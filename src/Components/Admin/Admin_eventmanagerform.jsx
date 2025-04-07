import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Admin_eventmanagerform = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_no: '',
        type: '',
        password: '',
        adhaarcard_details: '',
        skills: '',
        salary: '',
        status: ''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    // handle Add api----------------------------
    const handleAddUser = async (e)=>{
        e.preventDefault();
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin/add-user', formData, {
              headers: {
                'Content-Type': 'application/json',
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
                    navigate('/admin/user');
                    props.addFetchData();
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


    // handle form filling function ---------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
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
                        Add new Staff Or Manager
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form onSubmit={handleAddUser}>
                    <div className="mb-1">
                        <label htmlFor="name" className="form-label">Name:</label><span className='text-danger'>*</span>
                        <input type="text" className="form-control" name='name' id="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className='text-danger'>{errors.name[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="email" className="form-label">Email Address:</label><span className='text-danger'>*</span>
                        <input type="email" className="form-control" name='email' id="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <span className='text-danger'>{errors.email[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="mobile_no" className="form-label">Mobile Number:</label><span className='text-danger'>*</span>
                        <input type="text" className="form-control" name='mobile_no' id="mobile_no" value={formData.mobile_no} onChange={handleChange} />
                        {errors.mobile_no && <span className='text-danger'>{errors.mobile_no[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="type" className="form-label">type:</label><span className='text-danger'>*</span>
                        {/* <input type="text" className="form-control" name='lastname' id="lastname" value={formData.lastname} onChange={handleChange} />
                        {errors.lastname && <span className='text-danger'>{errors.lastname[0]}</span>} */}
                        <select name="type" id="type" className="form-control" value={formData.type} onChange={handleChange} >
                            <option value=""></option>
                            <option value="manager">Event manager</option>
                            <option value="staff">Staff</option>
                        </select>
                        {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="password" className="form-label">Password:</label><span className='text-danger'>*</span>
                        <input type="password" className="form-control" name='password' id="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <span className='text-danger'>{errors.password[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="adhaarcard_details" className="form-label">Adhar card Number:</label>
                        <input type="text" className="form-control" name='adhaarcard_details' id="adhaarcard_details" value={formData.adhaarcard_details} onChange={handleChange} />
                        {errors.adhaarcard_details && <span className='text-danger'>{errors.adhaarcard_details[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="skills" className="form-label">Skills:</label>
                        <input type="text" className="form-control" name='skills' id="skills" value={formData.skills} onChange={handleChange} />
                        {errors.skills && <span className='text-danger'>{errors.skills[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="salary" className="form-label">Salary:</label><span className='text-danger'>*</span>
                        <input type="text" className="form-control" name='salary' id="salary" value={formData.salary} onChange={handleChange} />
                        {errors.salary && <span className='text-danger'>{errors.salary[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="status" className="form-label">Status:</label><span className='text-danger'>*</span>
                        {/* <input type="text" className="form-control" name='lastname' id="lastname" value={formData.lastname} onChange={handleChange} />
                        {errors.lastname && <span className='text-danger'>{errors.lastname[0]}</span>} */}
                        <select name="status" id="status" className="form-control" value={formData.status} onChange={handleChange} >
                            <option value=""></option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && <span className='text-danger'>{errors.status[0]}</span>}
                    </div>
                    <div className="mt-3">
                        <button name='btnAddUser' id='btnAddUser' className='btn btn-outline-dark' >Add</button>
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

export default withSwal(Admin_eventmanagerform);
