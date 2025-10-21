import { createSlice } from "@reduxjs/toolkit";

const pipSlice = createSlice({
  name: "pip",
  initialState: {
    enabled: false,
    isVideoPlaying: false,
    pipClickCount: 0,
  },
  reducers: {
    // payload = boolean
    changePipState: (state, action) => {
      state.enabled = action.payload;
    },
    handlePipClick: (state) => {
      state.pipClickCount++;
    },
    // payload = boolean
    setIsVideoPlaying: (state, action) => {
      state.isVideoPlaying = action.payload;
    },
  },
});

export const { changePipState, handlePipClick, setIsVideoPlaying } =
  pipSlice.actions;

export default pipSlice.reducer;
