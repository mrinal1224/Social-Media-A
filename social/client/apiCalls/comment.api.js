
export const createCommentApi = async (postId, text) => {
    try {
        const res = await fetch(`/api/comments/create/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to create comment");
        }

        return data; 

    } catch (error) {
        console.error(error);
        throw error; 
    }
};