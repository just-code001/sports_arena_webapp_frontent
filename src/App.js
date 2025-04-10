import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Admin_home from "./Components/Admin/Admin_home";
import PrivateRoute from "./Auth/PrivateRoute";
import './App.css';
// import Card from './Components/Card';
// import HomeNavbar from './Components/HomeNavbar';
import background from "./Photos/test4.jpg";
// import Slider from './Components/Slider';
// import ContactPage from './Components/Contact';
// import AboutPage from './Components/Aboutus';
import Home from './Components/Home';
import Providerdashboard from "./Components/Provider/Providerdashboard";
import Admin_sidemenu from "./Components/Admin/Admin_sidemenu";
import { getUserRole } from "./Auth/JwtUtils";
import Admin_main_sport_category from "./Components/Admin/Admin_main_sport_category";
import Admin_main_client from "./Components/Admin/Admin_main_client";
import Provider_home from "./Components/Provider/Provider_home";
import Provider_main_venue from "./Components/Provider/Provider_main_venue";
import Provider_main_venueslot from "./Components/Provider/Provider_main_venueslot";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const r = getUserRole();
    setRole(r);
  }, []);

  const renderNavbar = () => {
    if (role === "admin" || role === "provider") return null;
    return <Navbar />;
  };

  return (
    <div
      className="App"
    >
      <Router>
      {renderNavbar()}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_home />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/admin/sport-category"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_sport_category />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/all-clients"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_client />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_home />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/venues"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_venue />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/venues-slots"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_venueslot />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/user/dashboard"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          /> */}
        </Routes>

        {/* Optional Components */}
        {/* <Card />
        <Slider />
        <ContactPage />
        <AboutPage /> */}
      </Router>
    </div>
  );
}

export default App;

