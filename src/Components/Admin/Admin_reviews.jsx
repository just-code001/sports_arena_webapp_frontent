import { useState, useEffect } from "react"
import { Table, Space, Typography, Popconfirm, Modal, Rate, message } from "antd"
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const Admin_reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblreviews", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setReviews(response.data.data)
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
        fetchReviews()
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
          Manage Reviews
        </Typography.Title>
      </div>

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

export default Admin_reviews
