import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      author: userId,
      content: content.trim(),
      image: image || ""
    });

    await post.save();

    // Add post to user's posts array
    await User.findByIdAndUpdate(userId, {
      $push: { posts: post._id }
    });

    await post.populate('author', 'name userName profilePic');

    res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name userName profilePic')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name userName profilePic'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      message: "Posts fetched successfully",
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single post
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'name userName profilePic')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name userName profilePic'
        }
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      message: "Post fetched successfully",
      post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts by a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate('author', 'name userName profilePic')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name userName profilePic'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      message: "User posts fetched successfully",
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, image } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    if (content) post.content = content.trim();
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('author', 'name userName profilePic');

    res.json({
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Remove post from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: isLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};
