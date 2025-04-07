import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_update_concert(props) {

    
    const [upcomingConcertUpdateForm, setupcomingConcertUpdateForm] = useState({
        id: null,
        concert_date:'',
        concert_singer:'',
        description:''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    console.log("upcoming_concertData",props.upcoming_concertData)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setupcomingConcertUpdateForm({
                    id:props.upcoming_concertData.id,
                    concert_date: props.upcoming_concertData.concert_date,
                    concert_singer: props.upcoming_concertData.concert_singer,
                    description: props.upcoming_concertData.description,
                    
        });
    }, [props.upcoming_concertData]);

    console.log("form", upcomingConcertUpdateForm)


    //handle update change
    const handleUpdateExihibition = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('concert_date', upcomingConcertUpdateForm.concert_date);
        await formData.append('concert_singer', upcomingConcertUpdateForm.concert_singer);
        await formData.append('description', upcomingConcertUpdateForm.description);
       
        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/concert/upcoming-concert/update-upcoming-concert/${id}`, formData, {
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
                        navigate('/Admin/upcomingconcert');
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

    const handleChange = (e) => {
        setupcomingConcertUpdateForm({ ...upcomingConcertUpdateForm, [e.target.name]: e.target.value });
    };


    


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
                    Update Upcoming concert Event
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='register-modal-body' style={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto'
            }}>
                <Form>
                <div className="mb-1">
                        <label htmlFor="concert_date" className="form-label">Upcoming Concert Date:</label>
                        <input type="date" className="form-control" name='concert_date' id="concert_date" value={upcomingConcertUpdateForm.concert_date} onChange={handleChange} />
                        {errors.concert_date && <span className='text-danger'>{errors.concert_date[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="concert_singer" className="form-label">Concert Singer Name:</label>
                        <input type="text" className="form-control" name='concert_singer' id="concert_singer" value={upcomingConcertUpdateForm.concert_singer} onChange={handleChange} />
                        {errors.concert_singer && <span className='text-danger'>{errors.concert_singer[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea name="description" id="description" cols="3" rows="5" value={upcomingConcertUpdateForm.description} onChange={handleChange}></textarea>
                        {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                    </div>
                    
                
                <div className="mt-3">
                            <button name='btnUpdateExihibition' id='btnUpdateExihibition' className='btn btn-outline-dark' onClick={(event)=>handleUpdateExihibition(upcomingConcertUpdateForm.id,event)} >Update</button>
                        </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} >Close</Button>
            </Modal.Footer>
        </Modal>
    </>

    );
}
export default withSwal(Admin_update_concert);