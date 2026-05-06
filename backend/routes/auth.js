const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

const logger = require("../logger");

const { createMfaToken } = require("../services/mfaService");
const { sendOtpEmail } = require("../services/emailService")

router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        logger.info(`REGISTER attempt: ${username} from ${req.ip}`);
        
        const existingUser = await User.findOne({username});
        if (existingUser) {
        logger.warn(`REGISTER FAILED (exists): ${username} from ${req.ip}`);
            return res.status(400).json({ message: "User already exists" });            
        }
                
        const newUser = new User({
            username,
            email,
            password
        });
        
        await newUser.save();
        
        logger.info(`REGISTER SUCCESS: ${username} from ${req.ip}`);
        
        res.status(201).json({message: "User created successfully"});
        
    } catch (err) {
        logger.error(`REGISTER ERROR: ${err.message}`);
        res.status(500).json({ error: err.message});
    }
});

router.post("/login", async (req, res) => { 
    try {
        const { username, password } = req.body;
        
        logger.info(`LOGIN attempt: ${username} from ${req.ip}`);
        
        const user = await User.findOne({ username });
        
        if (!user) {
            logger.warn(`LOGIN FAILED (no user): ${username} from ${req.ip}`);
            return res.status(400).json({ message: "Invalid credentials"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            logger.warn(`LOGIN FAILED (bad password): ${username} from ${req.ip}`);
            return res.status(400).json({ message: "Invalid credentials"});
        }
        
        const otp = await createMfaToken(user._id);
        
        await sendOtpEmail(user.email, otp);
        
        logger.info(`MFA OTP sent to ${username}`);
        
        return res.json({
            message: "MFA required - OTP sent to email",
            mfaRequired: true,
            userId: user._id
        });
        
    } catch (error) {
        logger.error(`LOGIN ERROR: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
