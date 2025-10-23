import React, { useState } from "react";
import { motion } from "framer-motion";

const iconsList = [
  { src: "/images/share/Copy Icon B.svg", platform: "copy" },
  { src: "/images/share/Share Icon B.svg", platform: "generic" },
  { src: "/images/share/ZIMOJI B.svg", platform: "zimoji" },
  { src: "/images/share/OMN B.svg", platform: "omn" },
  { src: "/images/share/Email B.svg", platform: "email" },
  { src: "/images/share/WhatsApp B.svg", platform: "whatsapp" },
  { src: "/images/share/Telegram B.svg", platform: "telegram" },
  { src: "/images/share/Facebook B.svg", platform: "facebook" },
  { src: "/images/share/X B.svg", platform: "x" },
  { src: "/images/share/WeChat B.svg", platform: "wechat" },
  { src: "/images/share/Threads B.svg", platform: "threads" },
  { src: "/images/share/BlueSky B.svg", platform: "BlueSky" },
  { src: "/images/share/Reddit B.svg", platform: "reddit" },
  { src: "/images/share/Discord B.svg", platform: "discord" },
  { src: "/images/share/Sina Weibo B.svg", platform: "weibo" },
  { src: "/images/share/Messenger B.svg", platform: "messenger" },
];

export default function Share({ start, onAnimationComplete }) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 9; // how many icons fit visible width
  const maxIndex = Math.max(0, iconsList.length - visibleCount);

  const handleNext = () => {
    setScrollIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };
  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full py-4 space-y-2"
      initial={{ opacity: 0, y: 30 }}
      animate={start ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* --- ICONS ROW --- */}
      <div className="overflow-hidden w-[460px]">
        <motion.div
          className="flex items-center gap-5"
          animate={{ x: -scrollIndex * 52 }} // each icon + gap ≈ 52px
          transition={{ type: "tween", duration: 0.4 }}
        >
          {iconsList.map((icon) => (
            <motion.img
              key={icon.platform}
              src={icon.src}
              alt={icon.platform}
              className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-150"
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>

      {/* --- ARROWS BELOW --- */}
      <div className="flex items-center justify-between mb-[28.5px] px-[24px]">
        <button
          onClick={handlePrev}
          className={`p-1 transition-opacity ${
            scrollIndex === 0
              ? "opacity-0 cursor-default"
              : "opacity-50 hover:opacity-100 "
          }`}
        >
          <img
            src="/images/share/Arrow Left B.svg"
            alt="Left"
            className="w-5 h-5"
          />
        </button>

        <button
          onClick={handleNext}
          className={`p-1 transition-opacity ${
            scrollIndex === maxIndex
              ? "opacity-0 cursor-default"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <img
            src="/images/share/Arrow Right B.svg"
            alt="Right"
            className="w-5 h-5"
          />
        </button>
      </div>
    </motion.div>
  );
}
