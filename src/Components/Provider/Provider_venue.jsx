"use client"

import { useEffect, useState } from "react"
import { Table, Space, Typography, Popconfirm, Modal, Form, Input, InputNumber, message, Upload, Select } from "antd"
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import Button from "react-bootstrap/Button"
import axios from "axios"

const { Option } = Select

const Provider_venue = () => {
  const [venues, setVenues] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingVenue, setEditingVenue] = useState(null)
  const [file, setFile] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchVenues()
    fetchCategories()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")
      if (!token) {
        message.error("Please login to continue")
        return
      }

      const response = await axios.get("https://localhost:7250/api/Tblvenues/Provider/my-venues", {
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
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.get("https://localhost:7250/api/Tblvenues/sport-categories", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      message.error("Failed to fetch categories")
    }
  }

  const handleAdd = () => {
    setEditingVenue(null)
    setFile(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (venue) => {
    setEditingVenue(venue)
    setFile(null)
    form.setFieldsValue({
      categoryId: venue.categoryId,
      venuename: venue.venuename,
      location: venue.location,
      description: venue.description,
      capacity: venue.capacity,
      pricePerHour: venue.priceperhour,
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.delete(`https://localhost:7250/api/Tblvenues/Provider/delete-venue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        message.success("Venue deleted successfully")
        fetchVenues()
      } else {
        message.error(response.data.message || "Failed to delete venue")
      }
    } catch (error) {
      console.error("Error deleting venue:", error)
      message.error(error.response?.data?.message || "Failed to delete venue")
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const token = sessionStorage.getItem("token")

      if (!token) {
        message.error("Please login to continue")
        return
      }

      const formData = new FormData()

      // Append all form fields to FormData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key])
      })

      if (file) {
        formData.append("venueImage", file)
      }

      let response
      if (editingVenue) {
        // Update existing venue
        response = await axios.put(
          `https://localhost:7250/api/Tblvenues/Provider/update-venue/${editingVenue.venueId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )

        if (response.data.success) {
          message.success("Venue updated successfully")
        } else {
          message.error(response.data.message || "Failed to update venue")
          return
        }
      } else {
        // Create new venue
        if (!file) {
          message.error("Please upload an image.")
          return
        }

        response = await axios.post("https://localhost:7250/api/Tblvenues", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        if (response.data.success) {
          message.success("Venue added successfully")
        } else {
          message.error(response.data.message || "Failed to add venue")
          return
        }
      }

      setIsModalVisible(false)
      form.resetFields()
      setFile(null)
      setEditingVenue(null)
      fetchVenues()
    } catch (error) {
      console.error("Error submitting venue:", error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        message.error("Session expired. Please login again.")
      } else {
        message.error("Something went wrong. Please try again.")
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setFile(null)
    setEditingVenue(null)
  }

  const columns = [
    {
      title: "Venue ID",
      dataIndex: "venueId",
      key: "venueId",
      width: 100,
    },
    {
      title: "Venue Name",
      dataIndex: "venuename",
      key: "venuename",
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: "Price per Hour",
      dataIndex: "priceperhour",
      key: "priceperhour",
      width: 120,
      render: (price) => `₹${price}`,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive) => (
        <span className={`badge ${isActive ? "bg-success" : "bg-danger"}`}>{isActive ? "Active" : "Inactive"}</span>
      ),
    },
    {
      title: "Image",
      dataIndex: "venueImage",
      key: "venueImage",
      width: 120,
      render: (venueImage) =>
        venueImage ? (
          <img
            src={`https://localhost:7250/images/${venueImage}`}
            alt="Venue"
            style={{
              width: 80,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=50&width=80"
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 50,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontSize: "12px",
              color: "#999",
            }}
          >
            No image
          </div>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, venue) => (
        <Space>
          <Button variant="warning" size="sm" onClick={() => handleEdit(venue)} title="Edit Venue">
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete Venue"
            description="Are you sure you want to delete this venue? This action cannot be undone."
            onConfirm={() => handleDelete(venue.venueId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button variant="danger" size="sm" title="Delete Venue">
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
          Manage Venues
        </Typography.Title>
        <Button variant="primary" onClick={handleAdd}>
          Add New Venue
        </Button>
      </div>

      <Table
        dataSource={venues}
        columns={columns}
        rowKey="venueId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} venues`,
        }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={<div className="d-flex align-items-center">{editingVenue ? "Edit Venue" : "Add New Venue"}</div>}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingVenue ? "Update Venue" : "Create Venue"}
        cancelText="Cancel"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="categoryId"
            label="Sport Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select sport category" loading={categories.length === 0}>
              {categories.map((cat) => (
                <Option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="venuename"
            label="Venue Name"
            rules={[
              { required: true, message: "Please enter venue name" },
              { min: 3, message: "Venue name must be at least 3 characters" },
              { max: 100, message: "Venue name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter venue name" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: "Please enter location" },
              { min: 5, message: "Location must be at least 5 characters" },
            ]}
          >
            <Input placeholder="Enter venue location" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: "Description cannot exceed 500 characters" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter venue description (optional)" showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[
              { required: true, message: "Please enter capacity" },
              { type: "number", min: 1, message: "Capacity must be at least 1" },
              { type: "number", max: 10000, message: "Capacity cannot exceed 10,000" },
            ]}
          >
            <InputNumber min={1} max={10000} className="w-100" placeholder="Enter venue capacity" />
          </Form.Item>

          <Form.Item
            name="pricePerHour"
            label="Price per Hour (₹)"
            rules={[
              { required: true, message: "Please enter price per hour" },
              { type: "number", min: 1, message: "Price must be at least ₹1" },
              { type: "number", max: 100000, message: "Price cannot exceed ₹1,00,000" },
            ]}
          >
            <input
              min={1}
              max={100000}
              className="w-100"
              placeholder="Enter price per hour"
              formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Venue Image"
            rules={editingVenue ? [] : [{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              beforeUpload={(file) => {
                // Validate file type
                const isImage = file.type.startsWith("image/")
                if (!isImage) {
                  message.error("You can only upload image files!")
                  return false
                }

                // Validate file size (max 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5
                if (!isLt5M) {
                  message.error("Image must be smaller than 5MB!")
                  return false
                }

                setFile(file)
                return false // Prevent auto upload
              }}
              maxCount={1}
              accept="image/*"
              fileList={file ? [file] : []}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>{editingVenue ? "Change Image" : "Select Image"}</Button>
            </Upload>
            {editingVenue && !file && (
              <div className="mt-2">
                <small className="text-muted">Current image will be kept if no new image is selected</small>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Provider_venue
