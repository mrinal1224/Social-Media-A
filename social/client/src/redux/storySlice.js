import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    allStories: [],
    myStories: [],
  },

  reducers: {
    setAllStories: (state, action) => {
      state.allStories = action.payload;
    },

    setMyStories: (state, action) => {
      state.myStories = action.payload;
    },

    addStory: (state, action) => {
      const newStory = action.payload;
      state.myStories.unshift(newStory);
      
    //   Add to allStories
      const authorId = newStory.author._id;
      const existingAuthorIndex = state.allStories.findIndex(
        (group) => group.author._id === authorId
      );
      
      if (existingAuthorIndex !== -1) {
        state.allStories[existingAuthorIndex].stories.unshift(newStory);
      } else {
        state.allStories.unshift({
          author: newStory.author,
          stories: [newStory],
        });
      }
    },

    removeStory: (state, action) => {
      const storyId = action.payload;
      
      // Remove from myStories
      state.myStories = state.myStories.filter(
        (story) => story._id !== storyId
      );
      
      // Remove from allStories
      state.allStories = state.allStories.map((group) => ({
        ...group,
        stories: group.stories.filter((story) => story._id !== storyId),
      })).filter((group) => group.stories.length > 0);
    },

    updateStoryViewers: (state, action) => {
      const updatedStory = action.payload;
      
      // Update in myStories
      const myStoryIndex = state.myStories.findIndex(
        (story) => story._id === updatedStory._id
      );
      if (myStoryIndex !== -1) {
        state.myStories[myStoryIndex] = updatedStory;
      }
      
      Update in allStories
      state.allStories = state.allStories.map((group) => ({
        ...group,
        stories: group.stories.map((story) =>
          story._id === updatedStory._id ? updatedStory : story
        ),
      }));
    },
  },
});

export const {
  setAllStories,
  setMyStories,
  addStory,
  updateStoryViewers,
} = storySlice.actions;

export default storySlice.reducer;