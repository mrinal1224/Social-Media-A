import express from "express";
import { createComment, getCommentsByPost, deleteComment } from "../controllers/comment.controllers.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Post a comment
router.post("/:postId", authMiddleware, createComment);

// Get all comments for a post
router.get("/:postId", getCommentsByPost);

// Delete a comment
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
