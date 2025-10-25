import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const userId = req.userId;

    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create new comment
    const comment = new Comment({
      post: postId,
      author: userId,
      content: content.trim(),
      parentComment: parentCommentId || null
    });

    await comment.save();

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // If it's a reply, add to parent comment
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.replies.push(comment._id);
        await parentComment.save();
      }
    }

    // Populate author info
    await comment.populate('author', 'name userName profilePic');

    res.status(201).json({
      message: "Comment created successfully",
      comment
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get all top-level comments (no parent)
    const comments = await Comment.find({ 
      post: postId,
      parentComment: null 
    })
      .populate('author', 'name userName profilePic')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name userName profilePic'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      message: "Comments fetched successfully",
      comments,
      count: comments.length
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single comment with its replies
export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate('author', 'name userName profilePic')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name userName profilePic'
        }
      });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({
      message: "Comment fetched successfully",
      comment
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.content = content.trim();
    await comment.save();

    await comment.populate('author', 'name userName profilePic');

    res.json({
      message: "Comment updated successfully",
      comment
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }
    });

    // If it's a reply, remove from parent comment
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId }
      });
    }

    // Delete all replies to this comment
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike a comment
export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      message: isLiked ? "Comment unliked" : "Comment liked",
      likes: comment.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get replies to a comment
export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'name userName profilePic')
      .sort({ createdAt: 1 });

    res.json({
      message: "Replies fetched successfully",
      replies,
      count: replies.length
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Server error" });
  }
};
