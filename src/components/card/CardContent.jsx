/* global chrome */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchShortUrl } from "../../store/features/shortUrlSlice";
import { addHistoryItem } from "../../store/features/historySlice";

// -------------------- ✨ Typing Effect Hook --------------------
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

// -------------------- ✨ Main Component --------------------
export default function CardContent({ start, onAnimationComplete }) {
  const dispatch = useDispatch();

  // ---------- Local States ----------
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  const [showLine, setShowLine] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startShortUrl, setStartShortUrl] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startOriginalUrl, setStartOriginalUrl] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [showIcons, setShowIcons] = useState([false, false, false]);

  // ---------- Refs ----------
  const hasSubmittedRef = useRef(false);
  const hasAddedHistoryRef = useRef(false);
  const hasAutoCopiedRef = useRef(false);

  // ---------- Redux Data ----------
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

  // -------------------- 🔍 Detect Current Tab URL --------------------
  useEffect(() => {
    if (window.chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) setOriginalUrl(tabs[0].url);
      });
    } else {
      setOriginalUrl("https://example.com/sample-url-for-testing");
    }
  }, []);

  // -------------------- 🚀 Fetch Short URL --------------------
  useEffect(() => {
    if (
      originalUrl &&
      visitorId &&
      !hasSubmittedRef.current &&
      status !== "loading"
    ) {
      dispatch(fetchShortUrl({ longUrl: originalUrl, visitorId }));
      hasSubmittedRef.current = true;
    }
  }, [originalUrl, visitorId, dispatch, status]);

  // -------------------- ✅ Handle API Success --------------------
  useEffect(() => {
    if (status === "success" && !hasAddedHistoryRef.current && shortUrlId) {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const newData = {
        shortUrl,
        metaTitle,
        originalUrl: reduxOriginalUrl,
        faviconUrl,
        time,
        date,
      };

      setAnimationData(newData);
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

  ]);

  // -------------------- ⚠️ Handle API Error --------------------
  useEffect(() => {
    if (status === "error")
      setError(shortUrlError || "An unknown error occurred.");
  }, [status, shortUrlError]);

  // -------------------- 💬 Typing Effects --------------------
  const displayShortUrl = animationData?.shortUrl?.replace(/^https?:\/\//, "");
  const typedShortUrl = useTypingEffect(displayShortUrl, 50, startShortUrl);
  const typedHeading = useTypingEffect(
    animationData?.metaTitle,
    30,
    startHeading
  );
  const typedOriginalUrl = useTypingEffect(
    animationData?.originalUrl,
    25,
    startOriginalUrl
  );

  // -------------------- 🕹️ Animation Sequence --------------------
  useEffect(() => {
    if (start) setShowLine(true);
  }, [start]);

  useEffect(() => {
    if (!showLine || !animationData) return;

    const logoTimeout = setTimeout(() => setShowLogo(true), 300);
    const shortUrlTimeout = setTimeout(() => setStartShortUrl(true), 1000);

    const headingDelay = 1000 + (displayShortUrl?.length * 50 || 0) + 500;
    const headingTimeout = setTimeout(
      () => setStartHeading(true),
      headingDelay
    );

    const totalTypingTime =
      1000 +
      (displayShortUrl?.length * 50 || 0) +
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
  }, [showLine, animationData, displayShortUrl]);

  // -------------------- 🧠 Auto Copy Short URL (once) --------------------
  useEffect(() => {
    if (startShortUrl && animationData?.shortUrl && !hasAutoCopiedRef.current) {
      navigator.clipboard
        .writeText(animationData.shortUrl)
        .then(() =>
          console.log(
            "✅ Short URL copied automatically:",
            animationData.shortUrl
          )
        )
        .catch((err) => console.error("❌ Copy failed:", err));
      hasAutoCopiedRef.current = true;
    }
  }, [startShortUrl, animationData]);

  // -------------------- ⏱️ Show Date, Time & Icons --------------------
 useEffect(() => {
  if (!startOriginalUrl || !animationData) return;
  if (showDateTime || showIcons.includes(true)) return;

  const timeouts = [];

  // Show date/time quickly after URL starts
  timeouts.push(setTimeout(() => setShowDateTime(true), 600));

  // Show icons soon after
  timeouts.push(setTimeout(() => setShowIcons([true, false, false]), 900));
  timeouts.push(setTimeout(() => setShowIcons([true, true, false]), 1200));
  timeouts.push(setTimeout(() => setShowIcons([true, true, true]), 1500));
  timeouts.push(setTimeout(() => onAnimationComplete?.(), 2000));

  return () => timeouts.forEach(clearTimeout);
}, [startOriginalUrl, animationData]);


  // -------------------- ❌ Error UI --------------------
  if (error) {
    return (
      <div className="flex items-center justify-center h-[195px] text-red-600 font-arial p-4">
        Error: {error}
      </div>
    );
  }

  // -------------------- 🎨 UI --------------------
  return (
    <div className="flex items-center gap-[20px] ml-[10px] mb-[48px]">
      {/* Left Line */}
      <div className="flex-shrink-0 w-[1px] h-auto">
        {showLine && (
          <motion.img
            src="/images/card/WS Chrome Line.svg"
            alt="line"
            className="w-[1px] h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-between h-[192px] text-[12px] font-arial text-[#000] tracking-[1.2px] ml-[10px] leading-none">
        {/* Favicon + Short URL */}
        <div className="flex items-center gap-[43px] mt-[5px]">
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
              className="h-[30px]"
              onError={(e) =>
                (e.target.src = "images/card/logo/default-favicon.png")
              }
            />
          )}
          <p className="text-[14px]">{typedShortUrl}</p>
        </div>

        {/* Title */}
        <h3 className="tracking-[1.5px] leading-[18px] pr-[20px]">
          {typedHeading}
        </h3>

        {/* Original URL */}
        {startOriginalUrl && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="cursor-default whitespace-nowrap overflow-hidden text-ellipsis w-[440px]"
          >
            {animationData?.originalUrl}
          </motion.p>
        )}

        {/* Date & Time */}
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

        {/* Action Icons */}
        <div className="flex gap-[50px]">
          {showIcons[0] && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Open in New Window.svg"
              alt="open"
              className="h-[22px] cursor-pointer"
              onClick={() => {
                if (animationData?.shortUrl) {
                  const alias = animationData.shortUrl.split("/").pop(); // e.g. "nakf6O"
                  console.log("Extracted alias:", alias);

                  // Open zimo.ws with alias as query param
                  window.open(`https://zimo.ws/?alias=${alias}`, "_blank");
                }
              }}
            />
          )}

          {showIcons[1] && (
            <motion.img
              key="copy-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Copy Icon B.svg"
              alt="copy"
              className={`h-[22px] cursor-pointer transition-all duration-200 ${
                copied ? "opacity-60 scale-95" : "hover:scale-105"
              }`}
              onClick={() => {
                if (animationData?.shortUrl) {
                  navigator.clipboard.writeText(animationData.shortUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 800); // Reset state after 0.8s
                }
              }}
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
              onClick={() => {
                if (navigator.share && animationData?.shortUrl) {
                  navigator.share({
                    title: "WS by ZIMO",
                    url: animationData.shortUrl,
                  });
                } else if (animationData?.shortUrl) {
                  navigator.clipboard.writeText(animationData.shortUrl);
                  alert("Link copied to clipboard!");
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
