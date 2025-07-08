import React from "react";
import { Form, Input, Typography } from "antd";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Provider_change_password = () => {
  const [form] = Form.useForm();
  const token = sessionStorage.getItem("token");

  const onFinish = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.warning("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7250/api/Tblusers/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully.");
        form.resetFields();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to change password.";
      toast.error(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <Typography.Title level={3}>Change Password</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter current password." }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter new password." }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm new password." }]}
        >
          <Input.Password />
        </Form.Item>

        <Button variant="primary" type="submit">
          Change Password
        </Button>
      </Form>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Provider_change_password;
