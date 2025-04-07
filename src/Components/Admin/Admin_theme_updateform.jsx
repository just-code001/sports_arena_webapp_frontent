import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { withSwal } from 'react-sweetalert2';

function Admin_theme_updateform(props) {

    
    const [ThemeUpdateFormData, setThemeUpdateFormData] = useState({
        id: null,
        type:'',
        themename: '',
        themeimage:''
    });

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    console.log("exihibition",props.themeData)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setThemeUpdateFormData({
                    id: props.themeData.id,
                    type: props.themeData.type,
                    themename: props.themeData.themename,
                    themeimage: props.themeData.themeimage,
                             
        });
    }, [props.themeData]);

    console.log("form", ThemeUpdateFormData)

    const handleImageChange = (e) => {
        setThemeUpdateFormData({ ...ThemeUpdateFormData, themeimage: e.target.files[0] });
    };

    //handle update change
    const handleUpdateTheme = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('type', ThemeUpdateFormData.type);
        await formData.append('themename', ThemeUpdateFormData.themename);
        await formData.append('themeimage', ThemeUpdateFormData.themeimage);
        
        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/event/birthday/update-theme/${id}`, formData, {
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
        setThemeUpdateFormData({ ...ThemeUpdateFormData, [e.target.name]: e.target.value });
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
                        <label htmlFor="type" className="form-label">Theme Type:</label>
                        <select name="type" id="type" className="form-control" value={ThemeUpdateFormData.type} onChange={handleChange} >
                        <option value=""></option>
                            <option value="boys">boys</option>
                            <option value="girls">girls</option>
                            <option value="men">men</option>
                            <option value="women">women</option>
                            <option value="adults">adults</option>
                            <option value="couples">couples</option>
                            <option value="1stbirthday">1st birthday</option>
                        </select>
                        {errors.type && <span className='text-danger'>{errors.type[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="themename" className="form-label">Theme Name:</label>
                        <input type="text" className="form-control" name='themename' id="themename" value={ThemeUpdateFormData.themename} onChange={handleChange} />
                        {errors.themename && <span className='text-danger'>{errors.themename[0]}</span>}
                    </div>
                    <div className="mb-1">
                        <label htmlFor="themeimage" className="form-label">Theme Image:</label>
                        <input type="file" name="themeimage" id="themeimage" className="form-control" onChange={handleImageChange} />
                        {errors.themeimage && <span className='text-danger'>{errors.themeimage[0]}</span>}
                    </div>
    
    
                <div className="mt-3">
                            <button name='btnUpdateTheme' id='btnUpdateTheme' className='btn btn-outline-dark' onClick={(event)=>handleUpdateTheme(ThemeUpdateFormData.id,event)} >Update</button>
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
export default withSwal(Admin_theme_updateform);