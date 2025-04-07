import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Admin_home from "./Components/Admin/Admin_home";
import './App.css';
import Home from './Components/Home';
import  Card  from './Components/Card';
import HomeNavbar from './Components/HomeNavbar';
import background from "./Photos/test4.jpg";
import Slider from './Components/Slider';
import ContactPage from './Components/Contact';
import AboutPage from './Components/Aboutus';

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
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin_home />} />
      </Routes>
    </Router>

      <HomeNavbar/>
      <Home/>
      <Card/>
      <Slider/>
      <ContactPage/>
      <AboutPage/>
    </div>
  );
}

export default App;
