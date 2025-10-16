import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Share from "../share/Share";
import CardContent from "../card/CardContent";

function Home() {
  return (
    <div>
      <div>
        <Header />
        <CardContent />
        <Share />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
