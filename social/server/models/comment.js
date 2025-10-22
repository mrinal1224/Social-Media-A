import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
       
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
        
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", 
            required: true,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;