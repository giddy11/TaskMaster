const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Set up rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
  });

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();
 
        // Create a token for the new user
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        // Send the token in the response
        res.status(201).json({ token }); // Now returning token
        //res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: 'Registration failed!' });
    }
});

// Login User
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error!' });
    }
});

module.exports = router;