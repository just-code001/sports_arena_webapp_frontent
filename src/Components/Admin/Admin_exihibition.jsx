import { Popconfirm, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getExihibition } from "../../API/Api_index";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Admin_exihibitionform from "./Admin_exihibitionform";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Admin_exihibition_updateform from "./Admin_exihibition_updateform";

function Admin_exhibition(props) {

    // const [loading, setLoading] = useState(false)
    const [dataExihibition, setdataExihibition] = useState([])
    const [exihibitionModelShow, setexihibitionModelShow] = useState(false);
    const [updateModelExihibition, setupdateModelExihibition] = useState(false);
    const { swal } = props;
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: null,
        event_name: '',
        type:'',
        exhibition_image:null,
        event_pricing: '',
        event_starting_date:'',
        event_ending_date:'',
        location: '',
        city: '',
        state: ''
    });

    const handleFetchSingleExihibition = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/event/exhibition/show-event/${id}`, {
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
                    id: data.exihibition.id,
                    event_name: data.exihibition.event_name,
                    type: data.exihibition.type,
                    exhibition_image: data.exihibition.exhibition_image,
                    event_pricing: data.exihibition.event_pricing,
                    event_starting_date: data.exihibition.event_starting_date,
                    event_ending_date: data.exihibition.event_ending_date,
                    location: data.exihibition.location,
                    city: data.exihibition.city,
                    state: data.exihibition.state,
                    
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

    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    
const fetchExihibitionData = async () => {
    try {
        setLoading(true);
        const res = await getExihibition();
        setDataSource(res.exihibition);
        console.log(res.exihibition)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchExihibitionData();
}, []);



    const handleDeleteExihibition = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/admin/event/exhibition/delete-event/${id}`, {
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
                navigate('/Admin/event/exihibition');
                fetchExihibitionData();
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
                <Typography.Title level={4}>Exhibition</Typography.Title>

                <>
                    <Form className="d-flex justify-content-end">
                        <Button variant="dark" className='mx-1' onClick={() => setexihibitionModelShow(true)}>Add exihibiton
                        </Button>
                        <Admin_exihibitionform
                            show={exihibitionModelShow}
                            onHide={() => { setexihibitionModelShow(false); navigate('/Admin/event/exihibition') }}
                            addFetchData={fetchExihibitionData} />
                    </Form>
                </>


                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Event Name",
                            dataIndex: "event_name"
                        },
                        {
                            title: "Type",
                            dataIndex: "type"
                        },
                        {
                            title: "Exhibition Image",
                            dataIndex: "exhibition_image",
                            render: (text, record) => {
                                return (
                                    <img src={`http://127.0.0.1:8000/images/${record.exhibition_image}`} height="100px" width="100px" alt="" />
                                )
                            }

                        },

                        {
                            title: "Event pricing",
                            dataIndex: "event_pricing",
                            render: (value) => <span>${value}</span>
                        },
                        {
                            title: "Event starting date",
                            dataIndex: "event_starting_date"
                        },

                        {
                            title: "Event ending date",
                            dataIndex: "event_ending_date"
                        },
                        {
                            title: "Location",
                            dataIndex: "location"
                        },
                        {
                            title: "City",
                            dataIndex: "city"
                        },
                        {
                            title: "State",
                            dataIndex: "state"
                        },
                        {
                            title: 'operation',
                            dataIndex: 'operation',
                            render: (text, record) => (
                                dataSource.length >= 1
                                    ? (<>
                                        <span >
                                            <button onClick={() => { handleFetchSingleExihibition(record.id); setupdateModelExihibition(true) }} className="text-decoration-none btn btn-primary rounded-5"><EditOutlined /></button>
                                            <Admin_exihibition_updateform
                                                show={updateModelExihibition}
                                                onHide={() => { setupdateModelExihibition(false) }}
                                                exihibitionData={formData}
                                                updateFetchData={fetchExihibitionData} />
                                        </span>
                                        <br />
                                        <Popconfirm className="" title="Sure to delete?" onConfirm={() => handleDeleteExihibition(record.id)}>
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
export default withSwal(Admin_exhibition);
