import React, { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../../apiCalls/authCalls.js";

function CommentSection({ postId, currentUserId }) {
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Load comments when component mounts or postId changes
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await getComments(postId);
        setCommentList(response);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    loadComments();
  }, [postId]);

  // Add a new comment
  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const newEntry = await addComment(postId, commentText);
      setCommentList(prev => [newEntry, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Remove a comment
  const handleRemove = async (id) => {
    try {
      await deleteComment(id);
      setCommentList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="p-3 mt-3 bg-gray-100 rounded-lg">
      <h3 className="mb-2 font-semibold text-gray-800">Comments</h3>

      {commentList.length ? (
        commentList.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center mb-2"
          >
            <p>
              <span className="font-medium">
                {item.commenterId?.username || "Anonymous"}:
              </span>{" "}
              {item.content}
            </p>
            {item.commenterId?._id === currentUserId && (
              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSubmit}
          className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
