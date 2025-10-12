import React from "react";
import { useSelector } from "react-redux";
import { deleteComment } from "../../apiCalls/authCalls";
import { updatePost } from "../redux/postSlice";
import { useDispatch } from "react-redux";

function Comment({ comment, postId }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Check if current user is the comment author
  const isCommentAuthor = comment.user._id === userData?._id;

  const handleDeleteComment = async () => {
    if (!isCommentAuthor) return;

    try {
      const updatedPost = await deleteComment(postId, comment._id);
      dispatch(updatePost(updatedPost));
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className="flex items-start gap-2 mb-3 group">
      {/* Comment author avatar */}
      <div className="w-6 h-6 rounded-full bg-neutral-300 overflow-hidden flex-shrink-0">
        <img
          src={comment.user.profileImage}
          alt={comment.user.userName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Comment content */}
      <div className="flex-1 min-w-0">
        <div className="bg-neutral-100 rounded-2xl px-3 py-2 inline-block max-w-full">
          <p className="text-sm">
            <span className="font-semibold text-neutral-900">
              {comment.user.userName}
            </span>{" "}
            <span className="text-neutral-700">{comment.text}</span>
          </p>
        </div>
        
        {/* Comment metadata */}
        <div className="flex items-center gap-2 mt-1 ml-3">
          <span className="text-xs text-neutral-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
          
          {/* Delete button - only visible to comment author */}
          {isCommentAuthor && (
            <button
              onClick={handleDeleteComment}
              className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;

