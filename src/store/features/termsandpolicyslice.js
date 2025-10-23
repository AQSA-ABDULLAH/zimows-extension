import { tandp } from "../../lib/constants";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  termsandpolicytab: tandp.terms,
};

const termsandpolicyslice = createSlice({
  name: "termsandpolicy",
  initialState,
  reducers: {
    changeTermsAndPolicyTab(state, action) {
      state.termsandpolicytab = action.payload;
    },
  },
});

export const { changeTermsAndPolicyTab } = termsandpolicyslice.actions;

export default termsandpolicyslice.reducer;
