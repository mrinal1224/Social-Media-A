const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth'); // ensure this middleware sets req.user.id

// Create a new comment on a post (requires authentication)
router.post('/:postId', auth, commentController.createComment);

// Get all comments for a specific post
router.get('/:postId', commentController.getCommentsByPost);

// Delete a comment (requires authentication)
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
