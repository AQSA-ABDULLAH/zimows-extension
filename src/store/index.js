import { configureStore } from "@reduxjs/toolkit";
import visitorSlice from "./features/visitorSlice";
import metaDataSlice from "./features/metaDataSlice";
import pipSlice from "./features/pip.slice";
import shortUrlSlice from "./features/shortUrlSlice";
import historySlice from "./features/historySlice";
import redirectSlice from "./features/redirectSlice";
import termsandpolicyslice from "./features/termsandpolicyslice";
import linkSharedSlice from "./features/linkSharedSlice";


const store = configureStore({
  // reducers here
  reducer: {
    visitor: visitorSlice,
    meta: metaDataSlice,
    pip: pipSlice,
    shortUrl: shortUrlSlice,
    history: historySlice,
    redirect: redirectSlice,
    termsandpolicy: termsandpolicyslice,
    linkShared: linkSharedSlice,
  },
});

export default store;
