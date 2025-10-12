import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  toggleLikeComment,
} from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:postId", verifyToken, createComment);
router.get("/:postId", getCommentsByPost);
router.delete("/:id", verifyToken, deleteComment);
router.put("/like/:id", verifyToken, toggleLikeComment);

export default router;
