import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import Admin_venueform from "./Admin_venueform";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getVenue } from "../../API/Api_index";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Admin_updatevenueform from "./Admin_updatevenueform";
import { Select } from 'antd';

function Admin_venue(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [venuemodalShow, setVenueModalShow] = useState(false);
    const [updateModelShow, setUpdateModelShow] = useState(false);
    const { swal } = props;
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: null,
        name: '',
        venue_category: '',
        venue_image: null,
        price: '',
        rating: '',
        venue_capacity: '',
        status: '',
        description: '',
        city: '',
        state: '',
        pincode: '',
        location: '',
        contact: '',
        food_facility: '',
        special_facility: '',
    });

    const handleFetchSingleVenue = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/venue/show-venue/${id}`, {
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
                    id: data.venue.id,
                    name: data.venue.name,
                    venue_category: data.venue.venue_category,
                    venue_image: data.venue.venue_image,
                    price: data.venue.price,
                    rating: data.venue.rating,
                    venue_capacity: data.venue.venue_capacity,
                    status: data.venue.status,
                    description: data.venue.detail.description,
                    city: data.venue.detail.city,
                    state: data.venue.detail.state,
                    pincode: data.venue.detail.pincode,
                    location: data.venue.detail.location,
                    contact: data.venue.detail.contact,
                    food_facility: data.venue.detail.food_facility,
                    special_facility: data.venue.detail.special_facility,
                });
                console.log("updated", formData);
                // navigate('/admin/order')
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
            const res = await getVenue();
            setDataSource(res.venues);
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

    const handleDeleteVenue = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/venue/delete-venue/${id}`, {
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
                navigate('/admin/venue')
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


    const handleChangeStatus = async (id, status) => {
        try {
          const response = await axios.put(`http://127.0.0.1:8000/api/admin/venue/update-status/${id}`,
            { status },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = response.data;
          if (data.status === 0) {
            // If there are errors, display an error message
            swal.fire({
              title: 'Error',
              text: data.message,
              icon: 'error',
            });
          } else {
            // If successful, display a success message and update the venue list
            swal.fire({
              title: 'Success',
              text: 'Status updated successfully',
              icon: 'success',
            });
            fetchData();
          }
        } catch (error) {
          // Handle errors
          console.error('Error updating status:', error);
        }
      };
      


    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>venue</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setVenueModalShow(true)}>Add Venue
                        </Button>
                        <Admin_venueform
                            show={venuemodalShow}
                            onHide={() => { setVenueModalShow(false); navigate('/admin/venue') }}
                            addFetchData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Name",
                            dataIndex: "name",
                            width: 100,
                            key: 'name',
                            fixed: 'left',
                        },
                        {
                            title: "Venue category",
                            dataIndex: "venue_category",
                            key: 'venue_category',
                            fixed: 'left',
                            width: 100,
                        },
                        {
                            title: "Venue Image",
                            dataIndex: "venue_image",
                            render: (text, record) => {
                                return (
                                    <img src={`http://127.0.0.1:8000/images/${record.venue_image}`} height="100px" width="100px" alt="" />
                                )
                            },
                            key: 'venue_image',
                            width: 120,

                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            key: 'price',
                            width: 75,
                            render: (value) => <span>Rs.{value}</span>
                        },
                        {
                            title: "Rating",
                            dataIndex: "rating",
                            render: (rating) => {
                                return <Rate value={parseFloat(rating)} allowHalf disabled />
                            }, // Convert rating from string to number
                            key: 'rating',
                            width: 150,
                        },
                        // {
                        //     title: "Address",
                        //     dataIndex: "Address",
                        //     render: (text, record) => {
                        //         return (
                        //             <p>{record.detail.location}, {record.detail.city}, {record.detail.state} <br /> - {record.detail.pincode} </p>
                        //         )
                        //     },
                        //     key: '4'
                        // },
                        // {
                        //     title: "Status",
                        //     dataIndex: "status",
                        //     key: 'status',
                        //     width: 150,
                        // },

                        {
                            title: "Status",
                            dataIndex: "status",
                            key: 'status',
                            width: 150,
                            render: (status, record) => (
                              <Select
                                defaultValue={status}
                                style={{ width: 120 }}
                                onChange={(value) => handleChangeStatus(record.id, value)}
                              >
                                <Select.Option value="booked">Booked</Select.Option>
                                <Select.Option value="not booked">Not Booked</Select.Option>
                              </Select>
                            ),
                          },
                          
                        {
                            title: "Venue Capacity",
                            dataIndex: "venue_capacity",
                            key: 'venue_capacity',
                            width:  50,
                        },
                        // {
                        //     title: "Description",
                        //     dataIndex: ["detail", "description"], // Accessing nested key
                        //     key: 'description',
                        //     width: 150,
                        // },
                        {
                            title: "Contact",
                            dataIndex: ["detail", "contact"],// Accessing nested key
                            key: 'contact',
                            width: 100,
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleVenue(record.id); setUpdateModelShow(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_updatevenueform
                                                show={updateModelShow}
                                                onHide={() => { setUpdateModelShow(false) }}
                                                venueData={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteVenue(record.id)}>
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
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
    );
}
export default withSwal(Admin_venue);