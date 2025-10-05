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
    const posts = await Post.find({})
      .populate("author", "userName profileImage")
      .populate("comments.user", "userName");
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


export const comment = async (req, res) => {
  try {
    console.log("Comment request received:", req.body);
    console.log("User ID from auth:", req.userId);
    
    const { postId, text } = req.body;
    const userId = req.userId;
    
    if (!postId || !text) {
      return res.status(400).json({ message: "PostId and text are required" });
    }
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found:", postId);
      return res.status(404).json({ message: "No Post Found" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "No User Found" });
    }
    
    console.log("Creating comment for post:", postId, "by user:", userId);
    
    // Create comment object matching the schema
    const newComment = {
      user: userId,
      text: text,
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    await post.save();
    
    console.log("Comment saved successfully");
    
    // Populate the post with author and comments
    const populatedPost = await Post.findById(postId)
      .populate("author", "userName profileImage")
      .populate("comments.user", "userName");
    
    console.log("Returning populated post with comments:", populatedPost.comments.length);
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ message: `Cannot Comment: ${error.message}` });
  }
};
