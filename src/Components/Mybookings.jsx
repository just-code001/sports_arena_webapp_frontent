"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
} from "react-icons/fa"
import { MdSportsCricket, MdSportsFootball, MdSportsTennis, MdGolfCourse } from "react-icons/md"
import Swal from "sweetalert2"
import BookingReceiptModal from "./BookingReceiptModal"

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const navigate = useNavigate()

  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [searchTerm, statusFilter, dateFilter, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to view your bookings")
        setLoading(false)
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblbookings/Client/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setBookings(response.data.data)
        setError(null)
      } else {
        setError("Failed to load bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      if (error.response?.status === 401) {
        setError("Please login to view your bookings")
      } else {
        setError("Failed to load bookings. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.venueName?.toLowerCase().includes(searchLower) ||
          booking.venueLocation?.toLowerCase().includes(searchLower) ||
          booking.categoryName?.toLowerCase().includes(searchLower),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.bookingStatus?.toLowerCase() === statusFilter.toLowerCase())
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()

      switch (dateFilter) {
        case "upcoming":
          filtered = filtered.filter((booking) => new Date(booking.date) >= today)
          break
        case "past":
          filtered = filtered.filter((booking) => new Date(booking.date) < today)
          break
        case "today":
          filtered = filtered.filter((booking) => new Date(booking.date).toDateString() === today.toDateString())
          break
      }
    }

    setFilteredBookings(filtered)
  }

  const getSportIcon = (categoryName) => {
    const category = categoryName?.toLowerCase() || ""
    if (category.includes("cricket")) {
      return <MdSportsCricket size={20} />
    } else if (category.includes("football")) {
      return <MdSportsFootball size={20} />
    } else if (category.includes("tennis")) {
      return <MdSportsTennis size={20} />
    } else if (category.includes("golf")) {
      return <MdGolfCourse size={20} />
    } else {
      return <MdSportsCricket size={20} />
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle className="text-success" />
      case "cancelled":
        return <FaTimesCircle className="text-danger" />
      case "pending":
        return <FaHourglassHalf className="text-warning" />
      default:
        return <FaHourglassHalf className="text-secondary" />
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
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  const handleCancelBooking = async (bookingId) => {
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

        // Refresh bookings
        fetchBookings()
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

  const handleDownloadReceipt = (booking) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}")
    const venueData = {
      name: booking.venueName,
      location: booking.venueLocation,
      capacity: booking.capacity || 50,
      image: booking.venueImage,
    }

    setSelectedBookingForReceipt({
      bookingData: booking,
      venueData: venueData,
      userData: userData,
    })
    setShowReceiptModal(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFilter("all")
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
            <p className="text-white mt-3">Loading your bookings...</p>
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
            <button className="btn btn-yellow me-2" onClick={fetchBookings}>
              Try Again
            </button>
            {error.includes("login") && (
              <button className="btn btn-outline-light" onClick={() => navigate("/login")}>
                Login
              </button>
            )}
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
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className="display-4 fw-bold mb-3" style={{ color: "#10b981" }}>
                My Bookings
              </h1>
              <p className="lead text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                Manage and track all your sports venue bookings
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="row mb-5">
            <div className="col-lg-10 mx-auto">
              <div className="glass-card p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="position-relative">
                      <FaSearch
                        className="position-absolute"
                        style={{
                          top: "50%",
                          left: "18px",
                          transform: "translateY(-50%)",
                          color: "#10b981",
                          fontSize: "14px",
                        }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search venues or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: "48px" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-light w-100" onClick={clearFilters} title="Clear Filters">
                      <FaFilter className="me-1" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {bookings.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-white-50 mb-0">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </p>
                  <Link to="/venues" className="btn btn-yellow btn-sm">
                    Book New Slot
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bookings List */}
          <div className="row">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.bookingId} className="col-lg-6 col-md-12 mb-4">
                  <div className="glass-card h-100">
                    <div className="card-body p-4">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <span className="me-2" style={{ color: "#10b981" }}>
                            {getSportIcon(booking.categoryName)}
                          </span>
                          <div>
                            <h5 className="text-white fw-semibold mb-1">{booking.venueName}</h5>
                            <small className="text-white-50">Booking #{booking.bookingId}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${getStatusBadge(booking.bookingStatus)} mb-2`}>
                            {booking.bookingStatus}
                          </span>
                          <div className="text-white-50 small">{formatDate(booking.bookingDate)}</div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="d-flex align-items-center mb-3 text-white-50">
                        <FaMapMarkerAlt className="me-2" size={14} />
                        <span style={{ fontSize: "14px" }}>{booking.venueLocation}</span>
                      </div>

                      {/* Date and Time */}
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2" style={{ color: "#10b981" }} size={14} />
                            <div>
                              <small className="text-white-50 d-block">Date</small>
                              <span className="text-white fw-semibold" style={{ fontSize: "14px" }}>
                                {formatDate(booking.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <FaClock className="me-2" style={{ color: "#10b981" }} size={14} />
                            <div>
                              <small className="text-white-50 d-block">Time</small>
                              <span className="text-white fw-semibold" style={{ fontSize: "14px" }}>
                                {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Payment Status */}
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <FaRupeeSign className="me-2" style={{ color: "#10b981" }} size={14} />
                            <div>
                              <small className="text-white-50 d-block">Amount</small>
                              <span className="text-white fw-bold" style={{ fontSize: "16px" }}>
                                ₹{booking.payableAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            {getStatusIcon(booking.paymentStatus || (booking.paymentPaid ? "Success" : "Pending"))}
                            <div className="ms-2">
                              <small className="text-white-50 d-block">Payment</small>
                              <span className="text-white fw-semibold" style={{ fontSize: "14px" }}>
                                {booking.paymentPaid ? "Paid" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mb-4">
                        <span
                          className="badge me-2"
                          style={{
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}
                        >
                          {booking.categoryName}
                        </span>
                        {booking.transactionId && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "rgba(59, 130, 246, 0.2)",
                              color: "#3b82f6",
                              fontSize: "11px",
                              fontWeight: "500",
                            }}
                          >
                            TXN: {booking.transactionId?.slice(-8)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-light btn-sm flex-fill"
                          onClick={() => navigate(`/booking-details/${booking.bookingId}`)}
                        >
                          <FaEye className="me-1" size={12} />
                          View Details
                        </button>

                        {booking.bookingStatus?.toLowerCase() === "pending" &&
                          !booking.paymentPaid &&
                          new Date(booking.date) > new Date() && (
                            <button
                              className="btn btn-yellow btn-sm"
                              onClick={() => navigate(`/payment/${booking.bookingId}`)}
                            >
                              Pay Now
                            </button>
                          )}

                        {booking.bookingStatus?.toLowerCase() !== "cancelled" &&
                          new Date(booking.date) > new Date() && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              Cancel
                            </button>
                          )}

                        {booking.paymentPaid && (
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => handleDownloadReceipt(booking)}
                          >
                            <FaDownload className="me-1" size={12} />
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No bookings found
              <div className="col-12">
                <div className="text-center py-5">
                  <div className="glass-card p-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <div className="mb-4">
                      <FaCalendarAlt size={64} className="text-white-50" />
                    </div>
                    <h4 className="text-white fw-semibold mb-3">
                      {bookings.length === 0 ? "No bookings yet" : "No bookings found"}
                    </h4>
                    <p className="text-white-50 mb-4">
                      {bookings.length === 0
                        ? "You haven't made any bookings yet. Start by exploring our venues!"
                        : "Try adjusting your search criteria or filters to find bookings."}
                    </p>
                    {bookings.length === 0 ? (
                      <Link to="/venues" className="btn btn-yellow">
                        Browse Venues
                      </Link>
                    ) : (
                      <button className="btn btn-yellow" onClick={clearFilters}>
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Receipt Modal */}
          {showReceiptModal && selectedBookingForReceipt && (
            <BookingReceiptModal
              show={showReceiptModal}
              onHide={() => setShowReceiptModal(false)}
              bookingData={selectedBookingForReceipt.bookingData}
              venueData={selectedBookingForReceipt.venueData}
              userData={selectedBookingForReceipt.userData}
              isMultiple={false}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MyBookings
