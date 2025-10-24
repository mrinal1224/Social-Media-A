import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // for replies
    content: { type: String, required: true, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // optional convenience array
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// index for common queries
commentSchema.index({ post: 1, user: 1 });

export default model("Comment", commentSchema);