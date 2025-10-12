import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.create({ postId, userId, text });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
