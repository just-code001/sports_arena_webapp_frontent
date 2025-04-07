import { useEffect, useState } from "react";
import { Table, Space, Typography, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { Button } from "react-bootstrap";
import Admin_special_service_form from "./Admin_special_service_form";
import Admin_special_service_update_form from "./Admin_special_service_update_form";

const Admin_special_service = (props) => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [specialServiceModelShow, setSpecialServiceModelShow] = useState(false);
    const [specialServiceUpdateModel, setSpecialServiceUpdateModel] = useState(false);
    const { swal } = props;
    const [formData, setFormdata] = useState({
        id: null,
        service_name:'',
        description:'',
        testimonial:''
    });

    const handleFetchSingleSpecialService = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/wedding/special-service/show-service/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            console.log(data)
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
                    id: data.service.id,
                    service_name: data.service.service_name,
                    description:data.service.description,
                    testimonial:data.service.testimonial
                });
                // console.log("updated", formData);
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

    // fetch data when page loads
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:8000/api/admin/wedding/special-service/show-services");
            const data = response.data;
            if (data.status === 1) {
                setDataSource(data.service);
            } else {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            swal.fire({
                title: 'Error',
                text: 'Failed to fetch data',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    // delete special service
    const handleDeleteService = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/wedding/special-service/delete-service/${id}`);
            const data = response.data;
            if (data.status === 1) {
                swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                });
                fetchData();
            } else {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            swal.fire({
                title: 'Error',
                text: 'Failed to delete service',
                icon: 'error',
            });
        }
    };
  return (
    <>
      <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Special Services</Typography.Title>

                <Space className="d-flex justify-content-end">
                    <Button variant="dark" className='mx-1' onClick={() => setSpecialServiceModelShow(true)}>Add Special Service</Button>
                    <Admin_special_service_form
                        show={specialServiceModelShow}
                        onHide={() => { setSpecialServiceModelShow(false) }}
                        addFetchData={fetchData} />
                </Space>

                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Service Name",
                            dataIndex: "service_name",
                            key: 'service_name',
                        },
                        {
                            title: "Service Image",
                            dataIndex: "other_img1",
                            render: (text,record) => <img src={`http://127.0.0.1:8000/images/service_images/${record.service_image}`} height="100px" width="100px" alt="" />,
                            key: 'other_img1',
                        },
                        {
                            title: "Other Images",
                            dataIndex: "other_img2",
                            render: (text,record) => <img src={`http://127.0.0.1:8000/images/service_images/${record.other_img1}`} height="100px" width="100px" alt="" />,
                            key: 'other_img2',
                        },
                        {
                            title: "Other Images",
                            dataIndex: "other_img3",
                            render: (text,record) => <img src={`http://127.0.0.1:8000/images/service_images/${record.other_img2}`} height="100px" width="100px" alt="" />,
                            key: 'other_img3',
                        },
                        {
                            title: "Other Images",
                            dataIndex: "service_image",
                            render: (text,record) => <img src={`http://127.0.0.1:8000/images/service_images/${record.other_img3}`} height="100px" width="100px" alt="" />,
                            key: 'service_image',
                        },
                        {
                            title: "Description",
                            dataIndex: "description",
                            key: 'description',
                        },
                        {
                            title: "Testimonial",
                            dataIndex: "testimonial",
                            key: 'testimonial',
                        },
                        {
                            title: 'Actions',
                            dataIndex: 'actions',
                            render: (_, record) => (
                                <Space>
                                    <span>
                                    <Button className="text-decoration-none btn btn-primary mt-3 rounded-5" onClick={() => {handleFetchSingleSpecialService(record.id); setSpecialServiceUpdateModel(true)}}><EditOutlined /></Button>
                                    <Admin_special_service_update_form
                                                show={specialServiceUpdateModel}
                                                onHide={() => { setSpecialServiceUpdateModel(false) }}
                                                specialServiceData={formData}
                                                updateFetchData={fetchData} />
                                                </span>
                                    <Popconfirm title="Are you sure to delete this service?" onConfirm={() => handleDeleteService(record.id)}>
                                        <Button type="danger" className="text-decoration-none btn btn-danger mt-3 rounded-5"><DeleteOutlined /></Button>
                                    </Popconfirm>
                                </Space>
                            ),
                            width: 150,
                        },
                    ]}
                    dataSource={dataSource}
                />
            </Space>
        </div>
    </>
  )
}

export default withSwal(Admin_special_service)
