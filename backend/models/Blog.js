const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: '' // URL returned by Cloudinary
    },
    cloudinaryId: {
      type: String,
      default: '' // Identifier to update/delete images on Cloudinary
    },
    author: {
      type: String,
      default: 'Admin'
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
