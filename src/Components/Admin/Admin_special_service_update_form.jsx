import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { useNavigate } from 'react-router-dom';

const Admin_special_service_update_form = (props) => {
    const [formData, setFormData] = useState({
        id: null,
        service_name: '',
        service_image: null,
        other_img1: null,
        other_img2: null,
        other_img3: null,
        description: '',
        testimonial: '',
    });

    const { swal } = props;

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setFormData({
            id:props.specialServiceData.id,
            service_name:props.specialServiceData.service_name,
            description:props.specialServiceData.description,
            testimonial:props.specialServiceData.testimonial
        });
    }, [props.specialServiceData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleUpdateSpecialService = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/wedding/special-service/update-service/${formData.id}`, data, {
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
                        // Redirect or fetch updated data as needed
                        props.updateFetchData();
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
                    <Modal.Title id="contained-modal-title-vcenter">Update Special Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSpecialService}>
                        <div className="mb-3">
                            <label htmlFor="service_name" className="form-label">Service Name:</label>
                            <input type="text" className="form-control" id="service_name" name="service_name" value={formData.service_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="service_image" className="form-label">Service Image:</label>
                            <input type="file" className="form-control" id="service_image" name="service_image" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img1" className="form-label">Other Image 1:</label>
                            <input type="file" className="form-control" id="other_img1" name="other_img1" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img2" className="form-label">Other Image 2:</label>
                            <input type="file" className="form-control" id="other_img2" name="other_img2" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_img3" className="form-label">Other Image 3:</label>
                            <input type="file" className="form-control" id="other_img3" name="other_img3" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="testimonial" className="form-label">Testimonial:</label>
                            <textarea className="form-control" id="testimonial" name="testimonial" value={formData.testimonial} onChange={handleChange}></textarea>
                        </div>
                        <Button type="submit">Update</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
    </>
  )
}

export default withSwal(Admin_special_service_update_form)
