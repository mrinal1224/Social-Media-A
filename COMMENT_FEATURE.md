# Comment Feature Documentation

## Overview
A complete comment system has been added to the social media application with support for nested replies, likes, and full CRUD operations.

## Backend Implementation

### Models Created

#### 1. Post Model (`/server/models/post.model.js`)
- Fields: author, content, image, likes, comments
- References User and Comment models
- Timestamps enabled

#### 2. Comment Model (`/server/models/comment.model.js`)
- Fields: post, author, content, likes, replies, parentComment
- Supports nested comments (replies)
- References User, Post, and Comment models
- Timestamps enabled

### API Endpoints

#### Comment Routes (`/api/comments`)

**Create Comment**
- `POST /api/comments`
- Body: `{ postId, content, parentCommentId? }`
- Requires authentication
- Creates a comment or reply to a comment

**Get Comments for Post**
- `GET /api/comments/post/:postId`
- Returns all top-level comments with populated replies
- Public endpoint

**Get Single Comment**
- `GET /api/comments/:commentId`
- Returns comment with populated author and replies

**Get Replies**
- `GET /api/comments/:commentId/replies`
- Returns all replies to a specific comment

**Update Comment**
- `PUT /api/comments/:commentId`
- Body: `{ content }`
- Requires authentication (author only)

**Delete Comment**
- `DELETE /api/comments/:commentId`
- Requires authentication (author only)
- Cascades deletion to all replies

**Like/Unlike Comment**
- `POST /api/comments/:commentId/like`
- Requires authentication
- Toggles like status

#### Post Routes (`/api/posts`)

**Create Post**
- `POST /api/posts`
- Body: `{ content, image? }`
- Requires authentication

**Get All Posts**
- `GET /api/posts`
- Returns all posts with populated comments and authors

**Get Single Post**
- `GET /api/posts/:postId`
- Returns post with comments

**Get User Posts**
- `GET /api/posts/user/:userId`
- Returns all posts by a specific user

**Update Post**
- `PUT /api/posts/:postId`
- Body: `{ content?, image? }`
- Requires authentication (author only)

**Delete Post**
- `DELETE /api/posts/:postId`
- Requires authentication (author only)

**Like/Unlike Post**
- `POST /api/posts/:postId/like`
- Requires authentication

## Frontend Implementation

### Components Created

#### 1. Comments Component (`/client/src/components/Comments.jsx`)
Features:
- Display all comments for a post
- Add new comments
- Reply to comments (nested)
- Like comments
- Delete comments
- Real-time updates after actions
- User-friendly UI with Tailwind CSS

Props:
- `postId` (required): The ID of the post to display comments for

#### 2. Post Component (`/client/src/components/Post.jsx`)
Features:
- Display post content and metadata
- Like/unlike posts
- Toggle comments visibility
- Integrates Comments component

Props:
- `post` (required): Post object with author, content, image, likes, comments

## Usage Example

```jsx
import Post from './components/Post';
import Comments from './components/Comments';

// Display a post with comments
function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:8000/api/posts');
    const data = await response.json();
    setPosts(data.posts);
  };

  return (
    <div>
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

// Or use Comments component standalone
function PostDetail({ postId }) {
  return (
    <div>
      {/* Post content here */}
      <Comments postId={postId} />
    </div>
  );
}
```

## Features

### ✅ Implemented
- Create, read, update, delete comments
- Nested replies (unlimited depth)
- Like/unlike comments and posts
- User authentication for protected actions
- Author-only edit/delete permissions
- Automatic cascade deletion of replies
- Real-time comment count updates
- Responsive UI with Tailwind CSS

### 🎯 Comment System Capabilities
- **Nested Replies**: Comments can have unlimited nested replies
- **Rich User Info**: Each comment shows author name, username, and profile picture
- **Timestamps**: All comments show creation date
- **Like System**: Both comments and replies can be liked
- **Authorization**: Only authors can edit/delete their comments
- **Validation**: Input validation on both frontend and backend

## Database Schema Relationships

```
User ──┬─> Posts (array of Post IDs)
       └─> Followers/Following (array of User IDs)

Post ──┬─> Author (User reference)
       ├─> Likes (array of User IDs)
       └─> Comments (array of Comment IDs)

Comment ──┬─> Post (Post reference)
          ├─> Author (User reference)
          ├─> Likes (array of User IDs)
          ├─> Replies (array of Comment IDs)
          └─> ParentComment (Comment reference, null for top-level)
```

## Testing the Feature

1. **Create a post**:
   ```bash
   POST http://localhost:8000/api/posts
   Body: { "content": "My first post!" }
   ```

2. **Add a comment**:
   ```bash
   POST http://localhost:8000/api/comments
   Body: { "postId": "POST_ID", "content": "Great post!" }
   ```

3. **Reply to a comment**:
   ```bash
   POST http://localhost:8000/api/comments
   Body: { 
     "postId": "POST_ID", 
     "content": "I agree!",
     "parentCommentId": "COMMENT_ID"
   }
   ```

4. **Get all comments**:
   ```bash
   GET http://localhost:8000/api/comments/post/POST_ID
   ```

## Environment Setup

Make sure your `.env` file in the server directory includes:
```
dbUrl=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_secret_key
PORT=8000
```

## Next Steps / Enhancements

- [ ] Add comment editing UI
- [ ] Add pagination for comments
- [ ] Add "Load more replies" for nested comments
- [ ] Add mentions (@username) in comments
- [ ] Add emoji picker
- [ ] Add image/GIF support in comments
- [ ] Add comment notifications
- [ ] Add sorting options (newest, oldest, most liked)
- [ ] Add report/flag functionality
- [ ] Add markdown support
