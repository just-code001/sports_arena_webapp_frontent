import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Admin_upcomingcars_form = (props) => {
    const [upcomingCarsData, setupcomingCarsData] = useState({
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
    //     setupcomingCarsData({ ...upcomingCarsData, carimage: e.target.files[0] });
    //     console.log(upcomingCarsData.carimage,e.target.files[0] )
    // };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setupcomingCarsData({
            ...upcomingCarsData,
            [name]: files ? files[0] : value,
        });
        console.log(upcomingCarsData)
    };

    

    // handle form filling function ---------------------
    // const handleChange = (e) => {
    //     console.log(e);
    //     setupcomingCarsData({ ...upcomingCarsData, [e.target.name]: e.target.value });
    //     console.log(upcomingCarsData)    
        
    // };


     // handle package add api----------------------------
     const handleAddUpcomingCars = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in upcomingCarsData) {
            formData.append(key, upcomingCarsData[key]);
        }

        console.log(formData)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin/cars/upcoming/add-car', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
                        // props.addFetchData();
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
                        Add Upcoming car Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form onSubmit={handleAddUpcomingCars}>
                    
                    <div className="mb-1">
                        <label htmlFor="name" className="form-label"> Name:</label>
                        <input type="text" className="form-control" name="name" id="name" value={upcomingCarsData.name} onChange={handleChange} />
                        {errors.name && <span className='text-danger'>{errors.name[0]}</span>}
                    </div>
                    
                    <div className="mb-1">
                            <label htmlFor="carimage" className="form-label">Upcoming car Image:</label><br />
                            <input type="file" name="carimage" id="carimage" onChange={handleChange} />
                            {errors.carimage && <span className='text-danger'>{errors.carimage[0]}</span>}
                        </div>
                        <div className="mb-1">
                        <label htmlFor="city" className="form-label"> city:</label>
                        <input type="text" className="form-control" name='city' id="city" value={upcomingCarsData.city} onChange={handleChange} />
                        {errors.city && <span className='text-danger'>{errors.city[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="time" className="form-label">Time:</label>
                        <input type="time" className="form-control" name='time' id="time" value={upcomingCarsData.time} onChange={handleChange} />
                         {errors.time && <span className='text-danger'>{errors.time[0]}</span>}
                            </div>

                    <div className="mb-1">
                        <label htmlFor="date" className="form-label">Upcoming car Date:</label>
                        <input type="date" className="form-control" name='date' id="date" value={upcomingCarsData.date} onChange={handleChange} />
                        {errors.date && <span className='text-danger'>{errors.date[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea className="form-control" name="description" id="description" cols="3" rows="5" value={upcomingCarsData.description} onChange={handleChange}></textarea>
                        {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                    </div>
                    
    
                    <div className="mt-3">
                        <button name='btnupcomingCars' id='btnupcomingCars' className='btn btn-outline-dark' >Add</button>
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

export default withSwal(Admin_upcomingcars_form);
