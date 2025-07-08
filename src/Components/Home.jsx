import Navbar from "./Navbar"
import HeroSection from "./HeroSection"
import FeatureCards from "./FeatureCards"
import WebsiteDetails from "./WebsiteDetails"
import Achievements from "./Achievements"
import Counters from "./Counters"
import Footer from "./Footer"

const Home = () => {
  return (
    <div className="sports-bg">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <WebsiteDetails />
      <Achievements />
      <Counters />
      <Footer />
    </div>
  )
}

export default Home
