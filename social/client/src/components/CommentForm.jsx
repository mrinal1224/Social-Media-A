import React, { useState } from 'react';
import { createCommentApi } from '../../apiCalls/comment.api.js';


const CommentForm = ({ postId, onCommentPosted }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return; 

        setLoading(true);
        setError(null);
        
        try {
            
            const updatedPost = await createCommentApi(postId, text);
            
           
            setText('');
            
           
            onCommentPosted(updatedPost); 
            
        } catch (err) {
            setError(err.message || "Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: '80%', padding: '8px' }} 
            />
            <button type="submit" disabled={loading} style={{ padding: '8px' }}>
                {loading ? 'Posting...' : 'Post'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default CommentForm;