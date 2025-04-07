import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_exihibition_updateform(props) {

    
    const [ExihibitionUpdateFormdata, setExihibitionUpdateFormdata] = useState({
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

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    console.log("exihibition",props.exihibitionData)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setExihibitionUpdateFormdata({
                    id:props.exihibitionData.id,
                    event_name: props.exihibitionData.event_name,
                    type: props.exihibitionData.type,
                    exhibition_image: props.exihibitionData.exhibition_image,
                    event_pricing: props.exihibitionData.event_pricing,
                    event_starting_date: props.exihibitionData.event_starting_date,
                    event_ending_date: props.exihibitionData.event_ending_date,
                    location: props.exihibitionData.location,
                    city: props.exihibitionData.city,
                    state: props.exihibitionData.state,
                    
        });
    }, [props.exihibitionData]);

    console.log("form", ExihibitionUpdateFormdata)

    const handleImageChange = (e) => {
        setExihibitionUpdateFormdata({ ...ExihibitionUpdateFormdata, exhibition_image: e.target.files[0] });
    };

    //handle update change
    const handleUpdateExihibition = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('event_name', ExihibitionUpdateFormdata.event_name);
        await formData.append('type', ExihibitionUpdateFormdata.type);
        await formData.append('exhibition_image', ExihibitionUpdateFormdata.exhibition_image);
        await formData.append('event_pricing', ExihibitionUpdateFormdata.event_pricing);
        await formData.append('event_starting_date', ExihibitionUpdateFormdata.event_starting_date);
        await formData.append('event_ending_date', ExihibitionUpdateFormdata.event_ending_date);
        await formData.append('location', ExihibitionUpdateFormdata.location);
        await formData.append('city', ExihibitionUpdateFormdata.city);
        await formData.append('state', ExihibitionUpdateFormdata.state);
       
        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/event/exhibition/update-event/${id}`, formData, {
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
                        navigate('/Admin/event/exihibition');
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
        setExihibitionUpdateFormdata({ ...ExihibitionUpdateFormdata, [e.target.name]: e.target.value });
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
                    Update Exihibition Event
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='register-modal-body' style={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto'
            }}>
                <Form>
                <div className="mb-1">
                <label htmlFor="event_name" className="form-label">event_name:</label>
                    <input type="tet" className="form-control" name="event_name" id="event_name" value={ExihibitionUpdateFormdata.event_name} onChange={handleChange} />
                    {errors.event_name && <span className='text-danger'>{errors.event_name[0]}</span>}
                </div>
                
                <div className="mb-1">
                        <label htmlFor="type" className="form-label">type:</label>
                        <select name="type" id="type" className="form-control" value={ExihibitionUpdateFormdata.type} onChange={handleChange} >
                            <option value=""></option>
                            <option value="Art Exihibition">Art Exihibition</option>
                            <option value="Car Exihibition">Car Exihibition</option>
                        </select>
                        {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                    </div>
                <div className="mb-1">
                        <label htmlFor="exhibition_image" className="form-label">Exihibition Image:</label><br />
                        <input type="file" name="exhibition_image" id="exhibition_image" onChange={handleImageChange} />
                        {errors.exhibition_image && <span className='text-danger'>{errors.exhibition_image[0]}</span>}
                    </div>
                <div className="mb-1">
                    <label htmlFor="event_pricing" className="form-label">Event pricing:</label>
                    <input type="text" className="form-control" name="event_pricing" id="event_pricing" value={ExihibitionUpdateFormdata.event_pricing} onChange={handleChange} />
                    {errors.event_pricing && <span className='text-danger'>{errors.event_pricing[0]}</span>}
                </div>
                <div className="mb-1">
                    <label htmlFor="event_starting_date" className="form-label">Starting Date:</label>
                    <input type="date" className="form-control" name='event_starting_date' id="event_starting_date" value={ExihibitionUpdateFormdata.event_starting_date} onChange={handleChange} />
                    {errors.event_starting_date && <span className='text-danger'>{errors.event_starting_date[0]}</span>}
                </div>
                <div className="mb-1">
                    <label htmlFor="event_ending_date" className="form-label">Ending Date:</label>
                    <input type="date" className="form-control" name='event_ending_date' id="event_ending_date" value={ExihibitionUpdateFormdata.event_ending_date} onChange={handleChange} />
                    {errors.event_ending_date && <span className='text-danger'>{errors.event_ending_date[0]}</span>}
                </div>
                <div className="mb-1">
                    <label htmlFor="location" className="form-label">Location:</label>
                    <input type="text" className="form-control" name='location' id="location" value={ExihibitionUpdateFormdata.location} onChange={handleChange} />
                    {errors.location && <span className='text-danger'>{errors.location[0]}</span>}
                </div>
                <div className="mb-1">
                    <label htmlFor="city" className="form-label">City:</label>
                    <input type="text" className="form-control" name='city' id="city" value={ExihibitionUpdateFormdata.city} onChange={handleChange} />
                    {errors.city && <span className='text-danger'>{errors.city[0]}</span>}
                </div>
                <div className="mb-1">
                    <label htmlFor="state" className="form-label">State:</label>
                    <input type="text" className="form-control" name='state' id="state" value={ExihibitionUpdateFormdata.state} onChange={handleChange} />
                    {errors.state && <span className='text-danger'>{errors.state[0]}</span>}
                </div>
                
                <div className="mt-3">
                            <button name='btnUpdateExihibition' id='btnUpdateExihibition' className='btn btn-outline-dark' onClick={(event)=>handleUpdateExihibition(ExihibitionUpdateFormdata.id,event)} >Update</button>
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
export default withSwal(Admin_exihibition_updateform);