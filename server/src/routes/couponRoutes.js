const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');
const validate = require('../middleware/validate');
const { validateCouponSchema } = require('../validators/couponValidator');

router.post('/validate', validate(validateCouponSchema), validateCoupon);

module.exports = router;
