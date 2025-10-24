// social/server/models/post.model.js
const mongoose = require('mongoose');

// Define the schema for comments first
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true // Added trim for cleaner data
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure 'User' matches your user model name
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the postSchema to include the comments array
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  img: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: "",
    trim: true // Added trim
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema] // <-- Add the comments array using the commentSchema
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;