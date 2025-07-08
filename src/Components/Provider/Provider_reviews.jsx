import { useState, useEffect } from "react"
import { Table, Space, Typography, Popconfirm, Modal, Rate, message, Select, Statistic, Card, Row, Col } from "antd"
import { DeleteOutlined, EyeOutlined, StarOutlined, CommentOutlined, UserOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const { Option } = Select

const Provider_reviews = () => {
  const [reviews, setReviews] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    venueStats: [],
  })

  useEffect(() => {
    fetchProviderVenues()
    fetchReviews()
  }, [])

  const fetchProviderVenues = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblvenues/provider/my-venues", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setVenues(response.data.data)
      } else {
        message.error("Failed to fetch venues")
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch venues")
      }
    }
  }

  const fetchReviews = async (venueId = null) => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      // Use the provider-specific endpoint to get only reviews for their venues
      const url =
        venueId && venueId !== "all"
          ? `https://localhost:7250/api/Tblreviews/venue/${venueId}`
          : "https://localhost:7250/api/Tblreviews/provider/venue-reviews"

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setReviews(response.data.data)

        // Calculate statistics
        calculateStats(response.data.data, venueId)
      } else {
        message.error("Failed to fetch reviews")
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch reviews")
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsData, selectedVenueId) => {
    // Calculate overall stats
    const totalReviews = reviewsData.length
    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0

    // Calculate stats per venue
    const venueMap = new Map()

    reviewsData.forEach((review) => {
      if (!venueMap.has(review.venueId)) {
        venueMap.set(review.venueId, {
          venueId: review.venueId,
          venueName: review.venueName,
          reviews: [],
          totalRating: 0,
          averageRating: 0,
          reviewCount: 0,
        })
      }

      const venueStats = venueMap.get(review.venueId)
      venueStats.reviews.push(review)
      venueStats.totalRating += review.rating
      venueStats.reviewCount++
      venueStats.averageRating = (venueStats.totalRating / venueStats.reviewCount).toFixed(1)
    })

    const venueStats = Array.from(venueMap.values())

    setStats({
      totalReviews,
      averageRating,
      venueStats,
    })
  }

  const handleVenueChange = (value) => {
    setSelectedVenue(value)
    fetchReviews(value)
  }

  const handleView = (review) => {
    setSelectedReview(review)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.delete(`https://localhost:7250/api/Tblreviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        message.success("Review deleted successfully")
        fetchReviews(selectedVenue)
      } else {
        message.error(response.data.message || "Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      message.error(error.response?.data?.message || "Failed to delete review")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const columns = [
    {
      title: "Review ID",
      dataIndex: "reviewId",
      key: "reviewId",
      width: 100,
    },
    {
      title: "Venue",
      dataIndex: "venueName",
      key: "venueName",
      ellipsis: true,
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, review) => (
        <Space>
          <Button variant="info" size="sm" onClick={() => handleView(review)} title="View Review">
            <EyeOutlined />
          </Button>
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review? This action cannot be undone."
            onConfirm={() => handleDelete(review.reviewId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button variant="danger" size="sm" title="Delete Review">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography.Title level={3} className="mb-0">
          Venue Reviews
        </Typography.Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Reviews" value={stats.totalReviews} prefix={<CommentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Rating"
              value={stats.averageRating}
              precision={1}
              prefix={<StarOutlined />}
              suffix="/ 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Venues Reviewed" value={stats.venueStats.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Venue Filter */}
      <div className="mb-4">
        <label className="me-2">Filter by Venue:</label>
        <Select style={{ width: 300 }} value={selectedVenue} onChange={handleVenueChange} loading={loading}>
          <Option value="all">All Venues</Option>
          {venues.map((venue) => (
            <Option key={venue.venueId} value={venue.venueId}>
              {venue.venuename}
            </Option>
          ))}
        </Select>
      </div>

      {/* Reviews Table */}
      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="reviewId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reviews`,
        }}
        scroll={{ x: 800 }}
      />

      {/* Review Detail Modal */}
      <Modal
        title="Review Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedReview && (
          <div>
            <div className="mb-3">
              <strong>Review ID:</strong> {selectedReview.reviewId}
            </div>
            <div className="mb-3">
              <strong>Venue:</strong> {selectedReview.venueName}
            </div>
            <div className="mb-3">
              <strong>User:</strong> {selectedReview.userName}
            </div>
            <div className="mb-3">
              <strong>Rating:</strong> <Rate disabled defaultValue={selectedReview.rating} />
            </div>
            <div className="mb-3">
              <strong>Date:</strong> {formatDate(selectedReview.createdAt)}
            </div>
            <div className="mb-3">
              <strong>Comment:</strong>
              <div className="p-3 bg-light rounded mt-2">{selectedReview.comment}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Provider_reviews
