const express = require('express');
const router = express.Router();
const { checkPincode } = require('../controllers/deliveryController');

router.get('/:pincode', checkPincode);

module.exports = router;
