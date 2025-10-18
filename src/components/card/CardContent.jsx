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
  const originalUrl =
    "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo";

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

  useEffect(() => {
    if (!showLine) return;

    // Step 2: Show Logo
    setTimeout(() => setShowLogo(true), 300);

    // Step 3: Start typing Short URL
    setTimeout(() => setStartShortUrl(true), 1000);

    // Step 4: Start typing Heading
    setTimeout(() => setStartHeading(true), 1000 + shortUrl.length * 50 + 500);

    const totalTypingTime =
      1000 + shortUrl.length * 50 + headingText.length * 30 + 800;

    // Step 5: Original URL
    setTimeout(() => setStartOriginalUrl(true), totalTypingTime);

    // Step 6: Date & Time
    setTimeout(
      () => setShowDateTime(true),
      totalTypingTime + originalUrl.length * 25 + 500
    );

    // Step 7: Icons (1 by 1)
    setTimeout(
      () => setShowIcons([true, false, false]),
      totalTypingTime + originalUrl.length * 25 + 900
    );
    setTimeout(
      () => setShowIcons([true, true, false]),
      totalTypingTime + originalUrl.length * 25 + 1200
    );
    setTimeout(
      () => setShowIcons([true, true, true]),
      totalTypingTime + originalUrl.length * 25 + 1500
    );

    // 🏁 Final step after last icon appears
  const totalTimeForAllAnimations =
    totalTypingTime + originalUrl.length * 25 + 1500 + 600;

  const finalTimeout = setTimeout(() => {
    if (onAnimationComplete) onAnimationComplete(); // callback trigger
  }, totalTimeForAllAnimations);

  return () => clearTimeout(finalTimeout);
  }, [showLine]);

  return (
    <div className="flex item-center gap-[20px] ml-[10px] mb-[48px]">
      {/* 🟡 First Step: Line Animation */}
      <div>
        {showLine && (
          <motion.img
            src="/images/card/WS Chrome Line.svg"
            alt="line"
            className="w-[1px] h-[195px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1px] ml-[10px] leading-none">
         <div className="flex items-center gap-[43px] h-[30px] mt-[5px]">
        {/* 🪙 Logo */}
        {showLogo && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src="images/card/logo/amex dls-logo-bluebox-solid.svg"
            alt="BBC"
            className="h-[30px] w-[30px]"
          />
        )}

        {/* 🔗 Short URL */}
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono"
        >
          {typedShortUrl}
        </a>

        </div>

        {/* 📰 Heading */}
        <h3 className="tracking-[1.8px] leading-[18px]">{typedHeading}</h3>

        {/* 🌐 Original URL */}
        <a
          href="/"
          className="tracking-[1.5px] break-all cursor-default font-mono"
        >
          {typedOriginalUrl}
        </a>

        {/* ⏰ Date & Time */}
        {showDateTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-[30px] leading-[10px]"
          >
            <span>17:23</span>
            <span>06 October 2025</span>
          </motion.div>
        )}

        {/* 🖼 Icons */}
        <div className="flex gap-[50px]">
          {showIcons[0] && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Open in New Window.svg"
              alt="open window"
              className="h-[22px] cursor-pointer"
            />
          )}
          {showIcons[1] && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src="/images/card/Copy Icon B.svg"
              alt="copy"
              className="h-[22px] cursor-pointer"
            />
          )}
          {showIcons[2] && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
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
