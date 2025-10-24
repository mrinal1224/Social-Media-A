import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { likePost } from "../../apiCalls/authCalls";
import { createComment, createReply } from "../../apiCalls/authCalls";
import { updatePost } from "../redux/postSlice";


function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyOpen, setReplyOpen] = useState({}); // { commentId: bool }
  const [replyText, setReplyText] = useState({}); // { commentId: text }

  // Check if current user liked this post
  const isLiked = currentPost.likes?.some(id => id === userData?._id);
  const likesCount = currentPost.likes?.length || 0;
  const commentsCount = currentPost.comments?.length || 0;

  // Handle Like
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const updatedPost = await likePost(currentPost._id);
      console.log(updatedPost)
      dispatch(updatePost(updatedPost));
      setCurrentPost(updatedPost);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
   e.preventDefault();
   if (!commentText.trim()) return;
   if (isCommenting) return;
   setIsCommenting(true);
    try {
     const updatedPost = await createComment(currentPost._id, commentText.trim());
     dispatch(updatePost(updatedPost));
     setCurrentPost(updatedPost);
     setCommentText("");
     setShowComments(true);
   } catch (error) {
     console.error("Comment error:", error);
     // Optionally show a toast
   } finally {
     setIsCommenting(false);
   }
  };

  const handleReply = async (e, commentId) => {
    e.preventDefault();
    const text = (replyText[commentId] || "").trim();
    if (!text) return;
    try {
      const updatedPost = await createReply(currentPost._id, commentId, text);
      dispatch(updatePost(updatedPost));
      setCurrentPost(updatedPost);
      setReplyText(prev => ({ ...prev, [commentId]: "" }));
      setReplyOpen(prev => ({ ...prev, [commentId]: false }));
      setShowComments(true);
    } catch (error) {
      console.error("Reply error:", error);
    }
  }

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[40px] h-[40px] rounded-full bg-neutral-300 overflow-hidden">
          <img
            src={currentPost.author?.profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{currentPost.author?.userName}</p>
          <p className="text-xs text-neutral-500">
            {new Date(currentPost.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post image/video */}
      <div className="w-full h-[500px] bg-neutral-200 rounded-lg mb-3 overflow-hidden">
        {currentPost.mediaType === "image" ? (
          <img
            src={currentPost.mediaUrl}
            alt="post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={currentPost.mediaUrl}
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
      {currentPost.caption && (
        <p className="text-sm text-neutral-700 mb-2">
          <span className="font-semibold">{currentPost.author?.userName}</span> {currentPost.caption}
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
      {showComments && commentsCount > 0 && (
        <div className="mt-3 max-h-[300px] overflow-y-auto border-t pt-3">
          {currentPost.comments.map((comment) => (
            <div key={comment._id} className="mb-3">
              <p className="text-sm">
                <span className="font-semibold">{comment.user?.userName || 'User'}</span>{" "}
                {comment.text}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 ml-4">
                  {comment.replies.map((r) => (
                    <div key={r._id} className="mb-2">
                      <p className="text-sm">
                        <span className="font-semibold">{r.user?.userName || 'User'}</span>{" "}
                        {r.text}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply button & form */}
              <div className="mt-1 ml-0">
                <button
                  onClick={() => setReplyOpen(prev => ({ ...prev, [comment._id]: !prev[comment._id] }))}
                  className="text-xs text-neutral-500 hover:text-neutral-700 mr-2"
                >
                  Reply
                </button>

                {replyOpen[comment._id] && (
                  <form onSubmit={(e) => handleReply(e, comment._id)} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText[comment._id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [comment._id]: e.target.value }))}
                      className="flex-1 px-3 py-1 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-400"
                    />
                    <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">Reply</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
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
    </div>
  );
}

export default Post;