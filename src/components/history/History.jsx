import React from "react";
import Footer from "../footer/Footer";
import HistoryList from "../card/HistoryList";

function History({ setActivePage }) {
  return (
    <div className="ultra-thin-scrollbar overflow-y-auto h-full">
      {/* Logo ko clickable banaya */}
      <div className="absolute top-0 left-0 cursor-pointer">
        <img
          src="images/header/RECENT B.svg"
          alt="Zimo Logo"
          className="h-[10px] w-[67.72px]"
        />
      </div>

      <div className="w-full flex justify-between items-center p-[40px]">
        <div onClick={() => setActivePage("home")}>
          <img
            src="images/header/ZIMO WS Duo Chrome B.svg"
            alt="Zimo Logo"
            className="h-[20px] cursor-pointer"
          />
        </div>
        <div className="flex gap-[40px]">
          <img
            src="images/header/Chrome Extension Icon.svg"
            alt="Chrome Extension Icon"
            className="h-[20px]"
          />
        </div>
      </div>

      <HistoryList />
      <Footer />
    </div>
  );
}

export default History;
