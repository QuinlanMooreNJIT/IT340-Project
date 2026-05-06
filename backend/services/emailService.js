const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOtpEmail(email, otp) {
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Musicians Marketplace = Your Login Verification Code',
    text: `
Your verification code is: ${otp}

This coe will expire in 5 minutes.

If you did not request this login, please ignore this email.
    `
    };
    
    await traonsporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
