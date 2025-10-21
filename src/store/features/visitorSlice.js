import { getUserLocation, getVisitor } from "../../lib/helpers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch visitor data
export const fetchVisitor = createAsyncThunk("visitor/fetch", async (_, thunkAPI) => {
  try {
    // Try to get geolocation
    const location = await getUserLocation();
    const visitor = await getVisitor(location.latitude, location.longitude);

    console.log("✅ Visitor fetched with geolocation:", visitor);

    localStorage.setItem("visitor_data", JSON.stringify(visitor.visitor_data));
    return visitor.visitor_data;

  } catch (e) {
    // If user denies geolocation
    if (e.message === "User denied Geolocation") {
      const visitor = await getVisitor();

      console.log("⚠️ Visitor fetched without geolocation (denied permission):", visitor);

      localStorage.setItem("visitor_data", JSON.stringify(visitor.visitor_data));
      return visitor.visitor_data;
    }

    // If response is 451 (Visitor not allowed)
    if (e?.response?.status === 451) {
      const res = {
        data: e.response.data.visitor_data,
        error: "Visitor not allowed",
      };
      console.warn("🚫 Visitor blocked (451):", res);
      throw new Error(JSON.stringify(res));
    }

    // Other unknown errors
    console.error("❌ Unknown visitor fetch error:", e.message);
    return thunkAPI.rejectWithValue(e.message || "Unexpected error");
  }
});


// Redux slice
export const visitorSlice = createSlice({
  name: "visitor",
  initialState: {
    status: "idle",      // 'idle' | 'loading' | 'success' | 'error'
    data: null,          // visitor data
    isAllowed: true,     // blocked country flag
  },
  reducers: {
    loadVisitor: (state) => {
      const localData = localStorage.getItem("visitor_data");
      if (localData) {
        state.data = JSON.parse(localData);
        state.status = "success";
      } else {
        state.status = "error";
        state.data = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVisitor.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchVisitor.rejected, (state, action) => {
        state.status = "error";

        try {
          const message = JSON.parse(action.error.message);
          state.data = message.data;
          if (message.error === "Visitor not allowed") {
            state.isAllowed = false;
          }
        } catch (err) {
          // fallback for unknown or invalid JSON errors
          console.error("Visitor fetch error:", action.error.message);
          state.data = null;
          state.isAllowed = true;
        }
      });
  },
});

// Exports
export const { loadVisitor } = visitorSlice.actions;
export default visitorSlice.reducer;
