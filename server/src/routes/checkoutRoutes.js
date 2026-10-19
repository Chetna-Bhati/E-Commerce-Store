const express = require('express');
const router = express.Router();
const { createCheckoutOrder, verifyAndPlaceOrder } = require('../controllers/checkoutController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCheckoutSchema, verifyCheckoutSchema } = require('../validators/checkoutValidator');

router.use(auth);

router.post('/create', validate(createCheckoutSchema), createCheckoutOrder);
router.post('/verify', validate(verifyCheckoutSchema), verifyAndPlaceOrder);

module.exports = router;
