const MfaToken = require('../models/MfaToken');

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createMfaToken(userId) {
    const otp = generateOtp();
    
    await MfaToken.deleteMany({ userId });
    
    await MfaToken.create({
        userId,
        otp
    });
    
    return otp;
}

module.exports = { generateOtp, createMfaToken};
