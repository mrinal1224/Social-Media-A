import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// route - /api/auth/signup

export const signUpUser = async ({ name, userName, email, password }) => {
  console.log(name, userName, password, email);
  try {
    const response = await api.post("/api/auth/signup", {
      name,
      userName,
      email,
      password,
    });

    console.log(response);
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const signInUser = async ({ userName, password }) => {
  try {
    const response = await api.post("/api/auth/signin", {
      userName,
      password,
    });

    console.log(response);
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/user/current", {withCredentials:true});
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
};


 // get User Profile Data
export const getProfile= async (userName) => {
  try {
    const response = await api.get(`/api/user/getprofile/${userName}`, {withCredentials:true});
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
};


export const editProfile= async (formData) => {
  try {
    const response = await api.post(`/api/user/editprofile/`,formData,  {withCredentials:true});
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
};


export const createPost = async(formData)=>{
   try {
    const response = await api.post(`/api/post/uploadPost/`,formData,
         {withCredentials:true}  );
    return response.data; // return just the data
  } catch (error) {
    // standardize error handling
    throw error.response?.data?.message || "Something went wrong";
  }
}


export const getAllPosts = async ()=>{
    try {
    const response = await api.get(`/api/post/getAllPosts`,  {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch Posts";
  } 
}

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/api/post/like/${postId}`, {}, { withCredentials: true })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || "Failed to like post";
  }
}

// follow and unfollow calls

export const followUser = async (userId) => {
  try {
    const response = await api.post(`/api/follow/${userId}`, {}, { withCredentials: true })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || "Failed to follow user";
  }
}

export const unfollowUser = async (userId) => {
  try {
    const response = await api.post(`/api/follow/unfollow/${userId}`, {}, { withCredentials: true })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || "Failed to unfollow user";
  }
}

export const getFollowStatus = async (userId) => {
  try {
    const response = await api.get(`/api/follow/status/${userId}`, { withCredentials: true })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || "Failed to get follow status";
  }
}

// 
export const getSuggestions = async () => {
  try {
    const response = await api.get(`/api/user/suggested`)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user profile data";
  }
}

// Story Calls

export const createStory = async (formData) => {
  try {
    const response = await api.post("/api/story/create", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create story";
  }
};

// Get all active stories
export const getAllStories = async () => {
  try {
    const response = await api.get("/api/story/all", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch stories";
  }
};

// Get current user's stories
export const getMyStories = async () => {
  try {
    const response = await api.get("/api/story/my-stories", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch your stories";
  }
};

// Get stories by specific user
export const getUserStories = async (userId) => {
  try {
    const response = await api.get(`/api/story/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user stories";
  }
};

// View a story
export const viewStory = async (storyId) => {
  try {
    const response = await api.post(`/api/story/view/${storyId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to view story";
  }
};

// Comments 
// Get all comments for a post
export const getComments = async (postId) => {
  try {
    const { data } = await api.get(/api/comments/${postId});
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch comments";
  }
};

// Add a new comment
export const addComment = async (postId, content) => {
  try {
    const { data } = await api.post(/api/comments/${postId}, { content });
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add comment";
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const { data } = await api.delete(/api/comments/${commentId});
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete comment";
  }
};










