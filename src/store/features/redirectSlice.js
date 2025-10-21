import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRedirect } from "../../lib/helpers";

/**
 * Thunk to fetch redirection data
 * @param {object} params - { alias, visitorId }
 */
export const fetchRedirect = createAsyncThunk(
  "redirect/fetch",
  async ({ alias, visitorId }, thunkAPI) => {
    try {
      const redirectData = await getRedirect(alias, visitorId);
      console.log("✅ Redirect data:", redirectData);
      return redirectData;
    } catch (e) {
      console.error("❌ Redirect fetch error:", e.message || e);
      return thunkAPI.rejectWithValue(e.message || "Redirect failed");
    }
  }
);

// Slice definition
export const redirectSlice = createSlice({
  name: "redirect",
  initialState: {
    status: "idle",      // 'idle' | 'loading' | 'success' | 'error'
    data: null,          // redirect response data
    error: null,         // error message (if any)
  },
  reducers: {
    resetRedirect: (state) => {
      state.status = "idle";
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRedirect.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRedirect.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchRedirect.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { resetRedirect } = redirectSlice.actions;
export default redirectSlice.reducer;
