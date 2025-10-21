import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Share({ start, onAnimationComplete }) {
  const scrollRef = useRef(null);
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    "/images/share/Messenger B.svg"
  ];

  // Animate icons one by one (Yeh bilkul theek hai)
  useEffect(() => {
    if (!start) return;
    let i = 0;
    setVisibleIcons([]);
    const interval = setInterval(() => {
      setVisibleIcons((prev) => [...prev, icons[i]]);
      i++;
      if (i >= icons.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowArrows(true); // YEH NAYE useEffect KO TRIGGER KAREGA
          setTimeout(() => {
            if (onAnimationComplete) onAnimationComplete();
          }, 500);
        }, 800);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [start]);

  // 🔸 Check scroll position (Yeh function bilkul theek hai)
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // --- YAHAN CHANGES KIYE GAYE HAIN ---

  // 🔸 NAYA BLOCK 1: Sirf listeners attach karein (jab component load ho)
  // Yeh state update nahi karta, is liye animation ko disturb nahi karta.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Jab user scroll kare tab update karein
    el.addEventListener("scroll", updateScrollButtons);
    // Jab window resize ho tab bhi update karein
    window.addEventListener("resize", updateScrollButtons);

    // Cleanup function
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []); // Empty array ka matlab: Sirf ek dafa component load honay par chalega

  // 🔸 NAYA BLOCK 2: Scroll state ko check karein jab animation complete ho
  // Yeh sirf tab chalega jab 'showArrows' true hoga.
  useEffect(() => {
    if (showArrows) {
      // Ek chota sa delay (100ms) taake DOM ko update honay ka time mil jaaye
      const timer = setTimeout(() => {
        updateScrollButtons();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showArrows]);

  // --- CHANGES END ---

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
            key={icon} // 'key={icon}' bilkul theek hai
            src={icon}
            alt={`icon-${index}`}
            className="h-[25.52px] flex-shrink-0 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
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
            className={`h-[25.52px] cursor-pointer transition-opacity ${
              canScrollLeft ? "opacity-50 hover:opacity-100" : "opacity-0"
            }`}
            onClick={() => canScrollLeft && handleScroll("left")}
          />
          <img
            src="/images/share/Arrow Right B.svg"
            alt="Right arrow"
            className={`h-[25.52px] cursor-pointer transition-opacity ${
              canScrollRight ? "opacity-50 hover:opacity-100" : "opacity-0"
            }`}
            onClick={() => canScrollRight && handleScroll("right")}
          />
        </motion.div>
      )}
    </div>
  );
}