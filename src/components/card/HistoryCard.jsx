import React, { useState } from "react";
import { motion } from "framer-motion";

function HistoryCard({ icon, shortUrl, title, fullUrl, time, date, onDelete, id }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(id);
    } else {
      setConfirmDelete(true);
      // 5 sec baad confirmation auto cancel
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        opacity: { duration: 0.25 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        scale: { duration: 0.25 },
        layout: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 },
      }}
      className="flex items-center gap-[20px] ml-[10px] mb-[48px]"
    >
      <div>
        <img
          src="/images/card/WS Chrome Line.svg"
          alt="line"
          className="w-[1px] h-[195px]"
        />
      </div>

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1.2px] ml-[10px] leading-none">
        {/* Top Section */}
        <div className="flex items-center gap-[43px] h-[30px] mt-[5px]">
          <img src={icon} alt="Logo" className="h-[30px] w-[30px]" />
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-[14px]">
            {shortUrl}
          </a>
        </div>

        {/* Title */}
        <h3 className="tracking-[1.5px] leading-[18px]">{title}</h3>

        {/* Full Link */}
        <p
          className="break-all"
        >
          {fullUrl}
        </p>

        {/* Date & Time */}
        <div className="flex gap-[30px]">
          <span>{time}</span>
          <span>{date}</span>
        </div>

        {/* Action Icons */}
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
          <img
            src={
              confirmDelete
                ? "/images/card/Delete Icon Red.svg"
                : "/images/card/Delete Icon B.svg"
            }
            alt="delete"
            className={`h-[22px] cursor-pointer transition-all duration-300 ease-in-out transform ${
              confirmDelete ? "scale-110" : "scale-100"
            }`}
            onClick={handleDeleteClick}
          />
          <img
            src="/images/card/Counter - URL Clicks.svg"
            alt="counter click"
            className="h-[22px] cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default HistoryCard;

