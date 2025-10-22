import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;
