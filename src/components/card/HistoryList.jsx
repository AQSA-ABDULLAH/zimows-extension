import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HistoryCard from "./HistoryCard";

function HistoryList() {
  const [items, setItems] = useState([
  {
    id: 1,
    icon: "images/card/logo/amex dls-logo-bluebox-solid.svg",
    shortUrl: "zimo.ws/OFBxVT",
    title: "Deadly fighting erupts between Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2025",
    clickCounter: "20"
  },
  {
    id: 2,
    icon: "/images/card/logo/sky-news-logo-dark.svg",
    shortUrl: "zimo.ws/OFBxUT",
    title: "Some other news title goes here",
    fullUrl: "https://www.bbc.co.uk/news/articles/example",
    time: "12:45",
    date: "07 October 2025",
    clickCounter: "20"
  },
  {
    id: 3,
    icon: "/images/card/logo/bbc-log.png",
    shortUrl: "zimo.ws/OFBxYU",
    title: "Deadladjhadg Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2028",
    clickCounter: "20"
  },
 ]);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  return (
     <div>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <HistoryCard key={item.id} {...item} onDelete={handleDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default HistoryList;
