const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Listing = require("../models/Listing");

const auth = require("../middleware/authMiddleware")

router.post("/add", auth, async (req, res) => {
    try {
        const { listingId } = req.body;
        
        const listing = await Listing.findById(listingId);
        
        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }
        
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            cart = new Cart({
            user: req.user.id,
            listings: [],
            });
        }
        
        const alreadyInCart = cart.listings.includes(listingId);
        
        if (alreadyInCart) {
            return res.status(400).json({
                message: "Item already in cart",
            });
        }
        
        cart.listings.push(listingId);
        
        await cart.save();
        
        res.json({
            message: "Item added to cart",
            cart,
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        
        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate("listings");
        
        if (!cart) {
            return res.json({
                listings: [],
            });
        }
        
        res.json(cart);
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.delete("/:listingId", auth, async (req, res) => {
    try {
    const cart = await Cart.findOne({
        user req.user.id,
    });
    
    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }
    
    cart.listings = cart.listings.filter(
        (item) => item.toString() !== req.params.listingId
    );
    
    await cart.save();
    
    res.json({
        message: "Item removed from cart",
        cart,
    });

    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;
