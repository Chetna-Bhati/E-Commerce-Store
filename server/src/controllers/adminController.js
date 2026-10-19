const { query, pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated, sendError } = require('../utils/apiResponse');

// Helper to generate a URL-safe slug from product title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// @desc    Get Admin Dashboard Stats, KPIs & Weekly Sales Graph data
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total Revenue
  const [revenueResult] = await query(
    "SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status != 'CANCELLED'"
  );
  const totalRevenue = parseFloat(revenueResult ? revenueResult.total_revenue : 0);

  // 2. Total Orders
  const [ordersResult] = await query('SELECT COUNT(*) AS total_orders FROM orders');
  const totalOrders = ordersResult ? ordersResult.total_orders : 0;

  // 3. Total Active Products
  const [productsResult] = await query('SELECT COUNT(*) AS total_products FROM products WHERE is_active = TRUE');
  const totalProducts = productsResult ? productsResult.total_products : 0;

  // 4. Total Customers
  const [customersResult] = await query("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'USER'");
  const totalCustomers = customersResult ? customersResult.total_customers : 0;

  // 5. Low-Stock Products (< 10 units total)
  const lowStockProducts = await query(
    `
    SELECT p.id, p.name, p.slug, p.stock, p.price, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE AND p.stock < 10
    ORDER BY p.stock ASC
    LIMIT 10
    `
  );

  // 6. Last 7 Days Sales Trend for Recharts
  const weeklySales = await query(`
    SELECT 
      DATE(created_at) AS sale_date,
      DAYNAME(created_at) AS day_name,
      COUNT(id) AS order_count,
      COALESCE(SUM(total), 0) AS revenue
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      AND status != 'CANCELLED'
    GROUP BY DATE(created_at), DAYNAME(created_at)
    ORDER BY sale_date ASC
  `);

  // Fill in any missing days with 0 for clean rendering
  const daysMap = new Map();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    daysMap.set(dateKey, { date: dateKey, day: dayName, orders: 0, sales: 0 });
  }

  weeklySales.forEach((row) => {
    const key = typeof row.sale_date === 'string' ? row.sale_date.slice(0, 10) : new Date(row.sale_date).toISOString().slice(0, 10);
    if (daysMap.has(key)) {
      daysMap.set(key, {
        ...daysMap.get(key),
        orders: row.order_count,
        sales: parseFloat(row.revenue)
      });
    }
  });

  const chartData = Array.from(daysMap.values());

  return sendSuccess(
    res,
    {
      kpis: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      weeklySales: chartData
    },
    'Admin dashboard stats fetched.'
  );
});

// @desc    Get Admin Products with Pagination and Search
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const { q, category, page = 1, limit = 15 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const params = [];

  if (q && q.trim() !== '') {
    conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
    params.push(`%${q.trim()}%`, `%${q.trim()}%`);
  }

  if (category && category.trim() !== '') {
    conditions.push('p.category_id = ?');
    params.push(category.trim());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRes] = await query(`SELECT COUNT(*) AS total FROM products p ${whereClause}`, params);
  const total = countRes ? countRes.total : 0;

  const products = await query(
    `
    SELECT 
      p.id,
      p.category_id,
      c.name AS category_name,
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
      p.is_active,
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
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limitNum, offset]
  );

  const formatted = products.map((p) => ({
    ...p,
    price: parseFloat(p.price),
    mrp: parseFloat(p.mrp),
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
  }));

  return sendPaginated(res, formatted, total, pageNum, limitNum);
});

// @desc    Create a new product (with optional multi-image upload)
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { category_id, name, description, fabric, price, mrp, stock, sizes, colors, is_active } = req.body;

  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await query('SELECT id FROM products WHERE slug = ?', [slug]);
    if (existing.length === 0) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const parsedSizes = typeof sizes === 'string' ? sizes : JSON.stringify(sizes);
  const parsedColors = typeof colors === 'string' ? colors : JSON.stringify(colors);

  const result = await query(
    `
    INSERT INTO products (
      category_id, name, slug, description, fabric, price, mrp, stock, sizes, colors, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      category_id,
      name,
      slug,
      description,
      fabric,
      price,
      mrp,
      stock || 0,
      parsedSizes,
      parsedColors,
      is_active !== undefined ? is_active : true
    ]
  );

  const newProductId = result.insertId;

  // Handle uploaded files if any
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const fileUrl = `/uploads/${req.files[i].filename}`;
      await query(
        'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)',
        [newProductId, fileUrl, i + 1]
      );
    }
  } else {
    // Add default category fallback placeholder
    await query(
      'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, 1)',
      [newProductId, '/images/products/heavyweight-boxy-tee-1.webp']
    );
  }

  return sendSuccess(res, { id: newProductId, slug }, 'Product created successfully.', 201);
});

