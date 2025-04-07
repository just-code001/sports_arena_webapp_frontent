import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFootballBall, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { MdSportsCricket, MdOutlineSportsTennis, MdGolfCourse } from "react-icons/md";
import { GiTennisCourt } from "react-icons/gi";
import { BsPersonFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Navbar.css"; // Import custom styles

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("token"); // Check if user is logged in
  const roleId = sessionStorage.getItem("roleId"); // Get user's role

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <MdSportsCricket size={30} className="me-2 text-warning" /> <span className="brand-text">Sports Arena</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="yellow" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2 12h12v-1H2v1zm0-4h12V7H2v1zm0-5v1h12V3H2z"/>
  </svg>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/cricket">
                <MdSportsCricket size={20} /> Cricket
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/football">
                <FaFootballBall size={20} /> Football
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/golf">
                <MdGolfCourse size={20} /> Golf
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/pickleball">
                <GiTennisCourt size={20} /> Pickleball
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle profile-btn" data-bs-toggle="dropdown">
                    <FaUserCircle size={20} /> Profile
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to={roleId === "1" ? "/admin/dashboard" : roleId === "2" ? "/provider/dashboard" : "/client/dashboard"}>
                        <BsPersonFill size={18} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FaSignOutAlt size={18} /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link login-btn" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link register-btn" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
