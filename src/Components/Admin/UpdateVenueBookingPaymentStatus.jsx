import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { withSwal } from 'react-sweetalert2';


const UpdateVenueBookingPaymentStatus = (props) => {
    const [updateStatus, setUpdateStatus] = useState({
        id:null,
        payment_status:''
    });

    const { swal } = props;

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    // console.log("status",props.paymentStatusData)

    useEffect(() => {
        // Update updateFormData whenever props.paymentStatusData changes
        setUpdateStatus({
            id:props.paymentStatusData.id,
            payment_status:props.paymentStatusData.payment_status
        });
    }, [props.paymentStatusData]);

    const handleChange = (e) => {
        setUpdateStatus({...updateStatus, [e.target.name]: e.target.value });
        console.log("object",updateStatus)
    }

    // handle status update api----------------------------
    const handleUpdatePaymentStatus = async (id, e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/admin/venue/update-payment-status/${id}`, updateStatus, {
                headers: {
                    'Content-Type': "application/json",
                },
            });
            const data = await response.data;
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
                swal.fire({
                    title: 'Done',
                    text: data.message,
                    icon: 'success',
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Update the React page here
                        props.onHide();
                        props.updateFetchData();
                    }
                });
            }
        } catch (error) {
            // If request fails, log the error or handle it appropriately
            if (error.response) {
                setErrors(error.response.data.errors)
            } else if (error.request) {
                console.log(error.request);
            } else {
                // If something else happened while setting up the request
                console.log('Error', error.message);
            }
        }
    }
    return (
        <>
        <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Venue Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
            <Form>
                <div className="mb-1">
                    <label htmlFor="payment_status" className="form-label">payment_status:</label>
                    <select name="payment_status" id="payment_status" className="form-control" value={updateStatus.payment_status} onChange={handleChange} >
                        <option value="pending">pending</option>
                        <option value="completed">completed</option>
                    </select>
                    {errors.payment_status && <span className='text-danger'>{errors.payment_status[0]}</span>}
                </div>
                <div className="mt-3">
                            <button name='btnUpdateStatus' id='btnUpdateStatus' className='btn btn-outline-dark' onClick={(event)=>handleUpdatePaymentStatus(updateStatus.id,event)} >Update</button>
                        </div>
            </Form>
            </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} >Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default withSwal(UpdateVenueBookingPaymentStatus)
