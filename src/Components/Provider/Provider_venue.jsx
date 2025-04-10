import React, { useEffect, useState } from "react";
import { Table, Space, Typography, Popconfirm, Modal, Form, Input, InputNumber, message, Upload, Select } from "antd";
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Button from "react-bootstrap/Button";
import axios from "axios";

const { Option } = Select;

const Provider_venue = () => {
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVenues();
    fetchCategories();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://localhost:7250/api/Tblvenues/Provider/my-venues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues(response.data.data);
    } catch (error) {
      message.error("Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://localhost:7250/api/Tblvenues/sport-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const handleAdd = () => {
    setEditingVenue(null);
    setFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFile(null);
    form.setFieldsValue({
      categoryId: venue.categoryId,
      venuename: venue.venuename,
      location: venue.location,
      description: venue.description,
      capacity: venue.capacity,
      pricePerHour: venue.priceperhour,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`https://localhost:7250/api/Tblvenues/Provider/delete-venue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Venue deleted successfully");
      fetchVenues();
    } catch (error) {
      message.error("Failed to delete venue");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      for (const key in values) {
        formData.append(key, values[key]);
      }

      if (file) {
        formData.append("venueImage", file);
      }

      if (editingVenue) {
        await axios.put(
          `https://localhost:7250/api/Tblvenues/Provider/update-venue/${editingVenue.venueId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Venue updated successfully");
      } else {
        if (!file) {
          return message.error("Please upload an image.");
        }

        await axios.post("https://localhost:7250/api/Tblvenues", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Venue added successfully");
      }

      setIsModalVisible(false);
      fetchVenues();
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const columns = [
    { title: "Venue ID", dataIndex: "venueId" },
    { title: "Venue Name", dataIndex: "venuename" },
    { title: "Location", dataIndex: "location" },
    { title: "Capacity", dataIndex: "capacity" },
    { title: "Price per Hour", dataIndex: "priceperhour" },
    {
        title: "Image",
        dataIndex: "venueImage", // or the property name your API returns for the image file name
        render: (venueImage) =>
            venueImage ? (
            <img
              src={`https://localhost:7250/images/${venueImage}`}
              alt="Venue"
              style={{ width: 100, height: 60, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            "No image"
          ),
      },
    {
      title: "Actions",
      render: (_, venue) => (
        <Space>
          <Button variant="warning" size="sm" onClick={() => handleEdit(venue)}>
            <EditOutlined />
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(venue.venueId)}>
            <Button variant="danger" size="sm">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <Typography.Title level={3}>Manage Venues</Typography.Title>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        Add New Venue
      </Button>
      <Table
        dataSource={venues}
        columns={columns}
        rowKey="venueId"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingVenue ? "Edit Venue" : "Add New Venue"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingVenue ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
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
            rules={[{ required: true, message: "Please enter venue name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please enter capacity" }]}
          >
            <InputNumber min={1} className="w-100" />
          </Form.Item>
          <Form.Item
            name="pricePerHour"
            label="Price per Hour"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={1} className="w-100" />
          </Form.Item>
          <Form.Item label="Venue Image">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Provider_venue;
