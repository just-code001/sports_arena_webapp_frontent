import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Eventmanager_staff_updateform = (props) => {

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    const [updateFormData, setUpdateFormData] = useState({
        user_id: null,
        name: '',
        email: '',
        mobile_no: '',
        type: '',
        adhaarcard_details: '',
        skills: '',
        salary: '',
        status: ''
    });

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setUpdateFormData({
            user_id: props.userData.user_id,
            name: props.userData.name,
            email: props.userData.email,
            mobile_no: props.userData.mobile_no,
            type: props.userData.type,
            adhaarcard_details: props.userData.aadharcard_details,
            skills: props.userData.skills,
            salary: props.userData.salary,
            status: props.userData.status
        });
    }, [props.userData]);

    console.log("form", updateFormData)


    const handleStaffChange = (e) => {
        setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
        console.log(updateFormData)
    }

    const handleUpdateStaff = async (id, e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/admin/update-user/${id}`, updateFormData, {
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
                        navigate('/eventmanager/staff');
                        props.updatefetchStaffData();
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
                        Update Staff 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form>
                        <div className="mb-1">
                            <label htmlFor="name" className="form-label">Name:</label><span className='text-danger'>*</span>
                            <input type="text" className="form-control" name='name' id="name" value={updateFormData.name} onChange={handleStaffChange} />
                            {errors.name && <span className='text-danger'>{errors.name[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="email" className="form-label">Email Address:</label><span className='text-danger'>*</span>
                            <input type="email" className="form-control" name='email' id="email" value={updateFormData.email} onChange={handleStaffChange} />
                            {errors.email && <span className='text-danger'>{errors.email[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="mobile_no" className="form-label">Mobile Number:</label><span className='text-danger'>*</span>
                            <input type="text" className="form-control" name='mobile_no' id="mobile_no" value={updateFormData.mobile_no} onChange={handleStaffChange} />
                            {errors.mobile_no && <span className='text-danger'>{errors.mobile_no[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="type" className="form-label">type:</label><span className='text-danger'>*</span>
                            {/* <input type="text" className="form-control" name='lastname' id="lastname" value={updateFormData.lastname} onChange={handleStaffChange} />
                        // {errors.lastname && <span className='text-danger'>{errors.lastname[0]}</span>} */}
                            <select name="type" id="type" className="form-control" value={updateFormData.type} onChange={handleStaffChange} >
                                <option value=""></option>
                                <option value="manager" disabled>Event manager</option>
                                <option value="staff">Staff</option>
                            </select>
                            {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="adhaarcard_details" className="form-label">Adhar card Number:</label>
                            <input type="text" className="form-control" name='adhaarcard_details' id="adhaarcard_details" value={updateFormData.adhaarcard_details} onChange={handleStaffChange} />
                            {errors.adhaarcard_details && <span className='text-danger'>{errors.adhaarcard_details[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="skills" className="form-label">Skills:</label>
                            <input type="text" className="form-control" name='skills' id="skills" value={updateFormData.skills} onChange={handleStaffChange} />
                            {errors.skills && <span className='text-danger'>{errors.skills[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="salary" className="form-label">Salary:</label><span className='text-danger'>*</span>
                            <input type="text" className="form-control" name='salary' id="salary" value={updateFormData.salary} onChange={handleStaffChange} />
                            {errors.salary && <span className='text-danger'>{errors.salary[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="status" className="form-label">Status:</label><span className='text-danger'>*</span>
                            {/* <input type="text" className="form-control" name='lastname' id="lastname" value={updateFormData.lastname} onChange={handleStaffChange} />
                        {errors.lastname && <span className='text-danger'>{errors.lastname[0]}</span>} */}
                            <select name="status" id="status" className="form-control" value={updateFormData.status} onChange={handleStaffChange} >
                                <option value=""></option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <span className='text-danger'>{errors.status[0]}</span>}
                        </div>
                        <div className="mt-3">
                            <button name='btnAddUser' id='btnAddUser' className='btn btn-outline-dark' onClick={(event)=>handleUpdateStaff(updateFormData.user_id,event)}>Update</button>
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

export default withSwal(Eventmanager_staff_updateform)
