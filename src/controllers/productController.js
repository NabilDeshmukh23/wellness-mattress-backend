const Product = require('../models/Product');
const Order = require('../models/Order');
const csv = require('csv-parser');
const fs = require('fs');


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

exports.getAllProductsAdmin = async (req, res) => {
    try {
       
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.importProductsCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a CSV file" });
        }

        const products = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Mapping EVERY field from your schema (excluding reviews)
                products.push({
                    productName: row['productName'],
                    description: row['description'],
                    category: row['category'],
                    feel: row['feel'],
                    imageUrl: row['imageUrl'],
                    basePrice: Number(row['basePrice']),
                    discount: Number(row['discount'] || 0),
                    warranty: row['warranty'],
                    isCustomizable: row['isCustomizable']?.toLowerCase() === 'true',
                    isBestseller: row['isBestseller']?.toLowerCase() === 'true',
                    ratings: Number(row['ratings'] || 0),
                    numReviews: Number(row['numReviews'] || 0),
                    
                    // Complex Array Fields
                    // Expected format in CSV: [{"length":72,"width":36,"thickness":"6 inch","price":12000,"stock":10,"hasMemoryFoam":true,"sizeCategory":"Single"}]
                    variants: row['variants'] ? JSON.parse(row['variants']) : [],
                    
                    // Expected format in CSV: [{"thickness":"6 inch","rate":2500}]
                    sqMtPrices: row['sqMtPrices'] ? JSON.parse(row['sqMtPrices']) : []
                });
            })
            .on('end', async () => {
                try {
                    // Using insertMany for bulk performance
                    await Product.insertMany(products, { ordered: false }); 
                    
                    // Cleanup temp file
                    fs.unlinkSync(filePath);

                    res.status(200).json({
                        success: true,
                        message: `Successfully imported ${products.length} products to the catalog.`
                    });
                } catch (err) {
                    // Handle validation or duplicate name errors
                    res.status(500).json({ 
                        success: false, 
                        message: "Error during database insertion: " + err.message 
                    });
                }
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ success: true, products: [] });

    // 'i' makes it case-insensitive for fuzzy matching
    const searchRegex = new RegExp(query, 'i'); 

    const products = await Product.find({
      $or: [
        { productName: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10); // Limit results for better performance

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

exports.updateAndGetBestsellers = async (req, res) => {
    try {
        // 1. Run aggregation to find the top 8 sold products
        const bestsellerData = await Order.aggregate([
            { $match: { "paymentInfo.status": "Paid" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 8 }
        ]);

        const bestsellerIds = bestsellerData.map(item => item._id);

        // 2. Reset all products (remove old bestseller flags)
        await Product.updateMany({}, { isBestseller: false });

        // 3. Update the new top performers in the Product collection
        await Product.updateMany(
            { _id: { $in: bestsellerIds } },
            { isBestseller: true }
        );

        // 4. Fetch the full product details to send back to frontend
        const products = await Product.find({ isBestseller: true });

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