// @desc    Update product details
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { category_id, name, description, fabric, price, mrp, stock, sizes, colors, is_active } = req.body;

  const existing = await query('SELECT id FROM products WHERE id = ?', [productId]);
  if (existing.length === 0) {
    return sendError(res, 'Product not found', 404);
  }

  const updates = [];
  const params = [];

  if (category_id !== undefined) { updates.push('category_id = ?'); params.push(category_id); }
  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (fabric !== undefined) { updates.push('fabric = ?'); params.push(fabric); }
  if (price !== undefined) { updates.push('price = ?'); params.push(price); }
  if (mrp !== undefined) { updates.push('mrp = ?'); params.push(mrp); }
  if (stock !== undefined) { updates.push('stock = ?'); params.push(stock); }
  if (sizes !== undefined) {
    updates.push('sizes = ?');
    params.push(typeof sizes === 'string' ? sizes : JSON.stringify(sizes));
  }
  if (colors !== undefined) {
    updates.push('colors = ?');
    params.push(typeof colors === 'string' ? colors : JSON.stringify(colors));
  }
  if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active); }

  if (updates.length > 0) {
    params.push(productId);
    await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
  }

  return sendSuccess(res, null, 'Product updated successfully.');
});

// @desc    Soft-delete / Deactivate product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  await query('UPDATE products SET is_active = FALSE WHERE id = ?', [productId]);
  return sendSuccess(res, null, 'Product deactivated successfully.');
});

// @desc  Get all orders for admin management
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const params = [];

  if (status && status.trim() !== '' && status.toUpperCase() !== 'ALL') {
    conditions.push('o.status = ?');
    params.push(status.toUpperCase().trim());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRes] = await query(`SELECT COUNT(*) AS total FROM orders o ${whereClause}`, params);
  const total = countRes ? countRes.total : 0;

  const orders = await query(
    `
    SELECT 
      o.id,
      o.order_number,
      o.user_id,
      u.name AS customer_name,
      u.email AS customer_email,
      o.subtotal,
      o.shipping,
      o.discount,
      o.total,
      o.status,
      o.payment_method,
      o.payment_status,
      o.created_at,
      COUNT(oi.id) AS item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    ${whereClause}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limitNum, offset]
  );

  const formatted = orders.map((o) => ({
    ...o,
    subtotal: parseFloat(o.subtotal),
    shipping: parseFloat(o.shipping),
    discount: parseFloat(o.discount),
    total: parseFloat(o.total)
  }));

  return sendPaginated(res, formatted, total, pageNum, limitNum);
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status, payment_status } = req.body;

  const validStatuses = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return sendError(res, 'Invalid order status.', 400);
  }

  const updates = ['status = ?'];
  const params = [status];

  if (payment_status) {
    updates.push('payment_status = ?');
    params.push(payment_status);
  } else if (status === 'DELIVERED') {
    // If delivered, mark payment as PAID
    updates.push("payment_status = 'PAID'");
  }

  params.push(orderId);
  const result = await query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);

  if (result.affectedRows === 0) {
    return sendError(res, 'Order not found', 404);
  }

  return sendSuccess(res, null, `Order marked as ${status}.`);
});

// @desc    Admin category management
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name);

  const result = await query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name.trim(), slug, description || null]
  );

  return sendSuccess(res, { id: result.insertId, name, slug }, 'Category created.', 201);
});

module.exports = {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  createCategory
};
