import React from 'react';
import Footer from "../footer/Footer";
import CardContent from "../card/CardContent";
import HistoryCard from '../card/HistoryCard';

function History() {
  return (
    <div className="">
      <div className="w-full flex justify-between items-center p-[40px]">
      <div>
        <img
          src="images/header/ZIMO WS Duo Chrome B.svg"
          alt="Zimo Logo"
          className="h-[20px]"
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
      <HistoryCard />
      <Footer />
    </div>
  );
}

export default History;
