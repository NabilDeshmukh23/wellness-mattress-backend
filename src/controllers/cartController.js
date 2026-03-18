const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getPopulatedCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId })
        .populate('items.product', 'productName imageUrl category variants sqMtPrices isCustomizable');

    if (!cart) return { items: [], summary: { subtotal: 0, shipping: 0, total: 0, taxStatus: "TAX INCLUDED" } };

    let subtotal = 0;
    const items = cart.items.map(item => {
        subtotal += (item.price * item.quantity);
        return item;
    });

    return {
        success: true,
        items,
        summary: {
            subtotal,
            shipping: 0, 
            total: subtotal,
            taxStatus: "TAX INCLUDED"
        }
    };
};

exports.getCart = async (req, res) => {
    try {
        const cartData = await getPopulatedCart(req.user.id);
        res.status(200).json(cartData);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const { productId, length, width, thickness, quantity } = req.body;
    try {
        const productData = await Product.findById(productId);
        if (!productData) return res.status(404).json({ success: false, message: "Product not found" });

        let verifiedPrice = 0;

      
        if (productData.productType === 'Pillows') {
         
            const pillowVariant = productData.variants[0]; 
            verifiedPrice = pillowVariant ? pillowVariant.price : productData.basePrice;
        } 
       
        else {
            const variant = productData.variants.find(v => 
                v.length === Number(length) && 
                v.width === Number(width) && 
                v.thickness === thickness
            );

            if (variant) {
                verifiedPrice = variant.price;
            } 
          
            else if (productData.isCustomizable && productData.sqMtPrices && productData.sqMtPrices.length > 0) {
                const rateObj = productData.sqMtPrices.find(p => p.thickness === thickness);
                const rate = rateObj ? rateObj.rate : productData.sqMtPrices[0].rate;
                verifiedPrice = Math.round(((Number(length) * Number(width)) / 1550) * rate);
            } else {
                verifiedPrice = productData.basePrice;
            }
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [] });

      
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.thickness === thickness && 
            (productData.productType === 'Pillows' || (item.width === Number(width) && item.length === Number(length)))
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += (Number(quantity) || 1);
            cart.items[itemIndex].price = verifiedPrice;
        } else {
            cart.items.push({ 
                product: productId, 
                length: Number(length) || 0, 
                width: Number(width) || 0, 
                thickness: thickness || "Standard", 
                price: verifiedPrice, 
                quantity: Number(quantity) || 1 
            });
        }

        await cart.save();
        
        const fullCart = await getPopulatedCart(req.user.id);
        res.status(200).json(fullCart);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();

        // ✅ CRITICAL: Send back the updated summary so names don't vanish
        const fullCart = await getPopulatedCart(req.user.id);
        res.status(200).json(fullCart);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};