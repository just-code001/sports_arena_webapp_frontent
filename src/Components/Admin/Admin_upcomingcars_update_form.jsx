import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_upcomingcars_update_form(props) {

    
    const [upcomingCarsUpdateForm, setupcomingCarsUpdateForm] = useState({
        id: null,
        name:'',
        carimage: null,
        city:'',
        time:'',
        date:'',
        description:''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

     //handle image
    //  const handleImageChange = (e) => {
    //     setupcomingCarsUpdateForm({ ...upcomingCarsUpdateForm, carimage: e.target.files[0] });
    // };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setupcomingCarsUpdateForm({
            ...upcomingCarsUpdateForm,
            [name]: files ? files[0] : value,
        });
        console.log(upcomingCarsUpdateForm)
    };

    console.log("upcomingCarsUpdateForm",props.upcomingCarsUpdateForm)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setupcomingCarsUpdateForm({
                    id:props.upcomingcarsdata.id,
                    name: props.upcomingcarsdata.name,
                    carimage: props.upcomingcarsdata.carimage,
                    city: props.upcomingcarsdata.city,
                    time: props.upcomingcarsdata.time,
                    date: props.upcomingcarsdata.date,
                    description: props.upcomingcarsdata.description
                    
        });
    }, [props.upcomingcarsdata]);

    console.log("form", upcomingCarsUpdateForm)


    //handle update change
    const handleUpdateCars = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('name', upcomingCarsUpdateForm.name);
        await formData.append('carimage', upcomingCarsUpdateForm.carimage);
        await formData.append('city', upcomingCarsUpdateForm.city);
        await formData.append('time', upcomingCarsUpdateForm.time);
        await formData.append('date', upcomingCarsUpdateForm.date);
        await formData.append('description', upcomingCarsUpdateForm.description);

        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/cars/upcoming/update-car/${id}`, formData, {
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
                        navigate('/Admin/upcomingcars')
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

    // const handleChange = (e) => {
    //     setExihibitionUpdateFormdata({ ...ExihibitionUpdateFormdata, [e.target.name]: e.target.value });
    // };


    


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
                        <label htmlFor="name" className="form-label">Upcoming cars Name:</label>
                        <input type="text" className="form-control" name='name' id="name" value={upcomingCarsUpdateForm.name} onChange={handleChange} />
                        {errors.name && <span className='text-danger'>{errors.name[0]}</span>}
                    </div>
                    <div className="mb-1">
                            <label htmlFor="carimage" className="form-label">Upcoming car Image:</label><br />
                            <input type="file" className="form-control" name="carimage" id="carimage" onChange={handleChange} />
                            {errors.carimage && <span className='text-danger'>{errors.carimage[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="city" className="form-label">city:</label><br />
                            <input type="text" className="form-control" name="city" id="city" onChange={handleChange} />
                            {errors.city && <span className='text-danger'>{errors.city[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="time" className="form-label">time:</label><br />
                            <input type="time" className="form-control" name="time" id="time" onChange={handleChange} />
                            {errors.time && <span className='text-danger'>{errors.time[0]}</span>}
                        </div>
                    <div className="mb-1">
                        <label htmlFor="date" className="form-label"> Date:</label>
                        <input type="date" className="form-control" name='date' id="date" value={upcomingCarsUpdateForm.date} onChange={handleChange} />
                        {errors.date && <span className='text-danger'>{errors.date[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea className="form-control" name="description" id="description" cols="3" rows="5" value={upcomingCarsUpdateForm.description} onChange={handleChange}></textarea>
                        {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                    </div>
                    
                    
                
                <div className="mt-3">
                            <button name='btnUpdateupcomingCars' id='btnUpdatecomingCars' className='btn btn-outline-dark' onClick={(event)=>handleUpdateCars(upcomingCarsUpdateForm.id,event)} >Update</button>
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
export default withSwal(Admin_upcomingcars_update_form);