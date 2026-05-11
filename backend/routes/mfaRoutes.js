const express = require('express');
const router = express.Router();

const MfaToken = require('../models/MfaToken');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/verify', async (req, res) => {

    const { userId, otp } = req.body;
    
    try {
    
        const record = await MfaToken.findOne({ userId, otp });
        
        if (!record) {
            return res.status(400).json ({
                message: 'Invalid or expired OTP'
            });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        
        await MfaToken.deleteMany({ userId });
        
        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role            
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        return res.status(200).json({
            message: 'MFA verified successfully',
            
            token,
            
            user: {
                userId: user._id,
                username: user.username,
                role: user.role
            }
        });
        
    } catch (err) {
    
        console.error(err);
        
        return res.status(500).json({
            message: 'Server error during MFA verification'
        });
    }
});

module.exports = router;
