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


exports.createProductReview = async (req, res) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id, 
        userName: req.user.name,
        rating: Number(rating),
        comment,
    };

    try {
        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.comment = comment;
                    rev.rating = rating;
                }
            });
        } else {
           
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
        }

      
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            review 
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