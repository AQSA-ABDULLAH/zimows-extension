import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// --- ICONS CONFIGURATION (deduplicated & normalized automatically) ---
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

// ✅ Deduplicate + normalize platform names (case-insensitive)
const icons = Array.from(
  new Map(
    iconsList.map((icon) => [
      icon.platform.toLowerCase(),
      { ...icon, platform: icon.platform.toLowerCase() },
    ])
  ).values()
);

export default function Share({ start = false, onAnimationComplete }) {
  const scrollRef = useRef(null);
  const hasAnimated = useRef(false);

  const [visibleIcons, setVisibleIcons] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const shortUrl = "https://your-short-url.com"; // Replace dynamically as needed

  // --- SHARE HANDLER ---
  const handleShare = async (platform) => {
    const encodedUrl = encodeURIComponent(shortUrl);
    let shareUrl = "";

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(shortUrl);
          console.log("✅ URL copied to clipboard");
        } catch (err) {
          console.error("❌ Copy failed:", err);
        }
        return;

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
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=Share WS by ZIMO`;
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
      case "wechat":
        shareUrl = `https://www.wechat.com/`;
        break;
      case "weibo":
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}`;
        break;
      case "zimoji":
        shareUrl = `https://zimoji.org`;
        break;
      case "omn":
        shareUrl = `https://omnium.social/`;
        break;
      case "messenger":
        shareUrl = `https://www.messenger.com/`;
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

  // --- ICONS APPEAR SEQUENTIALLY ---
  useEffect(() => {
    if (!start || hasAnimated.current) return;

    hasAnimated.current = true;
    setVisibleIcons([]);
    setShowArrows(false);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= icons.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowArrows(true);
          onAnimationComplete?.();
        }, 600);
        return;
      }
      setVisibleIcons((prev) => [...prev, icons[i]]);
      i++;
    }, 120);

    return () => clearInterval(interval);
  }, [start, onAnimationComplete]);

  // --- RESET ON STOP ---
  useEffect(() => {
    if (!start) {
      setVisibleIcons([]);
      setShowArrows(false);
      hasAnimated.current = false;
    }
  }, [start]);

  // --- SCROLL BUTTON VISIBILITY ---
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [visibleIcons]);

  // --- SCROLL HANDLER ---
  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  // --- RENDER ---
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* ICONS ROW */}
      <div
        ref={scrollRef}
        className="flex gap-[25px] mx-[24px] mt-[29px] mb-[20px] overflow-x-auto scroll-smooth no-scrollbar"
      >
        {visibleIcons.map(({ src, platform }) => (
          <motion.img
            key={platform}
            src={src}
            alt={platform}
            onClick={() => handleShare(platform)}
            className="h-[25.52px] flex-shrink-0 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* SCROLL ARROWS BELOW ICONS */}
      {showArrows && (
        <div className="w-full flex justify-between items-center mb-[28.5px] px-[24px]">
          {/* LEFT ARROW */}
          <motion.img
            src="/images/share/Arrow Left B.svg"
            alt="Scroll left"
            className={`h-[25.52px] transition-opacity ${
              canScrollLeft
                ? "opacity-60 hover:opacity-100 cursor-pointer"
                : "opacity-0"
            }`}
            onClick={() => canScrollLeft && handleScroll("left")}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollLeft ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* RIGHT ARROW */}
          <motion.img
            src="/images/share/Arrow Right B.svg"
            alt="Scroll right"
            className={`h-[25.52px] transition-opacity ${
              canScrollRight
                ? "opacity-60 hover:opacity-100 cursor-pointer"
                : "opacity-0"
            }`}
            onClick={() => canScrollRight && handleScroll("right")}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollRight ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}
