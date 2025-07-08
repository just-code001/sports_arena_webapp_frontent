import { Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

function Admin_booked_slots() {
    const [loading, setLoading] = useState(false);
    const [slotDataSource, setSlotDataSource] = useState([]);

    const fetchSlotBookingData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://localhost:7250/api/Tblbookings/Admin/all-bookings", {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.success) {
                setSlotDataSource(res.data.data);
                console.log(res.data.data);
            } else {
                console.error("Failed to fetch slot bookings.");
            }
        } catch (error) {
            console.error("Error fetching slot bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlotBookingData();
    }, []);

    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Booked Slots</Typography.Title>

                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "User Name",
                            dataIndex: "userName",
                            key: "userName"
                        },
                        {
                            title: "Venue ID",
                            dataIndex: "venueId",
                            key: "venueId"
                        },
                        {
                            title: "Slot Date",
                            dataIndex: "date",
                            key: "date",
                            sorter: (a, b) => new Date(a.date) - new Date(b.date),
                        },
                        {
                            title: "Start Time",
                            dataIndex: "slotStartTime",
                            key: "slotStartTime"
                        },
                        {
                            title: "End Time",
                            dataIndex: "slotEndTime",
                            key: "slotEndTime"
                        },
                        {
                            title: "Payable Amount",
                            dataIndex: "payableAmount",
                            key: "payableAmount",
                            render: (value) => <span>Rs.{value}</span>
                        },
                        {
                            title: "Payment Paid",
                            dataIndex: "paymentPaid",
                            key: "paymentPaid",
                            render : (value)=> value? <span>Paid</span>:<span>Pending</span>
                        }
                    ]}
                    dataSource={slotDataSource}
                    rowKey="bookingId"
                    pagination={{ pageSize: 5 }}
                />
            </Space>
        </div>
    );
}

export default Admin_booked_slots;
