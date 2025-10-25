import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String , default:'' },
  bio: { type: String, default: "" },
  followers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  reels: [],
  stories: []
});

const User = mongoose.model("User", userSchema);

export default User;
