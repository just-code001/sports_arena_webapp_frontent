import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getUser } from "../../API/Api_index";
// import Login from './Login';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Admin_eventmanagerform from "./Admin_eventmanagerform";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Admin_eventmanagerupdateform from "./Admin_eventmanagerupdateform";

function Admin_user(props) {

    const [addModelShow, setAddModelShow] = useState(false);
    const [updateModelShow, setUpdateModelShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [formData, setFormdata] = useState({
        user_id:null,
        name: '',
        email: '',
        mobile_no: '',
        type: '',
        adhaarcard_details: '',
        skills: '',
        salary: '',
        status: ''
    });
    const [name, setName] = useState('');

    const { swal } = props;
    const navigate = useNavigate();
    

    const handleFetchSingleUser = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/show-user/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            console.log(data.user.name);
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
                    user_id:data.user.user_id,
                    name: data.user.name,
                    email: data.user.email,
                    mobile_no: data.user.mobile_no,
                    type: data.user.type,
                    adhaarcard_details: data.user.aadharcard_details,
                    skills: data.user.skills,
                    salary: data.user.salary,
                    status: data.user.status
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

    // const handleUpdateClick = (id) => {
    //     handleFetchSingleUser(id);
    // }

    const handleDeleteUser = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/delete-user/${id}`, {
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
                navigate('/admin/user')
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getUser();
            setDataSource(res.users);
            console.log(res.users)
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


    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Users</Typography.Title>


                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setAddModelShow(true)}>Add
                        </Button>
                        <Admin_eventmanagerform
                            show={addModelShow}
                            onHide={() => { setAddModelShow(false) }}
                            addFetchData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "name",
                            dataIndex: "name"
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Mobile No.",
                            dataIndex: "mobile_no",
                        },

                        {
                            title: "Type",
                            dataIndex: "type"
                        },
                        {
                            title: "Aadharcard Details",
                            dataIndex: "adhaarcard_details"
                        },
                        {
                            title: "skills",
                            dataIndex: "skills",
                        },
                        {
                            title: "salary",
                            dataIndex: "salary"
                        },
                        {
                            title: "status",
                            dataIndex: "status"
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => {handleFetchSingleUser(record.user_id);setUpdateModelShow(true)}} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_eventmanagerupdateform
                                                show={updateModelShow}
                                                onHide={() => { setUpdateModelShow(false) }}
                                                userData={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <Popconfirm className="mx-2" title="Sure to delete?" onConfirm={() => handleDeleteUser(record.user_id)}>
                                            <a href="javascript:;" className="text-decoration-none btn btn-danger rounded-5"><DeleteOutlined /></a>
                                        </Popconfirm>
                                    </>
                                    ) : null
                            ),
                        }
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
export default withSwal(Admin_user);
