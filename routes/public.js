const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import models
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');

// Rate limit middleware: max 5 requests per hour
const publicRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many requests from this IP, please try again after an hour' }
});

// Apply rate limiter to all routes in this file
router.use(publicRateLimiter);

// @route   POST /api/public/book
router.post('/book', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;
    const newBooking = new Booking({ name, email, service, message });
    await newBooking.save();
    
    res.status(201).json({ message: 'Booking submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while submitting booking' });
  }
});

// @route   POST /api/public/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const newContact = new Contact({ name, email, phone, service, message });
    await newContact.save();
    
    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while submitting contact form' });
  }
});

// @route   POST /api/public/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();
    
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error while subscribing' });
  }
});

module.exports = router;
