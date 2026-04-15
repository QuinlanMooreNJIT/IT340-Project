const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
    try {
        const {username, password} = req.body;
        
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });            
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        
        await newUser.save();
        
        res.status(201).json({message: "User created successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post("/login", async (req, res) => { 
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials"});
        }
        
        const token = jwt.sign(
        { if: user._id },
        "SECRET_KEY",
        { expiresIn: "1h"}
        );
        
        res.json({
            message: "Login successful",
            token: token
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
