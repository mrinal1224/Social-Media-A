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


export const comment  = async(req , res)=>{
   // postid
   // userid
   // userName
   // text
   // createdAt

  try {
    const postId = req.params.postId;

    const { commentText } = req.body;

    if (!commentText || commentText.trim() === "") {
      return res
        .status(400)
        .json({ message: "Empty comment. Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "No post Found" });
    }

    const newComment = {
      user: req.userId,

      text,

      createdAt: Date.now(),
    };

    post.comments.push(newComment);

    await post.save();

    await post.populate({
      path: "comments.user",

      select: "userName profileImage",
    });

    await post.populate("author", "userName profileImage");

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: `Cannot add comment: ${error.message}` });
  }
}
