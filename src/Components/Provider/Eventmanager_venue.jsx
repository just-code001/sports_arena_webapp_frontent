import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getClientVenueBooking, getConcertBooking, getExihibitionBooking, getOrder } from "../../API/Api_index";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";


function Eventmanager_venue() {

    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [VenuedataSource, setVenuedataSource] = useState([])
    
const fetchVenueBookingData = async () => {
    try {
        setLoading(true);
        const res = await getClientVenueBooking();
        setVenuedataSource(res.bookings);
        console.log(res.bookings)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchVenueBookingData();
}, []);

    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Booked Venue</Typography.Title>
            
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "client name",
                            dataIndex: "client_name"
                        },
                        {
                            title: "client email",
                            dataIndex: "client_email",

                        },
                        {
                            title: "contact number",
                            dataIndex: "contact_number",
                        },
                        
                        {
                            title: "venue name",
                            dataIndex: "venue_name",
                        },
                        
                        {
                            title: "no of guests",
                            dataIndex: "no_of_guests",
                        },
                        
                        {
                            title: "checkin date",
                            dataIndex: "checkin_date",
                        },
                        
                        {
                            title: "checkout date",
                            dataIndex: "checkout_date",
                        },
                        
                        {
                            title: "price",
                            dataIndex: "price",
                            render: (value) => <span>${value}</span>
                        },

                        {
                            title: "payment status",
                            dataIndex: "payment_status"
                        },
                       
                    ]}
                    dataSource={VenuedataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default Eventmanager_venue;