import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getExtensionDetails } from "../../lib/helpers";

/**
 * Thunk to fetch extension URL details
 * @param {object} params - { alias }
 */
export const fetchExtensionDetails = createAsyncThunk(
  "extensionDetails/fetch",
  async ({ alias }, thunkAPI) => {
    try {
      const response = await getExtensionDetails(alias);
      console.log("✅ Extension Details:", response);
      return response;
    } catch (e) {
      console.error("❌ Extension Details fetch error:", e.message || e);
      return thunkAPI.rejectWithValue(e.message || "Extension details fetch failed");
    }
  }
);

export const extensionDetailsSlice = createSlice({
  name: "extensionDetails",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    data: null,     // API response data
    error: null,    // error message (if any)
  },
  reducers: {
    resetExtensionDetails: (state) => {
      state.status = "idle";
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExtensionDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExtensionDetails.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchExtensionDetails.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { resetExtensionDetails } = extensionDetailsSlice.actions;
export default extensionDetailsSlice.reducer;
