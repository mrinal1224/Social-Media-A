import uploadFile from "../config/cloudinary.js";
import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";

export const uploadReel = async (req, res) => {
  try {
    // Reels are video-only, so we only expect a video file from the client.
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const mediaUrl = await uploadFile(req.file.path);

    const reel = await Reel.create({
      caption,
      mediaUrl,
      author: req.userId,
    });

    // Keep the user's reel references in sync for future profile queries.
    const user = await User.findById(req.userId);
    if (user) {
      user.reels.push(reel._id);
      await user.save();
    }

    const populatedReel = await Reel.findById(reel._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json(populatedReel);
  } catch (error) {
    return res.status(500).json({
      message: `Cannot upload reel: ${error.message}`,
    });
  }
};

export const getAllReels = async (req, res) => {
  try {
    // Match the existing post-feed rule: show the current user's reels
    // plus reels from users the current user follows.
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const userIds = [req.userId, ...(currentUser.following || [])];

    const reels = await Reel.find({
      author: { $in: userIds },
    })
      .populate("author", "name userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(reels);
  } catch (error) {
    return res.status(500).json({
      message: `Cannot get reels: ${error.message}`,
    });
  }
};
