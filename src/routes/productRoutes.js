const express = require('express');
const router = express.Router();
const { 
    searchProducts,
    getAllProducts, 
    getProductDetails, 
    createProductReview, 
    updateAndGetBestsellers 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/bestsellers', updateAndGetBestsellers);

router.get('/search', searchProducts);
router.get('/', getAllProducts);

router.get('/:id', getProductDetails);

router.post('/reviews', protect, createProductReview);

module.exports = router;