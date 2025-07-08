"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaCheckCircle, FaCreditCard, FaCalendarAlt, FaClock, FaRupeeSign, FaArrowLeft } from "react-icons/fa"
import Swal from "sweetalert2"

const Payment = () => {
  const { bookingId, bookingIds } = useParams()
  const navigate = useNavigate()
  const [bookingDetails, setBookingDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [isMultipleBooking, setIsMultipleBooking] = useState(false)
  const [error, setError] = useState(null)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const fetchBookingDetails = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Required",
          text: "Please login to continue with payment",
          confirmButtonColor: "#10b981",
        }).then(() => {
          navigate("/login")
        })
        return
      }

      // Check if it's multiple bookings
      if (bookingIds) {
        setIsMultipleBooking(true)
        const ids = bookingIds.split(",").filter((id) => id && !isNaN(Number.parseInt(id)))

        if (ids.length === 0) {
          throw new Error("No valid booking IDs found")
        }

        // Fetch all booking details
        const bookingPromises = ids.map((id) =>
          axios.get(`https://localhost:7250/api/Tblbookings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        )

        const responses = await Promise.all(bookingPromises)
        const bookings = responses.map((response) => {
          if (response.data.success) {
            return response.data.data
          }
          throw new Error("Failed to fetch booking details")
        })

        // Calculate total amount
        const totalAmount = bookings.reduce((sum, booking) => sum + booking.payableAmount, 0)

        setBookingDetails({
          bookings: bookings,
          totalAmount: totalAmount,
          bookingIds: ids,
        })
      } else if (bookingId) {
        // Single booking
        setIsMultipleBooking(false)
        const response = await axios.get(`https://localhost:7250/api/Tblbookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          setBookingDetails(response.data.data)
        } else {
          throw new Error("Failed to fetch booking details")
        }
      } else {
        throw new Error("No booking ID provided")
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Failed to load booking details. Please try again.",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/my-bookings")
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bookingId || bookingIds) {
      fetchBookingDetails()
    } else {
      setError("No booking ID provided")
      setLoading(false)
    }
  }, [bookingId, bookingIds, navigate])

  const handlePayment = async () => {
    const res = await loadRazorpayScript()

    if (!res) {
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Razorpay SDK failed to load. Please check your internet connection.",
        confirmButtonColor: "#10b981",
      })
      return
    }

    const token = sessionStorage.getItem("token")
    const user = JSON.parse(sessionStorage.getItem("user") || "{}")

    const amount = isMultipleBooking ? bookingDetails.totalAmount : bookingDetails.payableAmount
    const amountInPaise = amount * 100

    const options = {
      key: "rzp_test_mKFFsoRNrHIPv0", // Replace with your Razorpay Key ID
      currency: "INR",
      amount: amountInPaise,
      name: "Sports Arena Booking",
      description: isMultipleBooking
        ? `Multiple slot bookings (${bookingDetails.bookings.length} slots)`
        : `Slot booking for ${new Date(bookingDetails.date).toDateString()}`,
      image: "/logo.png",
      handler: async (response) => {
        setProcessing(true)

        try {
          if (isMultipleBooking) {
            // Use the multiple payments endpoint for multiple bookings
            const paymentData = {
              bookingIds: bookingDetails.bookingIds.map((id) => Number.parseInt(id)),
              transactionId: response.razorpay_payment_id,
              totalAmount: Number.parseFloat(bookingDetails.totalAmount),
              paymentStatus: "Success",
              paymentMethod: "Razorpay",
              paymentGatewayResponse: JSON.stringify(response),
            }

            const paymentResponse = await axios.post("https://localhost:7250/api/Tblpayments/multiple", paymentData, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!paymentResponse.data.success) {
              throw new Error(paymentResponse.data.message || "Payment processing failed")
            }
          } else {
            // Single payment
            const paymentData = {
              bookingId: Number.parseInt(bookingId),
              transactionId: response.razorpay_payment_id,
              amount: Number.parseFloat(bookingDetails.payableAmount),
              paymentStatus: "Success",
              paymentMethod: "Razorpay",
              paymentGatewayResponse: JSON.stringify(response),
            }

            const paymentResponse = await axios.post("https://localhost:7250/api/Tblpayments", paymentData, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!paymentResponse.data.success) {
              throw new Error(paymentResponse.data.message || "Payment processing failed")
            }
          }

          setPaymentSuccess(true)

          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: isMultipleBooking
              ? `All ${bookingDetails.bookings.length} bookings have been confirmed.`
              : "Your booking has been confirmed.",
            confirmButtonColor: "#10b981",
            timer: 3000,
            timerProgressBar: true,
          })
        } catch (err) {
          console.error("Payment Saving Failed", err)
          Swal.fire({
            icon: "warning",
            title: "Payment Processed",
            text:
              err.response?.data?.message ||
              err.message ||
              "Payment was successful but there was an issue saving the record. Please contact support.",
            confirmButtonColor: "#10b981",
          })
        } finally {
          setProcessing(false)
        }
      },
      prefill: {
        name: user.name || "Customer",
        email: user.email || "customer@example.com",
        contact: user.phone || "9999999999",
      },
      notes: {
        booking_id: isMultipleBooking ? bookingDetails.bookingIds.join(",") : bookingId,
      },
      theme: {
        color: "#10b981",
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal closed")
        },
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
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

  if (loading) {
    return (
      <div className="sports-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="text-center">
            <div className="spinner-border" style={{ color: "#10b981" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="sports-bg min-vh-100">
      <Navbar />

      <section className="section-padding" style={{ paddingTop: "120px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/" style={{ color: "#10b981" }}>
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/my-bookings" style={{ color: "#10b981" }}>
                      My Bookings
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white">Payment</li>
                </ol>
              </nav>

              {paymentSuccess ? (
                // Success State
                <div className="glass-card p-5 text-center">
                  <div className="mb-4">
                    <FaCheckCircle size={64} style={{ color: "#10b981" }} />
                  </div>
                  <h2 className="text-white fw-bold mb-3">🎉 Payment Successful!</h2>
                  <p className="text-white-50 mb-4">
                    {isMultipleBooking
                      ? `All ${bookingDetails.bookings.length} bookings have been confirmed`
                      : "Your booking has been confirmed"}
                  </p>

                  <div className="glass-card p-4 mb-4" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                    {isMultipleBooking ? (
                      <div>
                        <h5 className="text-white mb-3">Booking Summary</h5>
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                          {bookingDetails.bookings.map((booking, index) => (
                            <div key={index} className="mb-3 pb-2 border-bottom border-secondary">
                              <div className="row text-center">
                                <div className="col-6">
                                  <FaCalendarAlt className="mb-1" style={{ color: "#10b981" }} />
                                  <div className="text-white fw-semibold small">
                                    {new Date(booking.date).toDateString()}
                                  </div>
                                </div>
                                <div className="col-6">
                                  <FaClock className="mb-1" style={{ color: "#10b981" }} />
                                  <div className="text-white fw-semibold small">
                                    {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-top border-secondary">
                          <div className="text-white fw-bold">Total Amount: ₹{bookingDetails.totalAmount}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="row text-center">
                        <div className="col-md-6 mb-3">
                          <FaCalendarAlt className="mb-2" style={{ color: "#10b981" }} />
                          <div className="text-white fw-semibold">{new Date(bookingDetails.date).toDateString()}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <FaClock className="mb-2" style={{ color: "#10b981" }} />
                          <div className="text-white fw-semibold">
                            {formatTime(bookingDetails.slotStartTime)} - {formatTime(bookingDetails.slotEndTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-white-50 mb-4">
                    Thank you for using Sports Arena! You will receive a confirmation email shortly.
                  </p>

                  <div className="d-flex gap-3 justify-content-center">
                    <Link to="/my-bookings" className="btn btn-yellow">
                      View My Bookings
                    </Link>
                    <Link to="/venues" className="btn btn-outline-light">
                      Book Another Slot
                    </Link>
                  </div>
                </div>
              ) : (
                // Payment Form
                <div className="glass-card p-5">
                  <div className="d-flex align-items-center mb-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-light me-3"
                      style={{ padding: "8px 12px" }}
                    >
                      <FaArrowLeft />
                    </button>
                    <h2 className="text-white fw-bold mb-0">
                      <FaCreditCard className="me-2" style={{ color: "#10b981" }} />
                      Payment Details
                    </h2>
                  </div>

                  {bookingDetails && (
                    <>
                      {/* Booking Summary */}
                      <div className="glass-card p-4 mb-4" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                        <h5 className="text-white fw-semibold mb-3">
                          {isMultipleBooking ? "Multiple Bookings Summary" : "Booking Summary"}
                        </h5>

                        {isMultipleBooking ? (
                          <div>
                            <div className="mb-3">
                              <span className="text-white-50">Number of Slots: </span>
                              <span className="text-white fw-semibold">{bookingDetails.bookings.length}</span>
                            </div>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }} className="mb-3">
                              {bookingDetails.bookings.map((booking, index) => (
                                <div
                                  key={index}
                                  className="mb-2 p-2 rounded"
                                  style={{ background: "rgba(16, 185, 129, 0.1)" }}
                                >
                                  <div className="row">
                                    <div className="col-6">
                                      <small className="text-white-50 d-block">Date</small>
                                      <span className="text-white fw-semibold small">
                                        {new Date(booking.date).toDateString()}
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-white-50 d-block">Time</small>
                                      <span className="text-white fw-semibold small">
                                        {formatTime(booking.slotStartTime)} - {formatTime(booking.slotEndTime)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2" style={{ color: "#10b981" }} />
                                <div>
                                  <small className="text-white-50 d-block">Date</small>
                                  <span className="text-white fw-semibold">
                                    {new Date(bookingDetails.date).toDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 mb-3">
                              <div className="d-flex align-items-center">
                                <FaClock className="me-2" style={{ color: "#10b981" }} />
                                <div>
                                  <small className="text-white-50 d-block">Time</small>
                                  <span className="text-white fw-semibold">
                                    {formatTime(bookingDetails.slotStartTime)} -{" "}
                                    {formatTime(bookingDetails.slotEndTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <hr className="border-secondary my-3" />

                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-white-50">Total Amount:</span>
                          <div className="d-flex align-items-center">
                            <FaRupeeSign className="me-1" style={{ color: "#10b981" }} />
                            <span className="text-white fw-bold h4 mb-0">
                              ₹{isMultipleBooking ? bookingDetails.totalAmount : bookingDetails.payableAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <div className="text-center">
                        <button
                          className="btn btn-yellow btn-lg px-5"
                          onClick={handlePayment}
                          disabled={processing}
                          style={{ minWidth: "200px" }}
                        >
                          {processing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaCreditCard className="me-2" />
                              Pay ₹{isMultipleBooking ? bookingDetails.totalAmount : bookingDetails.payableAmount}
                            </>
                          )}
                        </button>

                        <div className="mt-3">
                          <small className="text-white-50">🔒 Secure payment powered by Razorpay</small>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Payment
