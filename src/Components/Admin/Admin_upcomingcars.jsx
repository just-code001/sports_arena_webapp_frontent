import { Avatar, Popconfirm, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { getupcomingCars } from "../../API/Api_index";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Admin_upcomingcars_update_form from "./Admin_upcomingcars_update_form";
import Admin_upcomingcars_form from "./Admin_upcomingcars_form";
function Admin_upcomingcars(props) {

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [upcomingCarsmodelShow, setupcomingCarsmodelShow] = useState(false);
    const [upcomingCarsUpdateModel, setupcomingCarsUpdateModel] = useState(false);
    const { swal } = props;
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: null,
        name:'',
        city:'',
        time:'',
        date:'',
        description:''

    });

    const handleFetchSingleupcomingCars = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/cars/upcoming/show-car/${id}`, {
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
                    id: data.upcomming_car.id,
                    name: data.upcomming_car.name,
                    city:data.upcomming_car.city,
                    time:data.upcomming_car.time,
                    date:data.upcomming_car.date,
                    description:data.upcomming_car.description
                });
                console.log("updated", formData);
                // navigate('/Admin/upcomingcars')

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
            const res = await getupcomingCars();
            console.log(res)
            setDataSource(res.upcomming_cars);
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

    const handleDeleteCars = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/cars/upcoming/delete-car/${id}`, {
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
                navigate('/Admin/upcomingcars')
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
                <Typography.Title level={4}>upcoming cars</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setupcomingCarsmodelShow(true)}>Add upcoming cars
                        </Button>
                        <Admin_upcomingcars_form
                            show={upcomingCarsmodelShow}
                            onHide={() => { setupcomingCarsmodelShow(false); navigate('/Admin/upcomingcars') }}
                            addFetchData={fetchData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "name",
                            dataIndex: "name",
                            // width: 100,
                            key: 'name',
                        },
                        
                            {
                                title: "carsImage",
                                dataIndex: "carsimage",
                                render: (text, record) => {
                                    return (
                                        <img src={`http://127.0.0.1:8000/images/${record.carimage}`} height="100px" width="100px" alt="" />
                                    )
                                },
                                key: 'carsimage',
                                width: 120,
    
                            },
                            {
                                title: "city",
                                dataIndex: "city",
                                key: 'city',
                                // width: 75,
                            },
                            {
                                title: "time",
                                dataIndex: "time",
                                key: 'time',
                                // width: 75,
                            },
                        {
                            title: "date",
                            dataIndex: "date",
                            key: 'date',
                            // width: 75,
                        },
                        {
                            title: "description",
                            dataIndex: "description",
                            key: 'description',
                            // width: 75,
                        },
                       
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleupcomingCars(record.id); setupcomingCarsUpdateModel(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_upcomingcars_update_form
                                                show={upcomingCarsUpdateModel}
                                                onHide={() => { setupcomingCarsUpdateModel(false) }}
                                                upcomingcarsdata={formData}
                                                updateFetchData={fetchData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteCars(record.id)}>
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
export default withSwal(Admin_upcomingcars);