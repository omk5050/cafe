const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  gridSize: { 
    type: String, 
    enum: ['large', 'medium', 'small'], 
    default: 'small' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
