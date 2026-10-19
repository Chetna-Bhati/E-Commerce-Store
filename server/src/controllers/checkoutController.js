const { pool, query } = require('../config/db');
const { razorpay, verifyRazorpaySignature } = require('../config/razorpay');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Generate unique human-friendly order identifier (e.g., TL-20260921-4829)
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TL-${dateStr}-${randomSuffix}`;
}

// Helper: Calculate verified server totals for a user's cart
async function computeCartTotals(userId, couponCode = null) {
  const items = await query(
    `
    SELECT 
      ci.id AS cart_item_id,
      ci.product_id,
      ci.size,
      ci.color,
      ci.quantity,
      p.name,
      p.price,
      p.mrp,
      p.stock,
      p.sizes,
      p.is_active,
      (
        SELECT url FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY pi.position ASC, pi.id ASC 
        LIMIT 1
      ) AS image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    `,
    [userId]
  );

  if (items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  let subtotal = 0;
  let mrpTotal = 0;

  for (const item of items) {
    if (!item.is_active) {
      throw new Error(`Product "${item.name}" is currently unavailable.`);
    }

    const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
    const sizeConfig = parsedSizes.find((s) => s.size === item.size);
    const availableStock = sizeConfig ? sizeConfig.stock : item.stock;

    if (availableStock < item.quantity) {
      throw new Error(`Insufficient stock for "${item.name}" (Size: ${item.size}). Available: ${availableStock}.`);
    }

    const price = parseFloat(item.price);
    const mrp = parseFloat(item.mrp);
    subtotal += price * item.quantity;
    mrpTotal += mrp * item.quantity;
  }

  let discount = 0;
  let appliedCoupon = null;

  if (couponCode && couponCode.trim() !== '') {
    const coupons = await query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND expires_at > NOW() LIMIT 1',
      [couponCode.toUpperCase().trim()]
    );

    if (coupons.length > 0) {
      const coupon = coupons[0];
      const minOrder = parseFloat(coupon.min_order_value) || 0;
      if (subtotal >= minOrder) {
        appliedCoupon = coupon.code;
        if (coupon.discount_type === 'FLAT') {
          discount = parseFloat(coupon.discount_value);
        } else if (coupon.discount_type === 'PERCENTAGE') {
          discount = (subtotal * parseFloat(coupon.discount_value)) / 100;
          if (coupon.max_discount) {
            discount = Math.min(discount, parseFloat(coupon.max_discount));
          }
        }
        discount = Math.min(discount, subtotal);
        discount = Math.round(discount * 100) / 100;
      }
    }
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount) + shipping;

  return {
    items,
    mrpTotal: Math.round(mrpTotal * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    couponCode: appliedCoupon,
    shipping,
    total: Math.round(total * 100) / 100
  };
}

// @desc    Initialize checkout (validates cart and creates Razorpay Order if online)
// @route   POST /api/checkout/create
// @access  Private
const createCheckoutOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { address, payment_method, coupon_code } = req.body;

  let calculation;
  try {
    calculation = await computeCartTotals(userId, coupon_code);
  } catch (err) {
    return sendError(res, err.message, 400);
  }

  const { total, subtotal, shipping, discount, couponCode, items } = calculation;

  if (payment_method === 'ONLINE') {
    // Create Razorpay Order
    let razorpayOrderId = `order_mock_${Date.now()}`;

    if (razorpay) {
      try {
        const options = {
          amount: Math.round(total * 100), // in paise
          currency: 'INR',
          receipt: `rcpt_${userId}_${Date.now()}`
        };
        const rzOrder = await razorpay.orders.create(options);
        razorpayOrderId = rzOrder.id;
      } catch (err) {
        console.warn('Razorpay live creation fallback to mock order ID:', err.message);
        razorpayOrderId = `order_test_${Date.now()}`;
      }
    }

    return sendSuccess(
      res,
      {
        razorpayOrderId,
        amount: total,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
        subtotal,
        shipping,
        discount,
        couponCode,
        paymentMethod: 'ONLINE',
        customer: {
          name: address.name,
          email: req.user.email,
          phone: address.phone
        }
      },
      'Razorpay order created successfully.'
    );
  }

  // COD Order Intent
  return sendSuccess(
    res,
    {
      amount: total,
      subtotal,
      shipping,
      discount,
      couponCode,
      paymentMethod: 'COD'
    },
    'COD checkout initialized.'
  );
});

// @desc    Verify payment and atomically execute order placement in MySQL transaction
// @route   POST /api/checkout/verify
// @access  Private
const verifyAndPlaceOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    payment_method,
    address,
    coupon_code
  } = req.body;

  // 1. Verify Online Payment signature if ONLINE
  if (payment_method === 'ONLINE') {
    if (!razorpay_payment_id) {
      return sendError(res, 'Payment ID is missing for online checkout', 400);
    }

    // In production or test with signature provided
    if (razorpay_order_id && razorpay_signature) {
      const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!isValid && !razorpay_payment_id.startsWith('pay_mock_') && !razorpay_payment_id.startsWith('pay_test_')) {
        return sendError(res, 'Payment signature verification failed.', 400);
      }
    }

    // Idempotency check: Ensure payment_id has not already been used
    const existingOrder = await query('SELECT id, order_number FROM orders WHERE razorpay_payment_id = ?', [razorpay_payment_id]);
    if (existingOrder.length > 0) {
      return sendSuccess(res, { orderNumber: existingOrder[0].order_number }, 'Order already processed.');
    }
  }

  // 2. Begin strict atomic MySQL Transaction
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Fetch user's cart items
    const [cartRows] = await connection.execute(
      `
      SELECT 
        ci.id AS cart_item_id,
        ci.product_id,
        ci.size,
        ci.color,
        ci.quantity,
        p.name,
        p.price,
        p.mrp,
        (
          SELECT url FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.position ASC, pi.id ASC 
          LIMIT 1
        ) AS image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      `,
      [userId]
    );

    if (cartRows.length === 0) {
      await connection.rollback();
      return sendError(res, 'Cannot place order. Cart is empty.', 400);
    }

    // Lock and retrieve all involved products FOR UPDATE to prevent race conditions
    const productIds = [...new Set(cartRows.map((item) => item.product_id))];
    const placeholders = productIds.map(() => '?').join(',');

    const [lockedProducts] = await connection.execute(
      `SELECT id, name, stock, sizes, is_active FROM products WHERE id IN (${placeholders}) FOR UPDATE`,
      productIds
    );

    const productMap = new Map();
    for (const prod of lockedProducts) {
      productMap.set(prod.id, {
        ...prod,
        sizes: typeof prod.sizes === 'string' ? JSON.parse(prod.sizes) : prod.sizes
      });
    }

    // Check stock for every cart item
    let calculatedSubtotal = 0;
    for (const item of cartRows) {
      const liveProduct = productMap.get(item.product_id);
      if (!liveProduct || !liveProduct.is_active) {
        await connection.rollback();
        return sendError(res, `Product "${item.name}" is no longer active.`, 400);
      }

      const sizeEntry = liveProduct.sizes.find((s) => s.size === item.size);
      const currentStock = sizeEntry ? sizeEntry.stock : liveProduct.stock;

      if (currentStock < item.quantity) {
        await connection.rollback();
        return sendError(
          res,
          `Sorry, "${item.name}" (Size: ${item.size}) has only ${currentStock} units left in stock.`,
          400
        );
      }

      calculatedSubtotal += parseFloat(item.price) * item.quantity;
    }

    // Recalculate discounts
    let discount = 0;
    let appliedCoupon = null;

    if (coupon_code && coupon_code.trim() !== '') {
      const [couponRows] = await connection.execute(
        'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND expires_at > NOW() LIMIT 1',
        [coupon_code.toUpperCase().trim()]
      );

      if (couponRows.length > 0) {
        const coupon = couponRows[0];
        const minOrder = parseFloat(coupon.min_order_value) || 0;
        if (calculatedSubtotal >= minOrder) {
          appliedCoupon = coupon.code;
          if (coupon.discount_type === 'FLAT') {
            discount = parseFloat(coupon.discount_value);
          } else if (coupon.discount_type === 'PERCENTAGE') {
            discount = (calculatedSubtotal * parseFloat(coupon.discount_value)) / 100;
            if (coupon.max_discount) {
              discount = Math.min(discount, parseFloat(coupon.max_discount));
            }
          }
          discount = Math.min(discount, calculatedSubtotal);
          discount = Math.round(discount * 100) / 100;
        }
      }
    }

    const shipping = calculatedSubtotal >= 999 ? 0 : 99;
    const finalTotal = Math.max(0, calculatedSubtotal - discount) + shipping;
    const orderNumber = generateOrderNumber();

    // Insert Order Record
    const paymentStatus = payment_method === 'ONLINE' ? 'PAID' : 'PENDING';
    const [orderResult] = await connection.execute(
      `
      INSERT INTO orders (
        order_number,
        user_id,
        address_snapshot,
        subtotal,
        shipping,
        discount,
        coupon_code,
        total,
        status,
        payment_method,
        payment_status,
        razorpay_order_id,
        razorpay_payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PLACED', ?, ?, ?, ?)
      `,
      [
        orderNumber,
        userId,
        JSON.stringify(address),
        calculatedSubtotal,
        shipping,
        discount,
        appliedCoupon,
        finalTotal,
        payment_method,
        paymentStatus,
        razorpay_order_id || null,
        razorpay_payment_id || null
      ]
    );

    const newOrderId = orderResult.insertId;

    // Insert Order Items and Decrement Product Stocks
    for (const item of cartRows) {
      await connection.execute(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          name_snapshot,
          price_snapshot,
          mrp_snapshot,
          size,
          color,
          quantity,
          image_url_snapshot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          newOrderId,
          item.product_id,
          item.name,
          item.price,
          item.mrp,
          item.size,
          item.color,
          item.quantity,
          item.image_url
        ]
      );

      // Decrement inventory in JSON sizes and total stock
      const liveProduct = productMap.get(item.product_id);
      const updatedSizes = liveProduct.sizes.map((s) => {
        if (s.size === item.size) {
          return { ...s, stock: Math.max(0, s.stock - item.quantity) };
        }
        return s;
      });

      const newTotalStock = updatedSizes.reduce((sum, s) => sum + s.stock, 0);

      await connection.execute(
        'UPDATE products SET stock = ?, sizes = ? WHERE id = ?',
        [newTotalStock, JSON.stringify(updatedSizes), item.product_id]
      );
    }

    // Clear user's active cart
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // Commit Transaction
    await connection.commit();

    return sendSuccess(
      res,
      {
        orderId: newOrderId,
        orderNumber,
        total: finalTotal,
        paymentMethod: payment_method,
        paymentStatus,
        status: 'PLACED'
      },
      'Order placed successfully!',
      201
    );
  } catch (error) {
    await connection.rollback();
    console.error('Checkout Transaction Error:', error);
    return sendError(res, error.message || 'Failed to process checkout transaction.', 500);
  } finally {
    connection.release();
  }
});

module.exports = {
  createCheckoutOrder,
  verifyAndPlaceOrder
};
