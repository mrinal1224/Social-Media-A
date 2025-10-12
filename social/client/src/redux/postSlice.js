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
    }

    ,addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.postData.find(p => p._id === postId);
      if (post) post.comments.push(comment);
    }

    // clearUserData : (state , action)=>{
    //     state.userData = null
    // }
  },
});

export const { setPostData , updatePost, addComment} = postSlice.actions;
export default postSlice.reducer;
