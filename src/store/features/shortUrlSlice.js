import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shortenUrl } from "../../lib/helpers";
import { request_lamda3 } from "../../lib/services";

// ✅ Helper: Validate URL before using
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export const fetchShortUrl = createAsyncThunk(
  "shortUrl/fetch",
  async ({ longUrl, visitorId }, thunkAPI) => {
    try {
      const response = await shortenUrl(longUrl, visitorId);

      const alias = response.data.zimo_ws_url.split("/").pop();
      const isFallback = response.data.is_fallback || false;

      if (isFallback) {
        console.log("⚠️ Using WS URL (backend was unavailable)");
      }

      return {
        shortUrl: response.data.zimo_ws_url,
        shortUrlId: response.data.short_url_id,
        originalUrl: response.data.original_url,
        metaTitle: response.data.meta_title || "",
        metaDescription: response.data.meta_description || "",
        faviconUrl: response.data.favicon_url || "",
        onImage: response.data.meta_image || response.data.on_image || "",
        clicksCount: response.data.clicks_count || 0,
        isFallback,
      };
    } catch (error) {
      console.error("❌ URL shortening failed:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Unexpected error");
    }
  }
);

export const fetchUrlDetailsByAlias = createAsyncThunk(
  "shortUrl/fetchDetailsByAlias",
  async (alias, thunkAPI) => {
    try {
      const timestamp = Date.now();
      const response = await fetch(
        `/api/ws-meta-details?alias=${alias}&force_refresh=true&t=${timestamp}&cb=${Math.random()}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const metaDetails = data.metaDetails;
      let faviconUrl = "";

      // ✅ Favicon URL with validation
      if (metaDetails.favicon_url) {
        faviconUrl = metaDetails.favicon_url;
      } else if (metaDetails.original_url && isValidUrl(metaDetails.original_url)) {
        try {
          const domain = new URL(metaDetails.original_url).hostname;
          faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
        } catch {
          faviconUrl = "/assets/default-favicon.png";
        }
      } else {
        faviconUrl = "/assets/default-favicon.png";
      }

      // ✅ Ensure favicon URL is absolute
      if (faviconUrl && !faviconUrl.startsWith("http") && !faviconUrl.startsWith("/")) {
        try {
          const originalUrl = new URL(metaDetails.original_url);
          faviconUrl = `${originalUrl.origin}${faviconUrl.startsWith("/") ? "" : "/"}${faviconUrl}`;
        } catch {
          try {
            const domain = new URL(metaDetails.original_url).hostname;
            faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
          } catch {
            faviconUrl = "/assets/default-favicon.png";
          }
        }
      }

      console.log("🎯 Final favicon URL:", faviconUrl);
      console.log("🎯 Dynamic metadata from API:", {
        title: metaDetails.meta_title,
        description: metaDetails.meta_description,
        image: metaDetails.meta_image,
      });

      return {
        shortUrl: `https://zimo.ws/${metaDetails.alias}`,
        shortUrlId: metaDetails.short_url_id,
        originalUrl: metaDetails.original_url,
        metaTitle: metaDetails.meta_title || "",
        metaDescription: metaDetails.meta_description || "",
        faviconUrl,
        onImage: metaDetails.meta_image || "",
        clicksCount: 0,
      };
    } catch (error) {
      console.error("Error fetching URL details:", error);
      return thunkAPI.rejectWithValue(error.message || "Unexpected error");
    }
  }
);

// ✅ Fetch Click Count
export const fetchClickCount = createAsyncThunk(
  "shortUrl/fetchClickCount",
  async (alias, thunkAPI) => {
    try {
      console.log("📡 Making API call for alias:", alias);
      const response = await request_lamda3.get(`/api/ws-url-count?alias=${alias}`);
      console.log("📡 API response:", response.data);

      if (response.data && !response.data.error) {
        const count = response.data.data.ws_url_count;
        console.log("✅ Updated count:", count);
        return count;
      }
      throw new Error("Failed to fetch click count");
    } catch (error) {
      console.error("❌ API call failed:", error.message);
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch click count");
    }
  }
);

const initialState = {
  status: "idle",
  shortUrl: "",
  shortUrlId: null,
  originalUrl: "",
  metaTitle: "",
  metaDescription: "",
  faviconUrl: "",
  onImage: "",
  clicksCount: 0,
  error: null,
};

const shortUrlSlice = createSlice({
  name: "shortUrl",
  initialState,
  reducers: {
    resetShortUrl: () => initialState,

    setShortUrlData: (state, action) => {
      const {
        shortUrl,
        shortUrlId,
        originalUrl,
        metaTitle,
        metaDescription,
        faviconUrl,
        onImage,
        clicksCount,
      } = action.payload || {};

      if (shortUrl !== undefined) state.shortUrl = shortUrl;
      if (shortUrlId !== undefined) state.shortUrlId = shortUrlId;
      if (originalUrl !== undefined) state.originalUrl = originalUrl;
      if (metaTitle !== undefined) state.metaTitle = metaTitle;
      if (metaDescription !== undefined) state.metaDescription = metaDescription;
      if (faviconUrl !== undefined) state.faviconUrl = faviconUrl;
      if (onImage !== undefined) state.onImage = onImage;
      if (clicksCount !== undefined) state.clicksCount = clicksCount;
    },

    updateClickCount: (state, action) => {
      state.clicksCount = action.payload;
    },

    forceRefreshMetadata: (state) => {
      state.metaDescription = "";
      state.metaTitle = "";
      state.onImage = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchShortUrl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShortUrl.fulfilled, (state, action) => {
        state.status = "success";
        Object.assign(state, action.payload);
      })
      .addCase(fetchShortUrl.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(fetchUrlDetailsByAlias.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUrlDetailsByAlias.fulfilled, (state, action) => {
        state.status = "success";
        Object.assign(state, action.payload);
      })
      .addCase(fetchUrlDetailsByAlias.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(fetchClickCount.fulfilled, (state, action) => {
        state.clicksCount = action.payload;
      })
      .addCase(fetchClickCount.rejected, (state, action) => {
        console.error("Failed to fetch click count:", action.payload);
      });
  },
});

export const { resetShortUrl, setShortUrlData, updateClickCount, forceRefreshMetadata } =
  shortUrlSlice.actions;
export default shortUrlSlice.reducer;
