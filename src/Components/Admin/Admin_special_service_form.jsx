import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { useNavigate } from 'react-router-dom';

const Admin_special_service_form = (props) => {
    const [formData, setFormData] = useState({
        service_name: '',
        service_image: null,
        other_img1: null,
        other_img2: null,
        other_img3: null,
        description: '',
        testimonial: '',
    });

    const { swal } = props;

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin/wedding/special-service/add-service', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const responseData = response.data;
            if (responseData.status === 1) {
                swal.fire({
                    title: 'Success',
                    text: responseData.message,
                    icon: 'success',
                }).then((result) => {
                    if (result.isConfirmed) {
                        props.onHide();
                        props.addFetchData();
                    }
                });
            } else {
                swal.fire({
                    title: 'Error',
                    text: responseData.message,
                    icon: 'error',
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
    };
  return (
    <>
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Add Special Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="service_name" className="form-label">Service Name:</label>
                            <input type="text" className="form-control" id="service_name" name="service_name" onChange={handleChange} />
                            {errors.service_name && <span className='text-danger'>{errors.service_name[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="service_image" className="form-label">Service Image:</label>
                            <input type="file" className="form-control" id="service_image" name="service_image" onChange={handleChange} />
                            {errors.service_image && <span className='text-danger'>{errors.service_image[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img1" className="form-label">Other Image 1:</label>
                            <input type="file" className="form-control" id="other_img1" name="other_img1" onChange={handleChange} />
                            {errors.other_img1 && <span className='text-danger'>{errors.other_img1[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img2" className="form-label">Other Image 2:</label>
                            <input type="file" className="form-control" id="other_img2" name="other_img2" onChange={handleChange} />
                            {errors.other_img2 && <span className='text-danger'>{errors.other_img2[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img3" className="form-label">Other Image 3:</label>
                            <input type="file" className="form-control" id="other_img3" name="other_img3" onChange={handleChange} />
                            {errors.other_img3 && <span className='text-danger'>{errors.other_img3[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea className="form-control" id="description" name="description" onChange={handleChange}></textarea>
                            {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="testimonial" className="form-label">Testimonial:</label>
                            <textarea className="form-control" id="testimonial" name="testimonial" onChange={handleChange}></textarea>
                            {errors.testimonial && <span className='text-danger'>{errors.testimonial[0]}</span>}
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
    </>
  )
}

export default withSwal(Admin_special_service_form)
