import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    // ensure post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      postId,
      author: req.userId,
      text: text.trim(),
    });

    // Optionally push comment into post.comments for denormalized list
    post.comments.push({ user: req.userId, text: comment.text, createdAt: comment.createdAt });
    await post.save();

    const populated = await comment.populate("author", "userName profileImage");

    return res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // comment id

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // allow delete if owner of comment or owner of post
    if (comment.author.toString() !== req.userId.toString()) {
      // check post owner
      const post = await Post.findById(comment.postId);
      if (!post) return res.status(404).json({ message: "Parent post not found" });
      if (post.author.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
    }

    await Comment.findByIdAndDelete(id);

    // remove from post.comments array if present
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: { createdAt: comment.createdAt } },
    });

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("author", "userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get comments" });
  }
};
