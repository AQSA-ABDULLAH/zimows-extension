import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { request_lamda1, request_lamda2, request_lamda3, request_lamda4 } from "./services";
import { CUSTOM_DESC_API } from "./constants";


// Conditional logging helper
const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const logError = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};


// @returns {latitude, longitude} - Non-blocking with timeout
const getUserLocation = () => {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      resolve({ latitude: null, longitude: null }); // Don't block app
      return;
    }

    // Set timeout to prevent blocking
    const timeoutId = setTimeout(() => {
      resolve({ latitude: null, longitude: null });
    }, 5000); // 5 second timeout

    navigator.geolocation.getCurrentPosition(
      function (position) {
        clearTimeout(timeoutId);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function (error) {
        clearTimeout(timeoutId);
        resolve({ latitude: null, longitude: null }); // Don't block on error
      },
      { timeout: 5000, enableHighAccuracy: false } // Fast, low accuracy
    );
  });
};

/**
 * @param lat => user latitute, default will be null
 * @param lng => user longitude, default will be null
 * @returns visitor object
 */

const getVisitor = async (lat = null, lng = null) => {
  const visitor_id = uuidv4();

  try {
    // Step 1: Fetch public IP address
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const ip_address = ipRes.data.ip;

    log("Generated visitor_id:", visitor_id);
    log("Visitor Data: ", { ip_address, lat, lng });

    // Step 2: Send data to your backend
    const { data } = await request_lamda4.get(
      `/api/visitors?visitor_id=${visitor_id}&ip_address=${ip_address}&lat=${lat}&lng=${lng}&access_platform=web`
    );
    log(data);
    return data;
  } catch (e) {
    logError("error while fetching visitor", e.message);
    throw e;
  }
};


/**
 * Fetches metadata (title, description, favicon, etc.) from the backend API for a given URL.
 * @param {string} longUrl - The URL to extract metadata from
 * @returns {object} - { faviconUrl, metaTitle, metaDescription, onImage }
 */
