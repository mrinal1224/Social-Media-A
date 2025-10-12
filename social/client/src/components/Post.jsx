import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { likePost, addComment } from "../../apiCalls/authCalls";
import { updatePost } from "../redux/postSlice";
import Comment from "./Comment";


function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // Check if current user liked this post
  const isLiked = post.likes?.some(id => id === userData?._id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  // Handle Like
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const updatedPost = await likePost(post._id);
      console.log(updatedPost)
      dispatch(updatePost(updatedPost));
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const updatedPost = await addComment(post._id, commentText.trim());
      dispatch(updatePost(updatedPost));
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[40px] h-[40px] rounded-full bg-neutral-300 overflow-hidden">
          <img
            src={post.author.profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{post.author.userName}</p>
          <p className="text-xs text-neutral-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post image/video */}
      <div className="w-full h-[500px] bg-neutral-200 rounded-lg mb-3 overflow-hidden">
        {post.mediaType === "image" ? (
          <img
            src={post.mediaUrl}
            alt="post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Post actions */}
      <div className="flex gap-4 mb-3 text-[22px] text-neutral-700">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-1 transition-all disabled:opacity-50"
        >
          {isLiked ? (
            <AiFillHeart className="text-red-500" />
          ) : (
            <AiOutlineHeart className="hover:text-red-500" />
          )}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 transition-all"
        >
          <BiComment className="hover:text-blue-500" />
          {commentsCount > 0 && (
            <span className="text-sm text-neutral-600">{commentsCount}</span>
          )}
        </button>

        <BsBookmark className="cursor-pointer hover:text-green-500 transition ml-auto" />
      </div>

      {/* Likes count */}
      {likesCount > 0 && (
        <p className="text-sm font-semibold mb-2">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>
      )}

      {/* Caption */}
      {post.caption && (
        <p className="text-sm text-neutral-700 mb-2">
          <span className="font-semibold">{post.author.userName}</span> {post.caption}
        </p>
      )}

      {/* View comments */}
      {commentsCount > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          View all {commentsCount} comments
        </button>
      )}

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 max-h-[300px] overflow-y-auto border-t pt-3">
          {commentsCount > 0 ? (
            post.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} postId={post._id} />
            ))
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}

      {/* Add comment */}
      {showComments && (
        <form onSubmit={handleComment} className="flex gap-2 mt-3 border-t pt-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isCommenting}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isCommenting ? "..." : "Post"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;