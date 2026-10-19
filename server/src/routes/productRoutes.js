const express = require('express');
const router = express.Router();
const { listProducts, getProductBySlug } = require('../controllers/productController');
const validate = require('../middleware/validate');
const { listProductsSchema } = require('../validators/productValidator');

router.get('/', validate(listProductsSchema), listProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;
