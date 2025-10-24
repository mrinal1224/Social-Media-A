import Comment from "../models/comment.models.js";
import Post from "../models/post.models.js";

const getUserId = (req) => (req.user && req.user._id) || req.body.user;

export const createComment = async (req, res) => {
  try {
    const { post: postId, content, parentComment } = req.body;
    const userId = getUserId(req);

    if (!postId || !content || !userId) {
      return res.status(400).json({ message: "post, content and user are required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: postId,
      user: userId,
      parentComment: parentComment || null,
      content,
    });

    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, { $push: { replies: comment._id } });
    }

    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId, parentComment: null })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name avatar" })
      .populate({
        path: "replies",
        populate: { path: "user", select: "name avatar" },
        options: { sort: { createdAt: 1 } },
      });

    return res.json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name avatar" },
        options: { sort: { createdAt: 1 } },
      });

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    return res.json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "content is required" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    return res.json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = getUserId(req);
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, { $pull: { replies: comment._id } });
    }

    if (comment.replies && comment.replies.length) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    await comment.remove();
    return res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ message: "user required" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasLiked = comment.likes.some((l) => l.toString() === String(userId));
    if (hasLiked) {
      comment.likes = comment.likes.filter((l) => l.toString() !== String(userId));
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    return res.json({ likesCount: comment.likes.length, liked: !hasLiked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const parentCommentId = req.params.id;
    const { content } = req.body;
    const userId = getUserId(req);

    if (!content || !userId) return res.status(400).json({ message: "content and user required" });

    const parent = await Comment.findById(parentCommentId);
    if (!parent) return res.status(404).json({ message: "Parent comment not found" });

    const reply = await Comment.create({
      post: parent.post,
      user: userId,
      parentComment: parent._id,
      content,
    });

    parent.replies.push(reply._id);
    await parent.save();

    const populated = await Comment.findById(reply._id).populate("user", "name avatar");
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};