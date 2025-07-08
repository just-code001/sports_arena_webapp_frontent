"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaCalendarAlt, FaClock, FaRupeeSign, FaMapMarkerAlt, FaUsers, FaShoppingCart } from "react-icons/fa"
import { MdSportsCricket, MdSportsFootball, MdSportsTennis, MdGolfCourse } from "react-icons/md"
import Swal from "sweetalert2"
import axios from "axios"

const VenueSlots = () => {
  const { venueId } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [allSlots, setAllSlots] = useState([])
  const [filteredSlots, setFilteredSlots] = useState([])
  const [selectedSlots, setSelectedSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  // ✅ Generate available dates (next 7 days) regardless of slot availability
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }

    return dates
  }

  useEffect(() => {
    // ✅ Set default selected date to today
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)

    fetchVenueDetails()
  }, [venueId])

  // ✅ Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate, venueId])

  const fetchVenueDetails = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to view venue details")
        setLoading(false)
        return
      }

      const response = await axios.get(`https://localhost:7250/api/Tblvenues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const venueData = response.data.data
        setVenue({
          id: venueData.venueId,
          name: venueData.venuename,
          location: venueData.location,
          description: venueData.description,
          capacity: venueData.capacity,
          price: venueData.priceperhour,
          categoryId: venueData.categoryId,
          image: `https://localhost:7250/images/${venueData.venueImage}`,
        })
      }
    } catch (error) {
      console.error("Error fetching venue details:", error)
      setError("Failed to load venue details")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Modified to fetch slots for a specific date range around the selected date
  const fetchAvailableSlots = async (targetDate) => {
    try {
      setSlotsLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to view available slots")
        return
      }

      // ✅ Fetch slots for a wider range but focus on the selected date
      const fromDate = targetDate
      const toDate = targetDate // Fetch only for the selected date initially

      console.log("Fetching slots for date:", { fromDate, toDate, venueId })

      const response = await axios.get(
        `https://localhost:7250/api/Tblvenueslots/Client/slots-with-status/${venueId}?fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      console.log("API Response:", response.data)

      if (response.data.success) {
        const slotsData = response.data.data

        // ✅ FIX: Use lowercase property names from API response
        const transformedSlots = slotsData.map((slot) => ({
          slotId: slot.slotId, // Changed from slot.SlotId
          venueId: slot.venueId, // Changed from slot.VenueId
          date: slot.date, // Changed from slot.Date
          startTime: slot.startTime, // Changed from slot.StartTime
          endTime: slot.endTime, // Changed from slot.EndTime
          isBooked: slot.isBooked, // Changed from slot.IsBooked
          price: slot.price, // Changed from slot.Price
          status: slot.status, // Changed from slot.Status
          isBookable: slot.isBookable, // Changed from slot.IsBookable
        }))

        console.log("Transformed slots:", transformedSlots)

        // ✅ Filter slots for the selected date
        const slotsForDate = transformedSlots.filter((slot) => slot.date === targetDate)
        setFilteredSlots(slotsForDate)

        // ✅ Also update allSlots for other functionality
        setAllSlots(transformedSlots)
      } else {
        console.error("API returned success: false", response.data)
        setFilteredSlots([])
        // Don't set error here, just show "No slots available" message
      }
    } catch (error) {
      console.error("Error fetching available slots:", error)
      if (error.response?.status === 401) {
        setError("Please login to view available slots")
      } else if (error.response?.status === 404) {
        // Don't set error for 404, just show empty slots
        setFilteredSlots([])
      } else {
        setError(`Failed to load available slots: ${error.response?.data?.message || error.message}`)
      }
    } finally {
      setSlotsLoading(false)
    }
  }

  // ✅ Handle date selection and fetch slots for that date
  const handleDateSelection = (date) => {
    setSelectedDate(date)
    setSelectedSlots([]) // Clear selected slots when changing date
    // fetchAvailableSlots will be called by useEffect
  }

  const getSportIcon = (categoryId) => {
    switch (categoryId) {
      case 1:
        return <MdSportsCricket size={24} />
      case 2:
        return <MdSportsFootball size={24} />
      case 3:
        return <MdSportsTennis size={24} />
      case 4:
        return <MdGolfCourse size={24} />
      default:
        return <MdSportsCricket size={24} />
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
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  }

  const handleSlotSelection = (slot) => {
    if (slot.isBooked || !slot.isBookable) return

    if (multiSelectMode) {
      setSelectedSlots((prev) => {
        const isSelected = prev.find((s) => s.slotId === slot.slotId)
        if (isSelected) {
          return prev.filter((s) => s.slotId !== slot.slotId)
        } else {
          return [...prev, slot]
        }
      })
    } else {
      handleBookSingleSlot(slot)
    }
  }

  const handleBookSingleSlot = async (slot) => {
    const slotPrice = slot.price || venue.price

    const result = await Swal.fire({
      title: "Confirm Booking",
      html: `
        <div class="text-start">
          <p><strong>Venue:</strong> ${venue.name}</p>
          <p><strong>Date:</strong> ${formatDate(slot.date)}</p>
          <p><strong>Time:</strong> ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</p>
          <p><strong>Amount:</strong> ₹${slotPrice}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    const token = sessionStorage.getItem("token")

    try {
      Swal.fire({
        title: "Creating Booking...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await axios.post(
        "https://localhost:7250/api/Tblbookings",
        {
          slotId: slot.slotId,
          payableAmount: slotPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        const booking = response.data.data
        Swal.close()

        // Navigate to payment page for single booking
        navigate(`/payment/${booking.bookingId}`)
      } else {
        throw new Error(response.data.message || "Failed to create booking")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.response?.data?.message || error.message || "Failed to create booking. Please try again.",
        confirmButtonColor: "#10b981",
      })
    }
  }

  const handleBookMultipleSlots = async () => {
    if (selectedSlots.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Slots Selected",
        text: "Please select at least one slot to book.",
        confirmButtonColor: "#10b981",
      })
      return
    }

    const totalAmount = selectedSlots.reduce((sum, slot) => sum + (slot.price || venue.price), 0)

    const result = await Swal.fire({
      title: "Confirm Multiple Bookings",
      html: `
        <div class="text-start">
          <p><strong>Venue:</strong> ${venue.name}</p>
          <p><strong>Selected Slots:</strong> ${selectedSlots.length}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <hr>
          <div style="max-height: 200px; overflow-y: auto;">
            ${selectedSlots
              .map(
                (slot) => `
              <div class="mb-2">
                <strong>${formatDate(slot.date)}</strong> - ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)} (₹${slot.price || venue.price})
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    const token = sessionStorage.getItem("token")

    try {
      Swal.fire({
        title: "Creating Bookings...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await axios.post(
        "https://localhost:7250/api/Tblbookings/create-multiple",
        {
          slotIds: selectedSlots.map((slot) => slot.slotId),
          venueId: Number.parseInt(venueId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        if (response.data.bookings && Array.isArray(response.data.bookings) && response.data.bookings.length > 0) {
          const bookings = response.data.bookings
          const bookingIds = bookings.map((booking) => booking.bookingId).filter((id) => id)

          if (bookingIds.length === 0) {
            throw new Error("No valid booking IDs received from server")
          }

          Swal.close()

          const bookingIdsParam = bookingIds.join(",")
          navigate(`/payment/multiple/${bookingIdsParam}`)

          setSelectedSlots([])
          setMultiSelectMode(false)
        } else {
          throw new Error("No bookings were created")
        }
      } else {
        throw new Error(response.data.message || "Failed to create bookings")
      }
    } catch (error) {
      console.error("Error creating multiple bookings:", error)
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.response?.data?.message || error.message || "Failed to create bookings. Please try again.",
        confirmButtonColor: "#10b981",
      })
    }
  }

  const isSlotSelected = (slot) => {
    return selectedSlots.find((s) => s.slotId === slot.slotId) !== undefined
  }

  const toggleMultiSelectMode = () => {
    setMultiSelectMode(!multiSelectMode)
    setSelectedSlots([])
  }

  if (loading) {
    return (
      <div className="sports-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ color: "#10b981" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading venue details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sports-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="glass-card p-4" style={{ maxWidth: "400px" }}>
            <h4 className="text-white mb-3">Error</h4>
            <p className="text-white-50 mb-3">{error}</p>
            <button
              className="btn btn-yellow me-2"
              onClick={() => {
                setError(null)
                fetchVenueDetails()
                if (selectedDate) {
                  fetchAvailableSlots(selectedDate)
                }
              }}
            >
              Try Again
            </button>
            <Link to="/venues" className="btn btn-outline-light">
              Back to Venues
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="sports-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="glass-card p-4">
            <h4 className="text-white mb-3">Venue Not Found</h4>
            <Link to="/venues" className="btn btn-yellow">
              Back to Venues
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sports-bg min-vh-100">
      <Navbar />

      <section className="section-padding" style={{ paddingTop: "120px" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: "#10b981" }}>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/venues" style={{ color: "#10b981" }}>
                  Venues
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/venue-detail/${venue.id}`} style={{ color: "#10b981" }}>
                  {venue.name}
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">Book Slots</li>
            </ol>
          </nav>

          {/* Venue Header */}
          <div className="glass-card p-4 mb-5">
            <div className="row align-items-center">
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                  }}
                >
                  {getSportIcon(venue.categoryId)}
                </div>
              </div>
              <div className="col-md-7">
                <h1 className="h2 fw-bold mb-2" style={{ color: "#10b981" }}>
                  {venue.name}
                </h1>
                <div className="d-flex flex-wrap gap-3 text-white-50">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" size={14} />
                    <span style={{ fontSize: "14px" }}>{venue.location}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2" size={14} />
                    <span style={{ fontSize: "14px" }}>Capacity: {venue.capacity}</span>
                  </div>
                </div>
                <p className="text-white-50 mt-2 mb-0" style={{ fontSize: "14px" }}>
                  {venue.description}
                </p>
              </div>
              <div className="col-md-3 text-md-end">
                <div className="text-center text-md-end">
                  <div className="d-flex align-items-center justify-content-center justify-content-md-end mb-2">
                    <FaRupeeSign className="me-1" style={{ color: "#10b981" }} />
                    <span className="h3 text-white mb-0 fw-bold">₹{venue.price}</span>
                  </div>
                  <span className="text-white-50" style={{ fontSize: "14px" }}>
                    per hour
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Mode Toggle */}
          <div className="glass-card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1" style={{ color: "#10b981" }}>
                  Booking Mode
                </h5>
                <small className="text-white-50">
                  {multiSelectMode ? "Select multiple slots to book together" : "Click on a slot to book individually"}
                </small>
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`btn ${!multiSelectMode ? "btn-yellow" : "btn-outline-light"}`}
                  onClick={() => !multiSelectMode || toggleMultiSelectMode()}
                  style={{ fontSize: "14px" }}
                >
                  Single Booking
                </button>
                <button
                  className={`btn ${multiSelectMode ? "btn-yellow" : "btn-outline-light"}`}
                  onClick={toggleMultiSelectMode}
                  style={{ fontSize: "14px" }}
                >
                  Multi Booking
                </button>
              </div>
            </div>

            {multiSelectMode && selectedSlots.length > 0 && (
              <div className="mt-3 pt-3 border-top border-secondary">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white">
                      <FaShoppingCart className="me-2" />
                      {selectedSlots.length} slots selected
                    </span>
                    <span className="ms-3 text-white">
                      Total: ₹{selectedSlots.reduce((sum, slot) => sum + (slot.price || venue.price), 0)}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm" onClick={() => setSelectedSlots([])}>
                      Clear All
                    </button>
                    <button className="btn btn-yellow btn-sm" onClick={handleBookMultipleSlots}>
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ FIXED: Date Selection - Always show next 7 days */}
          <div className="glass-card p-4 mb-4">
            <h4 className="mb-3 fw-semibold d-flex align-items-center" style={{ color: "#10b981" }}>
              <FaCalendarAlt className="me-2" />
              Select Date
            </h4>
            <div className="row g-2">
              {getAvailableDates().map((date) => (
                <div key={date} className="col-auto">
                  <button
                    className={`btn ${selectedDate === date ? "btn-yellow" : "btn-outline-light"}`}
                    style={{ minWidth: "120px", fontSize: "14px" }}
                    onClick={() => handleDateSelection(date)}
                  >
                    <div className="fw-semibold">{formatDate(date)}</div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="glass-card p-4">
            <h4 className="mb-4 fw-semibold d-flex align-items-center" style={{ color: "#10b981" }}>
              <FaClock className="me-2" />
              Available Time Slots
              {selectedDate && (
                <span className="ms-2 badge bg-secondary" style={{ fontSize: "12px" }}>
                  {formatDate(selectedDate)}
                </span>
              )}
            </h4>

            {slotsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" style={{ color: "#10b981" }}>
                  <span className="visually-hidden">Loading slots...</span>
                </div>
                <p className="text-white-50 mt-3">Loading available slots...</p>
              </div>
            ) : selectedDate ? (
              filteredSlots.length > 0 ? (
                <div className="row g-3">
                  {filteredSlots.map((slot) => (
                    <div key={slot.slotId} className="col-lg-3 col-md-4 col-sm-6">
                      <div
                        className={`card h-100 ${
                          slot.isBooked || !slot.isBookable
                            ? "text-muted"
                            : isSlotSelected(slot)
                              ? "text-white border-warning"
                              : "text-white"
                        }`}
                        style={{
                          background:
                            slot.isBooked || !slot.isBookable
                              ? "rgba(255, 255, 255, 0.05)"
                              : isSlotSelected(slot)
                                ? "linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))"
                                : "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                          border:
                            slot.isBooked || !slot.isBookable
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : isSlotSelected(slot)
                                ? "2px solid #ffc107"
                                : "1px solid rgba(16, 185, 129, 0.3)",
                          transition: "all 0.3s ease",
                          cursor: slot.isBookable && !slot.isBooked ? "pointer" : "not-allowed",
                        }}
                        onClick={() => handleSlotSelection(slot)}
                      >
                        <div className="card-body text-center p-3">
                          <div className="fw-bold mb-2" style={{ fontSize: "16px" }}>
                            {formatTime(slot.startTime)}
                          </div>
                          <div className="text-white-50 mb-2" style={{ fontSize: "12px" }}>
                            to {formatTime(slot.endTime)}
                          </div>
                          <div className="mb-3">
                            {slot.isBooked ? (
                              <span className="badge bg-danger">Booked</span>
                            ) : !slot.isBookable ? (
                              <span className="badge bg-secondary">Past</span>
                            ) : (
                              <div className="fw-bold" style={{ color: "#10b981", fontSize: "18px" }}>
                                ₹{slot.price || venue.price}
                              </div>
                            )}
                          </div>
                          {multiSelectMode && slot.isBookable && !slot.isBooked && (
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                checked={isSlotSelected(slot)}
                                onChange={() => handleSlotSelection(slot)}
                                className="form-check-input"
                                style={{ transform: "scale(1.2)" }}
                              />
                            </div>
                          )}
                          <button
                            className={`btn w-100 ${
                              slot.isBooked || !slot.isBookable
                                ? "btn-secondary"
                                : multiSelectMode
                                  ? isSlotSelected(slot)
                                    ? "btn-warning"
                                    : "btn-outline-warning"
                                  : "btn-yellow"
                            }`}
                            disabled={slot.isBooked || !slot.isBookable}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSlotSelection(slot)
                            }}
                            style={{ fontSize: "14px" }}
                          >
                            {slot.isBooked
                              ? "Booked"
                              : !slot.isBookable
                                ? "Past"
                                : multiSelectMode
                                  ? isSlotSelected(slot)
                                    ? "Selected"
                                    : "Select"
                                  : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <FaClock size={48} className="text-white-50" />
                  </div>
                  <h5 className="text-white mb-2">No Available Slots</h5>
                  <p className="text-white-50 mb-3">No slots available for {formatDate(selectedDate)}</p>
                  <button className="btn btn-outline-light btn-sm" onClick={() => fetchAvailableSlots(selectedDate)}>
                    Refresh Slots
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <FaCalendarAlt size={48} className="text-white-50" />
                </div>
                <h5 className="text-white mb-2">Select a Date</h5>
                <p className="text-white-50">Please select a date to view available time slots</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default VenueSlots
