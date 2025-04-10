// HomePage.jsx (Main container combining all sections)
import React from "react";
import CarouselSection from "./CarouselSection";
import FeatureCards from "./FeatureCards";
import WebsiteDetails from "./WebsiteDetails";
import Achievements from "./Achievements";
import Counters from "./Counters";
import Footer from "./Footer";
import Slider from "./Slider";

const Home = () => {
  return (
    <div>
        <Slider/>
      <FeatureCards />
      <WebsiteDetails />
      <Achievements />
      <Counters />
      <Footer />
    </div>
  );
};

export default Home;