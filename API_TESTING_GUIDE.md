# API Testing Guide - Comment Feature

## Quick Start Guide

### Prerequisites
1. MongoDB running on `localhost:27017`
2. Server running on `http://localhost:8000`
3. Valid JWT token for authenticated requests

## Testing with cURL

### 1. Authentication (Get Token First)

**Sign Up**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Sign In** (Returns token in cookie)
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Post Operations

**Create a Post**
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "This is my first post! 🚀",
    "image": "https://example.com/image.jpg"
  }'
```

**Get All Posts**
```bash
curl http://localhost:8000/api/posts
```

**Get Single Post**
```bash
curl http://localhost:8000/api/posts/{POST_ID}
```

**Like a Post**
```bash
curl -X POST http://localhost:8000/api/posts/{POST_ID}/like \
  -b cookies.txt
```

**Update Post**
```bash
curl -X PUT http://localhost:8000/api/posts/{POST_ID} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Updated post content"
  }'
```

**Delete Post**
```bash
curl -X DELETE http://localhost:8000/api/posts/{POST_ID} \
  -b cookies.txt
```

### 3. Comment Operations

**Add a Comment to a Post**
```bash
curl -X POST http://localhost:8000/api/comments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "postId": "PUT_POST_ID_HERE",
    "content": "Great post! I totally agree with this."
  }'
```

**Add a Reply to a Comment**
```bash
curl -X POST http://localhost:8000/api/comments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "postId": "PUT_POST_ID_HERE",
    "content": "Thanks for sharing!",
    "parentCommentId": "PUT_COMMENT_ID_HERE"
  }'
```

**Get All Comments for a Post**
```bash
curl http://localhost:8000/api/comments/post/{POST_ID}
```

**Get a Specific Comment**
```bash
curl http://localhost:8000/api/comments/{COMMENT_ID}
```

**Get Replies to a Comment**
```bash
curl http://localhost:8000/api/comments/{COMMENT_ID}/replies
```

**Update a Comment**
```bash
curl -X PUT http://localhost:8000/api/comments/{COMMENT_ID} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Updated comment text"
  }'
```

**Delete a Comment**
```bash
curl -X DELETE http://localhost:8000/api/comments/{COMMENT_ID} \
  -b cookies.txt
```

**Like/Unlike a Comment**
```bash
curl -X POST http://localhost:8000/api/comments/{COMMENT_ID}/like \
  -b cookies.txt
```

## Testing with Postman

### Setup
1. Import the base URL: `http://localhost:8000`
2. Create a collection for "Social Media API"
3. Set up environment variables:
   - `baseUrl`: `http://localhost:8000`
   - `postId`: (save after creating a post)
   - `commentId`: (save after creating a comment)

### Test Sequence

1. **Sign Up/Sign In** → Save token from cookie
2. **Create Post** → Save `postId` from response
3. **Add Comment** → Use saved `postId`, save `commentId`
4. **Add Reply** → Use saved `postId` and `commentId`
5. **Get Comments** → Verify nested structure
6. **Like Comment** → Toggle like status
7. **Update Comment** → Modify content
8. **Delete Comment** → Verify cascade delete of replies

## Testing with JavaScript/Fetch

```javascript
// Create a post
async function createPost() {
  const response = await fetch('http://localhost:8000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      content: 'My test post',
      image: ''
    })
  });
  const data = await response.json();
  console.log('Post created:', data);
  return data.post._id;
}

// Add a comment
async function addComment(postId) {
  const response = await fetch('http://localhost:8000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      postId: postId,
      content: 'This is a test comment'
    })
  });
  const data = await response.json();
  console.log('Comment created:', data);
  return data.comment._id;
}

// Add a reply
async function addReply(postId, commentId) {
  const response = await fetch('http://localhost:8000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      postId: postId,
      content: 'This is a reply',
      parentCommentId: commentId
    })
  });
  const data = await response.json();
  console.log('Reply created:', data);
}

// Get comments
async function getComments(postId) {
  const response = await fetch(`http://localhost:8000/api/comments/post/${postId}`);
  const data = await response.json();
  console.log('Comments:', data);
}

// Full test flow
async function runTests() {
  const postId = await createPost();
  const commentId = await addComment(postId);
  await addReply(postId, commentId);
  await getComments(postId);
}
```

## Expected Response Formats

### Create Comment Response
```json
{
  "message": "Comment created successfully",
  "comment": {
    "_id": "comment_id",
    "post": "post_id",
    "author": {
      "_id": "user_id",
      "name": "John Doe",
      "userName": "johndoe",
      "profilePic": "url"
    },
    "content": "Comment text",
    "likes": [],
    "replies": [],
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  }
}
```

### Get Comments Response
```json
{
  "message": "Comments fetched successfully",
  "comments": [
    {
      "_id": "comment_id",
      "author": {
        "name": "John Doe",
        "userName": "johndoe",
        "profilePic": "url"
      },
      "content": "Comment text",
      "likes": ["user_id_1", "user_id_2"],
      "replies": [
        {
          "_id": "reply_id",
          "author": {...},
          "content": "Reply text",
          "likes": [],
          "createdAt": "..."
        }
      ],
      "createdAt": "2025-10-25T..."
    }
  ],
  "count": 1
}
```

### Like Comment Response
```json
{
  "message": "Comment liked",
  "likes": 5,
  "isLiked": true
}
```

## Common Error Responses

### 400 - Bad Request
```json
{
  "message": "Content and postId are required"
}
```

### 401 - Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 - Forbidden
```json
{
  "message": "Not authorized to delete this comment"
}
```

### 404 - Not Found
```json
{
  "message": "Post not found"
}
```

### 500 - Server Error
```json
{
  "message": "Server error"
}
```

## Testing Checklist

- [ ] User can create a post
- [ ] User can add a comment to a post
- [ ] User can reply to a comment (nested comment)
- [ ] User can like/unlike comments
- [ ] User can edit their own comments
- [ ] User cannot edit others' comments
- [ ] User can delete their own comments
- [ ] Deleting a comment deletes all its replies
- [ ] Comments display author information
- [ ] Comments show like count
- [ ] Comments show timestamp
- [ ] Unauthenticated users can view comments
- [ ] Unauthenticated users cannot create/edit/delete comments
