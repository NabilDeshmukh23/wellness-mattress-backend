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
    const { productId, length, width, thickness, quantity } = req.body;
    
    try {
       
        const productData = await Product.findById(productId);
        if (!productData) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let verifiedPrice = 0;

        const variant = productData.variants.find(v => 
            v.length === Number(length) && 
            v.width === Number(width) && 
            v.thickness === thickness
        );

        if (variant) {
            verifiedPrice = variant.price;
        } else if (productData.isCustomizable) {
          
            const rateObj = productData.sqMtPrices.find(p => p.thickness === thickness);
            const rate = rateObj ? rateObj.rate : productData.sqMtPrices[0].rate;
            verifiedPrice = Math.round(((Number(length) * Number(width)) / 1550) * rate);
        } else {
            return res.status(400).json({ success: false, message: "Invalid size for this product" });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

       
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.thickness === thickness && 
            item.width === Number(width) && 
            item.length === Number(length)
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += (Number(quantity) || 1);
            cart.items[itemIndex].price = verifiedPrice; 
        } else {
            cart.items.push({ 
                product: productId, 
                length: Number(length), 
                width: Number(width), 
                thickness, 
                price: verifiedPrice,
                quantity: Number(quantity) || 1 
            });
        }

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