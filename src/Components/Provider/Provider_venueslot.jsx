import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  message,
  Select,
  Popconfirm,
  Typography,
} from "antd";
import Button from "react-bootstrap/Button";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const Provider_venueslot = () => {
  const [venues, setVenues] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [form] = Form.useForm();

  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generateForm] = Form.useForm();


  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("https://localhost:7250/api/Tblvenues/Provider/my-venues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues(response.data.data);
    } catch (error) {
      message.error("Failed to load venues.");
    }
  };

  const fetchSlots = async (venueId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7250/api/Tblvenueslots/Provider/venueslots-By-Venue/${venueId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSlots(response.data.data);
    } catch (error) {
      message.error("Failed to load slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleVenueChange = (venueId) => {
    setSelectedVenue(venueId);
    fetchSlots(venueId);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const slotData = {
        venueId: selectedVenue,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
      };

      if (editingSlot) {
        await axios.put(
          `https://localhost:7250/api/Tblvenueslots/${editingSlot.slotId}`,
          slotData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Slot updated successfully.");
      } else {
        await axios.post("https://localhost:7250/api/Tblvenueslots", slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Slot created successfully.");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingSlot(null);
      fetchSlots(selectedVenue);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong.";
      message.error(errorMsg);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await axios.delete(`https://localhost:7250/api/Tblvenueslots/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Slot deleted.");
      fetchSlots(selectedVenue);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete slot.");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
    },
    {
      title: "Booked",
      dataIndex: "isBooked",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      render: (_, slot) => (
        <span>
          <Button
            variant="warning"
            size="sm"
            onClick={() => {
              setEditingSlot(slot);
              form.setFieldsValue({
                date: dayjs(slot.date),
                startTime: dayjs(slot.startTime, "HH:mm"),
                endTime: dayjs(slot.endTime, "HH:mm"),
              });
              setModalVisible(true);
            }}
            disabled={slot.isBooked}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this slot?"
            onConfirm={() => handleDelete(slot.slotId)}
            disabled={slot.isBooked}
          >
            <Button variant="danger" size="sm" className="ms-2" disabled={slot.isBooked}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <Typography.Title level={3}>Manage Venue Slots</Typography.Title>

      <Select
        placeholder="Select a Venue"
        style={{ width: 300, marginBottom: 20 }}
        onChange={handleVenueChange}
        value={selectedVenue}
      >
        {venues.map((venue) => (
          <Option key={venue.venueId} value={venue.venueId}>
            {venue.venuename}
          </Option>
        ))}
      </Select>

      <Button
        variant="primary"
        onClick={() => {
          setEditingSlot(null);
          form.resetFields();
          setModalVisible(true);
        }}
        disabled={!selectedVenue}
        className="ms-2 mb-3"
      >
        Add Slot
      </Button>

      <Button
        variant="success"
        className="ms-2 mb-3"
        onClick={() => {
          generateForm.resetFields();
          setGenerateModalVisible(true);
        }}
        disabled={!selectedVenue}
      >
        Generate Slots
      </Button>


      <Table
        rowKey="slotId"
        dataSource={slots}
        columns={columns}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingSlot ? "Edit Slot" : "Add New Slot"}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingSlot ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker className="w-100" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select a start time" }]}
          >
            <TimePicker format="HH:mm" className="w-100" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please select an end time" }]}
          >
            <TimePicker format="HH:mm" className="w-100" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Generate Daily Slots (9 AM - 12 AM)"
        visible={generateModalVisible}
        onOk={async () => {
          try {
            const values = await generateForm.validateFields();
            const [from, to] = values.dateRange;
            await axios.post(
              "https://localhost:7250/api/Tblvenueslots/Provider/generate-slots",
              {
                venueId: selectedVenue,
                fromDate: from.format("YYYY-MM-DD"),
                toDate: to.format("YYYY-MM-DD"),
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            message.success("Slots generated successfully.");
            setGenerateModalVisible(false);
            fetchSlots(selectedVenue);
          } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to generate slots.";
            message.error(errorMsg);
          }
        }}
        onCancel={() => setGenerateModalVisible(false)}
        okText="Generate"
      >
        <Form form={generateForm} layout="vertical">
          <Form.Item
            name="dateRange"
            label="Select Date Range"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <DatePicker.RangePicker className="w-100" />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default Provider_venueslot;
