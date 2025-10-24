const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth'); // ensure this middleware sets req.user.id

// new comment (needs auth)
router.post('/:postId', auth, commentController.createComment);

// get all comments by post
router.get('/:postId', commentController.getCommentsByPost);

// comment delete (needs auth)
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;