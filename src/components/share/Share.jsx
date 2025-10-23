import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  { src: "/images/share/BlueSky B.svg", platform: "bluesky" },
  { src: "/images/share/Reddit B.svg", platform: "reddit" },
  { src: "/images/share/Discord B.svg", platform: "discord" },
  { src: "/images/share/Sina Weibo B.svg", platform: "weibo" }
];

export default function Share({ start, onAnimationComplete }) {
  const shortUrl = useSelector((state) => state.shortUrl.shortUrl);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [iconsDone, setIconsDone] = useState(false);

  const visibleCount = 9; // how many icons fit
  const iconWidth = 52; // width + gap approximation
  const totalIcons = iconsList.length;

  // ✅ Calculate maxIndex precisely so no extra gap appears
  const maxIndex = Math.max(0, totalIcons - visibleCount);

  // --- SHARE HANDLER ---
  const handleShare = async (platform) => {
    if (!shortUrl) return;
    const encodedUrl = encodeURIComponent(shortUrl);
    let shareUrl = "";

    switch (platform) {
      case "copy":
        await navigator.clipboard.writeText(shortUrl);
        return;
      case "zimoji":
        shareUrl = `https://zimoji.org`;
        break;
      case "omn":
        shareUrl = `https://omnium.social/`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Share WS by ZIMO&body=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=Share WS by ZIMO - ${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=Share WS by ZIMO`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=Share WS by ZIMO%0A${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "wechat":
        shareUrl = `https://www.wechat.com/`;
        break;
      case "threads":
        shareUrl = `https://www.threads.net/intent/post?text=Share WS by ZIMO%0A${encodedUrl}`;
        break;
      case "bluesky":
        shareUrl = `https://bsky.app/intent/compose?text=Share WS by ZIMO%0A${encodedUrl}`;
        break;
      case "discord":
        shareUrl = `https://discord.com/`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=Share WS by ZIMO`;
        break;
      case "weibo":
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}`;
        break;
         case "generic":
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Share WS by ZIMO",
              text: `Share WS by ZIMO - ${shortUrl}`,
              url: shortUrl,
            });
          } catch {
            await navigator.clipboard.writeText(shortUrl);
          }
        } else {
          await navigator.clipboard.writeText(shortUrl);
        }
        return;
      default:
        await navigator.clipboard.writeText(shortUrl);
        return;
    }

    window.open(shareUrl, "_blank");
  };

  // --- SLIDER CONTROL ---
  const handleNext = () => {
    setScrollIndex((prev) => (prev < maxIndex ? prev + 6 : prev));
  };
  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 6 : prev));
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };
  const iconVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // ✅ Clamp scrollIndex to avoid overshoot
  const clampedIndex = Math.min(scrollIndex, maxIndex);
  const translateX = -clampedIndex * iconWidth;

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full"
      initial={{ opacity: 0 }}
      animate={start ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* --- ICONS ROW --- */}
      <div className="overflow-hidden w-[500px]">
        <motion.div
          className="flex gap-[25px] mx-[24px] mt-[29px] mb-[20px]"
          animate={{ x: translateX }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <motion.div
            className="flex gap-[25px]"
            variants={containerVariants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            onAnimationComplete={() => setIconsDone(true)}
          >
            {iconsList.map((icon) => (
              <motion.img
                key={icon.platform}
                src={icon.src}
                alt={icon.platform}
                variants={iconVariants}
                className="h-[25.52px] cursor-pointer transition-transform duration-150"
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare(icon.platform)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* --- ARROWS BELOW --- */}
      <motion.div
        className="w-full flex items-center justify-between mb-[28.5px] px-[24px]"
        initial={{ opacity: 0 }}
        animate={iconsDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={clampedIndex === 0}
          className={`transition-opacity ${
            clampedIndex === 0
              ? "opacity-0 cursor-default"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <img
            src="/images/share/Arrow Left B.svg"
            alt="Left"
            className="h-[25.52px]"
          />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={clampedIndex >= maxIndex}
          className={`transition-opacity ${
            clampedIndex >= maxIndex
              ? "opacity-0 cursor-default"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <img
            src="/images/share/Arrow Right B.svg"
            alt="Right"
            className="h-[25.52px]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
