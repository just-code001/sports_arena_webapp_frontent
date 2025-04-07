import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
// import Login from './Login';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";

function Admin_review() {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/show-reviews`);
                setDataSource(response.data.reviews);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors if needed
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [])

    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Review</Typography.Title>

                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "name",
                            dataIndex: "name"
                        },
                        {
                            title: "email",
                            dataIndex: "email",
                        },
                        {
                            title: "message",
                            dataIndex: "message",
                           
                        },

                    ]}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default Admin_review;