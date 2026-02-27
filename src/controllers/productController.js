const Product = require('../models/Product');


exports.getAllProducts = async (req, res) => {
    try {
        const { size, category } = req.query;
        let query = {};

       
        if (size) {
            query["variants.sizeCategory"] = size;
        }

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};