import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// --- ICONS ARRAY (Stable, outside component) ---
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
  "/images/share/BlueSky B.svg",
  "/images/share/Reddit B.svg",
  "/images/share/Discord B.svg",
  "/images/share/Sina Weibo B.svg",
  "/images/share/Messenger B.svg",
];

export default function Share({ start, onAnimationComplete }) {
  const scrollRef = useRef(null);
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Prevent animation from running more than once
  const hasAnimated = useRef(false);

  // --- ICONS ONE-BY-ONE ANIMATION ---
  useEffect(() => {
    if (!start || hasAnimated.current) return;
    hasAnimated.current = true;

    let i = 0;
    let isCancelled = false;
    setVisibleIcons([]);

    const interval = setInterval(() => {
      if (isCancelled) return;

      setVisibleIcons((prev) => {
        // prevent duplicates in case of re-renders
        if (!prev.includes(icons[i])) {
          return [...prev, icons[i]];
        }
        return prev;
      });

      i++;
      if (i >= icons.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (!isCancelled) {
            setShowArrows(true);
            setTimeout(() => {
              if (onAnimationComplete) onAnimationComplete();
            }, 500);
          }
        }, 800);
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [start, onAnimationComplete]);

  // --- RESET WHEN start = false ---
  useEffect(() => {
    if (!start) {
      setVisibleIcons([]);
      setShowArrows(false);
      hasAnimated.current = false;
    }
  }, [start]);

  // --- SCROLL POSITION TRACKER ---
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // --- ADD LISTENERS FOR SCROLL + RESIZE ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  // --- UPDATE ARROW VISIBILITY AFTER ANIMATION COMPLETES ---
  useEffect(() => {
    if (showArrows) {
      const timer = setTimeout(() => {
        updateScrollButtons();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showArrows]);

  // --- SCROLL HANDLER ---
  const handleScroll = (direction) => {
    const scrollAmount = 400;
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
            key={icon}
            src={icon}
            // alt={`icon-${index}`}
            className="h-[25.52px] flex-shrink-0 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* SCROLL ARROWS */}
      {showArrows && (
        <motion.div
          className="flex justify-between items-center mb-[28px] mx-[40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src="/images/share/Arrow Left B.svg"
            alt="Left arrow"
            className={`h-[25.52px] transition-opacity ${
              canScrollLeft ? "opacity-50 hover:opacity-100 cursor-pointer" : "opacity-0"
            }`}
            onClick={() => canScrollLeft && handleScroll("left")}
          />
          <img
            src="/images/share/Arrow Right B.svg"
            alt="Right arrow"
            className={`h-[25.52px] transition-opacity ${
              canScrollRight ? "opacity-50 hover:opacity-100 cursor-pointer" : "opacity-0"
            }`}
            onClick={() => canScrollRight && handleScroll("right")}
          />
        </motion.div>
      )}
    </div>
  );
}
