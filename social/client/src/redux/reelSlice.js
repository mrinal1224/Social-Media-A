import { createSlice } from "@reduxjs/toolkit";

const reelSlice = createSlice({
  name: "reel",
  initialState: {
    reelData: [],
  },

  reducers: {
    // Store the full list returned by the reels GET API.
    setReelData: (state, action) => {
      state.reelData = action.payload;
    },

    // Keep this reducer ready for future reel like/comment actions.
    updateReel: (state, action) => {
      const updatedReel = action.payload;
      const index = state.reelData.findIndex(
        (reel) => reel._id === updatedReel._id
      );

      if (index !== -1) {
        state.reelData[index] = updatedReel;
      }
    },
  },
});

export const { setReelData, updateReel } = reelSlice.actions;
export default reelSlice.reducer;