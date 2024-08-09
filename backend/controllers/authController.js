// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { userId, password, role } = req.body; // role eklenebilir, örneğin 'admin' veya 'user'
    try {
        const user = new User({ userId, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findOne({ userId, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        
        // JWT token oluşturma
        const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful.', token, role: user.role });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: err.message });
    }
};

// Auth middleware for protecting routes
exports.protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (err) {
            console.error('Error during token verification:', err);
            res.status(401).json({ message: 'Not authorized' });
        }
    };
};
