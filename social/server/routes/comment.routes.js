import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addComment, deleteComment, getCommentsForPost } from "../controllers/comment.controllers.js";

const commentRouter = express.Router();

// Add a comment to a post
commentRouter.post("/:postId", isAuth, addComment);

// Delete comment by id
commentRouter.post("/delete/:id", isAuth, deleteComment);

// Get comments for a post
commentRouter.get("/post/:postId", getCommentsForPost);

export default commentRouter;
