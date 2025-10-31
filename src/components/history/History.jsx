import React, { useEffect } from "react";
import HistoryList from "../card/HistoryList";
import { useSelector } from "react-redux";

function History({ setActivePage }) {
  // ✅ Correct path to visitorId
  const visitorId = useSelector((state) => state.visitor.data?.visitor_id);

  useEffect(() => {
    console.log("Visitor ID initialized:", visitorId);
  }, [visitorId]);

  return (
    <div className="relative min-h-screen">
      {/* RECENT Header */}
      <div className="absolute z-[100] top-[40px] left-[11px] cursor-pointer">
        <img
          src="images/header/RECENT B.svg"
          alt="Recent"
          className="h-[67.72px]"
        />
      </div>

      {/* Top Bar */}
      <div className="w-[510px] flex justify-between items-center p-[40px]">
        <img
          src="images/header/ZIMO WS Duo Chrome B.svg"
          alt="Zimo Logo"
          className="h-[20px] cursor-pointer"
          onClick={() => setActivePage("home")}
        />
        <img
          src="images/header/Chrome Extension Icon.svg"
          alt="Chrome Extension Icon"
          className="h-[20px]"
        />
      </div>

      {/* Scrollable content */}
      <div className="mt-[48px]">
        <HistoryList visitorId={visitorId} />
      </div>

      {/* <div className="fixed bottom-0 left-0 w-full bg-white p-[10px] flex justify-center items-center z-[200]">
  © COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.
</div> */}
      <div className="w-full bg-white p-[10px] flex justify-center items-center z-[200]">
        © COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}

export default History;
