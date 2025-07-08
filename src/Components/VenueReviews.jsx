import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { FaStar, FaUser, FaCalendarAlt } from "react-icons/fa"
import Swal from "sweetalert2"

const VenueReviews = () => {
  const { venueId } = useParams()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  })

  useEffect(() => {
    if (venueId) {
      fetchReviews()
      checkCanReview()
    }
  }, [venueId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://localhost:7250/api/Tblreviews/venue/${venueId}`)

      if (response.data.success) {
        setReviews(response.data.data)

        // Use the averageRating and totalReviews from the API response if available
        const averageRating = response.data.averageRating || 0
        const totalReviews = response.data.totalReviews || response.data.data.length

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        response.data.data.forEach((review) => {
          if (distribution[review.rating] !== undefined) {
            distribution[review.rating]++
          }
        })

        setStats({
          averageRating,
          totalReviews,
          ratingDistribution: distribution,
        })

        setError(null)
      } else {
        setError("Failed to fetch reviews")
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setError("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  const checkCanReview = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        setCanReview(false)
        return
      }

      // Since the can-review endpoint might not exist yet, let's handle it differently
      try {
        const response = await axios.get(`https://localhost:7250/api/Tblreviews/can-review/${venueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setCanReview(response.data.canReview)
      } catch (error) {
        // If the endpoint doesn't exist, let's assume the user can review
        // We'll let the backend handle the validation when they submit
        console.log("Can-review endpoint not available, defaulting to true")
        setCanReview(true)
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error)
      setCanReview(false)
    }
  }

  const handleRatingChange = (rating) => {
    setUserReview({ ...userReview, rating })
  }

  const handleCommentChange = (e) => {
    setUserReview({ ...userReview, comment: e.target.value })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (userReview.rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Rating Required",
        text: "Please select a rating before submitting",
        confirmButtonColor: "#10b981",
      })
      return
    }

    try {
      setSubmitting(true)
      const token = sessionStorage.getItem("token")

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Required",
          text: "Please login to submit a review",
          confirmButtonColor: "#10b981",
        })
        return
      }

      const response = await axios.post(
        "https://localhost:7250/api/Tblreviews",
        {
          venueId: Number.parseInt(venueId),
          rating: userReview.rating,
          comment: userReview.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted",
          text: "Your review has been submitted successfully!",
          confirmButtonColor: "#10b981",
        })
        setUserReview({ rating: 0, comment: "" })
        fetchReviews()
        setCanReview(false)
      } else {
        throw new Error(response.data.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || error.message || "Failed to submit review. Please try again.",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          size={16}
          style={{
            color: i < rating ? "#f59e0b" : "#4b5563",
            marginRight: "2px",
          }}
        />
      ))
  }

  const renderRatingBar = (rating, count) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

    return (
      <div className="d-flex align-items-center mb-1">
        <div className="me-2" style={{ width: "40px" }}>
          {rating} <FaStar size={10} style={{ color: "#f59e0b" }} />
        </div>
        <div className="progress flex-grow-1" style={{ height: "8px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${percentage}%`, backgroundColor: "#10b981" }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="ms-2" style={{ width: "30px", fontSize: "14px" }}>
          {count}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 mt-4">
      <h3 className="mb-4 fw-semibold" style={{ color: "#10b981" }}>
        Reviews & Ratings
      </h3>

      {/* Rating Summary */}
      <div className="row mb-4">
        <div className="col-md-4 text-center mb-4 mb-md-0">
          <div className="glass-card p-3" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <div className="display-4 fw-bold text-white mb-2">{stats.averageRating}</div>
            <div className="mb-2">{renderStars(Math.round(stats.averageRating))}</div>
            <div className="text-white-50">Based on {stats.totalReviews} reviews</div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="glass-card p-3">
            <h5 className="text-white mb-3">Rating Distribution</h5>
            {Object.entries(stats.ratingDistribution)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating}>{renderRatingBar(rating, count)}</div>
              ))}
          </div>
        </div>
      </div>

      {/* Write a Review */}
      {canReview && (
        <div className="glass-card p-4 mb-4">
          <h5 className="text-white mb-3">Write a Review</h5>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label text-white">Your Rating</label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    style={{
                      color: star <= userReview.rating ? "#f59e0b" : "#4b5563",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label text-white">
                Your Review
              </label>
              <textarea
                className="form-control"
                id="comment"
                rows="4"
                placeholder="Share your experience with this venue..."
                value={userReview.comment}
                onChange={handleCommentChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-yellow" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: "#10b981" }} role="status">
            <span className="visually-hidden">Loading reviews...</span>
          </div>
          <p className="text-white-50 mt-2">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-white-50">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-white-50">No reviews yet. Be the first to review this venue!</p>
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.reviewId} className="glass-card p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                    }}
                  >
                    <FaUser />
                  </div>
                  <div>
                    <h6 className="text-white mb-0">{review.userName || "Anonymous"}</h6>
                    <div className="d-flex align-items-center">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <div className="text-white-50 small">
                  <FaCalendarAlt className="me-1" size={12} />
                  {formatDate(review.createdAt || new Date())}
                </div>
              </div>
              <p className="text-white-50 mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VenueReviews
