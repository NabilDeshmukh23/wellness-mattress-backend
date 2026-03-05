const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    getProductDetails, 
    createProductReview, 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductDetails);
router.get('/search', searchProducts);

router.post('/reviews', protect, createProductReview);

module.exports = router;