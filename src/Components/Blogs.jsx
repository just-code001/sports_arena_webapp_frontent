import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaCalendarAlt, FaUser, FaSearch, FaFilter, FaArrowRight } from "react-icons/fa"

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://localhost:7250/api/Tblblogs")

        if (response.data.success && response.data.data) {
          setBlogs(response.data.data)
          setFilteredBlogs(response.data.data)
          setError(null)
        } else {
          setError("No blogs data received from server")
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
        setError("Failed to load blogs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter blogs based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.authorName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredBlogs(filtered)
    } else {
      setFilteredBlogs(blogs)
    }
  }, [searchTerm, blogs])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ""
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const clearFilters = () => {
    setSearchTerm("")
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
            <p className="text-white mt-3">Loading blogs...</p>
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
                Sports Blog
              </h1>
              <p className="lead text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
                Stay updated with the latest news, tips, and stories from the sports world
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto">
              <div className="glass-card p-4">
                <div className="row g-3">
                  <div className="col-md-9">
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
                        placeholder="Search blogs by title, content, or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: "48px" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
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
          {blogs.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-white-50 mb-0">
                    Showing {filteredBlogs.length} of {blogs.length} blogs
                  </p>
                  {searchTerm && (
                    <button className="btn btn-outline-light btn-sm" onClick={clearFilters}>
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Blogs Grid */}
          <div className="row">
            {filteredBlogs.map((blog) => (
              <div key={blog.blogId} className="col-lg-4 col-md-6 mb-4">
                <div className="venue-card h-100">
                  <div className="card-body p-4 text-white">
                    <h5 className="card-title mb-3 fw-semibold">{blog.title}</h5>

                    <div className="d-flex align-items-center mb-3 text-white-50">
                      <FaUser className="me-2" size={14} />
                      <span style={{ fontSize: "14px" }}>{blog.authorName || "Anonymous"}</span>
                      <span className="mx-2">•</span>
                      <FaCalendarAlt className="me-2" size={14} />
                      <span style={{ fontSize: "14px" }}>{formatDate(blog.publishDate)}</span>
                    </div>

                    <p className="card-text text-white-50 mb-4" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {truncateContent(blog.content)}
                    </p>

                    <Link
                      to={`/blog/${blog.blogId}`}
                      className="btn"
                      style={{
                        fontSize: "14px",
                        border: "1px solid #10b981",
                        color: "#10b981",
                        background: "rgba(16, 185, 129, 0.15)",
                      }}
                    >
                      Read More <FaArrowRight className="ms-1" size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && !loading && (
            <div className="text-center py-5">
              <div className="glass-card p-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h4 className="text-white fw-semibold mb-3">
                  {blogs.length === 0 ? "No blogs available" : "No blogs found"}
                </h4>
                <p className="text-white-50 mb-4">
                  {blogs.length === 0
                    ? "No blogs are currently available. Please check back later."
                    : "Try adjusting your search criteria to find blogs."}
                </p>
                {blogs.length > 0 && (
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

export default Blogs
