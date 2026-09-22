import mongoose from "mongoose";

// Reel model keeps short-form video content separate from normal posts.
// This makes the feed easier to extend with reel-specific behavior later.
const reelSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["video"],
      default: "video",
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Reel = mongoose.model("reel", reelSchema);

export default Reel;
