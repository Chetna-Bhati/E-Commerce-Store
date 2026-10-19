const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const items = await query(
    `
    SELECT 
      w.id AS wishlist_id,
      w.product_id,
      w.created_at,
      p.name,
      p.slug,
      p.fabric,
      p.price,
      p.mrp,
      p.stock,
      p.sizes,
      p.colors,
      p.rating,
      p.review_count,
      (
        SELECT url FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY pi.position ASC, pi.id ASC 
        LIMIT 1
      ) AS primary_image
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ? AND p.is_active = TRUE
    ORDER BY w.created_at DESC
    `,
    [userId]
  );

  const formatted = items.map((p) => {
    const itemPrice = parseFloat(p.price);
    const itemMrp = parseFloat(p.mrp);
    return {
      wishlistId: p.wishlist_id,
      productId: p.product_id,
      name: p.name,
      slug: p.slug,
      fabric: p.fabric,
      price: itemPrice,
      mrp: itemMrp,
      discountPercent: itemMrp > itemPrice ? Math.round(((itemMrp - itemPrice) / itemMrp) * 100) : 0,
      stock: p.stock,
      rating: p.rating,
      reviewCount: p.review_count,
      primaryImage: p.primary_image,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
    };
  });

  return sendSuccess(res, formatted, 'Wishlist fetched successfully.');
});

// @desc    Toggle product in wishlist (add if missing, remove if present)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return sendError(res, 'Invalid product ID', 400);
  }

  // Check product exists
  const products = await query('SELECT id FROM products WHERE id = ?', [productId]);
  if (products.length === 0) {
    return sendError(res, 'Product not found', 404);
  }

  const existing = await query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

  if (existing.length > 0) {
    await query('DELETE FROM wishlist WHERE id = ?', [existing[0].id]);
    return sendSuccess(res, { inWishlist: false }, 'Removed from wishlist.');
  } else {
    await query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    return sendSuccess(res, { inWishlist: true }, 'Added to wishlist.', 201);
  }
});

module.exports = {
  getWishlist,
  toggleWishlist
};
