import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Admin_packageform = (props) => {
    const [packageformData, setPackageFormData] = useState({
        type:'',
        packagename: '',
        packageimage:'',
        packagepricing: '',
        description: ''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    
    //handle image
    const handleImageChange = (e) => {
        setPackageFormData({ ...packageformData, packageimage: e.target.files[0] });
        console.log(packageformData.packageimage,e.target.files[0] )
    };


   
    // handle form filling function ---------------------
    const handleChange = (e) => {
        setPackageFormData({ ...packageformData, [e.target.name]: e.target.value });
        console.log(packageformData)    
    };

     // handle package add api----------------------------
     const handleAddPackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in packageformData) {
            formData.append(key, packageformData[key]);
        }

        console.log(formData)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin/event/birthday/add-package', formData, {
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
                        navigate('/Admin/event/birthday');
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
                        Add Package Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form onSubmit={handleAddPackage}>
                    <div className="mb-1">
                        <label htmlFor="type" className="form-label">Package Type:</label>
                        <select name="type" id="type" className="form-control" value={packageformData.type} onChange={handleChange} >
                            <option value=""></option>
                            <option value="silver">silver</option>
                            <option value="gold">gold</option>
                            <option value="diamond">diamond</option>
                        </select>
                        {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packagename" className="form-label">Package Name:</label>
                        <input type="text" className="form-control" name='packagename' id="packagename" value={packageformData.packagename} onChange={handleChange} />
                        {errors.packagename && <span className='text-danger'>{errors.packagename[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packageimage" className="form-label">Package Image:</label>
                        <input type="file" name="packageimage" id="packageimage" className="form-control" onChange={handleImageChange} />
                        {errors.packageimage && <span className='text-danger'>{errors.packageimage[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packagepricing" className="form-label">Package Pricing:</label>
                        <input type="text" className="form-control" name='packagepricing' id="packagepricing" value={packageformData.packagepricing} onChange={handleChange} />
                        {errors.packagepricing && <span className='text-danger'>{errors.packagepricing[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea name="description" id="description" className="form-control" cols="5" rows="3" value={packageformData.description} onChange={handleChange}></textarea>
                        {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                    </div>
    
                    <div className="mt-3">
                        <button name='btnPackage' id='btnPackage' className='btn btn-outline-dark' >Add</button>
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

export default withSwal(Admin_packageform);
