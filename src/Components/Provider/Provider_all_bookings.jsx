import { useState, useEffect } from "react"
import { Table, Space, Typography, Modal, message, Select, Statistic, Card, Row, Col, Tag, Tooltip } from "antd"
import { CalendarOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const { Option } = Select

const Provider_all_bookings = () => {
  const [bookings, setBookings] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchProviderVenues()
    fetchBookings()
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

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblbookings/Provider/venue-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const bookingsData = response.data.data
        setBookings(bookingsData)
        calculateStats(bookingsData)
      } else {
        message.error("Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch bookings")
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsData) => {
    const totalBookings = bookingsData.length
    const confirmedBookings = bookingsData.filter((b) => b.bookingStatus?.toLowerCase() === "confirmed").length
    const pendingBookings = bookingsData.filter((b) => b.bookingStatus?.toLowerCase() === "pending").length
    const cancelledBookings = bookingsData.filter((b) => b.bookingStatus?.toLowerCase() === "cancelled").length

    // Calculate total revenue from confirmed bookings
    const totalRevenue = bookingsData
      .filter((b) => b.paymentPaid)
      .reduce((sum, booking) => sum + booking.payableAmount, 0)

    setStats({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
    })
  }

  const handleVenueChange = (value) => {
    setSelectedVenue(value)
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value)
  }

  const handleView = (booking) => {
    setSelectedBooking(booking)
    setIsModalVisible(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
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

  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <Tag color="success">Confirmed</Tag>
      case "pending":
        return <Tag color="warning">Pending</Tag>
      case "cancelled":
        return <Tag color="error">Cancelled</Tag>
      default:
        return <Tag color="default">{status}</Tag>
    }
  }

  const getPaymentTag = (isPaid) => {
    return isPaid ? <Tag color="success">Paid</Tag> : <Tag color="warning">Pending</Tag>
  }

  // Filter bookings based on selected venue and status
  const filteredBookings = bookings.filter((booking) => {
    const venueMatch = selectedVenue === "all" || booking.venueId === Number.parseInt(selectedVenue)
    const statusMatch =
      selectedStatus === "all" || booking.bookingStatus?.toLowerCase() === selectedStatus.toLowerCase()
    return venueMatch && statusMatch
  })

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 100,
    },
    {
      title: "Venue",
      dataIndex: "venueName",
      key: "venueName",
      ellipsis: true,
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Time Slot",
      key: "timeSlot",
      width: 150,
      render: (_, record) => `${formatTime(record.slotStartTime)} - ${formatTime(record.slotEndTime)}`,
    },
    {
      title: "Amount",
      dataIndex: "payableAmount",
      key: "payableAmount",
      width: 100,
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => a.payableAmount - b.payableAmount,
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      width: 120,
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.bookingStatus?.toLowerCase() === value,
    },
    {
      title: "Payment",
      dataIndex: "paymentPaid",
      key: "paymentPaid",
      width: 100,
      render: (paid) => getPaymentTag(paid),
      filters: [
        { text: "Paid", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value, record) => record.paymentPaid === value,
    },
    {
      title: "Booked On",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 120,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, booking) => (
        <Space>
          <Tooltip title="View Details">
            <Button variant="info" size="sm" onClick={() => handleView(booking)}>
              <EyeOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography.Title level={3} className="mb-0">
          Venue Bookings
        </Typography.Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic title="Total Bookings" value={stats.totalBookings} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Confirmed"
              value={stats.confirmedBookings}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pendingBookings}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={stats.cancelledBookings}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <div className="mb-4 d-flex flex-wrap gap-3">
        <div>
          <label className="me-2">Filter by Venue:</label>
          <Select style={{ width: 250 }} value={selectedVenue} onChange={handleVenueChange} loading={loading}>
            <Option value="all">All Venues</Option>
            {venues.map((venue) => (
              <Option key={venue.venueId} value={venue.venueId}>
                {venue.venuename}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label className="me-2">Filter by Status:</label>
          <Select style={{ width: 150 }} value={selectedStatus} onChange={handleStatusChange}>
            <Option value="all">All Status</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="pending">Pending</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
        <div className="ms-auto">
          <Button variant="primary" onClick={fetchBookings}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="bookingId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* Booking Detail Modal */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedBooking && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Booking Information" bordered={false}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <strong>Booking ID:</strong> {selectedBooking.bookingId}
                      </p>
                      <p>
                        <strong>Status:</strong> {getStatusTag(selectedBooking.bookingStatus)}
                      </p>
                      <p>
                        <strong>Booked On:</strong> {formatDate(selectedBooking.bookingDate)}
                      </p>
                      <p>
                        <strong>Payment Status:</strong> {getPaymentTag(selectedBooking.paymentPaid)}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Amount:</strong> ₹{selectedBooking.payableAmount}
                      </p>
                      <p>
                        <strong>Customer:</strong> {selectedBooking.userName}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(selectedBooking.date)}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(selectedBooking.slotStartTime)} -{" "}
                        {formatTime(selectedBooking.slotEndTime)}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="Venue Information" bordered={false}>
                  <p>
                    <strong>Venue:</strong> {selectedBooking.venueName}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedBooking.venueLocation}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Provider_all_bookings
