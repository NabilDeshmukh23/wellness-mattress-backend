const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Razorpay with your credentials
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Step 1: Create Order Intent

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate KPIs using $facet to get overall and monthly stats in one query
        const stats = await Order.aggregate([
            {
                $facet: {
                    overall: [
                        { $match: { "paymentInfo.status": "Paid" } },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$totalAmount" },
                                totalOrders: { $sum: 1 }
                            }
                        }
                    ],
                    monthly: [
                        { 
                            $match: { 
                                "paymentInfo.status": "Paid",
                                createdAt: { $gte: firstDayOfMonth } 
                            } 
                        },
                        {
                            $group: {
                                _id: null,
                                monthlyRevenue: { $sum: "$totalAmount" },
                                monthlyOrders: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        // Fetch all orders for the table and CSV export
        const allOrders = await Order.find()
            .sort({ createdAt: -1 })
            .lean(); // Use lean for faster read-only performance

        const kpis = {
            totalRevenue: stats[0].overall[0]?.totalRevenue || 0,
            totalOrders: stats[0].overall[0]?.totalOrders || 0,
            monthlyRevenue: stats[0].monthly[0]?.monthlyRevenue || 0,
            monthlyOrders: stats[0].monthly[0]?.monthlyOrders || 0,
        };

        res.status(200).json({
            success: true,
            kpis,
            orders: allOrders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.createOrder = async (req, res) => {
    try {
        const { shippingDetails, items } = req.body;

        let totalCalculatedAmount = 0;

        // ✅ Step 1: Securely re-calculate price on backend
        for (const item of items) {
            const dbProduct = await Product.findById(item.product);
            
            if (!dbProduct) {
                return res.status(404).json({ message: `Product ${item.productName} not found` });
            }

            let itemPrice = 0;

            if (item.isCustom) {
                // Re-calculate custom price using your sqMt formula
                const rateObj = dbProduct.sqMtPrices.find(p => p.thickness === item.thickness);
                const rate = rateObj ? rateObj.rate : dbProduct.sqMtPrices[0].rate;
                itemPrice = Math.round(((item.length * item.width) / 1550) * rate);
            } else {
                // Find the exact variant price in DB
                const variant = dbProduct.variants.find(v => 
                    v.length === item.length && 
                    v.width === item.width && 
                    v.thickness === item.thickness
                );
                itemPrice = variant ? variant.price : 0;
            }

            totalCalculatedAmount += itemPrice * item.quantity;
        }

        // ✅ Step 2: Create Razorpay Order with the SECURE amount
        const options = {
            amount: totalCalculatedAmount * 100, // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // ✅ Step 3: Save to DB
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingDetails,
            totalAmount: totalCalculatedAmount, // Use the server-calculated total
            paymentInfo: {
                razorpay_order_id: razorpayOrder.id,
                status: 'Pending'
            }
        });

        res.status(201).json({
            success: true,
            order: razorpayOrder,
            dbOrderId: order._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Step 2: Verify Payment Signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update order status to Paid
            await Order.findOneAndUpdate(
                { "paymentInfo.razorpay_order_id": razorpay_order_id },
                { 
                    "paymentInfo.status": 'Paid',
                    "paymentInfo.razorpay_payment_id": razorpay_payment_id,
                    "paymentInfo.razorpay_signature": razorpay_signature,
                    paidAt: Date.now()
                }
            );

            res.status(200).json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};