import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getPackage, getTheme } from "../../API/Api_index";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Admin_exihibitionform from "./Admin_exihibitionform";
import Admin_birthday_packageform from "./Admin_birthday_packageform";
import Admin_birthday_theamform from "./Admin_birthday_theamform";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Admin_package_updateform from "./Admin_package_updateform";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function Admin_birthday(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])

    const [packagemodalShow, setpackageModalShow] = useState(false);
    const [thememodelShow, setThemeModalShow] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user-info"))


    const [themedataSource, setthemeDataSource] = useState([])
    const [updateModelPackage, setupdateModelPackage] = useState(false);
    const { swal } = props;
    const [formData, setFormdata] = useState({
        id: null,
        type: '',
        packagename: '',
        packageimage: '',
        packagepricing: '',
        description: '',
    });


    const [updateModelTheme, setupdateModelTheme] = useState(false);
    // const { swal } = props;
    const [themeformData, setthemeFormdata] = useState({
        id: null,
        type: '',
        themename: '',
        themeimage: ''
    });

    //handle single theme

    const handleFetchSingleTheme = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/event/birthday/show-theme/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.status === 0) {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                setthemeFormdata({
                    id: data.theme.id,
                    type: data.theme.type,
                    themename: data.theme.themename,
                    themeimage: data.theme.themeimage,
                });
                console.log("updated", themeformData);
            }
        } catch (error) {
            console.log('Error', error.message);
            swal.fire({
                title: 'Error',
                text: 'Failed to fetch exhibition. Please try again later.',
                icon: 'error',
            });
        }
    }

    //fetch theme data
    const fetchThemeData = async () => {
        try {
            setLoading(true);
            const res = await getTheme();
            setthemeDataSource(res.theme);
            console.log(res.theme)
        } catch (error) {
            console.error('Error fetching order:', error);
            // Handle the error gracefully, e.g., show a message to the user
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchThemeData();
    }, []);

    //delete package
    const handleDeleteTheme = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/event/birthday/delete-theme/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            if (data.status === 0) {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                swal.fire({
                    title: 'Done',
                    text: data.message,
                    icon: 'success',
                });
                navigate('/Admin/event/birthday');
                fetchThemeData();
            }
        } catch (error) {
            console.log('Error', error.message);
            swal.fire({
                title: 'Error',
                text: 'Failed to delete exhibition. Please try again later.',
                icon: 'error',
            });
        }
    };


    //handle single package

    const handleFetchSinglePackage = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/event/birthday/show-package/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.status === 0) {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                setFormdata({
                    id: data.package.id,
                    type: data.package.type,
                    packagename: data.package.packagename,
                    packageimage: data.package.packageimage,
                    packagepricing: data.package.packagepricing,
                    description: data.package.description,


                });
                console.log("updated", formData);
            }
        } catch (error) {
            console.log('Error', error.message);
            swal.fire({
                title: 'Error',
                text: 'Failed to fetch exhibition. Please try again later.',
                icon: 'error',
            });
        }
    }


    //fetch package data
    const fetchPackageData = async () => {
        try {
            setLoading(true);
            const res = await getPackage();
            setDataSource(res.package);
            console.log(res.package)
        } catch (error) {
            console.error('Error fetching order:', error);
            // Handle the error gracefully, e.g., show a message to the user
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchPackageData();
    }, []);

    //delete package
    const handleDeletePackage = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/event/birthday/delete-package/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            if (data.status === 0) {
                swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                });
            } else {
                swal.fire({
                    title: 'Done',
                    text: data.message,
                    icon: 'success',
                });
                navigate('/Admin/event/birthday');
                fetchPackageData();
            }
        } catch (error) {
            console.log('Error', error.message);
            swal.fire({
                title: 'Error',
                text: 'Failed to delete exhibition. Please try again later.',
                icon: 'error',
            });
        }
    };
    return (
        <div className="Admin_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Birthday</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setpackageModalShow(true)}>Add Packages
                        </Button>
                        <Admin_birthday_packageform
                            show={packagemodalShow}
                            onHide={() => { setpackageModalShow(false); navigate('/Admin/event/birthday') }}
                            addFetchData={fetchPackageData} />

                        <Button variant="dark" className='mx-1' onClick={() => setThemeModalShow(true)}>Add Themes
                        </Button>
                        <Admin_birthday_theamform
                            show={thememodelShow}
                            onHide={() => { setThemeModalShow(false); navigate('/Admin/event/birthday') }} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "type",
                            dataIndex: "type"
                        },

                        {
                            title: "packagename",
                            dataIndex: "packagename"
                        },

                        {
                            title: "packageimage",
                            dataIndex: "packageimage",
                            render: (text, record) => {
                                return (
                                    <img src={`http://127.0.0.1:8000/images/${record.packageimage}`} height="100px" width="100px" alt="" />
                                )
                            }
                        },
                        {
                            title: "packagepricing",
                            dataIndex: "packagepricing",
                            render: (value) => <span>${value}</span>
                        },

                        {
                            title: "description",
                            dataIndex: "description"
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSinglePackage(record.id); setupdateModelPackage(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_package_updateform
                                                show={updateModelPackage}
                                                onHide={() => { setupdateModelPackage(false) }}
                                                packageData={formData}
                                                updateFetchData={fetchPackageData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeletePackage(record.id)}>
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

                    {/* handle theme table */}
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "type",
                            dataIndex: "type"
                        },
                        
                        {
                            title: "themename",
                            dataIndex: "themename"
                        },

                        {
                            title: "themeimage",
                            dataIndex: "themeimage",
                            render: (text, record) => {
                                return (
                                    <img src={`http://127.0.0.1:8000/images/${record.themeimage}`} height="100px" width="100px" alt="" />
                                )
                            }
                        },
                        
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleTheme(record.id); setupdateModelTheme(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_package_updateform
                                                show={updateModelTheme}
                                                onHide={() => { setupdateModelTheme(false) }}
                                                themeData={formData}
                                                updateFetchData={fetchThemeData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteTheme(record.id)}>
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
export default withSwal(Admin_birthday);