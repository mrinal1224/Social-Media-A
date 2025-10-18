// Import the Comment model
const Comment = require("../models/commentModel");

/**
 * @desc    Create a new comment on a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */
exports.createComment = async (req, res) => {
  try {
    // Create a new comment instance with post ID, user ID (from auth middleware), and content
    const comment = new Comment({
      post: req.params.postId,
      user: req.user.id, // set by your authentication middleware
      content: req.body.content, // comment text
    });

    // Save the new comment to the database
    await comment.save();

    // Return the created comment as response
    res.status(201).json(comment);
  } catch (err) {
    // Handle any unexpected errors (e.g., DB errors)
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get all comments for a given post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
exports.getCommentsByPost = async (req, res) => {
  try {
    // Fetch comments matching the given post ID
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username") // populate username from User model
      .sort({ createdAt: -1 }); // latest comments first

    // Return the list of comments
    res.status(200).json(comments);
  } catch (err) {
    // Handle database or server errors
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Delete a specific comment
 * @route   DELETE /api/comments/:commentId
 * @access  Private (only comment owner can delete)
 */
exports.deleteComment = async (req, res) => {
  try {
    // Find comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    // If comment doesn’t exist, return 404
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the logged-in user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Remove the comment
    await comment.remove();

    // Return confirmation message
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    // Catch and return any server errors
    res.status(500).json({ message: err.message });
  }
};
