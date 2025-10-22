import Comment from "../models/comment.model.js";

// Add a new comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    // Check if comment is empty
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty!" });
    }

    const newComment = new Comment({
      postId: req.params.postId,
      commenterId: req.user.userId,
      content,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch all comments for a post
export const fetchCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("commenterId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment
export const removeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found!" });

    if (comment.commenterId.toString() !== req.user.userId)
      return res.status(401).json({ message: "You can delete only your own comment!" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
