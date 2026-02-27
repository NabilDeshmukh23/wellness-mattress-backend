const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
        res.status(200).json({ success: true, products: wishlist ? wishlist.products : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) wishlist = new Wishlist({ user: req.user.id, products: [] });

        const index = wishlist.products.indexOf(productId);
        if (index > -1) {
            wishlist.products.splice(index, 1); 
        } else {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};