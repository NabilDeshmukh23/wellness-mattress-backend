const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { 
    searchProducts,
    getAllProducts, 
    getProductDetails, 
    createProductReview, 
    updateAndGetBestsellers,
    importProductsCSV 
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

const upload = multer({ dest: 'uploads/' });

router.get('/bestsellers', updateAndGetBestsellers);
router.get('/search', searchProducts);
router.get('/', getAllProducts);


router.post('/import', protect, adminOnly, upload.single('file'), importProductsCSV);

router.get('/:id', getProductDetails);

router.post('/reviews', protect, createProductReview);

module.exports = router;