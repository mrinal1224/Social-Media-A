
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { likePost, addComment } from "../../apiCalls/authCalls";
import { updatePost } from "../redux/postSlice";
import Comment from "./Comment";

function Post({ post }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const commentsCount = post.comments ? post.comments.length : 0;

  useEffect(() => {
    if (userData && post.likes) {
      setIsLiked(post.likes.includes(userData._id));
    } else {
      setIsLiked(false);
    }
    setLikesCount(post.likes?.length || 0);
  }, [post, userData]);

  const handleLike = async () => {
    try {
      const updatedPost = await likePost(post._id);
      if (updatedPost) {
        dispatch(updatePost(updatedPost));
        setLikesCount(updatedPost.likes?.length || 0);
        if (userData) setIsLiked(updatedPost.likes?.includes(userData._id));
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const updatedPost = await addComment(post._id, commentText);
      if (updatedPost) {
        dispatch(updatePost(updatedPost));
      }
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.author?.profilePic || "/default-avatar.png"}
          alt={post.author?.userName || "user"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.author?.userName || "Unknown"}</p>
          <p className="text-xs text-neutral-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-3">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-[400px] object-cover rounded"
          />
        </div>
      )}

      {/* Post Caption */}
      {post.caption && <p className="mb-3">{post.caption}</p>}

      {/* Post Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-lg"
          aria-label="like"
        >
          {isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1 text-lg"
          aria-label="comments"
        >
          <BiComment />
          <span className="text-sm">{commentsCount}</span>
        </button>

        <button className="ml-auto text-lg" aria-label="bookmark">
          <BsBookmark />
        </button>
      </div>

      {/* Likes Count */}
      <div className="mt-2 text-sm">
        <span className="font-semibold">{likesCount} likes</span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="flex gap-2 items-center mb-3">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2 text-sm"
              disabled={isCommenting}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={isCommenting || !commentText.trim()}
            >
              {isCommenting ? "Posting..." : "Post"}
            </button>
          </form>

          {/* Display Comments */}
          {commentsCount > 0 && (
            <div className="mt-3 max-h-[200px] overflow-y-auto border-t pt-3">
              {post.comments.map((comment, idx) => (
                <Comment
                  key={comment._id || idx}
                  comment={comment}
                  postId={post._id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Post;
