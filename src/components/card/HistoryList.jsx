import React, { useState } from "react";
import HistoryCard from "./HistoryCard";

const initialHistoryData = [
  {
    id: 1,
    icon: "images/card/logo/amex dls-logo-bluebox-solid.svg",
    shortUrl: "zimo.ws/OFBxVT",
    title: "Deadly fighting erupts between Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2025",
  },
  {
    id: 2,
    icon: "/images/card/logo/sky-news-logo-dark.svg",
    shortUrl: "zimo.ws/OFBxUT",
    title: "Some other news title goes here",
    fullUrl: "https://www.bbc.co.uk/news/articles/example",
    time: "12:45",
    date: "07 October 2025",
  },
  {
    id: 3,
    icon: "/images/card/logo/bbc-log.png",
    shortUrl: "zimo.ws/OFBxYU",
    title: "Deadladjhadg Hamas and Palestinian clan in Gaza",
    fullUrl: "https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo",
    time: "17:23",
    date: "06 October 2028",
  },
];


function HistoryList() {
  const [historyItems, setHistoryItems] = useState(initialHistoryData);

  // Yeh function card ko delete karega
  const handleDeleteItem = (idToDelete) => {
    // .filter() use karke us item ko hata dein jiski id match karti hai
    const updatedItems = historyItems.filter((item) => item.id !== idToDelete);
    setHistoryItems(updatedItems);
    console.log(`Item with id: ${idToDelete} deleted.`);
  };
  return (
    <div>
      {historyItems.map((item) => (
        <HistoryCard
          key={item.id}
          id={item.id} // <-- id pass karein
          icon={item.icon}
          shortUrl={item.shortUrl}
          title={item.title}
          fullUrl={item.fullUrl}
          time={item.time}
          date={item.date}
          onDelete={handleDeleteItem} // <-- delete function pass karein
        />
      ))}
    </div>
  );
}

export default HistoryList;
