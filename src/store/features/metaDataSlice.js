import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  background:"", // set to none initially
  isVideoInBackground: false, // video shows after 15s
  indexForBgVideo: Math.floor(Math.random() * 5), // track which video ad to show - generates 0 to 4
  isMuted: true,
  cycleStep: "background", // cycle controls - background | video
};

const metaDataSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setBackground: (state, action) => {
      state.background = action.payload;
    },
    //For Video
    // incIndexForBgVideo: (state, action) => {
    //   state.indexForBgVideo = action.payload;
    // },
    setIsMuted: (state, action) => {
      state.isMuted = action.payload;
    },

    setVideoAsBackground: (state, action) => {
      state.isVideoInBackground = action.payload;
    },

    cycleBackgroundFlow: (state, action) => {
      const totalVideos = action.payload; // ads length

      if (state.cycleStep === "background") {
        // after 15s background - go to video
        state.isVideoInBackground = true;
        state.cycleStep = "video";

        if (totalVideos > 0) {
          state.indexForBgVideo = (state.indexForBgVideo + 1) % totalVideos;
        }
      } 
    },
    cycleToBackground: (state) => {
      // called when video ends
      state.isVideoInBackground = false;
      state.background = state.background === "black" ? "white" : "black";
      state.cycleStep = "background";
      // Reset video to muted state when cycling back to background
      state.isMuted = true;
    },

  },
});

export const {
  // incIndexForBgVideo,
  setBackground,
  setIsMuted,
  setVideoAsBackground,
  cycleBackgroundFlow,
  cycleToBackground,
} = metaDataSlice.actions;

export default metaDataSlice.reducer;