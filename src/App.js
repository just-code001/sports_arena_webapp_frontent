import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Admin_home from "./Components/Admin/Admin_home";
import './App.css';
import Home from './Components/Home';
// import Card from './Components/Card';
import HomeNavbar from './Components/HomeNavbar';
import background from "./Photos/test4.jpg";
import Slider from './Components/Slider';
import ContactPage from './Components/Contact';
import AboutPage from './Components/Aboutus';
import Sportscard from "./Components/Sportscard";
import Games from "./Components/Games";
import GameDetails from "./Components/GameDetails";
import Booking from "./Components/Booking";
import FAQs from "./Components/FAQs";

function App() {
  return (
      <div className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
      >
    <Router>
  <HomeNavbar />
  {/* <Navbar /> */}
  <Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<Admin_home />} />
    <Route path="/about-us" element={<AboutPage />} />
  
  </Routes>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>

  <Sportscard/>
   <Games/>   
   <GameDetails/>
   <Booking/>
   <FAQs/>
  {/* <Home /> */}
  {/* <Slider /> */}
  {/* <ContactPage /> */}
</Router>

    </div>
  );
}

export default App;
