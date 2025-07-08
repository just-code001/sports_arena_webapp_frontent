"use client"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import p1 from './../Photos/pl2.png'

const HeroSection = () => {
  const [particles, setParticles] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 18; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 18 + 18,
          delay: Math.random() * 6,
        })
      }
      setParticles(newParticles)
    }

    createParticles()
  }, [])

  const handleVenue=()=>{
    navigate('/venues')
  }

  return (
    <section className="hero-section">
      {/* Vibrant Floating Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <h1 className="display-3 fw-bold mb-4" style={{ color: "#10b981", lineHeight: "1.2" }}>
              Find Your Perfect Sports Venue
            </h1>
            <p
              className="lead mb-5 text-white"
              style={{ fontSize: "1.3rem", maxWidth: "750px", margin: "0 auto 2.5rem" }}
            >
              Book premium sports facilities across India with ease. From cricket grounds to tennis courts, discover and
              reserve the perfect venue for your game.
            </p>
            {/* <div className="d-flex gap-4 justify-content-center flex-wrap mb-5">
              <button onClick={handleVenue} className="btn btn-yellow btn-lg px-5 py-3">
                Explore Venues
              </button>
              <Link to="/about-us" className="btn btn-outline-light btn-lg px-5 py-3">
                Learn More
              </Link>
            </div> */}

            {/* Stats Cards */}
            <div className="row mt-5 pt-4">
              <div className="col-md-3 col-6 mb-3">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-1" style={{ color: "#10b981", fontSize: "2.2rem" }}>
                    500+
                  </h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                    Premium Venues
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-1" style={{ color: "#f59e0b", fontSize: "2.2rem" }}>
                    10K+
                  </h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                    Happy Customers
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-1" style={{ color: "#3b82f6", fontSize: "2.2rem" }}>
                    50+
                  </h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                    Cities Covered
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-1" style={{ color: "#ef4444", fontSize: "2.2rem" }}>
                    24/7
                  </h3>
                  <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                    Support Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
