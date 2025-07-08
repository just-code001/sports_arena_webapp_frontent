import React, { useEffect, useState } from "react";
import {
    Table,
    Modal,
    Form,
    Input,
    message,
    Typography,
    Popconfirm,
    Space,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Admin_providers = () => {
    const [providers, setProviders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpInput, setOtpInput] = useState("");

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const { data } = await axios.get(
                "https://localhost:7250/api/Tblusers/Admin/get-providers",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProviders(data.data || []);
        } catch {
            message.error("Failed to fetch providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleAddProvider = () => {
        form.resetFields();
        setOtpSent(false);
        setOtpVerified(false);
        setOtpInput("");
        setIsModalVisible(true);
    };

    const handleSendOtp = async () => {
        try {
            const email = form.getFieldValue("email");
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                return message.warning("Please enter a valid email first");
            }

            const { data } = await axios.post("https://localhost:7250/api/tblusers/send-otp", { email }, { withCredentials: true });
            if (data.success) {
                setOtpSent(true);
                message.success("OTP sent to email");
            } else {
                message.error(data.message || "Failed to send OTP");
            }
        } catch {
            message.error("Failed to send OTP");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const email = form.getFieldValue("email");
            if (!otpInput) return message.warning("Please enter the OTP");

            const { data } = await axios.post(
                "https://localhost:7250/api/tblusers/verify-otp",
                {
                    email,
                    otp: otpInput,
                },
                { withCredentials: true } // ✅ This is crucial for session-based verification
            );

            if (data.success) {
                setOtpVerified(true);
                message.success("OTP verified successfully");
            } else {
                message.error(data.message || "OTP verification failed");
            }
        } catch {
            message.error("OTP verification failed");
        }
    };

    const handleSubmit = async () => {
        try {
            if (!otpVerified) {
                return message.warning("Please verify OTP before submitting");
            }

            const values = await form.validateFields();
            const token = sessionStorage.getItem("token");

            await axios.post(
                "https://localhost:7250/api/Tblusers/Admin/create-provider",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            message.success("Provider created successfully");
            setIsModalVisible(false);
            fetchProviders();
        } catch (error) {
            message.error(
                error.response?.data?.message || "Failed to create provider"
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(
                `https://localhost:7250/api/Tblusers/Admin/delete-provider/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success("Provider deleted successfully");
            fetchProviders();
        } catch {
            message.error("Failed to delete provider");
        }
    };

    const columns = [
        { title: "Provider ID", dataIndex: "userId" },
        { title: "Name", dataIndex: "name" },
        { title: "Email", dataIndex: "email" },
        { title: "Contact", dataIndex: "contact" },
        {
            title: "Actions",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Are you sure to delete this provider?"
                        onConfirm={() => handleDelete(record.userId)}
                    >
                        <Button variant="danger" size="sm">
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <Typography.Title level={3}>Manage Providers</Typography.Title>
            <Button variant="primary" className="mb-3" onClick={handleAddProvider}>
                <PlusOutlined /> Add New Provider
            </Button>

            <Table
                columns={columns}
                dataSource={providers}
                rowKey="userId"
                bordered
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Create New Provider"
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText="Create"
                okButtonProps={{ disabled: !otpVerified }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Provider Name"
                        rules={[{ required: true, message: "Please enter name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Enter valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="contact"
                        label="Contact Number"
                        rules={[{ required: true, message: "Please enter contact number" }]}
                    >
                        <Input />
                    </Form.Item>

                    <div className="d-flex flex-column gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={handleSendOtp}
                            disabled={otpSent}
                        >
                            {otpSent ? "OTP Sent" : "Send OTP"}
                        </Button>

                        {otpSent && (
                            <>
                                <Input
                                    placeholder="Enter OTP"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value)}
                                />
                                <Button
                                    variant="outline-success"
                                    onClick={handleVerifyOtp}
                                    disabled={otpVerified}
                                >
                                    {otpVerified ? "OTP Verified" : "Verify OTP"}
                                </Button>
                            </>
                        )}
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Admin_providers;
