"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Typography, Table, Spin, Alert, Progress } from "antd"
import {
  ShopOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  EyeOutlined,
  PercentageOutlined,
} from "@ant-design/icons"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import axios from "axios"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

const { Title: AntTitle, Text } = Typography

const Provider_dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")

      if (!token) {
        setError("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblbookings/Provider/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setDashboardData(response.data.data)
        setError(null)
      } else {
        setError("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  // Chart configurations
  const monthlyTrendsChart = {
    labels:
      dashboardData?.monthlyTrends?.map((item) =>
        new Date(item.year, item.month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      ) || [],
    datasets: [
      {
        label: "Bookings",
        data: dashboardData?.monthlyTrends?.map((item) => item.count) || [],
        backgroundColor: "rgba(24, 144, 255, 0.6)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Revenue",
        data: dashboardData?.monthlyTrends?.map((item) => item.revenue) || [],
        backgroundColor: "rgba(82, 196, 26, 0.6)",
        borderColor: "rgba(82, 196, 26, 1)",
        borderWidth: 2,
        type: "line",
        yAxisID: "y1",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Performance Trends",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Bookings",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Revenue (₹)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const venuePerformanceColumns = [
    {
      title: "Venue Name",
      dataIndex: "venueName",
      key: "venueName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Total Bookings",
      dataIndex: "totalBookings",
      key: "totalBookings",
      sorter: (a, b) => a.totalBookings - b.totalBookings,
    },
    {
      title: "Monthly Bookings",
      dataIndex: "monthlyBookings",
      key: "monthlyBookings",
      sorter: (a, b) => a.monthlyBookings - b.monthlyBookings,
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (revenue) => formatCurrency(revenue),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
    {
      title: "Monthly Revenue",
      dataIndex: "monthlyRevenue",
      key: "monthlyRevenue",
      render: (revenue) => formatCurrency(revenue),
      sorter: (a, b) => a.monthlyRevenue - b.monthlyRevenue,
    },
    {
      title: "Utilization",
      key: "utilization",
      render: (_, record) => {
        const utilization = record.totalSlots > 0 ? Math.round((record.bookedSlots / record.totalSlots) * 100) : 0
        return (
          <Progress
            percent={utilization}
            size="small"
            status={utilization > 70 ? "success" : utilization > 40 ? "normal" : "exception"}
          />
        )
      },
      sorter: (a, b) => {
        const aUtil = a.totalSlots > 0 ? (a.bookedSlots / a.totalSlots) * 100 : 0
        const bUtil = b.totalSlots > 0 ? (b.bookedSlots / b.totalSlots) * 100 : 0
        return aUtil - bUtil
      },
    },
  ]

  const recentBookingsColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 100,
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Venue",
      dataIndex: "venueName",
      key: "venueName",
    },
    {
      title: "Amount",
      dataIndex: "payableAmount",
      key: "payableAmount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <span
          style={{
            color: status === "Confirmed" ? "#52c41a" : status === "Pending" ? "#faad14" : "#ff4d4f",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Slot Date",
      dataIndex: "slotDate",
      key: "slotDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Slot Time",
      dataIndex: "slotTime",
      key: "slotTime",
      render: (time) => {
        const [hours, minutes] = time.split(":")
        return `${hours}:${minutes}`
      },
    },
  ]

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  if (!dashboardData || !dashboardData.overview) {
    return <Alert message="No data available" type="info" showIcon />
  }

  return (
    <div className="provider-dashboard-content">
      <div style={{ marginBottom: "20px" }}>
        <AntTitle level={3} style={{ margin: 0, marginBottom: "8px" }}>
          Provider Dashboard
        </AntTitle>
        <Text type="secondary">Manage and monitor your venue performance</Text>
      </div>

      {/* Overview Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Total Venues"
              value={dashboardData.overview.totalVenues}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: "20px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Total Bookings"
              value={dashboardData.overview.totalBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#722ed1", fontSize: "20px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Total Revenue"
              value={dashboardData.overview.totalRevenue}
              prefix={<DollarCircleOutlined />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: "#52c41a", fontSize: "20px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Utilization Rate"
              value={dashboardData.overview.utilizationRate}
              prefix={<PercentageOutlined />}
              suffix="%"
              valueStyle={{
                color:
                  dashboardData.overview.utilizationRate > 70
                    ? "#52c41a"
                    : dashboardData.overview.utilizationRate > 40
                      ? "#faad14"
                      : "#ff4d4f",
                fontSize: "20px",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Today's and Monthly Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col xs={24} lg={12}>
          <Card title="Today's Performance" size="small">
            <Row gutter={12}>
              <Col span={12}>
                <Statistic
                  title="Today's Bookings"
                  value={dashboardData.overview.todayBookings}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Today's Revenue"
                  value={dashboardData.overview.todayRevenue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="This Month" size="small">
            <Row gutter={12}>
              <Col span={12}>
                <Statistic
                  title="Monthly Bookings"
                  value={dashboardData.overview.monthlyBookings}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Monthly Revenue"
                  value={dashboardData.overview.monthlyRevenue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Slot Utilization Overview */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card title="Slot Utilization Overview" size="small">
            <Row gutter={12}>
              <Col xs={24} sm={8}>
                <Statistic title="Total Slots" value={dashboardData.overview.totalSlots} />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic title="Booked Slots" value={dashboardData.overview.bookedSlots} />
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>Overall Utilization</Text>
                  <Progress
                    percent={dashboardData.overview.utilizationRate}
                    status={
                      dashboardData.overview.utilizationRate > 70
                        ? "success"
                        : dashboardData.overview.utilizationRate > 40
                          ? "normal"
                          : "exception"
                    }
                    style={{ marginTop: "8px" }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Monthly Trends Chart */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card title="Monthly Performance Trends" extra={<EyeOutlined />} size="small">
            <div style={{ height: "300px" }}>
              <Bar data={monthlyTrendsChart} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Venue Performance Table */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card title="Venue Performance Details" size="small">
            <Table
              dataSource={dashboardData.venuePerformance}
              columns={venuePerformanceColumns}
              pagination={{ pageSize: 5, size: "small" }}
              size="small"
              rowKey="venueId"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card title="Recent Bookings" extra={<EyeOutlined />} size="small">
            <Table
              dataSource={dashboardData.recentBookings}
              columns={recentBookingsColumns}
              pagination={{ pageSize: 5, size: "small" }}
              size="small"
              rowKey="bookingId"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Provider_dashboard
