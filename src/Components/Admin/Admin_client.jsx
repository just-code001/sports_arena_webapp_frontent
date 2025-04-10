import { Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

function Admin_client() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const fetchAdminClientData = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");

            const res = await axios.get("https://localhost:7250/api/Tblusers/Admin/all-clients", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDataSource(res.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminClientData();
    }, []);

    return (
        <div className="Eventmanager_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Clients</Typography.Title>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Name",
                            dataIndex: "name",
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Contact",
                            dataIndex: "contact",
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{ pageSize: 5 }}
                    rowKey="userId"
                />
            </Space>
        </div>
    );
}

export default Admin_client;
