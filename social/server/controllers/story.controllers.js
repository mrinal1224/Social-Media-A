import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import uploadFile from "../config/cloudinary.js";

export const createStory = async (req, res) => {
  try {
    const { mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "no file found" });
    }

    const mediaUrl = await uploadFile(req.file.path);
    const story = await Story.create({
      mediaUrl,
      mediaType,
      author: req.userId,
    });

    // extra things
    const user = await User.findById(req.userId);

    user.story.push(story._id);
    await user.save();

    const populatedStory = await Story.findById(story._id).populate(
      "author",
      "profileImage userName"
    );

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `Cannot upload Story ${error}` });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentTime = new Date();

    // Get all non-expired stories
    const stories = await Story.find({
      expiresAt: { $gt: currentTime },
    })
      .populate("author", "userName profileImage name")
      .populate("viewers", "userName profileImage")
      .sort({ createdAt: -1 });

    // Group stories by author
    const groupedStories = stories.reduce((acc, story) => {
      const authorId = story.author._id.toString();
      
      if (!acc[authorId]) {
        acc[authorId] = {
          author: story.author,
          stories: [],
        };
      }
      
      acc[authorId].stories.push(story);
      return acc;
    }, {});

    

    // Convert to array
    const storiesArray = Object.values(groupedStories);
    console.log(storiesArray)
    return res.status(200).json(storiesArray);
  } catch (error) {
    console.error("Get stories error:", error);
    return res.status(500).json({ message: "Failed to fetch stories" });
  }
};

// get user specific stories

// Get current user's stories
export const getMyStories = async (req, res) => {
  try {
    const currentTime = new Date();

    const stories = await Story.find({
      author: req.userId,
      expiresAt: { $gt: currentTime },
    })
      .populate("author", "userName profileImage name")
      .populate("viewers", "userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    console.error("Get my stories error:", error);
    return res.status(500).json({ message: "Failed to fetch your stories" });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentTime = new Date();

    const stories = await Story.find({
      author: userId,
      expiresAt: { $gt: currentTime },
    })
      .populate("author", "userName profileImage name")
      .populate("viewers", "userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    console.error("Get user stories error:", error);
    return res.status(500).json({ message: "Failed to fetch user stories" });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const currentUserId = req.userId;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if story is expired
    if (new Date() > story.expiresAt) {
      return res.status(400).json({ message: "Story has expired" });
    }

    // Check if user already viewed this story
    const alreadyViewed = story.viewers.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (!alreadyViewed) {
      story.viewers.push(currentUserId);
      await story.save();
    }

    // Populate and return updated story
    const updatedStory = await Story.findById(storyId)
      .populate("author", "userName profileImage name")
      .populate("viewers", "userName profileImage");

    return res.status(200).json(updatedStory);
  } catch (error) {
    console.error("View story error:", error);
    return res.status(500).json({ message: "Failed to view story" });
  }
};

//Delete a Story

// Small Homework


