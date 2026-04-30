const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/authMiddleware');

router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('postedBy', 'username')
            
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newListing = new Listing({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            images: req.body.images || [],
            keywords: req.body.keywords || [],
            postedBy: req.postedBy.id
        });
        
        const saved = await newListing.save();
        res.status(201).json(saved);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
