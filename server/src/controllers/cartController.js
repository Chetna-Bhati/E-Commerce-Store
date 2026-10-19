const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get current user's cart with live pricing and stock status
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const items = await query(
    `
    SELECT 
      ci.id,
      ci.product_id,
      ci.size,
      ci.color,
      ci.quantity,
      ci.created_at,
      p.name,
      p.slug,
      p.price,
      p.mrp,
      p.stock AS total_stock,
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
    ORDER BY ci.created_at DESC
    `,
    [userId]
  );

  let subtotal = 0;
  let mrpTotal = 0;

  const formattedItems = items.map((item) => {
    const itemPrice = parseFloat(item.price);
    const itemMrp = parseFloat(item.mrp);
    const itemTotal = itemPrice * item.quantity;
    const itemMrpTotal = itemMrp * item.quantity;

    subtotal += itemTotal;
    mrpTotal += itemMrpTotal;

    // Check size-specific stock
    let sizeStock = 0;
    try {
      const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
      const sizeObj = parsedSizes.find((s) => s.size === item.size);
      sizeStock = sizeObj ? sizeObj.stock : item.total_stock;
    } catch (e) {
      sizeStock = item.total_stock;
    }

    return {
      id: item.id,
      productId: item.product_id,
      name: item.name,
      slug: item.slug,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: itemPrice,
      mrp: itemMrp,
      discountPercent: itemMrp > itemPrice ? Math.round(((itemMrp - itemPrice) / itemMrp) * 100) : 0,
      itemTotal,
      imageUrl: item.image_url,
      inStock: item.is_active && sizeStock >= item.quantity,
      availableStock: sizeStock
    };
  });

  const discountOnMrp = mrpTotal - subtotal;
  const shipping = subtotal >= 999 || formattedItems.length === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return sendSuccess(
    res,
    {
      items: formattedItems,
      itemCount: formattedItems.reduce((acc, curr) => acc + curr.quantity, 0),
      summary: {
        mrpTotal,
        subtotal,
        discountOnMrp,
        shipping,
        freeShippingThreshold: 999,
        freeShippingQualified: subtotal >= 999,
        amountNeededForFreeShipping: subtotal >= 999 ? 0 : 999 - subtotal,
        total
      }
    },
    'Cart fetched successfully.'
  );
});

// @desc    Add item to cart or increment quantity
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { product_id, size, color, quantity = 1 } = req.body;

  // Check product existence and active status
  const products = await query('SELECT id, stock, sizes, is_active FROM products WHERE id = ?', [product_id]);
  if (products.length === 0 || !products[0].is_active) {
    return sendError(res, 'Product is currently unavailable.', 400);
  }

  const product = products[0];

  // Validate size stock
  const parsedSizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
  const sizeConfig = parsedSizes.find((s) => s.size === size);

  if (sizeConfig && sizeConfig.stock < quantity) {
    return sendError(res, `Size ${size} is out of stock or does not have enough inventory.`, 400);
  }

  // Check if item already exists in user's cart
  const existingItems = await query(
    'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?',
    [userId, product_id, size, color]
  );

  if (existingItems.length > 0) {
    const newQuantity = existingItems[0].quantity + quantity;
    if (sizeConfig && sizeConfig.stock < newQuantity) {
      return sendError(res, `Cannot add more units. Available stock is ${sizeConfig.stock}.`, 400);
    }
    await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, existingItems[0].id]);
  } else {
    await query(
      'INSERT INTO cart_items (user_id, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)',
      [userId, product_id, size, color, quantity]
    );
  }

  return sendSuccess(res, null, 'Item added to cart.', 201);
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  const items = await query(
    `
    SELECT ci.id, ci.product_id, ci.size, p.sizes, p.stock, p.is_active
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.id = ? AND ci.user_id = ?
    `,
    [cartItemId, userId]
  );

  if (items.length === 0) {
    return sendError(res, 'Cart item not found', 404);
  }

  const item = items[0];
  if (!item.is_active) {
    return sendError(res, 'Product is no longer active', 400);
  }

  const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
  const sizeConfig = parsedSizes.find((s) => s.size === item.size);

  if (sizeConfig && sizeConfig.stock < quantity) {
    return sendError(res, `Requested quantity exceeds available stock (${sizeConfig.stock}).`, 400);
  }

  await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId]);

  return sendSuccess(res, null, 'Cart updated successfully.');
});

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  const result = await query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, userId]);

  if (result.affectedRows === 0) {
    return sendError(res, 'Cart item not found', 404);
  }

  return sendSuccess(res, null, 'Item removed from cart.');
});

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  return sendSuccess(res, null, 'Cart cleared successfully.');
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
