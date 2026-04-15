const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  tag: { 
    type: String, 
    enum: ['NEW', 'SALE', 'NONE'], 
    default: 'NONE' 
  },
  rating: { type: Number, default: 5 },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
