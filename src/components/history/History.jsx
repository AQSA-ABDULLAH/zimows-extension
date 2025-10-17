import React from "react";
import Footer from "../footer/Footer";
import HistoryList from "../card/HistoryList";

function History({ setActivePage }) {
  return (
    <div className="">
      {/* Logo ko clickable banaya */}
      <div className="fixed top-[40px] left-[11px] cursor-pointer">
        <img
          src="images/header/RECENT B.svg"
          alt="Zimo Logo"
          className="h-[67.72px]"
        />
      </div>

      <div className="w-full bg-white fixed flex justify-between items-center p-[40px]">
        <div onClick={() => setActivePage("home")}>
          <img
            src="images/header/ZIMO WS Duo Chrome B.svg"
            alt="Zimo Logo"
            className="h-[20px] "
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

      <div className="mt-[48px]">
        <HistoryList />
        <Footer />
      </div>
    </div>
  );
}

export default History;
