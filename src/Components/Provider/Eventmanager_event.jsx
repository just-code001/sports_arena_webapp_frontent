import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getBirthdayBooking, getConcertBooking, getExihibitionBooking, getOrder, getWeddingBooking } from "../../API/Api_index";
import { Link, Navigate, useNavigate } from 'react-router-dom';


function Eventmanager_event() {

    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [exihibitionDataSource, setexihibitionDataSource] = useState([])
    
const fetchExihibitionBookingData = async () => {
    try {
        setLoading(true);
        const res = await getExihibitionBooking();
        setexihibitionDataSource(res.bookings);
        console.log(res.bookings)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchExihibitionBookingData();
}, []);

const [concertDataSource, setconcertDataSource] = useState([])
    
const fetchConcertBookingData = async () => {
    try {
        setLoading(true);
        const res = await getConcertBooking();
        setconcertDataSource(res.bookings);
        console.log(res.bookings)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchConcertBookingData();
}, []);


const [weddingDataSource, setweddingDataSource] = useState([])
    
const fetchWeddingBookingData = async () => {
    try {
        setLoading(true);
        const res = await getWeddingBooking();
        setweddingDataSource(res.bookings);
        console.log(res.bookings)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchWeddingBookingData();
}, []);


const [BirthdayDataSource, setBirthdayDataSource] = useState([])
    
const fetchBirthadyBookingData = async () => {
    try {
        setLoading(true);
        const res = await getBirthdayBooking();
        setBirthdayDataSource(res.bookings);
        console.log(res.bookings)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchBirthadyBookingData();
}, []);
    

  
//   const [registermodalShow, setRegisterModalShow] = useState(false);
  
//   const user = JSON.parse(localStorage.getItem("user-info"))

    //   const handleLogOut=()=>{
    //     localStorage.clear();
    //     navigate('/')
    //   }


    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Events</Typography.Title>

                
                <Typography.Title level={4}>Wedding</Typography.Title>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Client name",
                            dataIndex: "name"
                        },
                        {
                            title: "client email",
                            dataIndex: "email",

                        },
                        {
                            title: "address",
                            dataIndex: "address",
                        },
                        
                        {
                            title: "contact number",
                            dataIndex: "contact_number",
                        },
                        
                        {
                            title: "city",
                            dataIndex: "city",
                        },
                        
                        {
                            title: "guest list",
                            dataIndex: "guest_list",
                        },
                        
                        {
                            title: "specialServices",
                            dataIndex: "specialServices",
                        },
                        
                       
                    ]}
                    dataSource={weddingDataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>

<Typography.Title level={4}>Birthday</Typography.Title>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Client name",
                            dataIndex: "name"
                        },
                        {
                            title: "client email",
                            dataIndex: "email",

                        },
                        {
                            title: "address",
                            dataIndex: "address",
                        },
                        
                        {
                            title: "contact number",
                            dataIndex: "contact_number",
                        },
                        
                        {
                            title: "city",
                            dataIndex: "city",
                        },
                        
                        {
                            title: "guest list",
                            dataIndex: "guest_list",
                        },
                        
                        {
                            title: "package name",
                            dataIndex: "package_name",
                        },
                        {
                            title: "theme",
                            dataIndex: "theme",
                        }
                        
                       
                    ]}
                    dataSource={BirthdayDataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
                
                <Typography.Title level={4}>Exihibition</Typography.Title>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "client_name",
                            dataIndex: "client_name"
                        },
                        {
                            title: "client_email",
                            dataIndex: "client_email",

                        },
                        {
                            title: "contact_number",
                            dataIndex: "contact_number",
                        },
                        
                        {
                            title: "exhibition_name",
                            dataIndex: "exhibition_name",
                        },
                        
                        {
                            title: "no_of_tickets",
                            dataIndex: "no_of_tickets",
                        },
                        
                        {
                            title: "booking_date",
                            dataIndex: "booking_date",
                        },
                        
                        {
                            title: "exhibition_type",
                            dataIndex: "exhibition_type",
                        },
                        
                        {
                            title: "price",
                            dataIndex: "price",
                            render: (value) => <span>${value}</span>
                        },

                        {
                            title: "payment_status",
                            dataIndex: "payment_status"
                        },
                       
                    ]}
                    dataSource={exihibitionDataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>

<Typography.Title level={4}>Concert</Typography.Title>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "client_name",
                            dataIndex: "client_name"
                        },
                        {
                            title: "client_email",
                            dataIndex: "client_email",

                        },
                        {
                            title: "contact_number",
                            dataIndex: "contact_number",
                        },
                        
                        {
                            title: "exhibition_name",
                            dataIndex: "exhibition_name",
                        },
                        
                        {
                            title: "no_of_tickets",
                            dataIndex: "no_of_tickets",
                        },
                        
                        {
                            title: "booking_date",
                            dataIndex: "booking_date",
                        },
                        
                        {
                            title: "exhibition_type",
                            dataIndex: "exhibition_type",
                        },
                        
                        {
                            title: "price",
                            dataIndex: "price",
                            render: (value) => <span>${value}</span>
                        },

                        {
                            title: "payment_status",
                            dataIndex: "payment_status"
                        },
                       
                    ]}
                    dataSource={concertDataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default Eventmanager_event;