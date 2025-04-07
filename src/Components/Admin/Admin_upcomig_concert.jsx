import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getUpcomingConcert, getVenue } from "../../API/Api_index";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Admin_upcoming_concert_form from "./Admin_upcoming_concert_form";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Admin_update_upcoming_concert_form from "./Admin_update_upcoming_concert_form";

function Admin_upcoming_concert(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [upcomingConcertModelShow, setupcomingConcertModelShow] = useState(false);
    const [upcomingConcertUpdateModel, setupcomingConcertUpdateModel] = useState(false);
    const { swal } = props;
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: null,
        concert_date:'',
        concert_singer:'',
        description:''
    });

    const handleFetchSingleUpcomingConcert = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/concert/upcoming-concert/show-upcom8ing-concert/${id}`, {
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
                    id: data.upcoming_concert.id,
                    concert_date: data.upcoming_concert.concert_date,
                    concert_singer:data.upcoming_concert.concert_singer,
                    description:data.upcoming_concert.description
                });
                // console.log("updated", formData);
                navigate('/Admin/upcomingconcert')
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
            const res = await getUpcomingConcert();
            setDataSource(res.upcoming_concert);
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
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/concert/upcoming-concert/delete-upcoming-concert/${id}`, {
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
                navigate('/Admin/upcomingconcert')
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
                <Typography.Title level={4}>upcoming concert</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setupcomingConcertModelShow(true)}>Add upcoming concert
                        </Button>
                        <Admin_upcoming_concert_form
                            show={upcomingConcertModelShow}
                            onHide={() => { setupcomingConcertModelShow(false); navigate('/Admin/upcomingconcert') }}
                            addFetchData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "concert date",
                            dataIndex: "concert_date",
                            // width: 100,
                            key: 'concert_date',
                        },
                        {
                            title: "concert singer",
                            dataIndex: "concert_singer",
                            key: 'concert_singer',
                            // width: 100,
                        },
                        {
                            title: "description",
                            dataIndex: "description",
                            key: 'price',
                            // width: 75,
                        },
                       
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleUpcomingConcert(record.id); setupcomingConcertUpdateModel(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_update_upcoming_concert_form
                                                show={upcomingConcertUpdateModel}
                                                onHide={() => { setupcomingConcertUpdateModel(false) }}
                                                upcoming_concertData={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteConcert(record.id)}>
                                            <a href="javascript:;" className="text-decoration-none btn btn-danger mt-3 rounded-5"><DeleteOutlined /></a>
                                        </Popconfirm>
                                    </>
                                    ) : null
                            ),
                            key: 'operation',
                            width:80
                        }
                    ]}
                    dataSource={dataSource}
                    // scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default withSwal(Admin_upcoming_concert);