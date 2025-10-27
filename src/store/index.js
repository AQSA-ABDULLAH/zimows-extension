import { configureStore } from "@reduxjs/toolkit";
import visitorSlice from "./features/visitorSlice";
import shortUrlSlice from "./features/shortUrlSlice";
import historySlice from "./features/historySlice";
import redirectSlice from "./features/redirectSlice";
import linkSharedSlice from "./features/linkSharedSlice";
import extensionDetailsReducer from "./features/extensionDetailsSlice";


const store = configureStore({
  // reducers here
  reducer: {
    visitor: visitorSlice,
    shortUrl: shortUrlSlice,
    history: historySlice,
    redirect: redirectSlice,
    linkShared: linkSharedSlice,
    extensionDetails: extensionDetailsReducer,
  },
});

export default store;
