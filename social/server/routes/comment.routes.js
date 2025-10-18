// Importing required modules
const express = require("express");
const router = express.Router();

// Importing controller functions that handle comment-related logic
const commentController = require("../controllers/commentController");

// Importing authentication middleware (ensures only logged-in users can perform certain actions)
const auth = require("../middleware/auth"); // adjust path if needed

// @route   POST /:postId
// @desc    Create a new comment on a specific post
// @access  Private (requires authentication)
router.post("/:postId", auth, commentController.createComment);

// @route   GET /:postId
// @desc    Get all comments for a specific post
// @access  Public
router.get("/:postId", commentController.getCommentsByPost);

// @route   DELETE /:commentId
// @desc    Delete a specific comment by ID
// @access  Private (requires authentication)
router.delete("/:commentId", auth, commentController.deleteComment);

// Exporting the router to be used in the main server file (e.g., app.js)
module.exports = router;
