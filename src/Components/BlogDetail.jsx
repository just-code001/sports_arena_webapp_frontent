import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa"

const BlogDetail = () => {
  const { blogId } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://localhost:7250/api/Tblblogs/${blogId}`)

        if (response.data.success) {
          setBlog(response.data.data)
        } else {
          setError("Failed to fetch blog details")
        }
      } catch (error) {
        console.error("Error fetching blog details:", error)
        if (error.response?.status === 404) {
          setError("Blog not found")
        } else {
          setError("Failed to load blog details. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlogDetails()
    }
  }, [blogId])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
            <p className="text-white mt-3">Loading blog details...</p>
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
            <Link to="/blogs" className="btn btn-outline-light">
              Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="sports-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="text-center">
            <h4 className="text-white fw-semibold mb-3">Blog Not Found</h4>
            <Link to="/blogs" className="btn btn-yellow">
              Back to Blogs
            </Link>
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
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: "#10b981" }}>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blogs" style={{ color: "#10b981" }}>
                  Blogs
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">{blog.title}</li>
            </ol>
          </nav>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card p-4 p-md-5">
                <div className="mb-4">
                  <Link to="/blogs" className="btn btn-outline-light btn-sm mb-3">
                    <FaArrowLeft className="me-2" /> Back to Blogs
                  </Link>
                  <h1 className="fw-bold mb-3" style={{ color: "#10b981" }}>
                    {blog.title}
                  </h1>

                  <div className="d-flex align-items-center mb-4 text-white-50">
                    <FaUser className="me-2" size={14} />
                    <span style={{ fontSize: "14px" }}>{blog.authorName || "Anonymous"}</span>
                    <span className="mx-2">•</span>
                    <FaCalendarAlt className="me-2" size={14} />
                    <span style={{ fontSize: "14px" }}>{formatDate(blog.publishDate)}</span>
                  </div>
                </div>

                <div className="blog-content text-white" style={{ lineHeight: "1.8" }}>
                  {/* Split content by paragraphs and render */}
                  {blog.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
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

export default BlogDetail
