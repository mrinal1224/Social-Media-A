const Comment = require('../models/commentModel');

/**
 * Create a new comment for a specific post
 */
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const newComment = await Comment.create({
      post: postId,
      user: req.user.id,
      content: content.trim(),
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error while creating comment' });
  }
};

/**
 * Fetch all comments for a specific post
 */
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
};

/**
 * Delete a specific comment (only author can delete)
 */
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
};
