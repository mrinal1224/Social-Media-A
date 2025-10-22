import express from "express";
import { addComment, fetchComments, removeComment } from "../controllers/comment.controllers.js";
import authMiddleware from "../middleware/auth.js";

const commentRouter = express.Router();

// Add a new comment to a post
commentRouter.post("/:postId", authMiddleware, addComment);

// Retrieve all comments for a specific post
commentRouter.get("/:postId", fetchComments);

// Delete a comment by its ID
commentRouter.delete("/:commentId", authMiddleware, removeComment);

export default commentRouter;