const getMetadata = async (longUrl) => {
  try {
    console.log('🔍 Fetching metadata for:', longUrl);
    
    // 0) Database search first (highest priority)
    let dbMetadata = null;
    try {
      if (CUSTOM_DESC_API && typeof CUSTOM_DESC_API === 'string' && CUSTOM_DESC_API.trim().length > 0) {
        const originalUrlParam = encodeURIComponent(longUrl);
        const searchUrl = `${CUSTOM_DESC_API}?original_url=${originalUrlParam}`;
        
        console.log('🔍 Searching database for existing record:', searchUrl);
        const searchRes = await fetch(searchUrl, {
          method: 'GET',
          headers: { 'api-key': '2@w6g!!5' },
          timeout: 5000,
        });

        const searchData = await searchRes.json();
        console.log('📋 Database search response status:', searchRes.status);
        console.log('📋 Database search response data:', searchData);
        
        if (searchRes.ok && searchData && !searchData.error) {
          let record = null;

          if (searchData.data && Array.isArray(searchData.data) && searchData.data.length > 0) {
            record = searchData.data[0];
          } else if (searchData.data && typeof searchData.data === 'object' && !Array.isArray(searchData.data)) {
            record = searchData.data;
          } else if (searchData && typeof searchData === 'object' && !searchData.error && !searchData.data) {
            record = searchData;
          }
          
          if (record) {
            console.log('✅ Found existing record in database:', record);
            
            return {
              faviconUrl:
                record.favicon_url ||
                record.favicon ||
                `https://www.google.com/s2/favicons?sz=64&domain=${new URL(longUrl).hostname}`,
              metaTitle:
                record.meta_title ||
                record.title ||
                `${new URL(longUrl).hostname} - Page`,
              metaDescription:
                record.meta_description ||
                record.description ||
                `Visit ${new URL(longUrl).hostname} for more information.`,
            };
          } else {
            console.log('ℹ️ No existing record found in database, proceeding with metadata extraction');
          }
        } else {
          if (searchData && searchData.error) {
            console.log('ℹ️ Database search returned error:', searchData.message, 'proceeding with metadata extraction');
          } else {
            console.log('⚠️ Database search failed with status:', searchRes.status, 'proceeding with metadata extraction');
          }
        }
      }
    } catch (e) {
      logError('Database search failed:', e.message);
      console.log('⚠️ Database search error, proceeding with metadata extraction');
    }

    // 1) Custom description override
    let customDescription = "";
    try {
      if (CUSTOM_DESC_API && typeof CUSTOM_DESC_API === 'string' && CUSTOM_DESC_API.trim().length > 0) {
        const originalUrlParam = encodeURIComponent(longUrl);
        const customUrl = `${CUSTOM_DESC_API}?original_url=${originalUrlParam}`;
        const descRes = await fetch(customUrl, {
          method: 'GET',
          headers: { 'api-key': '2@w6g!!5' },
          timeout: 5000,
        });
        let descData = null;
        try { descData = await descRes.json(); } catch {}

        let candidateDesc =
          descData?.data?.meta_description ||
          descData?.meta_description ||
          descData?.description ||
          "";

        if (!candidateDesc || candidateDesc.trim().length === 0) {
          const candidateTitle =
            descData?.data?.meta_title ||
            descData?.meta_title ||
            descData?.title ||
            "";
          if (typeof candidateTitle === 'string' && candidateTitle.trim().length > 0) {
            candidateDesc = candidateTitle;
          }
        }

        if (typeof candidateDesc === 'string' && candidateDesc.trim().length > 0) {
          customDescription = candidateDesc;
        }
      }
    } catch (e) {
      logError('Custom description API failed:', e.message);
    }

    // 2) Use Lambda API for metadata extraction
    const lambdaUrl = 'https://w4eoer7wo5butpzqjysfqmfcby0bbvjo.lambda-url.eu-west-2.on.aws';
    
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: longUrl }),
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Lambda API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📋 Lambda API response:', data);

    const domain = new URL(longUrl).hostname;
    const fallbackFavicon = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

    const title = data.title || data.metaTitle || `${domain} - Page`;
    const description =
      customDescription ||
      data.description ||
      data.metaDescription ||
      `Visit ${domain} for more information and content.`;

    console.log("🔍 Enhanced metadata extraction:", {
      originalUrl: longUrl,
      title: title,
      description: description?.substring(0, 100) + '...',
    });
    
    return {
      faviconUrl: fallbackFavicon,
      metaTitle: title,
      metaDescription: description,
    };
  } catch (err) {
    logError("❌ Error fetching metadata from Lambda API:", err.message);
    
    if (err.message.includes('404') || err.message.includes('Not Found')) {
      console.log("⚠️ URL appears to be invalid or no longer exists:", longUrl);
    }

    // Fallback to old method
    try {
      const encodedUrl = encodeURIComponent(longUrl);
      const res = await fetch(`/api/metadata?url=${encodedUrl}`);
      const data = await res.json();

      const domain = new URL(longUrl).hostname;
      const fallbackFavicon = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

      const getBestFavicon = (favicons) => {
        if (!favicons || favicons.length === 0) return fallbackFavicon;
        const priorities = [
          (f) => f.rel === 'apple-touch-icon' && f.sizes === '180x180',
          (f) => f.rel === 'icon' && f.sizes === '32x32' && f.type === 'image/png',
          (f) => f.rel === 'icon' && f.sizes === '16x16' && f.type === 'image/png',
          (f) => f.rel === 'apple-touch-icon',
          (f) => f.rel === 'icon' && f.type === 'image/png',
          (f) => f.rel === 'icon',
        ];
        for (const priority of priorities) {
          const favicon = favicons.find(priority);
          if (favicon && favicon.href) return favicon.href;
        }
        return favicons[0]?.href || fallbackFavicon;
      };

      const selectedFavicon = getBestFavicon(data.favicons);

      console.log("🔍 Fallback metadata extraction:", {
        originalUrl: longUrl,
        selectedFavicon: selectedFavicon,
      });
      
      return {
        faviconUrl: selectedFavicon,
        metaTitle: data.title || data.metaTitle || "",
        metaDescription: data.description || "",
      };
    } catch (fallbackErr) {
      logError("❌ Fallback metadata extraction also failed:", fallbackErr.message);
      const domain = new URL(longUrl).hostname;
      return {
        faviconUrl: `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
        metaTitle: `${domain} - Page`,
        metaDescription: `Visit ${domain} for more information and content.`,
      };
    }
  }
};


// Performance monitoring utility
const performanceMetrics = {
  metadataExtraction: [],
  urlShortening: [],
  totalTime: []
};

const logPerformance = (operation, duration) => {
  performanceMetrics[operation].push(duration);
  
  // Keep only last 100 measurements
  if (performanceMetrics[operation].length > 100) {
    performanceMetrics[operation].shift();
  }
  
  // Log average performance every 10 operations
  if (performanceMetrics[operation].length % 10 === 0) {
    const avg = performanceMetrics[operation].reduce((a, b) => a + b, 0) / performanceMetrics[operation].length;
    console.log(`📊 ${operation} average time: ${avg.toFixed(2)}ms (last 10: ${performanceMetrics[operation].slice(-10).map(t => t.toFixed(0)).join(', ')}ms)`);
  }
};

/**
 * @param {string} longUrl - The long URL to shorten
 * @returns {object} - Response containing short_url
 */

// Generate a regular WS URL when backend is unavailable
const generateFallbackUrl = (originalUrl) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const wsAlias = `${randomId}${timestamp.toString().slice(-6)}`; // Regular format like other WS URLs
  return {
    zimo_ws_url: `https://zimo.ws/${wsAlias}`,
    short_url_id: `ws-${timestamp}`,
    original_url: originalUrl,
    is_fallback: true
  };
};

const shortenUrl = async (longUrl, visitorId) => {
  const startTime = Date.now();
  
  if (!visitorId) {
    logError("❌ visitor_id is missing from Redux");
    throw new Error("Missing visitor ID");
  }

  try {
    // Step 1: Get metadata with timeout and fallback
    let metadata = {};
    const metadataStart = Date.now();
    
    try {
      // Use Promise.race to add timeout to metadata extraction
      const metadataPromise = getMetadata(longUrl);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Metadata extraction timeout')), 6000)
      );
      
      metadata = await Promise.race([metadataPromise, timeoutPromise]);
      logPerformance('metadataExtraction', Date.now() - metadataStart);
    } catch (err) {
      logError("❌ getMetadata() failed, using fallback:", err.message || err);
      // Generate fallback metadata
      try {
        const domain = new URL(longUrl).hostname;
        metadata = {
          faviconUrl: `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
          metaTitle: `${domain} - Page`,
          metaDescription: `Visit ${domain} for more information and content.`,
          onImage: '', // Don't use favicon as post image
        };
      } catch (urlError) {
        metadata = {
          faviconUrl: "/assets/default-favicon.png",
          metaTitle: "Web Page",
          metaDescription: "Visit this webpage for more information and content.",
          onImage: '', // Don't use default image as post image
        };
      }
    }

    const {
      faviconUrl = "",
      metaTitle = "",
      metaDescription = "",
      description = "",
      onImage = "",
    } = metadata || {};

    // Step 2: Prepare payload with optimized data
    const maxMetaDescriptionLength = 500;
    let finalDescription = (metaDescription || description)?.slice(0, maxMetaDescriptionLength) || "";
    // Ensure we always have something meaningful: if description empty but title exists, use title
    if (!finalDescription || finalDescription.trim().length === 0) {
      if (metaTitle && metaTitle.trim().length > 0) {
        finalDescription = metaTitle.trim().slice(0, maxMetaDescriptionLength);
      }
    }

    const payload = {
      user_id: "",
      visitor_id: visitorId,
      original_url: longUrl,
      favicon_url: faviconUrl,
      meta_title: metaTitle,
      meta_description: finalDescription,
      meta_image: onImage,
      on_image: onImage,
      force_create: true,
    };

    log("📦 Payload sent to /shorten:", {
      original_url: longUrl,
      meta_title: metaTitle?.substring(0, 30) + "...",
      has_description: !!finalDescription,
      has_image: !!onImage,
      visitor_id: visitorId
    });

    // Step 3: Send to backend with timeout
    const backendStart = Date.now();
    
    try {
      const response = await Promise.race([
        request_lamda4.post("/api/url/shorten", payload),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Backend request timeout')), 8000)
        )
      ]);
      
      logPerformance('urlShortening', Date.now() - backendStart);

      // Step 4: Handle response with detailed debugging
      console.log("🔍 Backend response received:", {
        status: response?.status,
        statusText: response?.statusText,
        hasData: !!response?.data,
        dataType: typeof response?.data,
        dataKeys: response?.data ? Object.keys(response?.data) : 'no data'
      });

      const data = response?.data;
      
      // Check for various response formats
      if (!data) {
        throw new Error("Backend returned no data");
      }
      
      // Handle different response structures
      let shortUrl = null;
      let shortUrlId = null;
      let originalUrl = null;
      
      if (data.zimo_ws_url) {
        shortUrl = data.zimo_ws_url;
        shortUrlId = data.short_url_id;
        originalUrl = data.original_url;
      } else if (data.data && data.data.zimo_ws_url) {
        shortUrl = data.data.zimo_ws_url;
        shortUrlId = data.data.short_url_id;
        originalUrl = data.data.original_url;
      } else if (data.alias) {
        shortUrl = `https://zimo.ws/${data.alias}`;
        shortUrlId = data.short_url_id;
        originalUrl = data.original_url;
      } else {
        console.error("❌ Unexpected response structure:", JSON.stringify(data, null, 2));
        throw new Error("Backend response missing required fields");
      }
      
      if (!shortUrl) {
        throw new Error("No shortened URL found in response");
      }

      const totalTime = Date.now() - startTime;
      logPerformance('totalTime', totalTime);
      
      log("✅ URL shortened successfully:", {
        url: shortUrl,
        totalTime: `${totalTime}ms`,
        metadataTime: `${Date.now() - metadataStart}ms`,
        backendTime: `${Date.now() - backendStart}ms`
      });
      
      // Return data in expected format
      return {
        data: {
          zimo_ws_url: shortUrl,
          short_url_id: shortUrlId,
          original_url: originalUrl,
          meta_title: data.meta_title || metaTitle,
          // Prefer our computed description (which may come from custom API)
          meta_description: finalDescription || data.meta_description || "",
          favicon_url: data.favicon_url || faviconUrl,
          meta_image: data.meta_image || onImage,
          on_image: data.on_image || onImage,
          clicks_count: data.clicks_count || 0
        }
      };
      
    } catch (backendError) {
      console.error("❌ Backend request failed:", {
        error: backendError.message,
        status: backendError.response?.status,
        statusText: backendError.response?.statusText,
        data: backendError.response?.data
      });
      
      // Generate WS URL if backend is completely unavailable
      console.log("🔄 Generating WS URL due to backend failure");
      const fallbackData = generateFallbackUrl(longUrl);
      
      const totalTime = Date.now() - startTime;
      logPerformance('totalTime', totalTime);
      
      log("⚠️ Using WS URL (backend unavailable):", {
        url: fallbackData.zimo_ws_url,
        totalTime: `${totalTime}ms`,
        reason: "Backend unavailable"
      });
      
      // Return fallback data
      return {
        data: {
          zimo_ws_url: fallbackData.zimo_ws_url,
          short_url_id: fallbackData.short_url_id,
          original_url: fallbackData.original_url,
          meta_title: metaTitle,
          meta_description: finalDescription,
          favicon_url: faviconUrl,
          meta_image: onImage,
          on_image: onImage,
          clicks_count: 0,
          is_fallback: true
        }
      };
    }
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    logError("Error while shortening URL:", error.message || error);
    logError("Total time taken:", `${totalTime}ms`);
    throw error;
  }
};

/**
 * Fetch redirection info for a given alias and visitor ID
 * @param {string} alias - The short URL alias
 * @param {string} visitorId - The visitor's ID
 * @returns {object} - Response from the redirect API
 */
const getRedirect = async (alias , visitorId) => {
  try {
    if (!alias || !visitorId) {
      throw new Error("Alias and visitor ID are required");
    }

    const { data } = await request_lamda4.get(
      `/api/redirect?alias=${alias}&visitor_id=${visitorId}&no_count=0`
    );

    log("🔁Redirect response:", data);
    return data;
  } catch (error) {
    logError("Error fetching redirect data:", error.message || error);
    throw error;
  }
};


/**
 * get all history of the visitor
 * @param {string} visitorId - ID of the visitor
 */
const gethistory = async (visitorId) => {
  try {
    const { data } = await request_lamda3.get(
      `/api/url-history?visitor_id=${visitorId}`
    );
    console.log("📜 API Response:", data);
    return data;
  } catch (e) {
    logError("error while fetching visitor", e.message);
    throw e;
  }
};

/**
 * Delete a URL from the user's history
 * @param {string} shortUrlId - ID of the shortened URL
 * @param {string} visitorId - ID of the visitor
 * @returns {object} - API response
 */
const deleteHistory = async (shortUrlId, visitorId) => {
  try {
    const { data } = await request_lamda4.delete(
      `/api/history/delete-url?short_url_id=${shortUrlId}&visitor_id=${visitorId}`
    );
    log("Deleted history entry:", data);
    return data;
  } catch (e) {
    logError("Error while deleting history:", e.message);
    throw e;
  }
};

/**
 * Fetch URL details by alias
 * @param {string} alias - The short URL alias
 * @returns {object} - API response with URL details
 */
const getUrlDetailsByAlias = async (alias) => {
  try {
    const { data } = await request_lamda4.get(
      `/api/ws-url-details?alias=${alias}`
    );
    log("📋 URL details by alias:", data);
    
    // Debug favicon specifically
    if (data && data.data) {
      log("🔍 Favicon debug:", {
        favicon_url: data.data.favicon_url,
        favicon: data.data.favicon,
        has_favicon: !!data.data.favicon_url || !!data.data.favicon
      });
    }
    
    return data;
  } catch (e) {
    logError("Error while fetching URL details by alias:", e.message);
    throw e;
  }
};

export {
  getUserLocation,
  getVisitor,
  gethistory,
  getMetadata,
  shortenUrl,
  deleteHistory,
  getRedirect,
  getUrlDetailsByAlias
};
