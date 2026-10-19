const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get logged in user's order history
// @route   GET /api/orders
// @access  Private
const listUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await query(
    `
    SELECT 
      o.id,
      o.order_number,
      o.subtotal,
      o.shipping,
      o.discount,
      o.coupon_code,
      o.total,
      o.status,
      o.payment_method,
      o.payment_status,
      o.created_at,
      COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  const formatted = orders.map((o) => ({
    ...o,
    subtotal: parseFloat(o.subtotal),
    shipping: parseFloat(o.shipping),
    discount: parseFloat(o.discount),
    total: parseFloat(o.total)
  }));

  return sendSuccess(res, formatted, 'Order history fetched successfully.');
});

// @desc    Get order details with items and tracking timeline
// @route   GET /api/orders/:orderNumber
// @access  Private
const getOrderDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderNumber } = req.params;

  // If user is ADMIN, allow viewing any order, else restrict to own orders
  const sql = req.user.role === 'ADMIN'
    ? 'SELECT * FROM orders WHERE order_number = ? LIMIT 1'
    : 'SELECT * FROM orders WHERE order_number = ? AND user_id = ? LIMIT 1';
  const params = req.user.role === 'ADMIN' ? [orderNumber] : [orderNumber, userId];

  const orders = await query(sql, params);
  if (orders.length === 0) {
    return sendError(res, 'Order not found.', 404);
  }

  const order = orders[0];

  // Fetch order items
  const items = await query(
    `
    SELECT 
      oi.id,
      oi.product_id,
      oi.name_snapshot,
      oi.price_snapshot,
      oi.mrp_snapshot,
      oi.size,
      oi.color,
      oi.quantity,
      oi.image_url_snapshot,
      p.slug
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
    `,
    [order.id]
  );

  const timelineSteps = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = timelineSteps.indexOf(order.status);

  const timeline = timelineSteps.map((step, index) => {
    let completed = false;
    let current = false;

    if (order.status === 'CANCELLED') {
      completed = step === 'PLACED';
    } else {
      completed = currentStepIndex >= index;
      current = currentStepIndex === index;
    }

    return {
      status: step,
      label: step.charAt(0) + step.slice(1).toLowerCase(),
      completed,
      current
    };
  });

  const response = {
    id: order.id,
    orderNumber: order.order_number,
    subtotal: parseFloat(order.subtotal),
    shipping: parseFloat(order.shipping),
    discount: parseFloat(order.discount),
    couponCode: order.coupon_code,
    total: parseFloat(order.total),
    status: order.status,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    razorpayOrderId: order.razorpay_order_id,
    razorpayPaymentId: order.razorpay_payment_id,
    address: typeof order.address_snapshot === 'string' ? JSON.parse(order.address_snapshot) : order.address_snapshot,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((i) => ({
      id: i.id,
      productId: i.product_id,
      slug: i.slug,
      name: i.name_snapshot,
      price: parseFloat(i.price_snapshot),
      mrp: parseFloat(i.mrp_snapshot),
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      imageUrl: i.image_url_snapshot
    })),
    timeline
  };

  return sendSuccess(res, response, 'Order details fetched successfully.');
});

module.exports = {
  listUserOrders,
  getOrderDetails
};
