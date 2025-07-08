import { Link } from "react-router-dom"
import { FaPlay, FaArrowRight } from "react-icons/fa"

const WebsiteDetails = () => {
  return (
    <section className="section-padding" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4">
            <h2 className="display-5 fw-bold mb-4" style={{ color: "#10b981" }}>
              Book Premium Sports Venues
            </h2>
            <p className="text-white mb-3" style={{ fontSize: "16px", lineHeight: "1.6" }}>
              Sports Arena is India's leading sports venue booking platform, connecting sports enthusiasts with premium
              facilities across the country. Whether you're planning a casual game with friends or organizing a
              tournament, we have the perfect venue for you.
            </p>
            <p className="text-white-50 mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Our platform features state-of-the-art cricket grounds, football fields, tennis courts, golf courses, and
              much more. All venues are verified for quality and equipped with modern amenities.
            </p>

            {/* Features List */}
            <div className="mb-4">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: "8px", height: "8px", background: "#10b981" }}
                    ></div>
                    <span className="text-white" style={{ fontSize: "14px" }}>
                      500+ Premium Venues
                    </span>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: "8px", height: "8px", background: "#f59e0b" }}
                    ></div>
                    <span className="text-white" style={{ fontSize: "14px" }}>
                      Instant Booking
                    </span>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: "8px", height: "8px", background: "#3b82f6" }}
                    ></div>
                    <span className="text-white" style={{ fontSize: "14px" }}>
                      Secure Payments
                    </span>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: "8px", height: "8px", background: "#ef4444" }}
                    ></div>
                    <span className="text-white" style={{ fontSize: "14px" }}>
                      24/7 Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <Link to="/venues" className="btn btn-yellow d-flex align-items-center">
                Explore Venues
                <FaArrowRight className="ms-2" size={14} />
              </Link>
              <Link
                to="/about-us"
                className="btn d-flex align-items-center"
                style={{
                  border: "1px solid #10b981",
                  color: "#10b981",
                  background: "rgba(16, 185, 129, 0.15)",
                }}
              >
                <FaPlay className="me-2" size={12} />
                Learn More
              </Link>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="glass-card p-3">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Sports Venues"
                className="w-100 rounded"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebsiteDetails
