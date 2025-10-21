import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gethistory, deleteHistory as deleteHistoryApi } from "../../lib/helpers";

// Fetch history
export const fetchHistory = createAsyncThunk(
  "history/fetch",
  async (visitorId, thunkAPI) => {
    try {
      const response = await gethistory(visitorId);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message || "Unexpected error");
    }
  }
);

// Delete history with optimistic updates
export const deleteHistory = createAsyncThunk(
  "history/delete",
  async ({ shortUrlId, visitorId }, thunkAPI) => {
    // Get current state for potential rollback
    const state = thunkAPI.getState();
    const itemToDelete = state.history.items.find(
      (item) => item.short_url_id === shortUrlId
    );
    
    // Optimistic update - remove immediately
    thunkAPI.dispatch(historySlice.actions.removeHistoryItemOptimistic(shortUrlId));
    
    try {
      await deleteHistoryApi(shortUrlId, visitorId);
      return { shortUrlId };
    } catch (e) {
      // Rollback on error
      if (itemToDelete) {
        thunkAPI.dispatch(historySlice.actions.rollbackDeleteHistory(itemToDelete));
      }
      return thunkAPI.rejectWithValue(e.message || "Unexpected error");
    }
  }
);

// Create slice after async thunks to avoid circular reference
const historySlice = createSlice({
  name: "history",
  initialState: {
    status: "idle",
    items: [],
  },
  reducers: {
    // Optimistic update for new URL
    addHistoryItem: (state, action) => {
      const newItem = action.payload;
      // Add to beginning of array for most recent first
      state.items.unshift(newItem);
    },
    // Optimistic delete
    removeHistoryItemOptimistic: (state, action) => {
      const shortUrlId = action.payload;
      state.items = state.items.filter(
        (item) => item.short_url_id !== shortUrlId
      );
    },
    // Rollback optimistic delete on error
    rollbackDeleteHistory: (state, action) => {
      const restoredItem = action.payload;
      state.items.push(restoredItem);
    },
    // Add this reducer to historySlice
    updateHistoryItemClickCount: (state, action) => {
      const { shortUrlId, clicksCount } = action.payload;
      const itemIndex = state.items.findIndex(item => item.short_url_id === shortUrlId);
      if (itemIndex !== -1) {
        state.items[itemIndex].clicks_count = clicksCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload || [];
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.status = "error";
        state.items = [];
      })

      // Delete handlers (optimistic updates handled in thunk)
      .addCase(deleteHistory.pending, (state) => {
        // Don't change status to loading since we do optimistic updates
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.status = "success";
        // Item already removed optimistically, no need to filter again
      })
      .addCase(deleteHistory.rejected, (state) => {
        state.status = "error";
        // Rollback already handled in thunk
      });
  },
});

// Export action creators
export const { addHistoryItem, removeHistoryItemOptimistic, rollbackDeleteHistory, updateHistoryItemClickCount } = historySlice.actions;

export default historySlice.reducer;

