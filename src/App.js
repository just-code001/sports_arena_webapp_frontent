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
import Home from './Components/Home';
import Providerdashboard from "./Components/Provider/Providerdashboard";
import Admin_sidemenu from "./Components/Admin/Admin_sidemenu";
import { getUserRole } from "./Auth/JwtUtils";
import Admin_main_sport_category from "./Components/Admin/Admin_main_sport_category";
import Admin_main_client from "./Components/Admin/Admin_main_client";
import Provider_home from "./Components/Provider/Provider_home";
import Provider_main_venue from "./Components/Provider/Provider_main_venue";
import Provider_main_venueslot from "./Components/Provider/Provider_main_venueslot";
import Games from "./Components/Games";
import Sportscard from "./Components/Sportscard";
import GameDetails from "./Components/GameDetails";
import Booking from "./Components/Booking";
import Payment from "./Components/Payment";
import Aboutus from "./Components/Aboutus";
import Admin_main_booked_venue from "./Components/Admin/Admin_main_booked_venue";
import Contact from "./Components/Contact";
import Admin_main_providers from "./Components/Admin/Admin_main_providers";
import Provider_main_change_password from "./Components/Provider/Provider_main_change_password";
import ResetPassword from "./Components/ResetPassword";
import Venues from "./Components/Venues";
import VenueDetail from "./Components/VenueDetail";
import VenueSlots from "./Components/VenueSlots";
import Mybookings from "./Components/Mybookings";
import Admin_main_blogs from "./Components/Admin/Admin_main_blogs";
import Admin_main_inquiries from "./Components/Admin/Admin_main_inquiries";
import Admin_main_reviews from "./Components/Admin/Admin_main_reviews";
import Provider_main_reviews from "./Components/Provider/Provider_main_reviews";
import BookingDetails from "./Components/BookingDetail";
import Provider_main_all_bookings from "./Components/Provider/Provider_main_all_bookings";
import Provider_main_payments from "./Components/Provider/Provider_main_payments";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const r = getUserRole();
    setRole(r);
  }, []);

  // const renderNavbar = () => {
  //   if (role === "admin" || role === "provider") return null;
  //   return <Navbar />;
  // };

  // useEffect(() => {
  //   const nav = document.querySelector(".navbar");
  //   if (nav) {
  //     const navHeight = nav.offsetHeight;
  //     document.body.style.paddingTop = `${navHeight}px`;
  //   }
  // }, []);

  return (
    <div
      className="App"
    >
      <Router>
      {/* {renderNavbar()} */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          // admin routes --------------------------------------------------
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
            path="/admin/all-providers"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_providers />
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
            path="/admin/all-bookings"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_booked_venue />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/all-blogs"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_blogs />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/all-inquiries"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_inquiries />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/all-reviews"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin_main_reviews />
              </PrivateRoute>
            }
          />

          // provider routes ---------------------------------------
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
          <Route
            path="/provider/venues-reviews"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_reviews />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/change-password"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_change_password />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/all-booking"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_all_bookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/payments"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <Provider_main_payments />
              </PrivateRoute>
            }
          />

          // user routes ---------------------------------------------------
          <Route
            path="venues"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Venues />
              </PrivateRoute>
            }
          />
          <Route
            path="venue-detail/:venueId"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <VenueDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="book/:venueId"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <VenueSlots />
              </PrivateRoute>
            }
          />
          <Route
            path="payment/:bookingId"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment/multiple/:bookingIds"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Mybookings/>
              </PrivateRoute>
            }
          />
          <Route
            path="/booking-details/:bookingId"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <BookingDetails/>
              </PrivateRoute>
            }
          />
          <Route
            path="about-us"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Aboutus />
              </PrivateRoute>
            }
          />
          <Route
            path="contact-us"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <Contact />
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
        {/* <Games/>
        <Sportscard/> */}
        {/* <GameDetails/> */}
        {/* <Booking/> */}
      </Router>
          {/* <Games/> */}
          {/* <Contact/>
          <Footer/>
          <FAQs/> */}
    </div>
  );

}

export default App;

