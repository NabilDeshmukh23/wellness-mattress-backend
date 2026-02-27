const express = require('express');
const router = express.Router();
const { getAllProducts, getProductDetails } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware'); 

router.use(protect); 

router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

module.exports = router;