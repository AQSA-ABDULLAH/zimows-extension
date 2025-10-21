/* global chrome */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function useTypingEffect(text, delay = 40, start = true) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!start) return;
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
  const shortUrl = "zimo.ws/OFBxVT";
  const headingText =
    "Deadly fighting erupts between Hamas and Palestinian clan in Gaza";
  const [originalUrl, setOriginalUrl] = useState("");

  // 🧠 Detect current tab URL
  useEffect(() => {
    if (window.chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setOriginalUrl(tabs[0].url);
        }
      });
    } else {
      // fallback for local testing
      setOriginalUrl("https://example.com/this-is-a-longer-fallback-url-for-testing-animation-timing");
    }
  }, []);

  const [showLine, setShowLine] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startShortUrl, setStartShortUrl] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startOriginalUrl, setStartOriginalUrl] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [showIcons, setShowIcons] = useState([false, false, false]);

  const typedShortUrl = useTypingEffect(shortUrl, 50, startShortUrl);
  const typedHeading = useTypingEffect(headingText, 30, startHeading);
  const typedOriginalUrl = useTypingEffect(originalUrl, 25, startOriginalUrl);

  useEffect(() => {
    if (!start) return;
    // Step 1: Show Line first
    setShowLine(true);
  }, [start]);

  // ✅ FIXED: Effect 1 (Steps 2-5)
  // This effect schedules the first part of the animation,
  // up to *starting* the original URL.
  useEffect(() => {
    if (!showLine) return;

    // Step 2: Show Logo
    const logoTimeout = setTimeout(() => setShowLogo(true), 300);

    // Step 3: Start typing Short URL
    const shortUrlTimeout = setTimeout(() => setStartShortUrl(true), 1000);

    // Step 4: Start typing Heading
    const headingDelay = 1000 + shortUrl.length * 50 + 500;
    const headingTimeout = setTimeout(() => setStartHeading(true), headingDelay);

    // Step 5: Original URL
    // Calculate total time *before* starting the original URL
    const totalTypingTime =
      1000 + shortUrl.length * 50 + headingText.length * 30 + 800;
    const originalUrlTimeout = setTimeout(
      () => setStartOriginalUrl(true),
      totalTypingTime
    );

    // Cleanup for this part of the animation
    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(shortUrlTimeout);
      clearTimeout(headingTimeout);
      clearTimeout(originalUrlTimeout);
    };
  }, [showLine, shortUrl.length, headingText.length]); // Added constants to dependency array

  // ✅ FIXED: Effect 2 (Steps 6-End)
  // This effect *waits* for two things:
  // 1. The signal to start (`startOriginalUrl = true`)
  // 2. The URL to be fetched (`originalUrl !== ""`)
  useEffect(() => {
    // Wait until we have the URL *and* it's time to start typing it.
    if (!startOriginalUrl || originalUrl === "") {
      return;
    }

    // Now `originalUrl.length` is accurate!
    const originalUrlTypingDuration = originalUrl.length * 25;

    // Create an array to hold all timeouts for easy cleanup
    const timeouts = [];

    // Step 6: Date & Time
    timeouts.push(
      setTimeout(
        () => setShowDateTime(true),
        originalUrlTypingDuration + 500
      )
    );

    // Step 7: Icons (1 by 1)
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

    // 🏁 Final step after last icon appears
    const totalTimeForAllAnimations =
      originalUrlTypingDuration + 1500 + 600;

    timeouts.push(
      setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete(); // callback trigger
      }, totalTimeForAllAnimations)
    );

    // Cleanup: Clear all timeouts scheduled by *this* effect
    return () => {
      timeouts.forEach(clearTimeout);
    };
    // This effect depends on the start signal, the URL data, and the callback
  }, [startOriginalUrl, originalUrl, onAnimationComplete]);

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
          {/* 🪙 Logo */}
          {showLogo && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="images/card/logo/amex dls-logo-bluebox-solid.svg"
              alt="BBC"
              className="h-[30px] w-[30px]"
            />
          )}

          {/* Short URL */}
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px]"
          >
            {typedShortUrl}
          </a>
        </div>

        {/* Heading */}
        <h3 className="tracking-[1.5px] leading-[18px]">{typedHeading}</h3>

        {/* Original URL */}
        <p className="break-all cursor-default">{typedOriginalUrl}</p>

        {/* Date & Time */}
        {showDateTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-[30px]"
          >
            <span>17:23</span>
            <span>06 October 2025</span>
          </motion.div>
        )}

        {/* Icons */}
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