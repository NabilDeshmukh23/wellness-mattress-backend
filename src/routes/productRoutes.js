const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { 
    searchProducts,
    getMattress, 
    getProductDetails, 
    createProductReview, 
    updateAndGetBestsellers,
    importProductsCSV,
    getAllProductsAdmin,
    updateProduct,
    deleteProduct,
    getPillows,
    getSlimMattress
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

const upload = multer({ dest: 'uploads/' });

router.get('/bestsellers', updateAndGetBestsellers);
router.get('/search', searchProducts);
router.get('/pillows', getPillows);
router.get('/slimMattress', getSlimMattress);
router.get('/mattress', getMattress);

router.get('/admin/products', protect, adminOnly, getAllProductsAdmin);
router.put('/admin/product/:id', protect, adminOnly, updateProduct);
router.delete('/admin/product/:id', protect, adminOnly, deleteProduct);
router.post('/import', protect, adminOnly, upload.single('file'), importProductsCSV);

router.get('/:id', getProductDetails);

router.post('/reviews', protect, createProductReview);

router.get('/', getMattress);

module.exports = router;