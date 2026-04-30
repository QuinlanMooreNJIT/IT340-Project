const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });
            
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newListing = new Listing({
            title: req.body.title,
            description: req.body.descrpiton,
            price: req.body.price,
            category: req.body.category,
            user: req.user.id
        });
        
        const saved = await newListing.save();
        res.status(201).json(saved);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
