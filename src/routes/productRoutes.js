const express = require('express');
const router = express.Router();
const { getAllProducts, getProductDetails } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

module.exports = router;