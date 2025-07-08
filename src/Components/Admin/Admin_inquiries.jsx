import { useState, useEffect } from "react"
import { Table, Space, Typography, Popconfirm, Modal, message } from "antd"
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const Admin_inquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblinquiries", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setInquiries(response.data.data)
      } else {
        message.error("Failed to fetch inquiries")
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Failed to fetch inquiries")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.delete(`https://localhost:7250/api/Tblinquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        message.success("Inquiry deleted successfully")
        fetchInquiries()
      } else {
        message.error(response.data.message || "Failed to delete inquiry")
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      message.error(error.response?.data?.message || "Failed to delete inquiry")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const columns = [
    {
      title: "Inquiry ID",
      dataIndex: "inquiryId",
      key: "inquiryId",
      width: 100,
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: "Date",
      dataIndex: "inquiryDate",
      key: "inquiryDate",
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, inquiry) => (
        <Space>
          <Button variant="info" size="sm" onClick={() => handleView(inquiry)} title="View Inquiry">
            <EyeOutlined />
          </Button>
          <Popconfirm
            title="Delete Inquiry"
            description="Are you sure you want to delete this inquiry? This action cannot be undone."
            onConfirm={() => handleDelete(inquiry.inquiryId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button variant="danger" size="sm" title="Delete Inquiry">
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
          Manage Inquiries
        </Typography.Title>
      </div>

      <Table
        dataSource={inquiries}
        columns={columns}
        rowKey="inquiryId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} inquiries`,
        }}
        scroll={{ x: 800 }}
      />

      <Modal
        title="Inquiry Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedInquiry && (
          <div>
            <div className="mb-3">
              <strong>Inquiry ID:</strong> {selectedInquiry.inquiryId}
            </div>
            <div className="mb-3">
              <strong>User:</strong> {selectedInquiry.userName}
            </div>
            <div className="mb-3">
              <strong>Date:</strong> {formatDate(selectedInquiry.inquiryDate)}
            </div>
            <div className="mb-3">
              <strong>Message:</strong>
              <div className="p-3 bg-light rounded mt-2">{selectedInquiry.message}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Admin_inquiries
