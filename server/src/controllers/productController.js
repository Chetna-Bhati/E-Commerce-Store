const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendPaginated, sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    List products with search, filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const listProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, sort = 'popular', page = 1, limit = 12 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const offset = (pageNum - 1) * limitNum;

  const conditions = ['p.is_active = TRUE'];
  const params = [];

  // Search keyword (Fulltext with wildcard fallback)
  if (q && q.trim() !== '') {
    const searchTerm = q.trim();
    conditions.push('(MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) OR p.name LIKE ? OR p.fabric LIKE ?)');
    params.push(searchTerm, `%${searchTerm}%`, `%${searchTerm}%`);
  }

  // Category filter by slug or ID
  if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
    conditions.push('(c.slug = ? OR c.id = ?)');
    params.push(category.trim(), category.trim());
  }

  // Price range filters
  if (minPrice) {
    conditions.push('p.price >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    conditions.push('p.price <= ?');
    params.push(parseFloat(maxPrice));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sorting
  let orderBy = 'p.rating DESC, p.review_count DESC';
  if (sort === 'price_asc') {
    orderBy = 'p.price ASC';
  } else if (sort === 'price_desc') {
    orderBy = 'p.price DESC';
  } else if (sort === 'rating') {
    orderBy = 'p.rating DESC';
  } else if (sort === 'newest') {
    orderBy = 'p.created_at DESC';
  }

  // Total count query
  const countSql = `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ${whereClause}
  `;
  const [countResult] = await query(countSql, params);
  const total = countResult ? countResult.total : 0;

  // Products data query with primary image
  const dataSql = `
    SELECT 
      p.id,
      p.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      p.name,
      p.slug,
      p.description,
      p.fabric,
      p.price,
      p.mrp,
      p.stock,
      p.sizes,
      p.colors,
      p.rating,
      p.review_count,
      p.created_at,
      (
        SELECT url FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY pi.position ASC, pi.id ASC 
        LIMIT 1
      ) AS primary_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const products = await query(dataSql, [...params, limitNum, offset]);

  // Format products and calculate discount
  const formattedProducts = products.map((p) => {
    const discountPercent = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    return {
      ...p,
      price: parseFloat(p.price),
      mrp: parseFloat(p.mrp),
      discountPercent,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
    };
  });

  return sendPaginated(res, formattedProducts, total, pageNum, limitNum);
});

// @desc    Get single product details by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const products = await query(
    `
    SELECT 
      p.id,
      p.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      p.name,
      p.slug,
      p.description,
      p.fabric,
      p.price,
      p.mrp,
      p.stock,
      p.sizes,
      p.colors,
      p.rating,
      p.review_count,
      p.is_active,
      p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.is_active = TRUE
    LIMIT 1
    `,
    [slug]
  );

  if (products.length === 0) {
    return sendError(res, 'Product not found', 404);
  }

  const product = products[0];

  // Fetch all product images
  const images = await query(
    'SELECT id, url, position FROM product_images WHERE product_id = ? ORDER BY position ASC, id ASC',
    [product.id]
  );

  const discountPercent = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const result = {
    ...product,
    price: parseFloat(product.price),
    mrp: parseFloat(product.mrp),
    discountPercent,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
    images: images.map((img) => img.url)
  };

  return sendSuccess(res, result, 'Product details fetched successfully.');
});

module.exports = {
  listProducts,
  getProductBySlug
};
