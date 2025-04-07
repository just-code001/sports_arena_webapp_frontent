import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getClientVenueBooking, getConcertBooking, getExihibitionBooking, getOrder } from "../../API/Api_index";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import UpdateVenueBookingPaymentStatus from "./UpdateVenueBookingPaymentStatus";
import { EditOutlined } from "@ant-design/icons";
import { withSwal } from "react-sweetalert2";
import axios from "axios";

function Admin_booked_venue(props) {

    
    const navigate = useNavigate();
    const { swal } = props;
    const [loading, setLoading] = useState(false)
    const [VenuedataSource, setVenuedataSource] = useState([])
    const [updateVenueModelShow, setupdateVenueModelShow] = useState(false);

    const [formData, setFormdata] = useState({
        id: null,
        payment_status: '',
    });

    
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

 // fetch single data of concert
 const handleFetchSingleVenueBook = async (id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/venue/show-single-venuebooking/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        console.log("single", data)
        if (data.status === 0) {
            // If there are errors, set them to state
            swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error',
            });
        } else {
            // If successful, show success alert or take further action
            setFormdata({
                id: data.venuebooking.id,
                payment_status:data.venuebooking.payment_status
            });
            console.log("updated", formData);
        }
    } catch (error) {
        // If request fails, log the error or handle it appropriately
        if (error.response) {
            //   setErrors(error.response.data.errors)
        } else if (error.request) {
            console.log(error.request);
        } else {
            // If something else happened while setting up the request
            console.log('Error', error.message);
        }
    }
}


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
                            sorter: (a, b) => new Date(a.checkin_date) - new Date(b.checkin_date),
                        },
                        
                        {
                            title: "checkout date",
                            dataIndex: "checkout_date",
                            sorter: (a, b) => new Date(a.checkout_date) - new Date(b.checkout_date),
                        },
                        
                        {
                            title: "price",
                            dataIndex: "price",
                            render: (value) => <span>Rs.{value}</span>
                        },

                        {
                            title: "payment status",
                            dataIndex: "payment_status"
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                VenuedataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleVenueBook(record.id); setupdateVenueModelShow(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <UpdateVenueBookingPaymentStatus
                                                show={updateVenueModelShow}
                                                onHide={() => { setupdateVenueModelShow(false) }}
                                                paymentStatusData={formData}
                                                updateFetchData={fetchVenueBookingData} />
                                        </span>
                                    </>
                                    ) : null
                            ),
                        }
                       
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
export default withSwal(Admin_booked_venue);