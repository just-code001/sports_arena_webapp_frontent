"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa"
import Swal from "sweetalert2"
import InquiryForm from "./InquiryForm"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Mock form submission
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting us. We will get back to you within 24 hours.",
      confirmButtonColor: "#22c55e",
      background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(5, 46, 22, 0.9))",
      color: "#fff",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      description: "Call us for immediate assistance",
      color: "#22c55e",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: ["info@sportsarena.com", "support@sportsarena.com"],
      description: "Send us your queries anytime",
      color: "#f97316",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      details: ["123 Sports Complex", "Andheri West, Mumbai - 400058"],
      description: "Visit our headquarters",
      color: "#eab308",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 8:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
      description: "We're here to help",
      color: "#84cc16",
    },
  ]

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", url: "#", color: "#1877f2" },
    { icon: <FaTwitter />, name: "Twitter", url: "#", color: "#1da1f2" },
    { icon: <FaInstagram />, name: "Instagram", url: "#", color: "#e4405f" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "#", color: "#0077b5" },
  ]

  return (
    <div className="sports-bg min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4" style={{ color: "#22c55e" }}>
                Contact Us
              </h1>
              <p className="lead text-white mb-5" style={{ maxWidth: "700px", margin: "0 auto 2rem" }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container">
          <div className="row mb-5">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="glass-card p-4 text-center h-100">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      background: info.color,
                      color: "#fff",
                      fontSize: "1.2rem",
                    }}
                  >
                    {info.icon}
                  </div>
                  <h5 className="text-white mb-3 fw-semibold">{info.title}</h5>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-white mb-1" style={{ fontSize: "14px" }}>
                      {detail}
                    </p>
                  ))}
                  <p className="text-white-50 mt-2" style={{ fontSize: "12px" }}>
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Additional Info */}
      <section className="section-padding" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
        <InquiryForm/>
      </section>
    </div>
  )
}

export default Contact
