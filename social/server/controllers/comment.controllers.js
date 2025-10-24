import CommentModel from "../models/comment.model.js";

/**
 * @desc    Add a new comment to a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */

export const addComment = async (req, res) => {
  try {
    const newComment = new CommentModel({
      postId: req.params.postId,
      authorId: req.user.userId,
      body: req.body.body,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Fetch all comments for a given post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
export const fetchCommentsByPost = async (req, res) => {
  try {
    const allComments = await CommentModel.find({ postId: req.params.postId })
      .populate("authorId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove a specific comment
 * @route   DELETE /api/comments/:commentId
 * @access  Private
 */
export const removeComment = async (req, res) => {
  try {
    const foundComment = await CommentModel.findById(req.params.commentId);
    if (!foundComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (foundComment.authorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: "Unauthorized action" });
    }

    await foundComment.deleteOne();
    res.status(200).json({ message: "Comment removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
