const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const auth = require('../middleware/authMiddleware');

// GET all listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 });
            
        res.json(listings);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listing' });
    }
});


// GET single listing by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
            
        // Prevent invalid MongoDB ObjectID crash
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        const listing = await Listing.findById(id)
            .populate('postedBy', 'username')
            .exec();
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        
        res.json(listing);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listing' });
    }
});


// CREATE new listing
router.post('/', auth, async (req, res) => {
    try {
    
        if (!req.body.title ||
            !req.body.description ||
            req.body.price === undefined||
            !req.body.category
            ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const newListing = new Listing({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            images: req.body.images || [],
            keywords: req.body.keywords || [],
            postedBy: req.user.id
        });
        
        const saved = await newListing.save();
        
        const populatedListing = await saved.populate('postedBy', 'username');
        
        res.status(201).json(populatedListing);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating listing' });
    }
});

module.exports = router;
