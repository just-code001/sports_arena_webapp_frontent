"use client"

import { Link } from "react-router-dom"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa"
import { MdSportsCricket } from "react-icons/md"

const Footer = () => {
  return (
    <footer className="text-white pt-5 pb-3" style={{ background: "rgba(0, 0, 0, 0.95)" }}>
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #10b981, #f59e0b)",
                  borderRadius: "14px",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                }}
              >
                <MdSportsCricket size={26} />
              </div>
              <h4 className="mb-0 fw-bold" style={{ color: "#10b981" }}>
                Sports Arena
              </h4>
            </div>
            <p className="text-white-50 mb-4" style={{ lineHeight: "1.6", fontSize: "14px" }}>
              India's leading sports venue booking platform. Connecting sports enthusiasts with premium facilities
              across the nation since 2020.
            </p>

            {/* Social Links */}
            <div className="d-flex gap-3">
              {[
                { icon: <FaFacebook />, color: "#1877f2" },
                { icon: <FaTwitter />, color: "#1da1f2" },
                { icon: <FaInstagram />, color: "#e4405f" },
                { icon: <FaLinkedin />, color: "#0077b5" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: social.color,
                    color: "#fff",
                    fontSize: "16px",
                    transition: "transform 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-3px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-4 fw-semibold" style={{ color: "#10b981" }}>
              Quick Links
            </h5>
            <ul className="list-unstyled">
              {[
                { to: "/", label: "Home" },
                { to: "/venues", label: "Venues" },
                { to: "/about-us", label: "About Us" },
                { to: "/contact-us", label: "Contact" },
              ].map((link, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={link.to}
                    className="text-white-50 text-decoration-none"
                    style={{
                      transition: "color 0.3s ease",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255, 255, 255, 0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sports */}
          <div className="col-lg-2 col-md-6 mb-4">
            {/* <h5 className="mb-4 fw-semibold" style={{ color: "#10b981" }}>
              Sports
            </h5>
            <ul className="list-unstyled">
              {["Cricket", "Football", "Tennis", "Golf", "Badminton", "Basketball"].map((sport, index) => (
                <li key={index} className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none"
                    style={{
                      transition: "color 0.3s ease",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255, 255, 255, 0.5)")}
                  >
                    {sport}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="mb-4 fw-semibold" style={{ color: "#10b981" }}>
              Contact Info
            </h5>

            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(16, 185, 129, 0.2)",
                  borderRadius: "10px",
                  color: "#10b981",
                }}
              >
                <FaPhone size={14} />
              </div>
              <div>
                <div className="text-white fw-medium" style={{ fontSize: "14px" }}>
                  +91 98765 43210
                </div>
                <div className="text-white-50" style={{ fontSize: "12px" }}>
                  24/7 Support
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(16, 185, 129, 0.2)",
                  borderRadius: "10px",
                  color: "#10b981",
                }}
              >
                <FaEnvelope size={14} />
              </div>
              <div>
                <div className="text-white fw-medium" style={{ fontSize: "14px" }}>
                  info@sportsarena.com
                </div>
                <div className="text-white-50" style={{ fontSize: "12px" }}>
                  Email Support
                </div>
              </div>
            </div>

            <div className="d-flex align-items-start">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(16, 185, 129, 0.2)",
                  borderRadius: "10px",
                  color: "#10b981",
                }}
              >
                <FaMapMarkerAlt size={14} />
              </div>
              <div>
                <div className="text-white fw-medium" style={{ fontSize: "14px" }}>
                  123 Sports Complex
                </div>
                <div className="text-white-50" style={{ fontSize: "12px" }}>
                  Andheri West, Mumbai - 400058
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-white-50 mb-0 d-flex align-items-center" style={{ fontSize: "14px" }}>
              © 2024 Sports Arena. Made with <FaHeart className="text-danger mx-2" /> in India
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-4 flex-wrap">
              {["Privacy Policy", "Terms of Service", "Help Center"].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-white-50 text-decoration-none"
                  style={{
                    transition: "color 0.3s ease",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255, 255, 255, 0.5)")}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
