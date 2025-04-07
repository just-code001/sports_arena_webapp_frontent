import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {  getVenueBooking } from "../../API/Api_index";
// import Login from './Login';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Admin_eventmanagerform from "./Admin_eventmanagerform";
import { EditOutlined } from "@ant-design/icons";
import UpdateVenueBookingPaymentStatus from "./UpdateVenueBookingPaymentStatus";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Admin_transaction(props){

    const { swal } = props;
    const navigate = useNavigate();
    const[loading,setLoading]=useState(false)
    const[dataSource,setDataSource]=useState([])
    const [updateModelShow, setUpdateModelShow] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState({
        id:null,
        payment_status:''
    });

    const handleFetchSingleVenueBooking = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/venue/show-single-venuebooking/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            console.log(data.venuebooking.payment_status)
            if (data.status === 0) {
                // If there are errors, set them to state
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                // If successful, show success alert or take further action
                setPaymentStatus({
                    id:data.venuebooking.id,
                    payment_status:data.venuebooking.payment_status
                });
                console.log("updated", paymentStatus);
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getVenueBooking();
            setDataSource(res.bookings);
        } catch (error) {
            console.error('Error fetching order:', error);
            // Handle the error gracefully, e.g., show a message to the user
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);


return(
    <div className="Admin_pagecontent">
<Space size={20} direction="vertical">
<Typography.Title level={4}>Transaction</Typography.Title>

<Table
loading={loading}
columns={[
    {
    title:"client_name",
    dataIndex:"client_name"
},
{
    title:"client_email",
    dataIndex:"client_email",
},
{
    title:"contact_number",
    dataIndex:"contact_number",
},

{
    title:"venue_name",
    dataIndex:"venue_name"
},
{
    title:"no_of_guests",
    dataIndex:"no_of_guests"
},
{
    title:"price",
    dataIndex:"price"
},
{
    title:"payment_status",
    dataIndex:"payment_status"
},
{
    title: 'operation',
    dataIndex: 'operation',
    render: (text, record) => (
        dataSource.length >= 1
            ? (<>
                <span >
                    <button onClick={() => {handleFetchSingleVenueBooking(record.id); setUpdateModelShow(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                    <UpdateVenueBookingPaymentStatus
                        show={updateModelShow}
                        onHide={() => { setUpdateModelShow(false) }}
                        paymentStatusData={paymentStatus}
                        updateFetchData={fetchData} />
                </span>
            </>
            ) : null
    ),
}



]}
dataSource={dataSource}
pagination={{
    pageSize:5,
}}
></Table>
</Space>
</div>
);
}
export default withSwal(Admin_transaction);