"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa"
import { MdSportsCricket } from "react-icons/md"
import { AuthContext } from "../Auth/context/AuthContext"

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, userRole, logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg, #10b981, #f59e0b)",
              borderRadius: "12px",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
            }}
          >
            <MdSportsCricket size={24} />
          </div>
          <span className="brand-text">Sports Arena</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ color: "#10b981" }}
        >
          <FaBars size={20} />
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/">
                Home
              </Link>
            </li>

            {isAuthenticated && userRole === "client" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link custom-nav-link" to="/venues">
                    Venues
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-nav-link" to="/about-us">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-nav-link" to="/contact-us">
                    Contact
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated ? (
              <li className="nav-item dropdown ms-3">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    color: "#10b981",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <FaUserCircle size={18} className="me-2" />
                  Profile
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  style={{ background: "rgba(0, 0, 0, 0.9)", border: "1px solid rgba(16, 185, 129, 0.4)" }}
                >
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center"
                      onClick={handleLogout}
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                    >
                      <FaSignOutAlt size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                  <li>
                    <Link className="nav-link login-btn" to="/my-bookings">
                      My Bookings
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex gap-2 ms-3">
                <Link className="nav-link login-btn" to="/login">
                  Login
                </Link>
                <Link className="nav-link register-btn" to="/register">
                  Sign Up
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
