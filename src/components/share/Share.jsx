import React, { useRef } from "react";

export default function Share() {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const scrollAmount = 300; // kitna scroll karna hai per click
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    "/images/share/youtube B.svg",
    "/images/share/google B.svg",
    "/images/share/ztfr B.svg",
    "/images/share/nike B.svg",
    "/images/share/bbc B.svg",
  ];

  return (
    <div>
      {/* ICONS SCROLL ROW */}
      <div
        ref={scrollRef}
        className="flex gap-[28px] mx-[12px] mb-[28.5px] mt-[29px] overflow-x-auto scroll-smooth no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`icon-${index}`}
            className="h-[25.52px] flex-shrink-0"
          />
        ))}
      </div>

      {/* SCROLL ARROWS */}
      <div className="flex justify-between items-center mb-[28px] mx-[40px]">
        <img
          src="/images/share/Arrow Left B.svg"
          alt="Left arrow"
          className="h-[25.52px] cursor-pointer opacity-50"
          onClick={() => handleScroll("left")}
        />
        <img
          src="/images/share/Arrow Right B.svg"
          alt="Right arrow"
          className="h-[25.52px] cursor-pointer opacity-50"
          onClick={() => handleScroll("right")}
        />
      </div>
    </div>
  );
}


