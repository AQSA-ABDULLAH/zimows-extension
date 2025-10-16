import React from "react";
import HistoryCard from "./HistoryCard";

const historyData = [
  {
    icon: "/images/card/logo/bbc-log.svg",
    shortUrl: "zimo.ws/OFBxVT",
    title: "Deadly fighting erupts between Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2025",
  },
  {
    icon: "/images/card/logo/sky-news-logo-dark.svg",
    shortUrl: "zimo.ws/OFBxUT",
    title: "Some other news title goes here",
    fullUrl: "https://www.bbc.co.uk/news/articles/example",
    time: "12:45",
    date: "07 October 2025",
  },
  {
    icon: "/images/card/logo/sky-news-logo-dark.svg",
    shortUrl: "zimo.ws/OFBxYU",
    title: "Deadladjhadg Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2028",
  },
];


function HistoryList() {
  return (
    <div>
      {historyData.map((item, index) => (
        <HistoryCard key={index} {...item} />
      ))}
    </div>
  );
}

export default HistoryList;
