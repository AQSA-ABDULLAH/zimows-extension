import React from "react";

function HistoryCard({ icon, shortUrl, title, fullUrl, time, date }) {
  return (
    <div className="flex items-center gap-[20px] ml-[10px] mb-[48px]">
      <div>
        <img
          src="/images/card/WS Chrome Line.svg"
          alt="line"
          className="w-[1px] h-[195px]"
        />
      </div>

      <div className="flex flex-col text-[12px] tracking-[1px] ml-[10px] leading-none">
        {/* Top Section */}
        <div className="flex items-center gap-[43px]">
          <img src={icon} alt="Logo" className="h-[30px]" />
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#000] no-underline text-[12px] leading-none"
          >
            {shortUrl}
          </a>
        </div>

        {/* Title */}
        <h3 className="tracking-[1.8px] leading-[18px] mt-[19.8px] text-[12px]">
          {title}
        </h3>

        {/* Full Link */}
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-[1.5px] text-[#000000] break-all no-underline"
        >
          {fullUrl}
        </a>

        {/* Date & Time */}
        <div className="flex gap-[30px] mt-[18px] text-[12px] leading-[10px]">
          <span>{time}</span>
          <span>{date}</span>
        </div>

        {/* Action Icons */}
        <div className="flex mt-[20px] gap-[50px]">
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
            src="/images/card/Delete Icon B.svg"
            alt="delete"
            className="h-[22px] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
