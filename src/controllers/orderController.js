const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const stats = await Order.aggregate([
            {
                $facet: {
                    overall: [
                        {
                            $group: {
                                _id: null,
                               
                                totalRevenue: { 
                                    $sum: { $cond: [{ $eq: ["$paymentInfo.status", "Paid"] }, "$totalAmount", 0] } 
                                },
                             
                                totalOrders: { $sum: 1 },
                               
                                totalPaidOrders: { 
                                    $sum: { $cond: [{ $eq: ["$paymentInfo.status", "Paid"] }, 1, 0] } 
                                }
                            }
                        }
                    ],
                    monthly: [
                        { 
                            $match: { 
                                createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } 
                            } 
                        },
                        {
                            $group: {
                                _id: null,
                                monthlyRevenue: { 
                                    $sum: { $cond: [{ $eq: ["$paymentInfo.status", "Paid"] }, "$totalAmount", 0] } 
                                },
                                monthlyOrders: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

    
        const allOrders = await Order.find()
            .sort({ createdAt: -1 })
            .lean(); 

        const kpis = {
            totalRevenue: stats[0].overall[0]?.totalRevenue || 0,
            totalOrders: stats[0].overall[0]?.totalOrders || 0,
            totalPaidOrders: stats[0].overall[0]?.totalPaidOrders || 0,
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${orderStatus}`,
            order
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingDetails, items } = req.body;
    let totalCalculatedAmount = 0;

    const itemsWithPrices = await Promise.all(
      items.map(async (item) => {
        const dbProduct = await Product.findById(item.product);

        if (!dbProduct) {
          throw new Error(`Product not found for ID: ${item.product}`);
        }

        let itemPrice = 0;

        // ✅ 1. PILLOW LOGIC: Skip math, use flat price
        if (dbProduct.productType === 'Pillows') {
          // Use the first variant price or the basePrice as fallback
          itemPrice = dbProduct.variants[0]?.price || dbProduct.basePrice;
        } 
        
        // ✅ 2. MATTRESS LOGIC
        else {
          // Try to match an existing variant first
          const variant = dbProduct.variants.find((v) => {
            return (
              Number(v.length) === Number(item.length) &&
              Number(v.width) === Number(item.width) &&
              String(v.thickness).trim() === String(item.thickness).trim()
            );
          });

          if (variant) {
            itemPrice = variant.price;
          } 
          // Custom Calculation for Mattresses
          else if (dbProduct.sqMtPrices && dbProduct.sqMtPrices.length > 0) {
            const rateObj = dbProduct.sqMtPrices.find(
              (p) => String(p.thickness).trim() === String(item.thickness).trim()
            );

            if (!rateObj) {
              // Fallback: If "Standard" isn't found, use the first available rate 
              // instead of throwing an error for pillows/slims
              const fallbackRate = dbProduct.sqMtPrices[0].rate;
              itemPrice = Math.round(((Number(item.length) * Number(item.width)) / 1550) * fallbackRate);
            } else {
              itemPrice = Math.round(((Number(item.length) * Number(item.width)) / 1550) * rateObj.rate);
            }
          } else {
            // Final safety fallback
            itemPrice = dbProduct.basePrice;
          }
        }

        const itemTotal = itemPrice * item.quantity;
        totalCalculatedAmount += itemTotal;

        return {
          ...item,
          price: itemPrice,
        };
      })
    );

    const options = {
      amount: totalCalculatedAmount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      user: req.user._id,
      items: itemsWithPrices,
      shippingDetails,
      totalAmount: totalCalculatedAmount,
      paymentInfo: {
        razorpay_order_id: razorpayOrder.id,
        status: "Pending",
      },
    });

    res.status(201).json({
      success: true,
      order: razorpayOrder,
      dbOrderId: order._id,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
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