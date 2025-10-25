import express from 'express';
import {
  createComment,
  getCommentsByPost,
  getComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  getReplies
} from '../controllers/comment.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const commentRouter = express.Router();

// Create a comment (requires authentication)
commentRouter.post('/', isAuth, createComment);

// Get all comments for a specific post
commentRouter.get('/post/:postId', getCommentsByPost);

// Get a specific comment with its replies
commentRouter.get('/:commentId', getComment);

// Get replies to a specific comment
commentRouter.get('/:commentId/replies', getReplies);

// Update a comment (requires authentication)
commentRouter.put('/:commentId', isAuth, updateComment);

// Delete a comment (requires authentication)
commentRouter.delete('/:commentId', isAuth, deleteComment);

// Like/Unlike a comment (requires authentication)
commentRouter.post('/:commentId/like', isAuth, toggleLikeComment);

export default commentRouter;
