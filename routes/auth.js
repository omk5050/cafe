const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check credentials against environment variables
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        
        // Define payload
        const payload = {
            admin: {
                id: 'admin_sys',
                username: username
            }
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, msg: 'Login successful' });
            }
        );
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;
