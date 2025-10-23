import React, { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Share from "../share/Share";
import CardContent from "../card/CardContent";

function Home({ setActivePage }) {
  const [startCardContent, setStartCardContent] = useState(false);
  const [startShareAnimation, setStartShareAnimation] = useState(false);
  const [startFooterAnimation, setStartFooterAnimation] = useState(false);

  return (
    <div className="w-[510px] min-h-[500px]">
      <Header
        setActivePage={setActivePage}
        onHeaderAnimationComplete={() => setStartCardContent(true)}
      />
      <CardContent
        start={startCardContent}
        onAnimationComplete={() => setStartShareAnimation(true)}
      />
      <Share
        start={startShareAnimation}
        onAnimationComplete={() => setStartFooterAnimation(true)}
      />
      <Footer start={startFooterAnimation} />
    </div>
  );
}

export default Home;




