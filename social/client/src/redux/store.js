import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import reelSlice from "./reelSlice";

// Added reel state so Home can consume the reel GET response globally.
const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    reel: reelSlice,
  },
});

export default store;