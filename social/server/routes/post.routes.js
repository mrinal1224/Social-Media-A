import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  getUserPosts,
  updatePost,
  deletePost,
  toggleLikePost
} from '../controllers/post.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const postRouter = express.Router();

// Create a post (requires authentication)
postRouter.post('/', isAuth, createPost);

// Get all posts
postRouter.get('/', getAllPosts);

// Get a specific post
postRouter.get('/:postId', getPost);

// Get posts by a specific user
postRouter.get('/user/:userId', getUserPosts);

// Update a post (requires authentication)
postRouter.put('/:postId', isAuth, updatePost);

// Delete a post (requires authentication)
postRouter.delete('/:postId', isAuth, deletePost);

// Like/Unlike a post (requires authentication)
postRouter.post('/:postId/like', isAuth, toggleLikePost);

export default postRouter;
