const Cart = require('../models/CartAndWishlist');

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
        // 1. Find the cart
        let cart = await Cart.findOne({ user: req.user.id });

        // 2. If no cart exists, create it with an empty items array
        if (!cart) {
            cart = new Cart({ 
                user: req.user.id, 
                items: [],
                wishlist: [] // Ensure wishlist is initialized if using the same model
            });
        }

        // 3. Safety Check: Ensure items exists before calling findIndex
        if (!cart.items) {
            cart.items = [];
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product && item.product.toString() === productId && 
            item.thickness === thickness && 
            item.width === width && 
            item.length === length
        );

        if (itemIndex > -1) {
            // Update quantity if item exists
            cart.items[itemIndex].quantity += (Number(quantity) || 1);
        } else {
            // Add new item
            cart.items.push({ 
                product: productId, 
                length, 
                width, 
                thickness, 
                price, 
                quantity: Number(quantity) || 1 
            });
        }

        // 4. Save and return
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        // Safety check to prevent crashing if cart is null
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.status(200).json({ success: true, message: "Item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};