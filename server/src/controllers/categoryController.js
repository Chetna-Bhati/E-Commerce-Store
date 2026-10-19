const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

// @desc    List all active categories with product counts
// @route   GET /api/categories
// @access  Public
const listCategories = asyncHandler(async (req, res) => {
  const categories = await query(`
    SELECT 
      c.id, 
      c.name, 
      c.slug, 
      c.description,
      COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
    GROUP BY c.id, c.name, c.slug, c.description
    ORDER BY c.id ASC
  `);

  return sendSuccess(res, categories, 'Categories fetched successfully.');
});

module.exports = {
  listCategories
};
