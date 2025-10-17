import React from "react";
import Footer from "../footer/Footer";
import HistoryList from "../card/HistoryList";

function History({ setActivePage }) {
  return (
    <div className="relative min-h-screen">
      
        
        {/* RECENT wala logo ab header ke andar hai */}
        <div className="absolute z-[100] top-[40px] left-[11px] cursor-pointer">
          <img
            src="images/header/RECENT B.svg"
            alt="Zimo Logo"
            className="h-[67.72px]"
          />
        </div>

        {/* Aap ka baqi header ka content */}
        <div className="w-[510px] flex justify-between items-center p-[40px] mt-[200px]">
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
        <HistoryList />
        <Footer />
      </div>
    </div>
  );
}

export default History;