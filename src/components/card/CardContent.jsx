/* global chrome */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchShortUrl } from "../../store/features/shortUrlSlice"; 
import { addHistoryItem } from "../../store/features/historySlice"; 

// Typing Effect Hook
function useTypingEffect(text, delay = 40, start = true) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!start || !text) {
      setDisplayedText("");
      return;
    }
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
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [animationData, setAnimationData] = useState(null);

  const [showLine, setShowLine] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startShortUrl, setStartShortUrl] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startOriginalUrl, setStartOriginalUrl] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [showIcons, setShowIcons] = useState([false, false, false]);

  const hasSubmittedRef = useRef(false);
  const hasAddedHistoryRef = useRef(false);

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
    originalUrl: reduxOriginalUrl,
  } = useSelector((state) => state.shortUrl);

  // Detect current tab URL
  useEffect(() => {
    if (window.chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) setOriginalUrl(tabs[0].url);
      });
    } else {
      setOriginalUrl(
        "https://example.com/this-is-a-longer-fallback-url-for-testing-animation-timing"
      );
    }
  }, []);

  // Fetch short URL
  useEffect(() => {
    if (originalUrl && visitorId && !hasSubmittedRef.current && status !== "loading") {
      dispatch(fetchShortUrl({ longUrl: originalUrl, visitorId }));
      hasSubmittedRef.current = true;
    }
  }, [originalUrl, visitorId, dispatch, status]);

  // Handle API Success
  useEffect(() => {
    if (status === "success" && !hasAddedHistoryRef.current && shortUrlId) {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = now.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      setAnimationData({
        shortUrl,
        metaTitle,
        originalUrl: reduxOriginalUrl,
        faviconUrl,
        time,
        date,
      });

      dispatch(
        addHistoryItem({
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
        })
      );

      hasAddedHistoryRef.current = true;
    }
  }, [
    status,
    shortUrlId,
    shortUrl,
    metaTitle,
    reduxOriginalUrl,
    metaDescription,
    faviconUrl,
    onImage,
    clicksCount,
    visitorId,
    dispatch,
  ]);

  // Handle API Error
  useEffect(() => {
    if (status === "error") {
      setError(shortUrlError || "An unknown error occurred.");
    }
  }, [status, shortUrlError]);

  const typedShortUrl = useTypingEffect(animationData?.shortUrl, 50, startShortUrl);
  const typedHeading = useTypingEffect(animationData?.metaTitle, 30, startHeading);
  const typedOriginalUrl = useTypingEffect(animationData?.originalUrl, 25, startOriginalUrl);

  // Animation sequence
  useEffect(() => {
    if (start) setShowLine(true);
  }, [start]);

  useEffect(() => {
    if (!showLine || !animationData) return;

    const logoTimeout = setTimeout(() => setShowLogo(true), 300);
    const shortUrlTimeout = setTimeout(() => setStartShortUrl(true), 1000);
    const headingDelay = 1000 + (animationData.shortUrl?.length * 50 || 0) + 500;
    const headingTimeout = setTimeout(() => setStartHeading(true), headingDelay);
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
  }, [showLine, animationData]);

  useEffect(() => {
    if (!startOriginalUrl || !animationData) return;

    const originalUrlTypingDuration =
      (animationData.originalUrl?.length || 0) * 25;

    const timeouts = [];

    timeouts.push(
      setTimeout(() => setShowDateTime(true), originalUrlTypingDuration + 500)
    );
    timeouts.push(
      setTimeout(() => setShowIcons([true, false, false]), originalUrlTypingDuration + 900)
    );
    timeouts.push(
      setTimeout(() => setShowIcons([true, true, false]), originalUrlTypingDuration + 1200)
    );
    timeouts.push(
      setTimeout(() => setShowIcons([true, true, true]), originalUrlTypingDuration + 1500)
    );

    const totalTimeForAllAnimations =
      originalUrlTypingDuration + 1500 + 600;

    timeouts.push(
      setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, totalTimeForAllAnimations)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [startOriginalUrl, animationData, onAnimationComplete]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[195px] text-red-600 font-arial p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex item-center gap-[20px] ml-[10px] mb-[48px]">
      <div className="w-[1px] h-[195px]">
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
          {showLogo && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={
                animationData?.faviconUrl ||
                "images/card/logo/default-favicon.png"
              }
              alt="Favicon"
              className="h-[30px] w-[30px]"
              onError={(e) => {
                e.target.src = "images/card/logo/default-favicon.png";
              }}
            />
          )}
          <a
            href={animationData?.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px]"
          >
            {typedShortUrl}
          </a>
        </div>

        <h3 className="tracking-[1.5px] leading-[18px] pr-[20px]">{typedHeading}</h3>

        <p className="cursor-default whitespace-nowrap overflow-hidden text-ellipsis w-[420px]">
          {typedOriginalUrl}
        </p>

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
