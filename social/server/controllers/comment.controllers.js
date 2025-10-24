const Comment = require('../models/commentModel');

/**
 * Add a new comment to a specific post
 */
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Please provide comment content' });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      content: content.trim(),
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error('Failed to create comment:', err);
    return res.status(500).json({ message: 'An error occurred while adding the comment' });
  }
};

/**
 * Retrieve all comments linked to a specific post
 */
exports.fetchCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return res.status(500).json({ message: 'An error occurred while retrieving comments' });
  }
};

/**
 * Remove a comment (only the author can delete)
 */
exports.removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this comment' });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (err) {
    console.error('Failed to delete comment:', err);
    return res.status(500).json({ message: 'An error occurred while deleting the comment' });
  }
};
