"use client"

import { FaSearch, FaCalendarCheck, FaShieldAlt, FaClock, FaStar, FaUsers } from "react-icons/fa"

const FeatureCards = () => {
  const features = [
    {
      icon: <FaSearch />,
      title: "Smart Search",
      description: "Find the perfect sports venue with our intelligent search and filtering system",
      color: "#10b981",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Instant Booking",
      description: "Book venues instantly with real-time availability and immediate confirmation",
      color: "#f59e0b",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Payment",
      description: "Safe and secure payments with multiple options and instant refunds",
      color: "#3b82f6",
    },
    {
      icon: <FaClock />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your booking needs",
      color: "#ef4444",
    },
    {
      icon: <FaStar />,
      title: "Premium Quality",
      description: "Only verified venues with top-notch facilities and excellent reviews",
      color: "#8b5cf6",
    },
    {
      icon: <FaUsers />,
      title: "Sports Community",
      description: "Connect with fellow sports enthusiasts and join exciting tournaments",
      color: "#06b6d4",
    },
  ]

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold mb-4" style={{ color: "#10b981" }}>
              Why Choose Sports Arena?
            </h2>
            <p className="lead text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
              Experience the future of sports venue booking with our comprehensive platform
            </p>
          </div>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="glass-card p-4 text-center h-100 floating" style={{ animationDelay: `${index * 0.15}s` }}>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "75px",
                    height: "75px",
                    background: feature.color,
                    fontSize: "1.6rem",
                    color: "#fff",
                    boxShadow: `0 10px 30px ${feature.color}50`,
                  }}
                >
                  {feature.icon}
                </div>
                <h5 className="text-white mb-3 fw-semibold">{feature.title}</h5>
                <p className="text-white-50 mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards
