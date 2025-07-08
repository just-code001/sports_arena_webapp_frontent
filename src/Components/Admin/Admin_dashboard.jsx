"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Typography, Table, Space } from "antd"
import {
  DollarCircleOutlined,
  ShopOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement)

const { Title: AntTitle } = Typography

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5062/api/Tblbookings/Admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalBookings: 156,
      totalRevenue: 45000,
      totalVenues: 12,
      totalUsers: 89,
      bookingsGrowth: 12.5,
      revenueGrowth: 8.3,
      venuesGrowth: 0,
      usersGrowth: 15.2,
    },
    todayPerformance: {
      todayBookings: 0,
      todayRevenue: 0,
      monthlyBookings: 33,
      monthlyRevenue: 8000,
    },
    monthlyTrends: [
      { month: "Jan 2025", bookings: 25, revenue: 7500 },
      { month: "Feb 2025", bookings: 30, revenue: 9000 },
      { month: "Mar 2025", bookings: 28, revenue: 8400 },
      { month: "Apr 2025", bookings: 35, revenue: 10500 },
      { month: "May 2025", bookings: 32, revenue: 9600 },
      { month: "Jun 2025", bookings: 33, revenue: 8000 },
    ],
    statusDistribution: {
      confirmed: 45,
      pending: 25,
      cancelled: 15,
      completed: 15,
    },
    paymentMethods: {
      razorpay: 70,
      cash: 20,
      card: 10,
    },
    topVenues: [
      { venue: "dotball", bookings: 31, revenue: 31000 },
      { venue: "foot turf", bookings: 2, revenue: 2000 },
    ],
  }

  const data = dashboardData || mockData

  const renderGrowthIndicator = (growth) => {
    const isPositive = growth > 0
    return (
      <span style={{ color: isPositive ? "#52c41a" : "#ff4d4f", fontSize: "12px" }}>
        {isPositive ? <RiseOutlined /> : <FallOutlined />} {Math.abs(growth)}%
      </span>
    )
  }

  const monthlyTrendsChart = {
    labels: data.monthlyTrends.map((item) => item.month),
    datasets: [
      {
        type: "bar",
        label: "Bookings",
        data: data.monthlyTrends.map((item) => item.bookings),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Revenue (₹)",
        data: data.monthlyTrends.map((item) => item.revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y1",
      },
    ],
  }

  const statusChart = {
    labels: ["Confirmed", "Pending", "Cancelled", "Completed"],
    datasets: [
      {
        data: [
          data.statusDistribution.confirmed,
          data.statusDistribution.pending,
          data.statusDistribution.cancelled,
          data.statusDistribution.completed,
        ],
        backgroundColor: ["#52c41a", "#faad14", "#ff4d4f", "#1890ff"],
      },
    ],
  }

  const paymentChart = {
    labels: ["Razorpay", "Cash", "Card"],
    datasets: [
      {
        data: [data.paymentMethods.razorpay, data.paymentMethods.cash, data.paymentMethods.card],
        backgroundColor: ["#722ed1", "#13c2c2", "#52c41a"],
      },
    ],
  }

  const topVenuesColumns = [
    { title: "Venue", dataIndex: "venue", key: "venue" },
    { title: "Bookings", dataIndex: "bookings", key: "bookings" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ]

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <AntTitle level={3} style={{ margin: 0 }}>
          Admin Dashboard
        </AntTitle>

        {/* Overview Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={data.overview.totalBookings}
                prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
                suffix={renderGrowthIndicator(data.overview.bookingsGrowth)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={data.overview.totalRevenue}
                prefix={<DollarCircleOutlined style={{ color: "#52c41a" }} />}
                suffix={renderGrowthIndicator(data.overview.revenueGrowth)}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Venues"
                value={data.overview.totalVenues}
                prefix={<ShopOutlined style={{ color: "#faad14" }} />}
                suffix={renderGrowthIndicator(data.overview.venuesGrowth)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={data.overview.totalUsers}
                prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                suffix={renderGrowthIndicator(data.overview.usersGrowth)}
              />
            </Card>
          </Col>
        </Row>

        {/* Performance Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Today's Performance" extra={<EyeOutlined />}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Today's Bookings"
                    value={data.todayPerformance.todayBookings}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Today's Revenue"
                    value={data.todayPerformance.todayRevenue}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="This Month">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Monthly Bookings"
                    value={data.todayPerformance.monthlyBookings}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Monthly Revenue"
                    value={data.todayPerformance.monthlyRevenue}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Monthly Trends" extra={<EyeOutlined />}>
              <div style={{ height: "300px" }}>
                <Bar
                  data={monthlyTrendsChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Monthly Trends" },
                    },
                    scales: {
                      y: { type: "linear", display: true, position: "left" },
                      y1: { type: "linear", display: true, position: "right", grid: { drawOnChartArea: false } },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Booking Status Distribution">
              <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Doughnut
                  data={statusChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bottom Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Payment Methods">
              <div style={{ height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Doughnut
                  data={paymentChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card title="Top Performing Venues">
              <Table
                columns={topVenuesColumns}
                dataSource={data.topVenues}
                pagination={false}
                size="small"
                rowKey="venue"
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  )
}

export default AdminDashboard
