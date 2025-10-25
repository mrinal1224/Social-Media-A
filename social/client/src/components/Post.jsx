import { useState } from 'react';
import Comments from './Comments';

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${post._id}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setLikes(data.likes);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Post header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.author?.profilePic || 'https://via.placeholder.com/50'}
          alt={post.author?.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{post.author?.name}</h3>
          <p className="text-sm text-gray-500">@{post.author?.userName}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-800 mb-4">{post.content}</p>

      {/* Post image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* Post actions */}
      <div className="flex items-center space-x-6 pt-4 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${isLiked ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{likes} Likes</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <span>💬</span>
          <span>{post.comments?.length || 0} Comments</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && <Comments postId={post._id} />}
    </div>
  );
};

export default Post;
