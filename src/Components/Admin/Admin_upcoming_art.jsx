import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { getupcomingArt } from "../../API/Api_index";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Admin_upcoming_art_form from "./Admin_upcoming_art_form";
import Admin_upcoming_art_update_form from "./admin_upcoming_art_update_form";

function Admin_upcoming_concert(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [upcomingArtmodelShow, setupcomingArtmodelShow] = useState(false);
    const [upcomingArtUpdateModel, setupcomingArtUpdateModel] = useState(false);
    const { swal } = props;
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: null,
        art_name:'',
        art_image: null,
        art_date:'',
        art_description:''
    });

    const handleFetchSingleupcomingArt = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/concert/upcoming-art/show-upcoming-art/${id}`, {
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
                    id: data.upcoming_art.id,
                    art_name: data.upcoming_art.art_name,
                    art_image:data.upcoming_art.art_image,
                    art_date:data.upcoming_art.art_date,
                    art_description:data.upcoming_art.art_description
                });
                // console.log("updated", formData);
                navigate('/Admin/upcomingart')
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
            const res = await getupcomingArt();
            setDataSource(res.upcoming_art);
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

    const handleDeleteArt = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/concert/upcoming-art/delete-upcoming-art/${id}`, {
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
                navigate('/Admin/upcomingart')
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
                <Typography.Title level={4}>upcoming art exhibition</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setupcomingArtmodelShow(true)}>Add upcoming Art
                        </Button>
                        <Admin_upcoming_art_form
                            show={upcomingArtmodelShow}
                            onHide={() => { setupcomingArtmodelShow(false); navigate('/Admin/upcomingart') }}
                            addFetchData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "art name",
                            dataIndex: "art_name",
                            // width: 100,
                            key: 'art_name',
                        },
                        
                            {
                                title: "Art Image",
                                dataIndex: "art_image",
                                render: (text, record) => {
                                    return (
                                        <img src={`http://127.0.0.1:8000/images/${record.art_image}`} height="100px" width="100px" alt="" />
                                    )
                                },
                                key: 'art_image',
                                width: 120,
    
                            },
                        
                        {
                            title: "art_date",
                            dataIndex: "art_date",
                            key: 'art_date',
                            // width: 75,
                        },
                        {
                            title: "art_description",
                            dataIndex: "art_description",
                            key: 'art_description',
                            // width: 75,
                        },
                       
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleupcomingArt(record.id); setupcomingArtUpdateModel(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_upcoming_art_update_form
                                                show={upcomingArtUpdateModel}
                                                onHide={() => { setupcomingArtUpdateModel(false) }}
                                                upcoming_artdata={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteArt(record.id)}>
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
                >
                    
                </Table>
            </Space>
        </div>
    );
}
export default withSwal(Admin_upcoming_concert);