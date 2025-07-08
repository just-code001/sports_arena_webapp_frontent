import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import {
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft,
  FaDownload,
  FaIdCard,
  FaCreditCard,
  FaReceipt,
} from "react-icons/fa"
import { MdSportsCricket, MdSportsFootball, MdSportsTennis, MdGolfCourse } from "react-icons/md"
import Swal from "sweetalert2"
import BookingReceiptModal from "./BookingReceiptModal"

const BookingDetails = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to view booking details")
        setLoading(false)
        return
      }

      const response = await axios.get(`https://localhost:7250/api/Tblbookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setBooking(response.data.data)
        setError(null)
      } else {
        setError("Failed to load booking details")
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
      if (error.response?.status === 401) {
        setError("Please login to view booking details")
      } else if (error.response?.status === 404) {
        setError("Booking not found")
      } else {
        setError("Failed to load booking details. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getSportIcon = (categoryName) => {
    const category = categoryName?.toLowerCase() || ""
    if (category.includes("cricket")) {
      return <MdSportsCricket size={24} />
    } else if (category.includes("football")) {
      return <MdSportsFootball size={24} />
    } else if (category.includes("tennis")) {
      return <MdSportsTennis size={24} />
    } else if (category.includes("golf")) {
      return <MdGolfCourse size={24} />
    } else {
      return <MdSportsCricket size={24} />
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle className="text-success" size={20} />
      case "cancelled":
        return <FaTimesCircle className="text-danger" size={20} />
      case "pending":
        return <FaHourglassHalf className="text-warning" size={20} />
      default:
        return <FaHourglassHalf className="text-secondary" size={20} />
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-success"
      case "cancelled":
        return "bg-danger"
      case "pending":
        return "bg-warning"
      default:
        return "bg-secondary"
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }
    return timeString.slice(0, 5)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleCancelBooking = async () => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "Keep Booking",
    })

    if (!result.isConfirmed) return

    try {
      const token = sessionStorage.getItem("token")

      Swal.fire({
        title: "Cancelling Booking...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await axios.post(
        `https://localhost:7250/api/Tblbookings/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "Your booking has been cancelled successfully.",
          confirmButtonColor: "#10b981",
        })

        // Refresh booking details
        fetchBookingDetails()
      } else {
        throw new Error(response.data.message || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: error.response?.data?.message || error.message || "Failed to cancel booking. Please try again.",
        confirmButtonColor: "#10b981",
      })
    }
  }

  const handleDownloadReceipt = () => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}")
    const venueData = {
      name: booking.venueName,
      location: booking.venueLocation,
      capacity: 50, // Default capacity
      image: "/placeholder.svg?height=200&width=300",
    }

    const bookingData = {
      bookingId: booking.bookingId,
      venueName: booking.venueName,
      venueLocation: booking.venueLocation,
      date: booking.date,
      slotStartTime: booking.slotStartTime,
      slotEndTime: booking.slotEndTime,
      payableAmount: booking.payableAmount,
      bookingStatus: booking.bookingStatus,
      paymentPaid: booking.paymentPaid,
      bookingDate: booking.bookingDate,
      createdAt: booking.createdAt,
    }

    setShowReceiptModal(true)
  }

  const canCancelBooking = () => {
    if (!booking) return false
    if (booking.bookingStatus?.toLowerCase() === "cancelled") return false
    if (booking.paymentPaid) return false // Can't cancel paid bookings easily

    // Check if booking is in the future
    const slotDate = new Date(booking.date)
    const now = new Date()
    return slotDate > now
  }

  const canPayNow = () => {
    if (!booking) return false
    if (booking.paymentPaid) return false
    if (booking.bookingStatus?.toLowerCase() !== "pending") return false

    // Check if booking is in the future
    const slotDate = new Date(booking.date)
    const now = new Date()
    return slotDate > now
  }

  if (loading) {
    return (
      <div className="sports-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="text-center">
            <div className="spinner-border" style={{ color: "#10b981" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="sports-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="text-center">
            <h4 className="text-white fw-semibold mb-3">Oops! Something went wrong</h4>
            <p className="text-white-50 mb-4">{error}</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-yellow" onClick={fetchBookingDetails}>
                Try Again
              </button>
              <button className="btn btn-outline-light" onClick={() => navigate("/my-bookings")}>
                Back to Bookings
              </button>
              {error.includes("login") && (
                <button className="btn btn-outline-light" onClick={() => navigate("/login")}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="sports-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="text-center">
            <h4 className="text-white fw-semibold mb-3">Booking Not Found</h4>
            <p className="text-white-50 mb-4">
              The booking you're looking for doesn't exist or you don't have access to it.
            </p>
            <button className="btn btn-yellow" onClick={() => navigate("/my-bookings")}>
              Back to My Bookings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="sports-bg min-vh-100">
      <Navbar />

      <section className="section-padding" style={{ paddingTop: "130px" }}>
        <div className="container">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex align-items-center mb-3">
                <button
                  className="btn btn-outline-light me-3"
                  onClick={() => navigate("/my-bookings")}
                  style={{ borderRadius: "50px", padding: "8px 12px" }}
                >
                  <FaArrowLeft />
                </button>
                <div>
                  <h1 className="display-5 fw-bold mb-1" style={{ color: "#10b981" }}>
                    Booking Details
                  </h1>
                  <p className="text-white-50 mb-0">Booking #{booking.bookingId}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Main Details */}
            <div className="col-lg-8 mb-4">
              <div className="glass-card p-4 mb-4">
                {/* Venue Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ color: "#10b981" }}>
                      {getSportIcon(booking.categoryName)}
                    </span>
                    <div>
                      <h3 className="text-white fw-bold mb-1">{booking.venueName}</h3>
                      <div className="d-flex align-items-center text-white-50">
                        <FaMapMarkerAlt className="me-2" size={14} />
                        <span>{booking.venueLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadge(booking.bookingStatus)} mb-2 px-3 py-2`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className="ms-2">{booking.bookingStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="row g-4">
                  {/* Date */}
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 rounded"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    >
                      <FaCalendarAlt className="me-3" style={{ color: "#10b981" }} size={20} />
                      <div>
                        <small className="text-white-50 d-block">Booking Date</small>
                        <span className="text-white fw-semibold">{formatDate(booking.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 rounded"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    >
                      <FaClock className="me-3" style={{ color: "#10b981" }} size={20} />
                      <div>
                        <small className="text-white-50 d-block">Time Slot</small>
                        <span className="text-white fw-semibold">
                          {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 rounded"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    >
                      <FaRupeeSign className="me-3" style={{ color: "#10b981" }} size={20} />
                      <div>
                        <small className="text-white-50 d-block">Total Amount</small>
                        <span className="text-white fw-bold" style={{ fontSize: "18px" }}>
                          ₹{booking.payableAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 rounded"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    >
                      <FaCreditCard className="me-3" style={{ color: "#10b981" }} size={20} />
                      <div>
                        <small className="text-white-50 d-block">Payment Status</small>
                        <span className={`fw-semibold ${booking.paymentPaid ? "text-success" : "text-warning"}`}>
                          {booking.paymentPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="glass-card p-4">
                <h5 className="text-white fw-semibold mb-4">
                  <FaIdCard className="me-2" style={{ color: "#10b981" }} />
                  Booking Timeline
                </h5>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker bg-success"></div>
                    <div className="timeline-content">
                      <h6 className="text-white mb-1">Booking Created</h6>
                      <p className="text-white-50 mb-0 small">{formatDateTime(booking.createdAt)}</p>
                    </div>
                  </div>

                  {booking.paymentPaid && (
                    <div className="timeline-item">
                      <div className="timeline-marker bg-success"></div>
                      <div className="timeline-content">
                        <h6 className="text-white mb-1">Payment Completed</h6>
                        <p className="text-white-50 mb-0 small">Payment processed successfully</p>
                      </div>
                    </div>
                  )}

                  {booking.bookingStatus?.toLowerCase() === "confirmed" && (
                    <div className="timeline-item">
                      <div className="timeline-marker bg-success"></div>
                      <div className="timeline-content">
                        <h6 className="text-white mb-1">Booking Confirmed</h6>
                        <p className="text-white-50 mb-0 small">Your booking has been confirmed</p>
                      </div>
                    </div>
                  )}

                  {booking.bookingStatus?.toLowerCase() === "cancelled" && (
                    <div className="timeline-item">
                      <div className="timeline-marker bg-danger"></div>
                      <div className="timeline-content">
                        <h6 className="text-white mb-1">Booking Cancelled</h6>
                        <p className="text-white-50 mb-0 small">
                          {booking.updatedAt ? formatDateTime(booking.updatedAt) : "Booking was cancelled"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Actions Card */}
              <div className="glass-card p-4 mb-4">
                <h5 className="text-white fw-semibold mb-4">Actions</h5>
                <div className="d-grid gap-2">
                  {canPayNow() && (
                    <button className="btn btn-yellow" onClick={() => navigate(`/payment/${booking.bookingId}`)}>
                      <FaCreditCard className="me-2" />
                      Pay Now
                    </button>
                  )}

                  {booking.paymentPaid && (
                    <button className="btn btn-outline-light" onClick={handleDownloadReceipt}>
                      <FaDownload className="me-2" />
                      Download Receipt
                    </button>
                  )}

                  {canCancelBooking() && (
                    <button className="btn btn-outline-danger" onClick={handleCancelBooking}>
                      <FaTimesCircle className="me-2" />
                      Cancel Booking
                    </button>
                  )}

                  <Link to="/venues" className="btn btn-outline-light">
                    <FaCalendarAlt className="me-2" />
                    Book Another Slot
                  </Link>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="glass-card p-4">
                <h5 className="text-white fw-semibold mb-4">
                  <FaReceipt className="me-2" style={{ color: "#10b981" }} />
                  Booking Summary
                </h5>
                <div className="booking-summary">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Booking ID:</span>
                    <span className="text-white fw-semibold">#{booking.bookingId}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Venue:</span>
                    <span className="text-white">{booking.venueName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Date:</span>
                    <span className="text-white">{formatDate(booking.date)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Time:</span>
                    <span className="text-white">
                      {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Status:</span>
                    <span className={`badge ${getStatusBadge(booking.bookingStatus)}`}>{booking.bookingStatus}</span>
                  </div>
                  <hr className="border-secondary" />
                  <div className="d-flex justify-content-between">
                    <span className="text-white fw-semibold">Total Amount:</span>
                    <span className="text-white fw-bold" style={{ fontSize: "18px" }}>
                      ₹{booking.payableAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Modal */}
          {showReceiptModal && (
            <BookingReceiptModal
              show={showReceiptModal}
              onHide={() => setShowReceiptModal(false)}
              bookingData={{
                bookingId: booking.bookingId,
                venueName: booking.venueName,
                venueLocation: booking.venueLocation,
                date: booking.date,
                slotStartTime: booking.slotStartTime,
                slotEndTime: booking.slotEndTime,
                payableAmount: booking.payableAmount,
                bookingStatus: booking.bookingStatus,
                paymentPaid: booking.paymentPaid,
                bookingDate: booking.bookingDate,
                createdAt: booking.createdAt,
              }}
              venueData={{
                name: booking.venueName,
                location: booking.venueLocation,
                capacity: 50,
                image: "/placeholder.svg?height=200&width=300",
              }}
              userData={JSON.parse(sessionStorage.getItem("user") || "{}")}
              isMultiple={false}
            />
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(16, 185, 129, 0.3);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -25px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(16, 185, 129, 0.3);
        }

        .timeline-content {
          padding-left: 15px;
        }

        .booking-summary {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default BookingDetails
