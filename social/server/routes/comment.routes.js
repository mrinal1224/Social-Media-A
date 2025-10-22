import express from "express";
import { addComment, fetchCommentsByPost, removeComment } from "../controllers/comment.controllers.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Post a comment
router.post("/:postId", authMiddleware, addComment);

// Get all comments for a post
router.get("/:postId", fetchCommentsByPost);

// Delete a comment
router.delete("/:commentId", authMiddleware, removeComment);

export default router;
