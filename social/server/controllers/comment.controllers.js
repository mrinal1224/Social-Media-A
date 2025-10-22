import Comment from "../models/comment.model.js";

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const newComment = new Comment({
      postId,
      commenterId: req.user.userId,
      content: content.trim(),
    });

    await newComment.save();
    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Fetch comments of a post
export const fetchComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const commentData = await Comment.find({ postId })
      .populate("commenterId", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json(commentData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Remove a comment
export const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const commentDoc = await Comment.findById(commentId);

    if (!commentDoc) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (commentDoc.commenterId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can delete only your own comment" });
    }

    await commentDoc.deleteOne();
    return res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
