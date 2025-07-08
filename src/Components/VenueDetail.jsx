"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import {
  FaMapMarkerAlt,
  FaStar,
  FaRupeeSign,
  FaClock,
  FaParking,
  FaWifi,
  FaRestroom,
  FaCheck,
  FaUsers,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa"
import { MdSportsCricket, MdSportsFootball, MdSportsTennis, MdGolfCourse } from "react-icons/md"
import axios from "axios"
import VenueReviews from "./VenueReviews"

const VenueDetail = () => {
  const { venueId } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    fetchVenueDetails()
  }, [venueId])

  const fetchVenueDetails = async () => {
    try {
      setLoading(true)
      setError(null)

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

        // Transform API data to match component structure
        const transformedVenue = {
          id: venueData.venueId,
          name: venueData.venuename,
          location: venueData.location,
          sport: getSportFromCategory(venueData.categoryId),
          rating: 4.5, // Default rating as API doesn't provide this
          reviews: 156, // Default reviews as API doesn't provide this
          price: venueData.priceperhour,
          images: [
            `https://localhost:7250/images/${venueData.venueImage}`,
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
          ],
          description: venueData.description,
          capacity: venueData.capacity,
          categoryId: venueData.categoryId,
          providerId: venueData.providerId,
          isActive: venueData.isActive,
          providerName: venueData.providerName || "Venue Provider",
          amenities: [
            { icon: <FaParking />, name: "Free Parking" },
            { icon: <FaWifi />, name: "Free WiFi" },
            { icon: <FaRestroom />, name: "Changing Rooms" },
            { icon: <FaClock />, name: "Available Daily" },
          ],
          features: [
            `Professional sports facility with modern standards`,
            "High-quality equipment and maintenance",
            `Spacious venue with capacity for ${venueData.capacity} people`,
            "Professional staff and support",
            "Equipment rental available",
            "Refreshment facilities on-site",
          ],
          timings: {
            weekdays: "9:00 AM - 11:00 PM",
            weekends: "9:00 AM - 11:00 PM",
          },
          contact: {
            phone: "+91 98765 43210", // Default as API doesn't provide this
            email: "booking@venue.com", // Default as API doesn't provide this
          },
          rules: [
            "Advance booking required",
            "No outside food and drinks allowed",
            "Proper sports attire mandatory",
            "Damage to property will be charged",
            "Smoking and alcohol prohibited",
            "Follow venue timings strictly",
            "Maintain cleanliness and hygiene",
          ],
        }

        setVenue(transformedVenue)
      } else {
        setError("Failed to fetch venue details")
      }
    } catch (error) {
      console.error("Error fetching venue details:", error)
      if (error.response?.status === 401) {
        setError("Please login to view venue details")
      } else if (error.response?.status === 404) {
        setError("Venue not found")
      } else {
        setError("Failed to load venue details. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getSportFromCategory = (categoryId) => {
    // Map category IDs to sports - adjust based on your actual category IDs
    const categoryMap = {
      1: "cricket",
      2: "football",
      3: "tennis",
      4: "golf",
      5: "badminton",
      6: "basketball",
    }
    return categoryMap[categoryId] || "cricket"
  }

  const getSportIcon = (sport) => {
    const sportLower = sport?.toLowerCase()
    switch (sportLower) {
      case "cricket":
        return <MdSportsCricket size={24} />
      case "football":
        return <MdSportsFootball size={24} />
      case "tennis":
        return <MdSportsTennis size={24} />
      case "golf":
        return <MdGolfCourse size={24} />
      default:
        return <MdSportsCricket size={24} />
    }
  }

  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg?height=400&width=600"
  }

  const handleBookNow = () => {
    navigate(`/book/${venueId}`)
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
            <button className="btn btn-yellow me-2" onClick={fetchVenueDetails}>
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
              <li className="breadcrumb-item active text-white">{venue.name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Image Gallery */}
            <div className="col-lg-8 mb-4">
              <div className="glass-card p-3">
                <div className="main-image mb-3">
                  <img
                    src={venue.images[activeImageIndex] || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-100 rounded"
                    style={{ height: "400px", objectFit: "cover" }}
                    onError={handleImageError}
                  />
                </div>
                <div className="row g-2">
                  {venue.images.map((image, index) => (
                    <div key={index} className="col-3">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${venue.name} ${index + 1}`}
                        className={`w-100 rounded cursor-pointer ${
                          activeImageIndex === index ? "border border-2" : ""
                        }`}
                        style={{
                          height: "80px",
                          objectFit: "cover",
                          cursor: "pointer",
                          borderColor: activeImageIndex === index ? "#10b981" : "transparent",
                        }}
                        onClick={() => setActiveImageIndex(index)}
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="col-lg-4 mb-4">
              <div className="glass-card p-4 sticky-top" style={{ top: "100px" }}>
                <div className="d-flex align-items-center mb-3">
                  <span className="me-2" style={{ color: "#10b981" }}>
                    {getSportIcon(venue.sport)}
                  </span>
                  <h4 className="text-white mb-0 fw-semibold">{venue.name}</h4>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaMapMarkerAlt className="me-2" size={16} style={{ color: "#10b981" }} />
                  <span className="text-white" style={{ fontSize: "14px" }}>
                    {venue.location}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaStar className="me-1" size={16} style={{ color: "#f59e0b" }} />
                  <span className="text-white me-2 fw-medium">{venue.rating}</span>
                  <span className="text-white-50" style={{ fontSize: "14px" }}>
                    ({venue.reviews} reviews)
                  </span>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <FaRupeeSign className="me-1" size={18} style={{ color: "#10b981" }} />
                  <span className="h4 text-white mb-0 fw-bold">₹{venue.price}</span>
                  <span className="text-white-50">/hour</span>
                </div>

                <div className="mb-4">
                  <h6 className="mb-2 fw-semibold" style={{ color: "#10b981" }}>
                    Venue Details
                  </h6>
                  <div className="text-white" style={{ fontSize: "14px" }}>
                    <div className="mb-1">
                      <FaUsers className="me-2" style={{ color: "#10b981" }} />
                      <strong>Capacity:</strong> {venue.capacity} people
                    </div>
                    <div className="mb-1">
                      <strong>Status:</strong>
                      <span className={`ms-2 badge ${venue.isActive ? "bg-success" : "bg-danger"}`}>
                        {venue.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mb-1">
                      <strong>Provider:</strong> {venue.providerName}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="mb-2 fw-semibold" style={{ color: "#10b981" }}>
                    Operating Hours
                  </h6>
                  <div className="text-white" style={{ fontSize: "14px" }}>
                    <div className="mb-1">
                      <strong>Weekdays:</strong> {venue.timings.weekdays}
                    </div>
                    <div>
                      <strong>Weekends:</strong> {venue.timings.weekends}
                    </div>
                  </div>
                </div>

                <button onClick={handleBookNow} className="btn btn-yellow w-100 mb-3 py-3" disabled={!venue.isActive}>
                  {venue.isActive ? "Book Now" : "Currently Unavailable"}
                </button>

                <div className="text-center">
                  <small className="text-white-50">
                    <FaClock className="me-1" />
                    Instant confirmation
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="row mt-5">
            <div className="col-lg-8">
              <div className="glass-card p-4 mb-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  About This Venue
                </h3>
                <p className="text-white" style={{ lineHeight: "1.6" }}>
                  {venue.description ||
                    "Experience world-class sports facilities at this premium venue. Our state-of-the-art facility offers the perfect environment for sports enthusiasts of all levels."}
                </p>
              </div>

              <div className="glass-card p-4 mb-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Features & Facilities
                </h3>
                <div className="row">
                  {venue.features.map((feature, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <FaCheck className="me-3 mt-1" size={14} style={{ color: "#10b981" }} />
                        <span className="text-white" style={{ fontSize: "14px" }}>
                          {feature}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 mb-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Amenities
                </h3>
                <div className="row">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="me-3" style={{ color: "#10b981" }}>
                          {amenity.icon}
                        </span>
                        <span className="text-white" style={{ fontSize: "14px" }}>
                          {amenity.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Rules & Regulations
                </h3>
                <ul className="text-white" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  {venue.rules.map((rule, index) => (
                    <li key={index} className="mb-2">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reviews Section */}
              <VenueReviews />
            </div>

            <div className="col-lg-4">
              <div className="glass-card p-4 mb-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Contact Information
                </h3>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="me-2" style={{ color: "#10b981" }} />
                    <strong className="text-white">Phone:</strong>
                  </div>
                  <div className="text-white-50" style={{ fontSize: "14px" }}>
                    {venue.contact.phone}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-2" style={{ color: "#10b981" }} />
                    <strong className="text-white">Email:</strong>
                  </div>
                  <div className="text-white-50" style={{ fontSize: "14px" }}>
                    {venue.contact.email}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="me-2" style={{ color: "#10b981" }} />
                    <strong className="text-white">Address:</strong>
                  </div>
                  <div className="text-white-50" style={{ fontSize: "14px" }}>
                    {venue.location}
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h3 className="mb-3 fw-semibold" style={{ color: "#10b981" }}>
                  Quick Actions
                </h3>
                <div className="d-grid gap-2">
                  <button onClick={handleBookNow} className="btn btn-yellow" disabled={!venue.isActive}>
                    Book This Venue
                  </button>
                  <Link to="/venues" className="btn btn-outline-light">
                    Browse Other Venues
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default VenueDetail
