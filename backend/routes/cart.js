const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Listing = require("../models/Listing");
const nodemailer = require("nodemailer");
const User = require("../models/User")

const auth = require("../middleware/authMiddleware")

router.post("/add", auth, async (req, res) => {
    try {
        console.log("USER CART ROUTE FILE VERSION 2");
        console.log("\n ====== CART ADD ROUTE HIT ======");
        console.log("BODY:", req.body);
        console.log("RAW USER", req.user);
        
        const { listingId } = req.body;
        
        const userId = req.user.userId;
        
        console.log("RESOLVED USER ID:", userId);
        console.log("LISTING ID", listingId);
        
        if (!listingId) {
            console.log("MISSING listingId");
            return res.status(404).json({ message: "Listing not found" });
        }
        
        console.log("FIND LISTING....");
        const listing = await Listing.findById(listingId);
        
        console.log("Listing found:", listing ? "YES" : "NO");
        
        if (!listing) {
            console.log("LISTING NOT FOUND IN DB");
            return res.status(404).json({
                message: "Listing not found",
            });
        }
        
        console.log("FIND CART FOR USER:", userId);
        
        let cart = await Cart.findOne({ user: userId });
        
        console.log("CART EXISTS", !!cart);
        
        if (!cart) {
            console.log("CREATING NEW CART");
            
            cart = new Cart({
                user: userId,
                listings: [],
            });
        }
        
        console.log("CHECKING IF ITEM ALREADY IN CART....");
        
        const alreadyInCart = cart.listings.some(
            (item) => item.toString() === listingId
        );
        
        console.log("alreadyInCart", alreadyInCart);
        
        if (alreadyInCart) {
            console.log("ITEM ALREADY IN CART");
            return res.status(400).json({
                message: "Item already in cart",
            });
        }
        
        console.log("ADDING ITEM TO CART");
        
        cart.listings.push(listingId);
        
        console.log("SAVING CART......");
        
        await cart.save();
        
        console.log("CART SAVED SUCCESSFULLY");
        
        res.json({
            message: "Item added to cart",
            cart,
        });
        
    } catch (error) {
        console.error("CART ADD ERROR", error);       
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.get("/", auth, async (req, res) => {

    console.log("\n ===== GET /CART HIT =====");
    
    try {
        
        console.log("USER:", req.user);
        
        const cart = await Cart.findOne({
            user: userId,
        }).populate("listings");
        
        console.log("CART RESULT:", cart);
        
        if (!cart) {
            console.log("NO CART FOUND - RETURNING EMPTY");
            return res.json({ listings: [] });
        }
        
        console.log("SENDING CART RESPONSE");
        
        res.json(cart);
        
    } catch (error) {
        
        console.log("GET CART ERROR:", error);
        
        console.error(error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.delete("/:listingId", auth, async (req, res) => {
    try {
    
        console.log("\n ===== DELETE FROM CART ======");
        console.log("listingId:", req.params.listingId);
        console.log("user:", userId);
        
        const cart = await Cart.findOne({ user: userId });
    
        if (!cart) {
            console.log("NO CART FOUND");
            return res.status(404).json({
                message: "Cart not found",
            });
    }
    
    cart.listings = cart.listings.filter(
        (item) => item.toString() !== req.params.listingId
    );
    
    await cart.save();
    
    console.log("ITEM REMOVED");
    
    res.json({
        message: "Item removed from cart",
        cart,
    });

    } catch (error) {
        console.error("DELETE CART ERROR:", error);
        
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.post("/checkout", auth, async (req, res) => {
    try {
    
        console.log("\n ===== CHECKOUT ======");
        console.log("USER:", userId);
        console.log("CART:", cart);
        console.log("ITEMS:", purchasedListings);
        
    const cart = await Cart.findOne({
        user: userId,
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
    
    const user = await User.findById(userId);
    
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
        from: proccess.env.EMAIL_USER,
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
