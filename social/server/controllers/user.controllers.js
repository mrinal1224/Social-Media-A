import uploadFile from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    return res.status(401).json({ message: "Not authorized , no token" });
  }
  try {
    const verifiedUser = await User.findById(userId).select("-password");
    res.json(verifiedUser);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { userName, name, bio } = req.body;

    const user = await User.findById(req.userId);

    // userName Validition and Duplication Check- HW

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    let profileImage='';

    if (req.file) {
      profileImage = await uploadFile(req.file.path);
      console.log(profileImage)
    }

    user.name = name;
    user.userName = userName;
    user.bio = bio;
    user.profileImage = profileImage;

    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    console.log(`Error Updating User -> ${error}`);
  }
};


export const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get suggested user error ${error}` });
  }
};