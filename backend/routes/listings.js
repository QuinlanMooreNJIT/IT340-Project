const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Listing = require('../models/Listing');
const Comment = require('../models/comment');

const requireAuth = require('../middleware/requireAuth');
const {
    isListingOwnerOrAdmin,
    isCommentOwnerOrAdmin
} = require('../middleware/ownership');

//SEARCH listings
router.get('/search', async (req, res) => {
    try {
        
        const query = req.query.q;
        
        if(!query || query.trim() === '') {
            return res.status(400).json({
                message: 'Search query is required'
            });
        }
        
        const listings = await Listing.find({
            $text: {
                $search: query
            }
        })
        .populate('postedBy', 'username')
        .sort({ createdAt: -1 });
        
        res.json(listings);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error searching listings'
        });
    }
});

// GET all listings
router.get('/', async (req, res) => {

    try {
    
        const listings = await Listing.find()
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 });
            
        const listingsWithComments = await Promise.all(
            listings.map(async (listing) => {
            
                const comments = await Comment.find({ listingId: listing._id })
                    .populate('userId', 'username')
                    .sort({ createdAt: -1 })
                    .limit(3);
                    
                return {
                    ...listing.toObject(),
                    comments
                };
            })
        );
            
        res.json(listingsWithComments);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listing' });
    }
});


// GET single listing
router.get('/:id', async (req, res) => {

    try {
    
        const { id } = req.params;
            
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        const listing = await Listing.findById(id)
            .populate('postedBy', 'username');
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        
        res.json(listing);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listing' });
    }
});


// CREATE listing
router.post('/', requireAuth, async (req, res) => {

    try {
    
        const {
            title,
            description,
            price,
            category,
            images,
            keywords
        } = req.body;
        
        if (!title || !description || price === undefined || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        
        const newListing = new Listing({
            title,
            description,
            price,
            category,
            images: images || [],
            keywords: keywords || [],
            postedBy: req.user.userId
        });
        
        const saved = await newListing.save();
        
        const populatedListing = await saved.populate('postedBy', 'username');
        
        res.status(201).json(populatedListing);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating listing' });
    }
});


//  UPDATE listing
router.put('/:id', requireAuth, isListingOwnerOrAdmin, async (req, res) => {

    try {
    
        const updates = req.body;
        
        Object.assign(req.listing, updates);
        
        await req.listing.save();
        
        res.json({
            message: "Listing updated",
            listing: req.listing
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating listing' });
    }
});


//DELETE listing
router.delete('/:id', requireAuth, isListingOwnerOrAdmin, async (req, res) => {
    
    try {
    
        await req.listing.deleteOne();
        
        res.json({
            message: "Listing deleted"
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting listing' });
    }
});

module.exports = router;
