const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.json({ success: true, items: [], subtotal: 0, total: 0 });

        const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        res.status(200).json({
            success: true,
            items: cart.items,
            summary: {
                subtotal: subtotal,
                shipping: 0,
                total: subtotal,
                taxStatus: "TAX INCLUDED"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const { productId, length, width, thickness, price, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [] });

       
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.thickness === thickness && 
            item.width === width && 
            item.length === length
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += (quantity || 1);
        } else {
            cart.items.push({ product: productId, length, width, thickness, price, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.status(200).json({ success: true, message: "Item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};