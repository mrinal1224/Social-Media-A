
import React, { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../../apiCalls/authCalls.js";

function CommentSection({ postId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const updatedComment = await addComment(postId, newComment);
      setComments([updatedComment, ...comments]); // add to top
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-3 bg-neutral-100 p-3 rounded-lg">
      <h3 className="font-semibold mb-2 text-neutral-800">Comments</h3>

      {comments.length > 0 ? (
        comments.map((c) => (
          <div key={c._id} className="mb-2 flex justify-between items-center">
            <div>
              <strong>{c.commenterId?.username || "User"}:</strong> {c.content}
            </div>
            {c.commenterId?._id === currentUserId && (
              <button
                onClick={() => handleDeleteComment(c._id)}
                className="text-red-500 text-sm hover:underline ml-2"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-neutral-500">No comments yet.</p>
      )}

      <div className="flex mt-3 gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
