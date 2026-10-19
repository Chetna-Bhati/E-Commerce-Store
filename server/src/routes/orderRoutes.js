const express = require('express');
const router = express.Router();
const { listUserOrders, getOrderDetails } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', listUserOrders);
router.get('/:orderNumber', getOrderDetails);

module.exports = router;
