import { createSlice } from "@reduxjs/toolkit";

const reelSlice = createSlice({
  name: "reel",

  initialState: {
    reelData: [],
  },

  reducers: {
    setReelData: (state, action) => {
      state.reelData = action.payload;
    },

    // Update one reel in Redux when a future reel action returns
    // the updated document from the backend.
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
