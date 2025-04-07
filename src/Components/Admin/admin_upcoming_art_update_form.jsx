import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_update_art(props) {

    
    const [upcomingArtUpdateForm, setupcomingArtUpdateForm] = useState({
        id: null,
        art_name:'',
        art_image: null,
        art_date:'',
        art_description:''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

     //handle image
     const handleImageChange = (e) => {
        setupcomingArtUpdateForm({ ...upcomingArtUpdateForm, art_image: e.target.files[0] });
    };

    console.log("upcoming_artdata",props.upcoming_artdata)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setupcomingArtUpdateForm({
                    id:props.upcoming_artdata.id,
                    art_name: props.upcoming_artdata.art_name,
                    art_image: props.upcoming_artdata.art_image,
                    art_date: props.upcoming_artdata.art_date,
                    art_description: props.upcoming_artdata.art_description
                    
        });
    }, [props.upcoming_artdata]);

    console.log("form", upcomingArtUpdateForm)


    //handle update change
    const handleUpdateArt = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('art_name', upcomingArtUpdateForm.art_name);
        await formData.append('art_image', upcomingArtUpdateForm.art_image);
        await formData.append('art_date', upcomingArtUpdateForm.art_date);
        await formData.append('art_description', upcomingArtUpdateForm.art_description);

        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/concert/upcoming-art/update-upcoming-art/${id}`, formData, {
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
                        navigate('/Admin/upcomingart');
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
        setupcomingArtUpdateForm({ ...upcomingArtUpdateForm, [e.target.name]: e.target.value });
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
                    Update Upcoming Art Event
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='register-modal-body' style={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto'
            }}>
                <Form>
                <div className="mb-1">
                        <label htmlFor="art_name" className="form-label">Upcoming Art Name:</label>
                        <input type="text" className="form-control" name='art_name' id="art_name" value={upcomingArtUpdateForm.art_name} onChange={handleChange} />
                        {errors.art_name && <span className='text-danger'>{errors.art_name[0]}</span>}
                    </div>
                    <div className="mb-1">
                            <label htmlFor="art_image" className="form-label">Upcoming Art Image:</label><br />
                            <input type="file" name="art_image" id="art_image" onChange={handleImageChange} />
                            {errors.art_image && <span className='text-danger'>{errors.art_image[0]}</span>}
                        </div>
                    <div className="mb-1">
                        <label htmlFor="art_date" className="form-label">Upcoming Art Date:</label>
                        <input type="date" className="form-control" name='art_date' id="art_date" value={upcomingArtUpdateForm.art_date} onChange={handleChange} />
                        {errors.art_date && <span className='text-danger'>{errors.art_date[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="art_description" className="form-label">Description:</label>
                        <textarea className="form-control" name="art_description" id="art_description" cols="3" rows="5" value={upcomingArtUpdateForm.art_description} onChange={handleChange}></textarea>
                        {errors.art_description && <span className='text-danger'>{errors.art_description[0]}</span>}
                    </div>
                    
                    
                
                <div className="mt-3">
                            <button name='btnUpdateExihibition' id='btnUpdateExihibition' className='btn btn-outline-dark' onClick={(event)=>handleUpdateArt(upcomingArtUpdateForm.id,event)} >Update</button>
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
export default withSwal(Admin_update_art);