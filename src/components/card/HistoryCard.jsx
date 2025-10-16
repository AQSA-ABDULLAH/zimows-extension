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

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1px] ml-[10px] leading-none">
        {/* Top Section */}
        <div className="flex items-center gap-[43px] h-[30px]">
          <img src={icon} alt="Logo" className="h-[30px] w-[30px]" />
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
        </div>

        {/* Title */}
        <h3 className="tracking-[1.8px] leading-[18px]">
          {title}
        </h3>

        {/* Full Link */}
        <a
        href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-[1.5px] break-all cursor-default"
        >
          {fullUrl}
        </a>

        {/* Date & Time */}
        <div className="flex gap-[30px] leading-[10px]">
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
            src="/images/card/Delete Icon B.svg"
            alt="delete"
            className="h-[22px] cursor-pointer"
          />
          <img
          src="/images/card/Counter - URL Clicks.svg"
          alt="counter click"
          className="h-[22px] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
