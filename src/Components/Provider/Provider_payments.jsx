"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Space,
  Typography,
  Modal,
  message,
  Select,
  Statistic,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  DatePicker,
} from "antd"
import { DollarOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const { Option } = Select
const { RangePicker } = DatePicker

const Provider_payments = () => {
  const [payments, setPayments] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState(null)
  const [stats, setStats] = useState({
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    fetchProviderVenues()
    fetchPayments()
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

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblpayments/Provider/venue-payments", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const paymentsData = response.data.data
        setPayments(paymentsData)
        calculateStats(paymentsData)
      } else {
        message.error("Failed to fetch payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch payments")
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (paymentsData) => {
    const totalPayments = paymentsData.length
    const successfulPayments = paymentsData.filter((p) => p.paymentStatus?.toLowerCase() === "success").length
    const failedPayments = paymentsData.filter((p) => p.paymentStatus?.toLowerCase() === "failed").length

    // Calculate total revenue from successful payments
    const totalRevenue = paymentsData
      .filter((p) => p.paymentStatus?.toLowerCase() === "success")
      .reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate today's revenue
    const today = new Date().setHours(0, 0, 0, 0)
    const todayRevenue = paymentsData
      .filter(
        (p) => p.paymentStatus?.toLowerCase() === "success" && new Date(p.paymentDate).setHours(0, 0, 0, 0) === today,
      )
      .reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate this month's revenue
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRevenue = paymentsData
      .filter((p) => {
        const paymentDate = new Date(p.paymentDate)
        return (
          p.paymentStatus?.toLowerCase() === "success" &&
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        )
      })
      .reduce((sum, payment) => sum + payment.amount, 0)

    setStats({
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
    })
  }

  const handleVenueChange = (value) => {
    setSelectedVenue(value)
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value)
  }

  const handleDateRangeChange = (dates) => {
    setDateRange(dates)
  }

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setIsModalVisible(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
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
      case "success":
        return <Tag color="success">Success</Tag>
      case "failed":
        return <Tag color="error">Failed</Tag>
      case "pending":
        return <Tag color="warning">Pending</Tag>
      case "refunded":
        return <Tag color="default">Refunded</Tag>
      default:
        return <Tag color="default">{status}</Tag>
    }
  }

  // Filter payments based on selected venue, status, and date range
  const filteredPayments = payments.filter((payment) => {
    const venueMatch = selectedVenue === "all" || payment.venueId === Number.parseInt(selectedVenue)
    const statusMatch =
      selectedStatus === "all" || payment.paymentStatus?.toLowerCase() === selectedStatus.toLowerCase()

    let dateMatch = true
    if (dateRange && dateRange[0] && dateRange[1]) {
      const paymentDate = new Date(payment.paymentDate)
      const startDate = dateRange[0].startOf("day").toDate()
      const endDate = dateRange[1].endOf("day").toDate()
      dateMatch = paymentDate >= startDate && paymentDate <= endDate
    }

    return venueMatch && statusMatch && dateMatch
  })

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
      width: 100,
    },
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Success", value: "success" },
        { text: "Failed", value: "failed" },
        { text: "Pending", value: "pending" },
        { text: "Refunded", value: "refunded" },
      ],
      onFilter: (value, record) => record.paymentStatus?.toLowerCase() === value,
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 150,
      render: (date) => formatDateTime(date),
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, payment) => (
        <Space>
          <Tooltip title="View Details">
            <Button variant="info" size="sm" onClick={() => handleView(payment)}>
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
          Venue Payments
        </Typography.Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Total Payments" value={stats.totalPayments} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Successful"
              value={stats.successfulPayments}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Failed"
              value={stats.failedPayments}
              valueStyle={{ color: "#cf1322" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={stats.todayRevenue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={stats.monthlyRevenue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
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
            <Option value="success">Success</Option>
            <Option value="failed">Failed</Option>
            <Option value="pending">Pending</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        </div>
        <div>
          <label className="me-2">Date Range:</label>
          <RangePicker onChange={handleDateRangeChange} />
        </div>
        <div className="ms-auto">
          <Button variant="primary" onClick={fetchPayments}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Table
        dataSource={filteredPayments}
        columns={columns}
        rowKey="paymentId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* Payment Detail Modal */}
      <Modal
        title="Payment Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedPayment && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Payment Information" bordered={false}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <strong>Payment ID:</strong> {selectedPayment.paymentId}
                      </p>
                      <p>
                        <strong>Status:</strong> {getStatusTag(selectedPayment.paymentStatus)}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{selectedPayment.amount}
                      </p>
                      <p>
                        <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Transaction ID:</strong> {selectedPayment.transactionId}
                      </p>
                      <p>
                        <strong>Payment Date:</strong> {formatDateTime(selectedPayment.paymentDate)}
                      </p>
                      <p>
                        <strong>Customer:</strong> {selectedPayment.userName}
                      </p>
                      <p>
                        <strong>Booking ID:</strong> {selectedPayment.bookingId}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="Booking Information" bordered={false}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <strong>Venue:</strong> {selectedPayment.venueName}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedPayment.venueLocation}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Date:</strong> {formatDate(selectedPayment.slotDate)}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(selectedPayment.slotStartTime)} -{" "}
                        {formatTime(selectedPayment.slotEndTime)}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Provider_payments
