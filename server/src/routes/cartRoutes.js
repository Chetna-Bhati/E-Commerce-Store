const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cartValidator');

router.use(auth); // All cart routes require authentication

router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);
router.put('/:id', validate(updateCartItemSchema), updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
