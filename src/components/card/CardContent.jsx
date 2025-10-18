import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ✅ Typing effect custom hook
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

export default function CardContent() {
  const shortUrl = "zimo.ws/OFBxVT";
  const headingText = "Deadly fighting erupts between Hamas and Palestinian clan in Gaza";
  const originalUrl = "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo";

  const [showLogo, setShowLogo] = useState(false);
  const [startShortUrl, setStartShortUrl] = useState(false);
  const [startHeading, setStartHeading] = useState(false);
  const [startOriginalUrl, setStartOriginalUrl] = useState(false);

  const typedShortUrl = useTypingEffect(shortUrl, 50, startShortUrl);
  const typedHeading = useTypingEffect(headingText, 30, startHeading);
  const typedOriginalUrl = useTypingEffect(originalUrl, 25, startOriginalUrl);

  useEffect(() => {
    // Step 1: Show Logo
    setTimeout(() => setShowLogo(true), 300);

    // Step 2: Start typing Short URL
    setTimeout(() => setStartShortUrl(true), 1000);

    // Step 3: Start typing Heading
    setTimeout(() => setStartHeading(true), 1000 + shortUrl.length * 50 + 500);

    // Step 4: Start typing Original URL
    setTimeout(() => {
      setStartOriginalUrl(true);
    }, 1000 + shortUrl.length * 50 + headingText.length * 30 + 800);
  }, []);

  return (
    <div className="flex item-center gap-[20px] ml-[10px] mb-[48px]">
      <div>
        <img
          src="/images/card/WS Chrome Line.svg"
          alt="line"
          className="w-[1px] h-[195px]"
        />
      </div>

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1px] ml-[10px] leading-none">
        {/* ✅ Logo fade-in */}
        <div className="flex items-center gap-[43px] mt-[5px]">
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
          <a
            href="https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
          >
            {typedShortUrl}
          </a>
        </div>

        {/* Heading typing */}
        <h3 className="tracking-[1.8px] leading-[18px] ">
          {typedHeading}
        </h3>

        {/* Original URL typing */}
        <a
          href="/"
          className="tracking-[1.5px] break-all cursor-default"
        >
          {typedOriginalUrl}
        </a>

        {/* Time and Date */}
        <div className="flex gap-[30px] leading-[10px]">
          <span>17:23</span>
          <span>06 October 2025</span>
        </div>

        {/* Icons */}
        <div className="flex gap-[50px]">
          <img
            src="/images/card/Open in New Window.svg"
            alt="open window"
            className="h-[22px] cursor-pointer"
          />
          <img
            src="/images/card/Copy Icon B.svg"
            alt="copy"
            className="h-[22px] cursor-pointer"
          />
          <img
            src="/images/card/Share Icon B.svg"
            alt="share"
            className="h-[22px] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
