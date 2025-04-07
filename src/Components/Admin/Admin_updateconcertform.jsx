import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Admin_updateconcertform = (props) => {

    const [concertUpdateformData, setConcertUpdateFormData] = useState({
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
    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setConcertUpdateFormData({
            id: props.concertData.id,
            event_name: props.concertData.event_name,
            singer: props.concertData.singer,
            event_timing: props.concertData.event_timing,
            concert_date: props.concertData.concert_date,
            concert_image: props.concertData.concert_image,
            description: props.concertData.description,
            city: props.concertData.city,
            state: props.concertData.state,
            pincode: props.concertData.pincode,
            location: props.concertData.location,
            ticket_type1: props.concertData.ticket_type1,
            ticket_pricing1: props.concertData.ticket_pricing1,
            ticket_type2: props.concertData.ticket_type2,
            ticket_pricing2: props.concertData.ticket_pricing2,
            ticket_type3: props.concertData.ticket_type3,
            ticket_pricing3: props.concertData.ticket_pricing3
        });
    }, [props.concertData]);

    const handleChange = (e) => {
        setConcertUpdateFormData({ ...concertUpdateformData, [e.target.name]: e.target.value });
    };

    // handle image --------------------------
    const handleImageChange = (e) => {
        setConcertUpdateFormData({ ...concertUpdateformData, concert_image: e.target.files[0] });
    };

    // handle venue update api----------------------------
    const handleUpdateConcert = async (id, e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in concertUpdateformData) {
            formData.append(key, concertUpdateformData[key]);
        }

        console.log(formData)

        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/event/concert/update-concert/${id}`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
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
                        Add Concert Event
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form>
                        <div className="mb-1">
                            <label htmlFor="event_name" className="form-label">Event Name:</label>
                            <input type="text" className="form-control" name='event_name' id="event_name" value={concertUpdateformData.event_name} onChange={handleChange} />
                            {errors.event_name && <span className='text-danger'>{errors.event_name[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="singer" className="form-label">Singer:</label>
                            <input type="text" className="form-control" name='singer' id="singer" value={concertUpdateformData.singer} onChange={handleChange} />
                            {errors.singer && <span className='text-danger'>{errors.singer[0]}</span>}
                        </div>

                        <div className="mb-1">
                            <label htmlFor="event_timing" className="form-label">Event Timing:</label>
                            <input type="text" className="form-control" name='event_timing' id="event_timing" value={concertUpdateformData.event_timing} onChange={handleChange} />
                            {errors.event_timing && <span className='text-danger'>{errors.event_timing[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="concert_date" className="form-label">Date:</label>
                            <input type="date" className="form-control" name='concert_date' id="concert_date" value={concertUpdateformData.concert_date} onChange={handleChange} />
                            {errors.event_timing && <span className='text-danger'>{errors.event_timing[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="concert_image" className="form-label">Concert Image:</label><br />
                            <input type="file" name="concert_image" id="concert_image" onChange={handleImageChange} />
                            {errors.concert_image && <span className='text-danger'>{errors.concert_image[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="description" className="form-label">Concert Description:</label>
                            <textarea name="description" id="description" cols="4" rows="3" value={concertUpdateformData.description} onChange={handleChange}></textarea>
                            {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="city" className="form-label">City:</label>
                            <input type="text" className="form-control" name='city' id="city" value={concertUpdateformData.city} onChange={handleChange} />
                            {errors.city && <span className='text-danger'>{errors.city[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="state" className="form-label">State:</label>
                            <input type="text" className="form-control" name='state' id="state" value={concertUpdateformData.state} onChange={handleChange} />
                            {errors.state && <span className='text-danger'>{errors.state[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="pincode" className="form-label">pincode:</label>
                            <input type="text" className="form-control" name='pincode' id="pincode" value={concertUpdateformData.pincode} onChange={handleChange} />
                            {errors.pincode && <span className='text-danger'>{errors.pincode[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="location" className="form-label">Location:</label>
                            <input type="text" className="form-control" name='location' id="location" value={concertUpdateformData.location} onChange={handleChange} />
                            {errors.location && <span className='text-danger'>{errors.location[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_type1" className="form-label">Ticket Type:</label>
                            <input type="text" className="form-control" name='ticket_type1' id="ticket_type1" defaultValue={"basic"} value={concertUpdateformData.ticket_type1} onChange={handleChange} />
                            {errors.ticket_type1 && <span className='text-danger'>{errors.ticket_type1[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_pricing1" className="form-label">Ticket Pricing:</label>
                            <input type="text" className="form-control" name='ticket_pricing1' id="ticket_pricing1" value={concertUpdateformData.ticket_pricing1} onChange={handleChange} />
                            {errors.ticket_pricing1 && <span className='text-danger'>{errors.ticket_pricing1[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_type2" className="form-label">Ticket Type:</label>
                            <input type="text" className="form-control" name='ticket_type2' id="ticket_type2" defaultValue={"gold"} value={concertUpdateformData.ticket_type2} onChange={handleChange} />
                            {errors.ticket_type2 && <span className='text-danger'>{errors.ticket_type2[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_pricing2" className="form-label">Ticket Pricing:</label>
                            <input type="text" className="form-control" name='ticket_pricing2' id="ticket_pricing2" value={concertUpdateformData.ticket_pricing2} onChange={handleChange} />
                            {errors.ticket_pricing2 && <span className='text-danger'>{errors.ticket_pricing2[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_type3" className="form-label">Ticket Type:</label>
                            <input type="text" className="form-control" name='ticket_type3' id="ticket_type3" defaultValue={"platinum"} value={concertUpdateformData.ticket_type3} onChange={handleChange} />
                            {errors.ticket_type3 && <span className='text-danger'>{errors.ticket_type3[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="ticket_pricing3" className="form-label">Ticket Pricing:</label>
                            <input type="text" className="form-control" name='ticket_pricing3' id="ticket_pricing3" value={concertUpdateformData.ticket_pricing3} onChange={handleChange} />
                            {errors.ticket_pricing3 && <span className='text-danger'>{errors.ticket_pricing3[0]}</span>}
                        </div>
                        <div className="mt-3">
                            <button name='btnRegister' id='btnRegister' onClick={(event)=>handleUpdateConcert(concertUpdateformData.id,event)} className='btn btn-outline-dark' >Update</button>
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

export default withSwal(Admin_updateconcertform)
