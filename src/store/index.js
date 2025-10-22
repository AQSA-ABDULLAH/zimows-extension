import { configureStore } from "@reduxjs/toolkit";
import visitorSlice from "./features/visitorSlice";
import shortUrlSlice from "./features/shortUrlSlice";
import historySlice from "./features/historySlice";
import redirectSlice from "./features/redirectSlice";
import linkSharedSlice from "./features/linkSharedSlice";


const store = configureStore({
  // reducers here
  reducer: {
    visitor: visitorSlice,
    shortUrl: shortUrlSlice,
    history: historySlice,
    redirect: redirectSlice,
    linkShared: linkSharedSlice,
  },
});

export default store;
