// social/server/routes/post.routes.js
const express = require('express');
const {
  createPost,
  getPosts,
  getUserPosts,
  likeUnlikePost,
  deletePost,
  addComment,     // <-- Import the addComment controller function
  deleteComment   // <-- Import the deleteComment controller function
} = require('../controllers/post.controllers');
const { isAuth } = require('../middlewares/isAuth');
const { upload } = require('../middlewares/multer');

const router = express.Router();

// Existing Post Routes
router.post('/create', isAuth, upload.single('img'), createPost);
router.get('/all', isAuth, getPosts);
router.get('/user/:username', isAuth, getUserPosts);
router.post('/like/:id', isAuth, likeUnlikePost);
router.delete('/:id', isAuth, deletePost);

// Comment Routes - Add these lines
router.post('/:postId/comments', isAuth, addComment);        // Route for adding a comment
router.delete('/:postId/comments/:commentId', isAuth, deleteComment); // Route for deleting a comment

module.exports = router;