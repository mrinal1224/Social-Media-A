import express from "express";
import {
  createComment,
  getCommentsByPost,
  getComment,
  updateComment,
  deleteComment,
  toggleLike,
  replyToComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", createComment);
router.get("/post/:postId", getCommentsByPost);
router.get("/:id", getComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);
router.post("/:id/like", toggleLike);
router.post("/:id/reply", replyToComment);

export default router;