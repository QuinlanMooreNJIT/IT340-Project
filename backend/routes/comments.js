const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../models/comment');

const requireAuth = require('../middleware/requireAuth');
const { isCommentOwnerOrAdmin } = require('../middleware/ownership');


// CREATE comment
router.post('/', requireAuth, async (req, res) => {

    try {
    
        const { listingId, content } = req.body;
        
        if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }
        
        const newComment = new Comment ({
            listingId,
            userId: req.user.id,
            content: content.trim()
        });
        
        const savedComment = await newComment.save();
        
        res.status(201).json(savedComment);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET comments
router.get('/:listingId', async (req, res) => {
    try {
    
        const { listingId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        
        if(!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: 'Invalid listing ID' });
        }
        
        const comments = await Comment.find({ listingId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .limit(limit);
            
        res.json(comments);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


//UPDATE comment
router.put('/:id', requireAuth, isCommentOwnerOrAdmin, async (req, res) =>{
    
    try {
        
        const { content } = req.body;
        
        if (!comment || content.trim() === '') {
            return res.status(400).json({ message : 'Comment cannot be empty' });
        }
        
        req.comment.content = content.trim();
        
        await req.comment.save();
        
        res.json({
            message: "Comment updated",
            comment: req.comment
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    
});


// DELETE comment
router.delete('/:id', requireAuth, isCommentOwnerOrAdmin, async (req, res) => {
    
    try {
        
        await res.comment.deleteOne();
        
        res.json({
            message: "Comment deleted"
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    
});

module.exports = router;
