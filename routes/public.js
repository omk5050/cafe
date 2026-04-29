const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import models
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const Menu = require('../models/Menu');
const Team = require('../models/Team');
const Testimonial = require('../models/Testimonial');
const Order = require('../models/Order');

// Rate limit middleware: max 5 requests per hour
const publicRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many requests from this IP, please try again after an hour' }
});

// Rate limiter applies to form submission routes ONLY (not reads)
// Note: Express 5 does not support bare '*' wildcards in path-to-regexp v8.
// Rate limiter is applied individually to each POST route below.

// @route   GET /api/public/menu — No auth required (public storefront)
router.get('/menu', async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/public/team — No auth required (public storefront)
router.get('/team', async (req, res) => {
  try {
    const items = await Team.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/public/testimonials — No auth required
router.get('/testimonials', async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/book', publicRateLimiter, async (req, res) => {
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
router.post('/contact', publicRateLimiter, async (req, res) => {
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
router.post('/subscribe', publicRateLimiter, async (req, res) => {
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

// @route   POST /api/public/checkout
router.post('/checkout', publicRateLimiter, async (req, res) => {
  try {
    const { customer, shippingAddress, notes, items, totals, paymentMethod } = req.body;
    
    // Basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const newOrder = new Order({
      customer,
      shippingAddress,
      notes,
      items,
      totals,
      paymentMethod
    });

    await newOrder.save();
    
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Server error while processing checkout' });
  }
});

module.exports = router;
