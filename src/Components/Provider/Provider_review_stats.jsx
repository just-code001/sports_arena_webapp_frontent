"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Progress, Typography, Spin, Alert, Select } from "antd"
import { StarOutlined, CommentOutlined, LikeOutlined } from "@ant-design/icons"
import axios from "axios"

const { Title, Text } = Typography
const { Option } = Select

const Provider_review_stats = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    venueStats: [],
  })

  useEffect(() => {
    fetchVenues()
    fetchStats()
  }, [])

  const fetchVenues = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblvenues/provider/my-venues", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setVenues(response.data.data)
      } else {
        setError("Failed to fetch venues")
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
      setError("Failed to fetch venues")
    }
  }

  const fetchStats = async (venueId = null) => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        setError("Please login to continue")
        return
      }

      const url =
        venueId && venueId !== "all"
          ? `https://localhost:7250/api/Tblreviews/venue-stats/${venueId}`
          : "https://localhost:7250/api/Tblreviews/provider/venue-reviews"

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        if (venueId && venueId !== "all") {
          // Single venue stats
          const data = response.data.data
          setStats({
            totalReviews: data.totalReviews,
            averageRating: data.averageRating,
            ratingDistribution: {
              1: data.ratingDistribution.oneStar,
              2: data.ratingDistribution.twoStars,
              3: data.ratingDistribution.threeStars,
              4: data.ratingDistribution.fourStars,
              5: data.ratingDistribution.fiveStars,
            },
            venueStats: [],
          })
        } else {
          // All venues stats
          const reviews = response.data.data
          const statistics = response.data.statistics || {}

          // Calculate rating distribution
          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          reviews.forEach((review) => {
            if (distribution[review.rating] !== undefined) {
              distribution[review.rating]++
            }
          })

          setStats({
            totalReviews: statistics.totalReviews || reviews.length,
            averageRating: statistics.averageRating || 0,
            ratingDistribution: distribution,
            venueStats: statistics.venueStats || [],
          })
        }

        setError(null)
      } else {
        setError("Failed to fetch review statistics")
      }
    } catch (error) {
      console.error("Error fetching review statistics:", error)
      setError("Failed to fetch review statistics")
    } finally {
      setLoading(false)
    }
  }

  const handleVenueChange = (value) => {
    setSelectedVenue(value)
    fetchStats(value)
  }

  const renderRatingDistribution = () => {
    const ratings = [5, 4, 3, 2, 1]
    return ratings.map((rating) => {
      const count = stats.ratingDistribution[rating] || 0
      const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

      return (
        <div key={rating} className="mb-2">
          <div className="d-flex align-items-center">
            <div style={{ width: "60px" }}>
              {rating} <StarOutlined style={{ color: "#fadb14" }} />
            </div>
            <Progress
              percent={percentage}
              showInfo={false}
              strokeColor="#10b981"
              style={{ flex: 1, marginRight: "10px" }}
            />
            <div style={{ width: "40px", textAlign: "right" }}>{count}</div>
          </div>
        </div>
      )
    })
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  return (
    <div className="container mt-3">
      <Title level={3}>Review Statistics</Title>

      {/* Venue Filter */}
      <div className="mb-4">
        <Text strong>Select Venue: </Text>
        <Select style={{ width: 300 }} value={selectedVenue} onChange={handleVenueChange} loading={loading}>
          <Option value="all">All Venues</Option>
          {venues.map((venue) => (
            <Option key={venue.venueId} value={venue.venueId}>
              {venue.venuename}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <div className="mt-3">Loading statistics...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={16} className="mb-4">
            <Col xs={24} md={8} className="mb-3">
              <Card>
                <Statistic title="Total Reviews" value={stats.totalReviews} prefix={<CommentOutlined />} />
              </Card>
            </Col>
            <Col xs={24} md={8} className="mb-3">
              <Card>
                <Statistic
                  title="Average Rating"
                  value={stats.averageRating}
                  precision={1}
                  prefix={<StarOutlined style={{ color: "#fadb14" }} />}
                  suffix="/ 5"
                />
              </Card>
            </Col>
            <Col xs={24} md={8} className="mb-3">
              <Card>
                <Statistic
                  title="Positive Reviews"
                  value={(stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)}
                  prefix={<LikeOutlined />}
                  suffix={
                    stats.totalReviews > 0
                      ? `(${((((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews) * 100).toFixed(0)}%)`
                      : "(0%)"
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* Rating Distribution */}
          <Card title="Rating Distribution" className="mb-4">
            {stats.totalReviews > 0 ? (
              renderRatingDistribution()
            ) : (
              <div className="text-center py-3">
                <Text type="secondary">No reviews available</Text>
              </div>
            )}
          </Card>

          {/* Venue-specific Stats */}
          {selectedVenue === "all" && stats.venueStats.length > 0 && (
            <Card title="Venue Ratings">
              <Row gutter={[16, 16]}>
                {stats.venueStats.map((venue) => (
                  <Col xs={24} sm={12} md={8} key={venue.venueId}>
                    <Card size="small" title={venue.venueName}>
                      <Statistic
                        title="Average Rating"
                        value={venue.averageRating}
                        precision={1}
                        prefix={<StarOutlined style={{ color: "#fadb14" }} />}
                        suffix={`/ 5 (${venue.reviewCount} reviews)`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default Provider_review_stats
