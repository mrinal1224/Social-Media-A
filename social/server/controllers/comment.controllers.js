const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
  try {
    const comment = new Comment({
      post: req.params.postId,
      user: req.user.id,
      content: req.body.content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await comment.remove();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};