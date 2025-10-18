import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Share({ start, onAnimationComplete }) {
  const scrollRef = useRef(null);
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [showArrows, setShowArrows] = useState(false);

  const icons = [
    "/images/share/Share Icon B.svg",
    "/images/share/Copy Icon B.svg",
    "/images/share/ZIMOJI B.svg",
    "/images/share/OMN B.svg",
    "/images/share/Email B.svg",
    "/images/share/WhatsApp B.svg",
    "/images/share/Telegram B.svg",
    "/images/share/Facebook B.svg",
    "/images/share/X B.svg",
    "/images/share/WeChat B.svg",
    "/images/share/Threads B.svg",
    "/images/share/Reddit B.svg",
    "/images/share/Discord B.svg",
    "/images/share/BlueSky B.svg",
    "/images/share/Sina Weibo B.svg",
  ];

  useEffect(() => {
    if (!start) return;
    let i = 0;
    const interval = setInterval(() => {
      setVisibleIcons(prev => [...prev, icons[i]]);
      i++;
      if (i >= icons.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowArrows(true);
          // 👇 jab arrows bhi show ho jaye to footer trigger karein
          setTimeout(() => {
            if (onAnimationComplete) onAnimationComplete();
          }, 500);
        }, 300);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [start]);

  const handleScroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {/* ICONS SCROLL ROW */}
      <div
        ref={scrollRef}
        className="flex gap-[28px] mx-[12px] mb-[28.5px] mt-[29px] overflow-x-auto scroll-smooth no-scrollbar"
      >
        {visibleIcons.map((icon, index) => (
          <motion.img
            key={index}
            src={icon}
            alt={`icon-${index}`}
            className="h-[25.52px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {/* SCROLL ARROWS */}
      {showArrows && (
        <motion.div
          className="flex justify-between items-center mb-[28px] mx-[40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ duration: 0.4 }}
        >
          <img
            src="/images/share/Arrow Left B.svg"
            alt="Left arrow"
            className="h-[25.52px] cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => handleScroll("left")}
          />
          <img
            src="/images/share/Arrow Right B.svg"
            alt="Right arrow"
            className="h-[25.52px] cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => handleScroll("right")}
          />
        </motion.div>
      )}
    </div>
  );
}

