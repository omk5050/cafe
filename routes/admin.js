const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { cloudinary, upload } = require('../config/cloudinary');

const Team = require('../models/Team');
const Testimonial = require('../models/Testimonial');
const Menu = require('../models/Menu');
const Gallery = require('../models/Gallery');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
// Apply auth middleware to all admin routes
router.use(adminAuth);

// ---------------- TEAM ---------------- //
router.get('/team', async (req, res) => {
  try {
    const items = await Team.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { name, role } = req.body;
    const newItem = new Team({
      name,
      role,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const item = await Team.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    // Crucial: Delete from Cloudinary before removing from DB
    await cloudinary.uploader.destroy(item.cloudinaryId);
    await item.deleteOne();
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- TESTIMONIAL ---------------- //
router.get('/testimonial', async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testimonial', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { clientName, clientRole, quote } = req.body;
    const newItem = new Testimonial({
      clientName,
      clientRole,
      quote,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/testimonial/:id', async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    // Crucial: Delete from Cloudinary before removing from DB
    await cloudinary.uploader.destroy(item.cloudinaryId);
    await item.deleteOne();
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- MENU ---------------- //
router.get('/menu', async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/menu', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { name, price, oldPrice, tag, rating } = req.body;
    const newItem = new Menu({
      name,
      price,
      oldPrice,
      tag,
      rating,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    // Crucial: Delete from Cloudinary before removing from DB
    await cloudinary.uploader.destroy(item.cloudinaryId);
    await item.deleteOne();
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GALLERY ---------------- //
router.get('/gallery', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { title, subtitle, gridSize } = req.body;
    const newItem = new Gallery({
      title,
      subtitle,
      gridSize,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    // Crucial: Delete from Cloudinary before removing from DB
    await cloudinary.uploader.destroy(item.cloudinaryId);
    await item.deleteOne();
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- BOOKINGS ---------------- //
router.get('/bookings', async (req, res) => {
  try {
    const items = await Booking.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CONTACTS ---------------- //
router.get('/contacts', async (req, res) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- NEWSLETTER ---------------- //
router.get('/newsletter', async (req, res) => {
  try {
    const items = await Newsletter.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
