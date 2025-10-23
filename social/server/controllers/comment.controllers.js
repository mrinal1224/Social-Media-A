import Post from "../models/post.model.js";


export const createComment = async (req, res) => {
    try {

        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user._id; 

        if (!text) {
            return res.status(400).json({ error: "Comment text is required" });
        }


        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }


        const newComment = {
            user: userId,
            text: text,

        };


        post.comments.unshift(newComment);


        await post.save();


        res.status(201).json(post);

    } catch (error) {
        console.error("Error in createComment controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};