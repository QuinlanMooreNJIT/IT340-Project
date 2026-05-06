const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../models/comment');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) = {
    try {
        const { listingId, conetent } = req.body;
        
        if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        if (!content || content.trim() == '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }
        
        const newComment = new Comment ({
            listingId,
            userId: res.user.id,
            content: content.trim()
        });
        
        const savedComment = await newComment.save()
        
        res.status(201).json(savedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        const comments = await Comment.find({ listingId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .limit(20);
            
        res.json(comments);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
