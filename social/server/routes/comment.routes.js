const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth'); // adjust as per your auth

router.post('/:postId', auth, commentController.createComment);
router.get('/:postId', commentController.getCommentsByPost);
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
