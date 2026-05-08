const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Listing = require("../models/Listing");

const nodemailer = require("nodemailer");
const User = require("../models/User")

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
        
        const alreadyInCart = cart.listings.some(
            (item) => item.toString() === listingId
        );
        
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

    console.log("ENTERED GET /cart ROUTE");
    
    try {
        
        console.log("REQ.USER:", req.user);
        
        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate("listings");
        
        console.log("CART QUERY RESULT:", cart);
        
        if (!cart) {
        
            console.log("NO CART FOUND");
            
            return res.json({
                listings: [],
            });
        }
        
        console.log("SENDING CART RESPONSE");
        
        res.json(cart);
        
    } catch (error) {
        
        console.log("GET /cart ERROR");
        
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.delete("/:listingId", auth, async (req, res) => {
    try {
    
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

router.post("/checkout", auth, async (req, res) => {
    try {
    const cart = await Cart.findOne({
        user: req.user.id,
    }).populate("listings");
    
    if (!cart || cart.listings.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
        });
    }
    
    const purchasedListings = cart.listings;
    
    const listingIds = purchasedListings.map(
        (listing) => listing._id
    );
    
    await Listing.deleteMany({
        _id: { $in: listingIds },
    });
    
    cart.listings = [];
    
    await cart.save();
    
    const user = await User.findById(req.user.id);
    
    const itemList = purchasedListings
        .map((item) => `- ${item.title}`)
        .join("\n");
        
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: proccess.env.EMAIL_USER,
            pass: proccess.env.EMAIL_PASS,
        },
    });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Purchase Confirmation",
        text:`
Thank you for your purchase on Musicians Marketplace!

You purchased:

${itemList}

Your purchase has been completed successfully.
        `,
        });
        
        res.json({
            message: "Checkout successful",
            purchasedListings,
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;
