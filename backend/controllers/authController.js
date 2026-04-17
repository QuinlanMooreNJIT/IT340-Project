const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        
        const user = new User({ username, password });
        await user.save();
        
        res.status(201).send('User created');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');
        
        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).send('Invalid password');
        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (err) {
        res.status(500).send('Login Failed');
    }
};
