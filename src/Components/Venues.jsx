"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaMapMarkerAlt, FaStar, FaRupeeSign, FaSearch, FaUsers, FaFilter } from "react-icons/fa"
import { MdSportsCricket, MdSportsFootball, MdSportsTennis, MdGolfCourse } from "react-icons/md"

const Venues = () => {
  const [venues, setVenues] = useState([])
  const [filteredVenues, setFilteredVenues] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true)
        const token = sessionStorage.getItem("token")
        if (!token) {
          setError("Please login to view venues")
          setLoading(false)
          return
        }

        const response = await axios.get("https://localhost:7250/api/Tblvenues/Client/GetAllActiveVenues", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success && response.data.data) {
          // Transform API data to match component structure
          const transformedVenues = response.data.data.map((venue) => ({
            id: venue.venueId,
            name: venue.venuename || "Unnamed Venue",
            location: venue.location || "Location not specified",
            sport: venue.categoryName?.toLowerCase() || "general",
            rating: 4.5, // Default rating since not provided by API
            price: venue.priceperhour || 0,
            image: venue.venueImage
              ? `https://localhost:7250/images/${venue.venueImage}`
              : "/placeholder.svg?height=200&width=300",
            amenities: ["Professional Grade", "Parking", "Changing Rooms"], // Default amenities
            description: venue.description || "Professional sports facility with modern amenities",
            capacity: venue.capacity || 0,
            providerName: venue.providerName || "Venue Provider",
            categoryName: venue.categoryName || "General",
            venueId: venue.venueId,
          }))

          setVenues(transformedVenues)
          setFilteredVenues(transformedVenues) // Set both immediately like your working code
          setError(null)
        } else {
          setError("No venues data received from server")
        }
      } catch (error) {
        console.error("Error fetching venues:", error)
        if (error.response?.status === 401) {
          setError("Please login to view venues")
        } else {
          setError("Failed to load venues. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  // Filter venues based on search, sport, and price - keeping your working logic
  useEffect(() => {
    let filtered = venues

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.providerName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sport filter
    if (selectedSport !== "all") {
      filtered = filtered.filter(
        (venue) =>
          venue.sport === selectedSport || venue.categoryName?.toLowerCase().includes(selectedSport.toLowerCase()),
      )
    }

    // Price filter
    if (priceRange !== "all") {
      filtered = filtered.filter((venue) => {
        const price = venue.price || 0
        switch (priceRange) {
          case "low":
            return price <= 500
          case "medium":
            return price > 500 && price <= 1500
          case "high":
            return price > 1500
          default:
            return true
        }
      })
    }

    setFilteredVenues(filtered)
  }, [searchTerm, selectedSport, priceRange, venues])

  const getSportIcon = (sport) => {
    const sportLower = sport?.toLowerCase()
    switch (sportLower) {
      case "cricket":
        return <MdSportsCricket size={20} />
      case "football":
        return <MdSportsFootball size={20} />
      case "tennis":
        return <MdSportsTennis size={20} />
      case "golf":
        return <MdGolfCourse size={20} />
      default:
        return <MdSportsCricket size={20} />
    }
  }

  const handleBookNow = (venueId) => {
    navigate(`/book/${venueId}`) // Updated to match your routing
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSport("all")
    setPriceRange("all")
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
            <p className="text-white mt-3">Loading venues...</p>
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
            <button className="btn btn-yellow me-2" onClick={() => window.location.reload()}>
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

      {/* Header Section */}
      <section className="section-padding" style={{ paddingTop: "130px" }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className="display-4 fw-bold mb-3" style={{ color: "#10b981" }}>
                Sports Venues
              </h1>
              <p className="lead text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                Discover and book the best sports venues in your city
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="row mb-5">
            <div className="col-lg-10 mx-auto">
              <div className="glass-card p-4">
                <div className="row g-3">
                  <div className="col-md-5">
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
                        placeholder="Search venues, locations, or providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: "48px" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                    >
                      <option value="all">All Sports</option>
                      <option value="cricket">Cricket</option>
                      <option value="football">Football</option>
                      <option value="tennis">Tennis</option>
                      <option value="golf">Golf</option>
                      <option value="badminton">Badminton</option>
                      <option value="basketball">Basketball</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select className="form-select" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                      <option value="all">All Prices</option>
                      <option value="low">₹0 - ₹500</option>
                      <option value="medium">₹500 - ₹1500</option>
                      <option value="high">₹1500+</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <div className="d-flex gap-2">
                      <button className="btn btn-yellow flex-fill">Search</button>
                      <button className="btn btn-outline-light" onClick={clearFilters} title="Clear Filters">
                        <FaFilter />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {venues.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-white-50 mb-0">
                    Showing {filteredVenues.length} of {venues.length} venues
                  </p>
                  {(searchTerm || selectedSport !== "all" || priceRange !== "all") && (
                    <button className="btn btn-outline-light btn-sm" onClick={clearFilters}>
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Venues Grid */}
          <div className="row">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="col-lg-4 col-md-6 mb-4">
                <div className="venue-card h-100">
                  <div className="position-relative">
                    <img
                      src={venue.image || "/placeholder.svg?height=200&width=300"}
                      alt={venue.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-success">
                        <FaStar className="me-1" size={12} />
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4 text-white">
                    <div className="d-flex align-items-center mb-3">
                      <span className="me-2" style={{ color: "#10b981" }}>
                        {getSportIcon(venue.sport)}
                      </span>
                      <h5 className="card-title mb-0 fw-semibold">{venue.name}</h5>
                    </div>

                    <div className="d-flex align-items-center mb-2 text-white-50">
                      <FaMapMarkerAlt className="me-2" size={14} />
                      <span style={{ fontSize: "14px" }}>{venue.location}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2 text-white-50">
                      <span className="me-2" style={{ fontSize: "14px" }}>
                        🏷️
                      </span>
                      <span style={{ fontSize: "14px" }}>{venue.categoryName}</span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <FaStar className="me-1" size={14} style={{ color: "#f59e0b" }} />
                      <span className="me-3 fw-medium" style={{ fontSize: "14px" }}>
                        {venue.rating}
                      </span>
                      <FaUsers className="me-1" size={14} style={{ color: "#3b82f6" }} />
                      <span className="me-3 fw-medium" style={{ fontSize: "14px" }}>
                        {venue.capacity}
                      </span>
                      <FaRupeeSign className="me-1" size={14} style={{ color: "#10b981" }} />
                      <span className="fw-semibold" style={{ fontSize: "14px" }}>
                        ₹{venue.price}/hour
                      </span>
                    </div>

                    <p className="card-text text-white-50 mb-3" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {venue.description?.length > 100
                        ? `${venue.description.substring(0, 100)}...`
                        : venue.description}
                    </p>

                    <div className="mb-3">
                      <span className="text-white-50" style={{ fontSize: "12px" }}>
                        Provider: {venue.providerName}
                      </span>
                    </div>

                    <div className="mb-4">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="badge me-2 mb-1"
                          style={{
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/venue-detail/${venue.id}`}
                        className="btn flex-fill"
                        style={{
                          fontSize: "14px",
                          border: "1px solid #10b981",
                          color: "#10b981",
                          background: "rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBookNow(venue.id)}
                        className="btn btn-yellow flex-fill"
                        style={{ fontSize: "14px" }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && !loading && (
            <div className="text-center py-5">
              <div className="glass-card p-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h4 className="text-white fw-semibold mb-3">
                  {venues.length === 0 ? "No venues available" : "No venues found"}
                </h4>
                <p className="text-white-50 mb-4">
                  {venues.length === 0
                    ? "No venues are currently available. Please check back later."
                    : "Try adjusting your search criteria or filters to find venues."}
                </p>
                {venues.length > 0 && (
                  <button className="btn btn-yellow" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Venues
