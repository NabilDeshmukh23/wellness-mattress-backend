const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });

        await newContact.save();

        res.status(201).json({ 
            success: true, 
            message: "Your message has been sent successfully!" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAdminContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        // Dynamic Search Filter (Name or Email)
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalContacts = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            contacts,
            pagination: {
                totalContacts,
                totalPages: Math.ceil(totalContacts / limit),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};