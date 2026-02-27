const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const products = [
   {
    productName: "Wellness Supportec",
    description: "The peak of luxury and durability. This heavy-duty mattress is available in two specialized builds: a standard high-resiliency core or an upgraded version featuring a premium 1-inch Memory Foam top layer for superior pressure relief.",
    category: "Hybrid",
    feel: "Medium Firm",
    imageUrl: "https://your-image-url.com/wellness-supported.jpg",
    warranty: "84 MONTHS", //
    sqMtPrices: [
        { thickness: "5\"", rate: 6918 }, 
        { thickness: "6\"", rate: 7533 }  
    ],
    basePrice: 9636, // Starting price for 72x30 Without Memory
    isCustomizable: true,
    variants: [
        // --- WITHOUT MEMORY (5" Thickness) ---
        // Length 72"
        { length: 72, width: 30, thickness: "5\"", price: 9636, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 72, width: 36, thickness: "5\"", price: 11564, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 72, width: 48, thickness: "5\"", price: 15418, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 72, width: 60, thickness: "5\"", price: 19272, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 72, width: 66, thickness: "5\"", price: 21199, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 72, width: 72, thickness: "5\"", price: 23127, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 75"
        { length: 75, width: 30, thickness: "5\"", price: 10038, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 75, width: 36, thickness: "5\"", price: 12045, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 75, width: 48, thickness: "5\"", price: 16060, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 75, width: 60, thickness: "5\"", price: 20075, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 75, width: 66, thickness: "5\"", price: 22324, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 75, width: 72, thickness: "5\"", price: 24090, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 78"
        { length: 78, width: 30, thickness: "5\"", price: 10439, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 78, width: 36, thickness: "5\"", price: 12527, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 78, width: 48, thickness: "5\"", price: 16703, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 78, width: 60, thickness: "5\"", price: 20878, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 78, width: 66, thickness: "5\"", price: 22966, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 78, width: 72, thickness: "5\"", price: 25054, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 84"
        { length: 84, width: 60, thickness: "5\"", price: 22484, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 84, width: 72, thickness: "5\"", price: 26980, hasMemoryFoam: false, sizeCategory: "King" },

        // --- WITH MEMORY (6" Thickness) ---
        // Length 72"
        { length: 72, width: 30, thickness: "6\"", price: 10494, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 72, width: 36, thickness: "6\"", price: 12592, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 72, width: 48, thickness: "6\"", price: 16790, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 72, width: 60, thickness: "6\"", price: 20988, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 72, width: 66, thickness: "6\"", price: 23087, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 72, width: 72, thickness: "6\"", price: 25186, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 75"
        { length: 75, width: 30, thickness: "6\"", price: 10932, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 75, width: 36, thickness: "6\"", price: 13118, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 75, width: 48, thickness: "6\"", price: 17490, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 75, width: 60, thickness: "6\"", price: 21863, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 75, width: 66, thickness: "6\"", price: 24049, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 75, width: 72, thickness: "6\"", price: 26235, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 78"
        { length: 78, width: 30, thickness: "6\"", price: 11369, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 78, width: 36, thickness: "6\"", price: 13643, hasMemoryFoam: false, sizeCategory: "Single" },
        { length: 78, width: 48, thickness: "6\"", price: 18190, hasMemoryFoam: false, sizeCategory: "Double" },
        { length: 78, width: 60, thickness: "6\"", price: 22737, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 78, width: 66, thickness: "6\"", price: 25010, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 78, width: 72, thickness: "6\"", price: 27285, hasMemoryFoam: false, sizeCategory: "King" },

        // Length 84"
        { length: 84, width: 60, thickness: "6\"", price: 24486, hasMemoryFoam: false, sizeCategory: "Queen" },
        { length: 84, width: 72, thickness: "6\"", price: 29384, hasMemoryFoam: false, sizeCategory: "King" }
    ]
},
  {
        productName: "Dream Sleep",
        description: "The Dream Sleep series is designed for plush, cloud-like comfort. Featuring high-resiliency foam and a breathable top layer, it provides a medium-soft feel that's perfect for pressure relief and deep, restful sleep.",
        category: "Memory Foam",
        feel: "Medium Soft",
        imageUrl: "https://your-image-url.com/dream-sleep.jpg",
        warranty: "24 MONTHS", // 
        sqMtPrices: [
            { thickness: "4\"", rate: 3080.00 }, // 
            { thickness: "5\"", rate: 3553.00 }  // 
        ],
        basePrice: 4290.00,
        isCustomizable: true,
        variants: [
            // --- 10.2CM (4") Variants ---
            { length: 72, width: 30, thickness: "4\"", price: 4290, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 36, thickness: "4\"", price: 5148, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 48, thickness: "4\"", price: 6864, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 72, width: 60, thickness: "4\"", price: 8580, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 66, thickness: "4\"", price: 9438, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 72, thickness: "4\"", price: 10296, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 75, width: 30, thickness: "4\"", price: 4470, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 36, thickness: "4\"", price: 5365, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 48, thickness: "4\"", price: 7150, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 75, width: 60, thickness: "4\"", price: 8940, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 66, thickness: "4\"", price: 9830, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 72, thickness: "4\"", price: 10725, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 78, width: 30, thickness: "4\"", price: 4647, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 36, thickness: "4\"", price: 5577, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 48, thickness: "4\"", price: 7436, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 78, width: 60, thickness: "4\"", price: 9295, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 66, thickness: "4\"", price: 10225, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 72, thickness: "4\"", price: 11154, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 84, width: 60, thickness: "4\"", price: 10010, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 84, width: 72, thickness: "4\"", price: 12012, hasMemoryFoam: false, sizeCategory: "King" },

            // --- 12.7CM (5") Variants ---
            { length: 72, width: 30, thickness: "5\"", price: 4950, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 36, thickness: "5\"", price: 5940, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 48, thickness: "5\"", price: 7920, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 72, width: 60, thickness: "5\"", price: 9900, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 66, thickness: "5\"", price: 10890, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 72, thickness: "5\"", price: 11880, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 75, width: 30, thickness: "5\"", price: 5160, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 36, thickness: "5\"", price: 6190, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 48, thickness: "5\"", price: 8250, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 75, width: 60, thickness: "5\"", price: 10313, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 66, thickness: "5\"", price: 11345, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 72, thickness: "5\"", price: 12375, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 78, width: 30, thickness: "5\"", price: 5363, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 36, thickness: "5\"", price: 6435, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 48, thickness: "5\"", price: 8580, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 78, width: 60, thickness: "5\"", price: 10725, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 66, thickness: "5\"", price: 11798, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 72, thickness: "5\"", price: 12870, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 84, width: 60, thickness: "5\"", price: 11550, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 84, width: 72, thickness: "5\"", price: 13860, hasMemoryFoam: false, sizeCategory: "King" }
        ]
    },
    {
        productName: "Spine Comfort",
        description: "An orthopedic masterpiece crafted with firm bonded foam to ensure correct spinal alignment. Designed for durability and back support, the Spine Comfort series is perfect for those who require a firm sleep surface to prevent morning back pain.",
        category: "Orthopedic",
        feel: "Firm",
        imageUrl: "https://your-image-url.com/spine-comfort.jpg",
        warranty: "60 MONTHS", // [cite: 83]
        sqMtPrices: [
            { thickness: "4\"", rate: 4264.00 }, // 
            { thickness: "5\"", rate: 4738.00 }  // 
        ],
        basePrice: 5940.00,
        isCustomizable: true,
        variants: [
            // --- 10.2CM (4") Variants ---
            { length: 72, width: 30, thickness: "4\"", price: 5940, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 36, thickness: "4\"", price: 7128, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 48, thickness: "4\"", price: 9504, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 72, width: 60, thickness: "4\"", price: 11880, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 66, thickness: "4\"", price: 13068, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 72, thickness: "4\"", price: 14256, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 75, width: 30, thickness: "4\"", price: 6190, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 36, thickness: "4\"", price: 7425, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 48, thickness: "4\"", price: 9900, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 75, width: 60, thickness: "4\"", price: 12375, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 66, thickness: "4\"", price: 13613, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 72, thickness: "4\"", price: 14850, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 78, width: 30, thickness: "4\"", price: 6435, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 36, thickness: "4\"", price: 7722, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 48, thickness: "4\"", price: 10296, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 78, width: 60, thickness: "4\"", price: 12870, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 66, thickness: "4\"", price: 14157, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 72, thickness: "4\"", price: 15444, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 84, width: 60, thickness: "4\"", price: 13860, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 84, width: 72, thickness: "4\"", price: 16632, hasMemoryFoam: false, sizeCategory: "King" },

            // --- 12.7CM (5") Variants ---
            { length: 72, width: 30, thickness: "5\"", price: 6600, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 36, thickness: "5\"", price: 7920, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 72, width: 48, thickness: "5\"", price: 10560, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 72, width: 60, thickness: "5\"", price: 13200, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 66, thickness: "5\"", price: 14520, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 72, width: 72, thickness: "5\"", price: 15840, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 75, width: 30, thickness: "5\"", price: 6875, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 36, thickness: "5\"", price: 8250, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 75, width: 48, thickness: "5\"", price: 11000, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 75, width: 60, thickness: "5\"", price: 13750, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 66, thickness: "5\"", price: 15125, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 75, width: 72, thickness: "5\"", price: 16500, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 78, width: 30, thickness: "5\"", price: 7150, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 36, thickness: "5\"", price: 8580, hasMemoryFoam: false, sizeCategory: "Single" },
            { length: 78, width: 48, thickness: "5\"", price: 11440, hasMemoryFoam: false, sizeCategory: "Double" },
            { length: 78, width: 60, thickness: "5\"", price: 14300, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 66, thickness: "5\"", price: 15730, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 78, width: 72, thickness: "5\"", price: 17160, hasMemoryFoam: false, sizeCategory: "King" },

            { length: 84, width: 60, thickness: "5\"", price: 15400, hasMemoryFoam: false, sizeCategory: "Queen" },
            { length: 84, width: 72, thickness: "5\"", price: 18480, hasMemoryFoam: false, sizeCategory: "King" }
        ]
    },
    {
        productName: "Ortho Fit",
        description: "The Ortho Fit series is engineered for high-responsiveness and adaptive support. Using advanced reactive foam technology, it contours to your body shape instantly, providing relief to pressure points and ensuring a balanced sleep posture for active lifestyles.",
        category: "Orthopedic",
        feel: "Firm",
        imageUrl: "https://your-image-url.com/ortho-fit.jpg",
       warranty: "60 MONTHS", // [cite: 154]
       sqMtPrices: [
            { thickness: "5\"", rate: 7770 },
            { thickness: "6\"", rate: 8339 }
        ],   // [cite: 150]
        basePrice: 10824.00,
        isCustomizable: true,
        variants: [
            // --- 12.7CM (5") Variants ---
           { length: 72, width: 30, thickness: "5\"", price: 10824, sizeCategory: "Single" }, // [cite: 84]
           { length: 72, width: 36, thickness: "5\"", price: 12990, sizeCategory: "Single" }, // [cite: 84]
           { length: 72, width: 48, thickness: "5\"", price: 17320, sizeCategory: "Double" }, // [cite: 84]
           { length: 72, width: 60, thickness: "5\"", price: 21648, sizeCategory: "Queen" }, // [cite: 84]
           { length: 72, width: 66, thickness: "5\"", price: 23813, sizeCategory: "Queen" }, // [cite: 84]
           { length: 72, width: 72, thickness: "5\"", price: 25980, sizeCategory: "King" }, // [cite: 84]
            
           { length: 75, width: 30, thickness: "5\"", price: 11275, sizeCategory: "Single" }, // [cite: 98]
           { length: 75, width: 36, thickness: "5\"", price: 13530, sizeCategory: "Single" }, // [cite: 99]
           { length: 75, width: 48, thickness: "5\"", price: 18040, sizeCategory: "Double" }, // [cite: 100]
           { length: 75, width: 60, thickness: "5\"", price: 22550, sizeCategory: "Queen" }, // [cite: 101]
           { length: 75, width: 66, thickness: "5\"", price: 24805, sizeCategory: "Queen" }, // [cite: 102]
           { length: 75, width: 72, thickness: "5\"", price: 27060, sizeCategory: "King" }, // [cite: 103]

           { length: 78, width: 30, thickness: "5\"", price: 11726, sizeCategory: "Single" }, // [cite: 124]
           { length: 78, width: 36, thickness: "5\"", price: 14072, sizeCategory: "Single" }, // [cite: 125]
           { length: 78, width: 48, thickness: "5\"", price: 18762, sizeCategory: "Double" }, // [cite: 126]
           { length: 78, width: 60, thickness: "5\"", price: 23452, sizeCategory: "Queen" }, // [cite: 127]
           { length: 78, width: 66, thickness: "5\"", price: 25800, sizeCategory: "Queen" }, // [cite: 128]
           { length: 78, width: 72, thickness: "5\"", price: 28143, sizeCategory: "King" }, // [cite: 129]

           { length: 84, width: 60, thickness: "5\"", price: 25256, sizeCategory: "Queen" }, // [cite: 141]
           { length: 84, width: 72, thickness: "5\"", price: 30308, sizeCategory: "King" }, // [cite: 143]

            // --- 15.2CM (6") Variants ---
           { length: 72, width: 30, thickness: "6\"", price: 11616, sizeCategory: "Single" }, // [cite: 84]
           { length: 72, width: 36, thickness: "6\"", price: 13940, sizeCategory: "Single" }, // [cite: 84]
           { length: 72, width: 48, thickness: "6\"", price: 18586, sizeCategory: "Double" }, // [cite: 84]
           { length: 72, width: 60, thickness: "6\"", price: 23232, sizeCategory: "Queen" }, // [cite: 84]
           { length: 72, width: 66, thickness: "6\"", price: 25555, sizeCategory: "Queen" }, // [cite: 84]
           { length: 72, width: 72, thickness: "6\"", price: 27880, sizeCategory: "King" }, // [cite: 84]

           { length: 75, width: 30, thickness: "6\"", price: 12100, sizeCategory: "Single" }, // [cite: 104]
           { length: 75, width: 36, thickness: "6\"", price: 14520, sizeCategory: "Single" }, // [cite: 105]
           { length: 75, width: 48, thickness: "6\"", price: 19360, sizeCategory: "Double" }, // [cite: 106]
           { length: 75, width: 60, thickness: "6\"", price: 24200, sizeCategory: "Queen" }, // [cite: 107]
           { length: 75, width: 66, thickness: "6\"", price: 26620, sizeCategory: "Queen" }, // [cite: 108]
           { length: 75, width: 72, thickness: "6\"", price: 29040, sizeCategory: "King" }, // [cite: 109]

           { length: 78, width: 30, thickness: "6\"", price: 12584, sizeCategory: "Single" }, // [cite: 130]
           { length: 78, width: 36, thickness: "6\"", price: 15100, sizeCategory: "Single" }, // [cite: 131]
           { length: 78, width: 48, thickness: "6\"", price: 20134, sizeCategory: "Double" }, // [cite: 132]
           { length: 78, width: 60, thickness: "6\"", price: 25168, sizeCategory: "Queen" }, // [cite: 133]
           { length: 78, width: 66, thickness: "6\"", price: 27685, sizeCategory: "Queen" }, // [cite: 134]
           { length: 78, width: 72, thickness: "6\"", price: 30202, sizeCategory: "King" }, // [cite: 135]

           { length: 84, width: 60, thickness: "6\"", price: 27104, sizeCategory: "Queen" }, // [cite: 144]
            { length: 84, width: 72, thickness: "6\"", price: 32525, sizeCategory: "King" }
        ]
    },
    {
        productName: "Latex Pro",
        description: "The Latex Pro mattress offers the ultimate in natural luxury and breathability. Crafted with premium latex, it provides a buoyant, weightless feel while being naturally hypoallergenic and resistant to dust mites. Perfect for sleepers who want a cool, eco-friendly environment with durable support.",
        category: "Latex",
        feel: "Medium",
        imageUrl: "https://your-image-url.com/latex-pro.jpg",
        warranty: "60 MONTHS", // [cite: 155]
       sqMtPrices: [
            { thickness: "5\"", rate: 8150 },
            { thickness: "6\"", rate: 9571 }
        ],  // [cite: 152]
        basePrice: 11352.00,
        isCustomizable: true,
        variants: [
            // --- 12.7CM (5") Variants ---
           { length: 72, width: 30, thickness: "5\"", price: 11352, sizeCategory: "Single" }, // [cite: 85]
           { length: 72, width: 36, thickness: "5\"", price: 13623, sizeCategory: "Single" }, // [cite: 85]
           { length: 72, width: 48, thickness: "5\"", price: 18163, sizeCategory: "Double" }, // [cite: 85]
           { length: 72, width: 60, thickness: "5\"", price: 22704, sizeCategory: "Queen" }, // [cite: 85]
           { length: 72, width: 66, thickness: "5\"", price: 24975, sizeCategory: "Queen" }, // [cite: 85]
           { length: 72, width: 72, thickness: "5\"", price: 27245, sizeCategory: "King" }, // [cite: 85]

           { length: 75, width: 30, thickness: "5\"", price: 11825, sizeCategory: "Single" }, // [cite: 110]
           { length: 75, width: 36, thickness: "5\"", price: 14190, sizeCategory: "Single" }, // [cite: 110]
           { length: 75, width: 48, thickness: "5\"", price: 18920, sizeCategory: "Double" }, // [cite: 110]
           { length: 75, width: 60, thickness: "5\"", price: 23650, sizeCategory: "Queen" }, // [cite: 110]
           { length: 75, width: 66, thickness: "5\"", price: 26015, sizeCategory: "Queen" }, // [cite: 110]
           { length: 75, width: 72, thickness: "5\"", price: 28380, sizeCategory: "King" }, // [cite: 110]

           { length: 78, width: 30, thickness: "5\"", price: 12298, sizeCategory: "Single" }, // [cite: 111]
           { length: 78, width: 36, thickness: "5\"", price: 14560, sizeCategory: "Single" }, // [cite: 111]
           { length: 78, width: 48, thickness: "5\"", price: 19777, sizeCategory: "Double" }, // [cite: 111]
           { length: 78, width: 60, thickness: "5\"", price: 24596, sizeCategory: "Queen" }, // [cite: 111]
           { length: 78, width: 66, thickness: "5\"", price: 27055, sizeCategory: "Queen" }, // [cite: 111]
           { length: 78, width: 72, thickness: "5\"", price: 29516, sizeCategory: "King" }, // [cite: 111]

           { length: 84, width: 60, thickness: "5\"", price: 26488, sizeCategory: "Queen" }, // [cite: 145]
           { length: 84, width: 72, thickness: "5\"", price: 31786, sizeCategory: "King" }, // [cite: 147]

            // --- 15.2CM (6") Variants ---
        { length: 72, width: 30, thickness: "6\"", price: 13332, sizeCategory: "Single" }, // [cite: 85]
           { length: 72, width: 36, thickness: "6\"", price: 15999, sizeCategory: "Single" }, // [cite: 85]
           { length: 72, width: 48, thickness: "6\"", price: 21332, sizeCategory: "Double" }, // [cite: 85]
           { length: 72, width: 60, thickness: "6\"", price: 26665, sizeCategory: "Queen" }, // [cite: 85]
           { length: 72, width: 66, thickness: "6\"", price: 29330, sizeCategory: "Queen" }, // [cite: 85]
           { length: 72, width: 72, thickness: "6\"", price: 31997, sizeCategory: "King" }, // [cite: 85]

           { length: 75, width: 30, thickness: "6\"", price: 13890, sizeCategory: "Single" }, // [cite: 110]
           { length: 75, width: 36, thickness: "6\"", price: 16665, sizeCategory: "Single" }, // [cite: 110]
           { length: 75, width: 48, thickness: "6\"", price: 22220, sizeCategory: "Double" }, // [cite: 110]
           { length: 75, width: 60, thickness: "6\"", price: 27775, sizeCategory: "Queen" }, // [cite: 110]
           { length: 75, width: 66, thickness: "6\"", price: 30553, sizeCategory: "Queen" }, // [cite: 110]
           { length: 75, width: 72, thickness: "6\"", price: 33330, sizeCategory: "King" }, // [cite: 110]

           { length: 78, width: 30, thickness: "6\"", price: 14443, sizeCategory: "Single" }, // [cite: 111]
           { length: 78, width: 36, thickness: "6\"", price: 17332, sizeCategory: "Single" }, // [cite: 111]
           { length: 78, width: 48, thickness: "6\"", price: 23109, sizeCategory: "Double" }, // [cite: 111]
           { length: 78, width: 60, thickness: "6\"", price: 28886, sizeCategory: "Queen" }, // [cite: 111]
           { length: 78, width: 66, thickness: "6\"", price: 31775, sizeCategory: "Queen" }, // [cite: 111]
           { length: 78, width: 72, thickness: "6\"", price: 34664, sizeCategory: "King" }, // [cite: 111]

           { length: 84, width: 60, thickness: "6\"", price: 31108, sizeCategory: "Queen" }, // [cite: 148]
           { length: 84, width: 72, thickness: "6\"", price: 37330, sizeCategory: "King" }  // [cite: 149]
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();