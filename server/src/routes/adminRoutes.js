const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  createCategory
} = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const upload = require('../middleware/upload');

// Protect all admin routes with auth + requireAdmin
router.use(auth, requireAdmin);

router.get('/stats', getDashboardStats);

router.get('/products', getAdminProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/categories', createCategory);

router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
