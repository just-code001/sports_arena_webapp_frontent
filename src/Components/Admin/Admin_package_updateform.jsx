import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_package_updateform(props) {

    
    const [PackageUpdateFormData, setPackageUpdateFormData] = useState({
        id: null,
        type: '',
        packagename: '',
        packageimage: '',
        packagepricing: '',
        description: '',
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    console.log("exihibition",props.packageData)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setPackageUpdateFormData({
                    id: props.packageData.id,
                    type: props.packageData.type,
                    packagename: props.packageData.packagename,
                    packageimage: props.packageData.packageimage,
                    packagepricing: props.packageData.packagepricing,
                    description: props.packageData.description,
                    
        });
    }, [props.packageData]);

    console.log("form", PackageUpdateFormData)

    const handleImageChange = (e) => {
        setPackageUpdateFormData({ ...PackageUpdateFormData, packageimage: e.target.files[0] });
    };

    //handle update change
    const handleUpdatePackage = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('type', PackageUpdateFormData.type);
        await formData.append('packagename', PackageUpdateFormData.packagename);
        await formData.append('packageimage', PackageUpdateFormData.packageimage);
        await formData.append('packagepricing', PackageUpdateFormData.packagepricing);
        await formData.append('description', PackageUpdateFormData.description);
        
        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/event/birthday/update-package/${id}`, formData, {
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
                        navigate('/Admin/event/birthday');
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
        setPackageUpdateFormData({ ...PackageUpdateFormData, [e.target.name]: e.target.value });
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
                    Update Package Form
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='register-modal-body' style={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto'
            }}>
                <Form>
                <div className="mb-1">
                        <label htmlFor="type" className="form-label">Package Type:</label>
                        <select name="type" id="type" className="form-control" value={PackageUpdateFormData.type} onChange={handleChange} >
                            <option value=""></option>
                            <option value="silver">silver</option>
                            <option value="gold">gold</option>
                            <option value="diamond">diamond</option>
                        </select>
                        {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packagename" className="form-label">Package Name:</label>
                        <input type="text" className="form-control" name='packagename' id="packagename" value={PackageUpdateFormData.packagename} onChange={handleChange} />
                        {errors.packagename && <span className='text-danger'>{errors.packagename[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packageimage" className="form-label">Package Image:</label>
                        <input type="file" name="packageimage" id="packageimage" className="form-control" onChange={handleImageChange} />
                        {errors.packageimage && <span className='text-danger'>{errors.packageimage[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="packagepricing" className="form-label">Package Pricing:</label>
                        <input type="text" className="form-control" name='packagepricing' id="packagepricing" value={PackageUpdateFormData.packagepricing} onChange={handleChange} />
                        {errors.packagepricing && <span className='text-danger'>{errors.packagepricing[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea name="description" id="description" className="form-control" cols="5" rows="3" value={PackageUpdateFormData.description} onChange={handleChange}></textarea>
                        {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                    </div>
    
                <div className="mt-3">
                            <button name='btnUpdateExihibition' id='btnUpdateExihibition' className='btn btn-outline-dark' onClick={(event)=>handleUpdatePackage(PackageUpdateFormData.id,event)} >Update</button>
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
export default withSwal(Admin_package_updateform);