import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      },
      index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
    }
  },
  { timestamps: true }
);

// Index for efficient querying
storySchema.index({ author: 1, expiresAt: 1 });
storySchema.index({ expiresAt: 1 });

const Story = mongoose.model("story", storySchema);

export default Story;