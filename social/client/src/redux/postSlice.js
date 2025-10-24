import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",

  initialState: {
    postData: [],
  },

  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload;
    },

     updatePost: (state, action) => {
      const updatedPost = action.payload
      const index = state.postData.findIndex(post => post._id === updatedPost._id)
      if (index !== -1) {
        state.postData[index] = updatedPost
      }
    },

    editComment: (state, action) => {
      const { postId, commentId, newText } = action.payload
      const post = state.postData.find(post => post._id === postId)
      if(post) {
        const comment = post.comments.find(c => c._id === commentId)
        if(comment) comment.text = newText
      }
    },

    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload
      const post = state.postData.find(post => post._id === postId)
      if(post) {
        post.comments = post.comments.filter(c => c._id !== commentId)
      }
    },

    // clearUserData : (state , action)=>{
    //     state.userData = null
    // }
  },
});

export const { setPostData , updatePost, editComment, deleteComment} = postSlice.actions;
export default postSlice.reducer;
