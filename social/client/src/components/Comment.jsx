import React from "react";
import { useSelector } from "react-redux";
import { deleteComment } from "../../apiCalls/authCalls";
import { useDispatch } from "react-redux";
import { updatePost } from "../redux/postSlice";

function Comment({ comment, postId, onDelete }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const updatedPost = await deleteComment(postId, comment._id);
      dispatch(updatePost(updatedPost));
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  const canDelete = comment.user?._id === userData?._id;

  return (
    <div className="mb-3 flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{comment.user?.userName || 'Unknown User'}</span>{" "}
          {comment.text}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          className="ml-2 text-red-500 hover:text-red-700 text-xs"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default Comment;