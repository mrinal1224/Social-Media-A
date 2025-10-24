// social/server/controllers/post.controllers.js
const Post = require('../models/post.model');
const User = require('../models/user.model'); // <-- Make sure this line is present
const mongoose = require('mongoose'); // Import mongoose if needed for ObjectId validation etc.

// ... keep existing functions (createPost, getPosts, getUserPosts, likeUnlikePost, deletePost) ...

// ** START: Add these new functions **

// Controller to add a comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // User ID comes from the 'isAuth' middleware

    // Basic validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
       return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create the new comment object
    const comment = {
      text: text.trim(),
      user: userId,
      createdAt: new Date() // Explicitly set creation time
    };

    // Add comment to the post's comments array
    post.comments.push(comment);
    await post.save();

    // Get the newly added comment (it's the last one in the array)
    const newComment = post.comments[post.comments.length - 1];

    // Populate the user details for the response
    // Ensure your User model includes 'username' and 'profilePic'
    await User.populate(newComment, { path: 'user', select: 'username profilePic' });

    // Send the populated comment back to the client
    res.status(201).json(newComment);

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Controller to delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id; // User ID from 'isAuth' middleware

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
       return res.status(400).json({ message: 'Invalid Post or Comment ID' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the index of the comment to delete
    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = post.comments[commentIndex];

    // Authorization check: Only the comment owner can delete it
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments' });
    }

    // Remove the comment using splice
    post.comments.splice(commentIndex, 1);
    await post.save();

    // Send success response
    res.status(200).json({ message: 'Comment deleted successfully', commentId: commentId });

  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// ** END: Add new functions **

// Make sure exports includes the new functions if you defined them elsewhere
module.exports = {
  createPost: exports.createPost, // Assuming these were already defined and exported
  getPosts: exports.getPosts,
  getUserPosts: exports.getUserPosts,
  likeUnlikePost: exports.likeUnlikePost,
  deletePost: exports.deletePost,
  addComment: exports.addComment, // Add this
  deleteComment: exports.deleteComment // Add this
};