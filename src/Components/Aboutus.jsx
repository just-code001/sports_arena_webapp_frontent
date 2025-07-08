import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaUsers, FaTrophy, FaMapMarkerAlt, FaClock } from "react-icons/fa"
import InquiryForm from "./InquiryForm"

const AboutUs = () => {
  const stats = [
    { icon: <FaUsers />, number: "10,000+", label: "Happy Customers", color: "#10b981" },
    { icon: <FaTrophy />, number: "500+", label: "Sports Venues", color: "#f59e0b" },
    { icon: <FaMapMarkerAlt />, number: "50+", label: "Cities Covered", color: "#3b82f6" },
    { icon: <FaClock />, number: "24/7", label: "Customer Support", color: "#ef4444" },
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Former national cricket player with 15+ years in sports management",
    },
    {
      name: "Priya Sharma",
      position: "Head of Operations",
      image: "/placeholder.svg?height=200&width=200",
      description: "Sports facility management expert with MBA from IIM",
    },
    {
      name: "Amit Patel",
      position: "Technology Lead",
      image: "/placeholder.svg?height=200&width=200",
      description: "Full-stack developer passionate about sports and technology",
    },
  ]

  const values = [
    {
      title: "Quality",
      description: "We partner only with venues that meet our high standards for facilities and service.",
      color: "#10b981",
    },
    {
      title: "Accessibility",
      description: "Making sports accessible to everyone, regardless of skill level or background.",
      color: "#f59e0b",
    },
    {
      title: "Innovation",
      description: "Continuously improving our platform with the latest technology and user feedback.",
      color: "#3b82f6",
    },
    {
      title: "Community",
      description: "Building a strong sports community that supports and encourages each other.",
      color: "#ef4444",
    },
  ]

  return (
    <div className="sports-bg min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4" style={{ color: "#10b981" }}>
                About Sports Arena
              </h1>
              <p className="lead text-white mb-5" style={{ maxWidth: "750px", margin: "0 auto 2.5rem" }}>
                We're passionate about making sports accessible to everyone. Our platform connects sports enthusiasts
                with the best venues across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <div className="glass-card p-3">
                <img src="/placeholder.svg?height=400&width=600" alt="Our Story" className="w-100 rounded" />
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <h2 className="mb-4 fw-bold" style={{ color: "#10b981" }}>
                Our Story
              </h2>
              <p className="text-white mb-3" style={{ lineHeight: "1.6" }}>
                Sports Arena was founded in 2020 with a simple mission: to make sports venue booking as easy as ordering
                food online. We noticed that finding and booking quality sports facilities was a major pain point for
                sports enthusiasts across India.
              </p>
              <p className="text-white mb-3" style={{ lineHeight: "1.6" }}>
                Starting from Mumbai with just 10 cricket grounds, we've grown to become India's largest sports venue
                booking platform, serving over 10,000 customers across 50+ cities.
              </p>
              <p className="text-white" style={{ lineHeight: "1.6" }}>
                Today, we're proud to offer a diverse range of sports facilities including cricket grounds, football
                fields, tennis courts, golf courses, and much more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: "#10b981" }}>
                Our Impact
              </h2>
              <p className="text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                Numbers that showcase our commitment to the sports community
              </p>
            </div>
          </div>
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="glass-card p-4 text-center h-100">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "75px",
                      height: "75px",
                      background: stat.color,
                      color: "#fff",
                      fontSize: "1.6rem",
                      boxShadow: `0 8px 25px ${stat.color}40`,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontSize: "2.2rem" }}>
                    {stat.number}
                  </h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="glass-card p-4 h-100">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Our Mission
                </h3>
                <p className="text-white" style={{ lineHeight: "1.6" }}>
                  To democratize access to quality sports facilities across India by providing a seamless,
                  technology-driven platform that connects sports enthusiasts with the best venues in their city.
                </p>
                <p className="text-white" style={{ lineHeight: "1.6" }}>
                  We believe that everyone deserves access to quality sports infrastructure, regardless of their
                  location or background.
                </p>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="glass-card p-4 h-100">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Our Vision
                </h3>
                <p className="text-white" style={{ lineHeight: "1.6" }}>
                  To become the go-to platform for sports venue booking across Asia, fostering a healthier and more
                  active society through easy access to sports facilities.
                </p>
                <p className="text-white" style={{ lineHeight: "1.6" }}>
                  We envision a future where booking a sports venue is as simple as a few taps on your phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: "#10b981" }}>
                Meet Our Team
              </h2>
              <p className="text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                The passionate individuals behind Sports Arena
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            {team.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="glass-card p-4 text-center h-100">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    style={{ width: "130px", height: "130px", objectFit: "cover" }}
                  />
                  <h5 className="text-white mb-1 fw-semibold">{member.name}</h5>
                  <p className="mb-3" style={{ fontSize: "14px", color: "#f59e0b" }}>
                    {member.position}
                  </p>
                  <p className="text-white-50" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: "#10b981" }}>
                Our Values
              </h2>
              <p className="text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                The principles that guide everything we do
              </p>
            </div>
          </div>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="glass-card p-4 text-center h-100">
                  <div
                    className="rounded-circle mx-auto mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                      background: value.color,
                    }}
                  ></div>
                  <h5 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                    {value.title}
                  </h5>
                  <p className="text-white" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs
