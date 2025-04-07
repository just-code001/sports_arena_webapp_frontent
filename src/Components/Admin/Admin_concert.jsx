import {  Popconfirm, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getConcert } from "../../API/Api_index";
import Admin_concertform from "./Admin_concertform";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { withSwal } from "react-sweetalert2";
import axios from "axios";
import Admin_updateconcertform from "./Admin_updateconcertform";


function Admin_concert(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [concertmodalShow, setConcertModalShow] = useState(false);
    const [updateModelShow, setUpdateModelShow] = useState(false);
    const navigate = useNavigate();
    const { swal } = props;
    const [formData, setFormdata] = useState({
        id: null,
        event_name: '',
        singer: '',
        event_timing: '',
        concert_date: null,
        concert_image: '',
        description: '',
        city: '',
        state: '',
        pincode: '',
        location: '',
        ticket_type1: '',
        ticket_pricing1: '',
        ticket_type2: '',
        ticket_pricing2: '',
        ticket_type3: '',
        ticket_pricing3: ''
    });

    // fetch single data of concert
    const handleFetchSingleConcert = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/event/concert/show-concert/${id}`, {
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
                    id: data.concert.id,
                    event_name: data.concert.event_name,
                    singer: data.concert.singer,
                    event_timing: data.concert.event_timing,
                    concert_date: data.concert.concert_date,
                    concert_image: data.concert.concert_image,
                    description: data.concert.description,
                    city: data.concert.city,
                    state: data.concert.state,
                    pincode: data.concert.pincode,
                    location: data.concert.location,
                    ticket_type1: data.concert.ticket_type1,
                    ticket_pricing1: data.concert.ticket_pricing1,
                    ticket_type2: data.concert.ticket_type2,
                    ticket_pricing2: data.concert.ticket_pricing2,
                    ticket_type3: data.concert.ticket_type3,
                    ticket_pricing3: data.concert.ticket_pricing3
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getConcert();
            setDataSource(res.concerts);
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

    const handleDeleteConcert = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/event/concert/delete-concert/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            console.log(data);
            if (data.status === 0) {
                // If there are errors, set them to state
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                // If successful, show success alert or take further action
                swal.fire({
                    title: 'Done',
                    text: data.message,
                    icon: 'success',
                });
                navigate('Admin/event/concert')
                fetchData();
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
    };

    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Concert</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setConcertModalShow(true)}>Add
                        </Button>
                        <Admin_concertform
                            show={concertmodalShow}
                            onHide={() => { setConcertModalShow(false); navigate('/Admin/event/concert') }}
                            refreshData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "event_name",
                            dataIndex: "event_name",
                            width: 150,
                            key: 'event_name',
                            fixed: 'left',
                        },
                        {
                            title: "singer",
                            dataIndex: "singer",
                            width: 100,
                            key: 'singer',
                            fixed: 'left',
                        },
                        {
                            title: "event_timing",
                            dataIndex: "event_timing",
                            key: '1'
                        },
                        {
                            title: "concert_date",
                            dataIndex: "concert_date",
                            key: '2'
                        },
                        {
                            title: "concert_image",
                            dataIndex: "concert_image",
                            render: (text, record) => {
                                return (
                                    <img src={`http://127.0.0.1:8000/images/concert_images/${record.concert_image}`} height="100px" width="130px" alt="" />
                                )
                            },
                            key: '3',
                        },

                        {
                            title: "Address",
                            dataIndex: "Address",
                            render: (text, record) => {
                                return (
                                    <h6>{record.location}, {record.city}, {record.state} <br /> - {record.pincode} </h6>
                                )
                            },
                            key: '4'
                        },
                        {
                            title: "Ticket Type & Price",
                            dataIndex: "ticket_type1",
                            render: (text, record) => {
                                return (
                                    <h6>{record.ticket_type1} - {record.ticket_pricing1} Rs.<br /> {record.ticket_type2} - {record.ticket_pricing2} Rs. <br /> {record.ticket_type3} - {record.ticket_pricing3} Rs. </h6>
                                )
                            },
                            key: '5',
                            width: 250,
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleConcert(record.id); setUpdateModelShow(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_updateconcertform
                                                show={updateModelShow}
                                                onHide={() => { setUpdateModelShow(false) }}
                                                concertData={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteConcert(record.id)}>
                                            <a href="javascript:;" className="text-decoration-none mx-2 btn btn-danger rounded-5"><DeleteOutlined /></a>
                                        </Popconfirm>
                                    </>
                                    ) : null
                            ),
                        }


                    ]}
                    dataSource={dataSource}
                    scroll={{
                        x: 1300,
                    }}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default withSwal(Admin_concert);