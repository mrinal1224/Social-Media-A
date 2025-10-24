// social/client/src/components/Post.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Import Link for usernames
import { API_BASE_URL } from '../apiCalls/config'; // Make sure path is correct

// Assuming you have icons, import them or use text/emoji
// import { Heart, MessageCircle, Trash2 } from 'react-feather'; // Example using react-feather

const Post = ({ post: initialPost }) => {
  const { user: currentUser } = useSelector(state => state.user); // Get logged-in user from Redux store
  const [post, setPost] = useState(initialPost); // Use local state for post data (likes, comments)
  const [comments, setComments] = useState(initialPost.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false); // To prevent double-clicks on like

  // Update local state if the initialPost prop changes (e.g., in a feed)
  useEffect(() => {
    setPost(initialPost);
    setComments(initialPost.comments || []);
  }, [initialPost]);

  // Check if the current user has liked this post
  const isLiked = post.likes?.includes(currentUser?._id);

  // --- Like/Unlike Handler ---
  const handleLikeUnlike = async () => {
    if (isLiking || !currentUser) return; // Prevent action if not logged in or already processing
    setIsLiking(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/like/${post._id}`,
        {}, // Empty body
        { withCredentials: true }
      );

      // Update the post state locally based on the response
      setPost(prevPost => ({
        ...prevPost,
        likes: res.data.likes // Assuming backend returns the updated likes array
      }));

      // Optional: Show toast notification
      // toast.success(res.data.message);

    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast.error(error.response?.data?.message || 'Could not update like status.');
    } finally {
      setIsLiking(false);
    }
  };

  // --- Add Comment Handler ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return; // Need text and logged-in user

    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/${post._id}/comments`,
        { text: newComment },
        { withCredentials: true }
      );
      // Add the new comment (returned with populated user) to the local state
      setComments(prevComments => [...prevComments, res.data]);
      setNewComment(''); // Clear input field
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Could not add comment.');
    }
  };

  // --- Delete Comment Handler ---
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/posts/${post._id}/comments/${commentId}`,
        { withCredentials: true }
      );
      // Remove the comment from local state
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      toast.success(res.data.message || 'Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Could not delete comment.');
    }
  };

  // --- Helper to format date ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString; // Fallback
    }
  };

  return (
    <div className="border rounded-lg shadow-md mb-6 bg-white overflow-hidden max-w-2xl mx-auto"> {/* Added max-width and centering */}
      {/* Post Header */}
      <div className="flex items-center p-4 border-b">
        <Link to={`/profile/${post.user?.username}`} className="flex items-center">
          <img
            src={post.user?.profilePic || '/default-avatar.png'} // Use a default avatar image
            alt={post.user?.username || 'User'}
            className="w-10 h-10 rounded-full mr-3 object-cover border" // Added border
          />
          <span className="font-semibold text-gray-800 hover:underline">
            {post.user?.username || 'Unknown User'}
          </span>
        </Link>
        {/* Optional: Add delete post button if currentUser._id === post.user._id */}
        {currentUser?._id === post.user?._id && (
           <button
             onClick={() => {/* Implement delete post logic here */}}
             className="ml-auto text-red-500 hover:text-red-700 text-xs"
             aria-label="Delete post"
           >
             {/* Use an icon or text like 'Delete' */}
              🗑️
           </button>
         )}
      </div>

      {/* Post Image */}
      {/* Make sure the image resizes correctly */}
      <div className="w-full bg-gray-100 flex justify-center">
         <img
            src={post.img}
            alt="Post content"
            className="w-full object-contain max-h-[75vh]" // Adjust max-height as needed
         />
      </div>


      {/* Post Actions (Like, Comment Button) */}
      <div className="flex items-center p-4 border-b space-x-4">
        <button
          onClick={handleLikeUnlike}
          disabled={isLiking || !currentUser}
          className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 disabled:opacity-50`}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          {/* Heart Icon or Emoji */}
          <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span>Like ({post.likes?.length || 0})</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
          aria-label="Toggle comments"
        >
          {/* Comment Icon or Emoji */}
          <span className="text-xl">💬</span>
          <span>Comment ({comments?.length || 0})</span>
        </button>
      </div>

      {/* Post Caption */}
      {post.caption && (
        <div className="p-4 pt-2 text-sm">
          <Link to={`/profile/${post.user?.username}`} className="font-semibold mr-2 hover:underline">
            {post.user?.username || 'Unknown User'}
          </Link>
          <span>{post.caption}</span>
        </div>
      )}

      {/* Comment Section (Conditionally Rendered) */}
      {showComments && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="font-semibold mb-3 text-gray-700 text-base">Comments</h4> {/* Adjusted styling */}
          <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar"> {/* Scrollable comments with custom scrollbar class if needed */}
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment._id} className="flex justify-between items-start text-sm">
                  <div className="flex items-start">
                     <Link to={`/profile/${comment.user?.username}`}>
                        <img
                           src={comment.user?.profilePic || '/default-avatar.png'}
                           alt={comment.user?.username}
                           className="w-6 h-6 rounded-full mr-2 object-cover border"
                        />
                     </Link>
                     <div>
                        <Link to={`/profile/${comment.user?.username}`} className="font-semibold mr-1.5 hover:underline">
                           {comment.user?.username || 'User'}
                        </Link>
                        <span>{comment.text}</span>
                        <div className="text-xs text-gray-500 mt-0.5">{formatDate(comment.createdAt)}</div>
                     </div>
                  </div>
                  {/* Show delete button only if the logged-in user is the comment owner */}
                  {currentUser?._id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2 flex-shrink-0"
                      aria-label="Delete comment"
                    >
                      🗑️ {/* Trash Icon or 'Delete' */}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No comments yet.</p>
            )}
          </div>

          {/* Add Comment Form */}
          {currentUser && ( // Only show form if user is logged in
            <form onSubmit={handleAddComment} className="flex items-center border-t pt-4 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow border rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" // Adjusted padding/focus
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1.5 rounded-r-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed" // Adjusted styles
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;