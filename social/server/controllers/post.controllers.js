import uploadFile from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const uploadPost = async (req, res) => {
  try {
    // caption
    //mediaType
    // mediaUrl
    const { mediaType, caption } = req.body;

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File path:", req.file.path); // Check if path exists

    let mediaUrl = "";
    try {
      mediaUrl = await uploadFile(req.file.path);
      console.log("Cloudinary URL:", mediaUrl);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res
        .status(500)
        .json({ message: `Cloudinary upload failed: ${uploadError.message}` });
    }

    if (!mediaUrl) {
      return res
        .status(500)
        .json({ message: "Failed to get media URL from Cloudinary" });
    }

    // create the post

    const post = await Post.create({
      mediaType,
      caption,
      mediaUrl,
      author: req.userId,
    });
    // we need to show posts for a individual user
    const user = await User.findById(req.userId).populate("posts");
    user.posts.push(post._id);
    await user.save();

    // we need to show posts on the feed

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "userName profileImage"
    );

    return res.status(201).json(populatedPost);

    // userName
    // profileImage
  } catch (error) {
    res.status(500).json({ message: `Cannot Upload$ ${error}` });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    // Get current user with following list
    const currentUser = await User.findById(req.userId);
    
    // Create array of user IDs to fetch posts from (followed users + self)
    const userIds = [req.userId, ...currentUser.following];
    
    // Get posts only from these users
    const posts = await Post.find({
      author: { $in: userIds }
    })
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 }); // Latest posts first
    
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: `Cannot get posts error ${error}` });
  }
};


export const like = async (req, res) => {
  // post id
  // userId
  // already liked the post - dislike
  // if not - like
  // userName
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "No post Found" });
  }

  // if this is already liked?
  // userId -> likes[] - all user Ids

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === req.userId.toString()
  );

  if (alreadyLiked) {
    // post is already liked
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.userId.toString()
    );
  } else {
    post.likes.push(req.userId);
  }

  await post.save();
  await post.populate("author", "userName");

  return res.status(200).json(post);
};

// homework
// Example: postController.js

export const comment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.userId;

    // ✅ Step 1: Validate comment text
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    // ✅ Step 2: Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Step 3: Add comment
    const newComment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    await post.populate("comments.user", "userName profileImage");

    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};



export const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find comment inside post
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the logged-in user is the one who made the comment
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    // Update text
    comment.text = text;
    await post.save();

    await post.populate("comments.user", "userName profileImage");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: `Cannot edit comment: ${error}` });
  }
};



export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if user owns the comment or is the author of the post
    if (
      comment.user.toString() !== req.userId.toString() &&
      post.author.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Remove comment
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId
    );
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: `Cannot delete comment: ${error}` });
  }
};
