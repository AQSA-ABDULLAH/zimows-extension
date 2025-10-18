import React, { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Share from "../share/Share";
import CardContent from "../card/CardContent";

function Home({ setActivePage }) {
  const [startCardContent, setStartCardContent] = useState(false);
  const [startShareAnimation, setStartShareAnimation] = useState(false);

  return (
    <div className="w-[510px]">
      <Header
        setActivePage={setActivePage}
        onHeaderAnimationComplete={() => setStartCardContent(true)}
      />
      <CardContent
        start={startCardContent}
        onAnimationComplete={() => setStartShareAnimation(true)} // 👈 yahan trigger hoga
      />
      <Share start={startShareAnimation} /> {/* 👈 pass as prop */}
      <Footer />
    </div>
  );
}

export default Home;



