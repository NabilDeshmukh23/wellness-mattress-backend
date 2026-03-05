const express = require('express');
const router = express.Router();
const { 
    searchProducts,
    getAllProducts, 
    getProductDetails, 
    createProductReview, 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');


router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);


router.post('/reviews', protect, createProductReview);

module.exports = router;