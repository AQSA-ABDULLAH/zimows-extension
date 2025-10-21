/* global chrome */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchShortUrl } from "../../store/features/shortUrlSlice"; // Check path
import { addHistoryItem } from "../../store/features/historySlice"; // Check path

// Typing Effect Hook (No changes)
function useTypingEffect(text, delay = 40, start = true) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!start || !text) { // Added !text check
        setDisplayedText(""); // Clear text if not started or no text
        return;
    };
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay, start]);

  return displayedText;
}

export default function CardContent({ start, onAnimationComplete }) {
  // --- Local State for Animation & Data ---
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  
  // This state holds the final data for animation to prevent flickering
  const [animationData, setAnimationData] = useState(null); 

  // --- Animation Triggers ---
  const [showLine, setShowLine] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startShortUrl, setStartShortUrl] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startOriginalUrl, setStartOriginalUrl] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [showIcons, setShowIcons] = useState([false, false, false]);

  // --- Refs to prevent multiple submissions ---
  const hasSubmittedRef = useRef(false);
  const hasAddedHistoryRef = useRef(false);

  // --- Redux Integration (Backend Logic) ---
  const dispatch = useDispatch();
  const visitorId = useSelector((state) => state.visitor.data?.visitor_id);
  const {
    status,
    error: shortUrlError,
    shortUrl,
    shortUrlId,
    metaTitle,
    metaDescription,
    faviconUrl,
    onImage,
    clicksCount,
    originalUrl: reduxOriginalUrl, // Renamed to avoid clash
  } = useSelector((state) => state.shortUrl);

  // 🧠 Step 1: Detect current tab URL (Original logic)
  useEffect(() => {
    if (window.chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setOriginalUrl(tabs[0].url);
        }
      });
    } else {
      // Fallback for local testing
      setOriginalUrl("https://example.com/this-is-a-longer-fallback-url-for-testing-animation-timing");
    }
  }, []);

  // 🚀 Step 2: Trigger API call when URL and visitorId are ready
  useEffect(() => {
    if (originalUrl && visitorId && !hasSubmittedRef.current && status !== 'loading') {
      console.log("Dispatching fetchShortUrl for:", originalUrl);
      dispatch(fetchShortUrl({ longUrl: originalUrl, visitorId }));
      hasSubmittedRef.current = true; // Mark as submitted
    }
  }, [originalUrl, visitorId, dispatch, status]);

  // 🏪 Step 3: Handle API Success, Store History, & Set Animation Data
  useEffect(() => {
    if (status === 'success' && !hasAddedHistoryRef.current && shortUrlId) {
      console.log("API Success, adding to history and setting animation.");
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' });

      // 1. Set data for animation
      setAnimationData({
        shortUrl,
        metaTitle,
        originalUrl: reduxOriginalUrl,
        faviconUrl,
        time,
        date,
      });

      // 2. Dispatch to history
      dispatch(addHistoryItem({
        short_url_id: shortUrlId,
        zimo_ws_url: shortUrl,
        original_url: reduxOriginalUrl,
        meta_title: metaTitle,
        meta_description: metaDescription,
        favicon_url: faviconUrl,
        on_image: onImage,
        clicks_count: clicksCount || 0,
        created_at: now.toISOString(),
        time,
        date,
      }));

      hasAddedHistoryRef.current = true; // Mark history as added
    }
  }, [status, shortUrlId, shortUrl, metaTitle, reduxOriginalUrl, metaDescription, faviconUrl, onImage, clicksCount, visitorId, dispatch]);

  // ❌ Step 4: Handle API Error
  useEffect(() => {
    if (status === 'error') {
      setError(shortUrlError || "An unknown error occurred.");
    }
  }, [status, shortUrlError]);


  // --- Data for Typing Animation ---
  // Uses data from `animationData` state
  const typedShortUrl = useTypingEffect(animationData?.shortUrl, 50, startShortUrl);
  const typedHeading = useTypingEffect(animationData?.metaTitle, 30, startHeading);
  
  const displayUrl =
    animationData?.originalUrl && animationData.originalUrl.length > 60
      ? animationData.originalUrl.slice(0, 60) + "..."
      : animationData?.originalUrl;
  const typedOriginalUrl = useTypingEffect(displayUrl, 25, startOriginalUrl);


  // --- Animation Sequence Logic (Updated) ---

  // Step 1: Show Line (triggered by parent `start` prop)
  useEffect(() => {
    if (start) {
      setShowLine(true);
    }
  }, [start]);

  // Steps 2-5: Wait for data AND line
  useEffect(() => {
    // Wait until line is shown AND data is ready
    if (!showLine || !animationData) return;

    // Step 2: Show Logo
    const logoTimeout = setTimeout(() => setShowLogo(true), 300);

    // Step 3: Start typing Short URL
    const shortUrlTimeout = setTimeout(() => setStartShortUrl(true), 1000);

    // Step 4: Start typing Heading
    const headingDelay = 1000 + (animationData.shortUrl?.length * 50 || 0) + 500;
    const headingTimeout = setTimeout(() => setStartHeading(true), headingDelay);

    // Step 5: Original URL
    const totalTypingTime =
      1000 +
      (animationData.shortUrl?.length * 50 || 0) +
      (animationData.metaTitle?.length * 30 || 0) +
      800;
    const originalUrlTimeout = setTimeout(
      () => setStartOriginalUrl(true),
      totalTypingTime
    );

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(shortUrlTimeout);
      clearTimeout(headingTimeout);
      clearTimeout(originalUrlTimeout);
    };
  }, [showLine, animationData]); // Depends on data now

  // Steps 6-End: Wait for original URL typing to start
  useEffect(() => {
    if (!startOriginalUrl || !animationData) {
      return;
    }

    const displayUrlLength =
      (animationData.originalUrl?.length > 60
        ? 60
        : animationData.originalUrl?.length) || 0;
        
    const originalUrlTypingDuration = displayUrlLength * 25;

    const timeouts = [];

    // Step 6: Date & Time
    timeouts.push(
      setTimeout(
        () => setShowDateTime(true),
        originalUrlTypingDuration + 500
      )
    );

    // Step 7: Icons
    timeouts.push(
      setTimeout(
        () => setShowIcons([true, false, false]),
        originalUrlTypingDuration + 900
      )
    );
    timeouts.push(
      setTimeout(
        () => setShowIcons([true, true, false]),
        originalUrlTypingDuration + 1200
      )
    );
    timeouts.push(
      setTimeout(
        () => setShowIcons([true, true, true]),
        originalUrlTypingDuration + 1500
      )
    );

    // 🏁 Final step
    const totalTimeForAllAnimations =
      originalUrlTypingDuration + 1500 + 600;

    timeouts.push(
      setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, totalTimeForAllAnimations)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [startOriginalUrl, animationData, onAnimationComplete]); // Depends on data now

  // --- Render ---

  // Loading State
  if (status === 'loading' && !error) {
    return (
        <div className="flex items-center justify-center h-[195px] text-[#000] font-arial">
            Shortening...
        </div>
    );
  }

  // Error State
  if (error) {
     return (
        <div className="flex items-center justify-center h-[195px] text-red-600 font-arial p-4">
            Error: {error}
        </div>
    );
  }

  // Animation Content
  return (
    <div className="flex item-center gap-[20px] ml-[10px] mb-[48px]">
      {/* 🟡 First Step: Line Animation */}
      <div>
        {showLine && (
          <motion.img
            src="/images/card/WS Chrome Line.svg"
            alt="line"
            className="w-[1px] h-[195px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline font-arial text-[#000] tracking-[1.2px] ml-[10px] leading-none">
        <div className="flex items-center gap-[43px] h-[30px] mt-[5px]">
          {/* 🪙 Logo (Now uses real favicon) */}
          {showLogo && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={animationData?.faviconUrl || "images/card/logo/default-favicon.png"} // Use real favicon
              alt="Favicon"
              className="h-[30px] w-[30px]"
              onError={(e) => { e.target.src = "images/card/logo/default-favicon.png"; }} // Fallback
            />
          )}

          {/* Short URL (Now uses real data) */}
          <a
            href={animationData?.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px]"
          >
            {typedShortUrl}
          </a>
        </div>

        {/* Heading (Now uses real data) */}
        <h3 className="tracking-[1.5px] leading-[18px]">{typedHeading}</h3>

        {/* Original URL (Now uses real data) */}
        <p className="cursor-default whitespace-nowrap overflow-hidden text-ellipsis">
          {typedOriginalUrl}
        </p>

        {/* Date & Time (Now uses real data) */}
        {showDateTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-[30px]"
          >
            <span>{animationData?.time}</span>
            <span>{animationData?.date}</span>
          </motion.div>
        )}

        {/* Icons (No changes) */}
        <div className="flex gap-[50px]">
          {showIcons[0] && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Open in New Window.svg"
              alt="open window"
              className="h-[22px] cursor-pointer"
            />
          )}
          {showIcons[1] && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Copy Icon B.svg"
              alt="copy"
              className="h-[22px] cursor-pointer"
            />
          )}
          {showIcons[2] && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Share Icon B.svg"
              alt="share"
              className="h-[22px] cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}