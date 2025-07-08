import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa"
import Swal from "sweetalert2"

const InquiryForm = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Message",
        text: "Please enter your inquiry message",
        confirmButtonColor: "#10b981",
      })
      return
    }

    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Required",
          text: "Please login to submit an inquiry",
          confirmButtonColor: "#10b981",
        }).then(() => {
          navigate("/login")
        })
        return
      }

      const response = await axios.post(
        "https://localhost:7250/api/Tblinquiries",
        { message },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Inquiry Submitted",
          text: "Your inquiry has been submitted successfully. We'll get back to you soon!",
          confirmButtonColor: "#10b981",
        })
        setMessage("")
      } else {
        throw new Error(response.data.message || "Failed to submit inquiry")
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || error.message || "Failed to submit inquiry. Please try again.",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sports-bg min-vh-100">

      <section className="section-padding" style={{ paddingTop: "130px" }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className="display-4 fw-bold mb-3" style={{ color: "#10b981" }}>
                Contact Us
              </h1>
              <p className="lead text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                Have questions or need assistance? Send us an inquiry and we'll get back to you soon.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card p-4 p-md-5">
                <div className="row">
                  <div className="col-md-5 mb-4 mb-md-0">
                    <h4 className="fw-bold mb-4" style={{ color: "#10b981" }}>
                      Get In Touch
                    </h4>

                    <div className="d-flex align-items-start mb-4">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                          }}
                        >
                          <FaEnvelope />
                        </div>
                      </div>
                      <div>
                        <h6 className="text-white mb-1">Email Us</h6>
                        <p className="text-white-50 mb-0">support@sportsarena.com</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                          }}
                        >
                          <FaPhone />
                        </div>
                      </div>
                      <div>
                        <h6 className="text-white mb-1">Call Us</h6>
                        <p className="text-white-50 mb-0">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                          }}
                        >
                          <FaMapMarkerAlt />
                        </div>
                      </div>
                      <div>
                        <h6 className="text-white mb-1">Visit Us</h6>
                        <p className="text-white-50 mb-0">123 Sports Avenue, Mumbai, India</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-7">
                    <h4 className="fw-bold mb-4" style={{ color: "#10b981" }}>
                      Send an Inquiry
                    </h4>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="message" className="form-label text-white">
                          Your Message
                        </label>
                        <textarea
                          className="form-control"
                          id="message"
                          rows="6"
                          placeholder="Type your inquiry here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-yellow" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Send Inquiry
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InquiryForm
