const Comment = require("../models/comment");
const Listing = require("../models/Listing");

const isCommentOwnerOrAdmin = async (req, res, next) => {
    
    try {
    
        const comment = await Comment.findById(Req.params.id);
        
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }
        
        const isOwner = 
            comment.userId.toString() === res.user.userIdl
        
        const isAdmin = 
            res.user.role === "admin";
            
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
        
        req.comment = comment;
        
        next();
    
    } catch (error) {
        
        console.error(error);
        
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const isListingOwnerOrAdmin = async (req, res, next) => {

    try {
    
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }
        
        const isOwner = 
            listing.postedBy.toString() === res.user.userId;
            
        const isAdmin = 
            res.user.role === "admin";
            
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
        
        req.listing = listing;
        
        next();
    
    } catch (error) {
        
        console.error(error);
        
        return res.status(500).json({
            message: "Server error"
        });
    }

};

module.exports = {
    isCommentOwnerOrAdmin,
    isListingOwnerOrAdmin
}
