import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Share from "../share/Share";
import CardContent from "../card/CardContent";

function Home({ setActivePage }) {
  return (
    <div>
      <Header setActivePage={setActivePage} />
      <CardContent />
      <Share />
      <Footer />
    </div>
  );
}

export default Home;

