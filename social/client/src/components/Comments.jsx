import { useState, useEffect } from 'react';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch comments for the post
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/post/${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewComment('');
        fetchComments(); // Refresh comments
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentCommentId: commentId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchComments(); // Refresh comments
      } else {
        alert(data.message || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Error adding reply');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchComments(); // Refresh comments
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchComments(); // Refresh comments to show updated likes
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} border-l-2 border-gray-200 pl-4`}>
      <div className="flex items-start space-x-3">
        <img
          src={comment.author?.profilePic || 'https://via.placeholder.com/40'}
          alt={comment.author?.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="font-semibold text-sm">{comment.author?.name}</div>
            <div className="text-sm text-gray-700 mt-1">{comment.content}</div>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className="hover:text-blue-600"
            >
              Like ({comment.likes?.length || 0})
            </button>
            <button
              onClick={() => setReplyingTo(comment._id)}
              className="hover:text-blue-600"
            >
              Reply
            </button>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="hover:text-red-600"
            >
              Delete
            </button>
            <span className="text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Reply input */}
          {replyingTo === comment._id && (
            <div className="mt-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleAddReply(comment._id)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
