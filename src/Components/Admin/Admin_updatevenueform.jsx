import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import { Form } from 'react-bootstrap';

const Admin_updatevenueform = (props) => {
    const [venueUpdateformData, setVenueUpdateFormData] = useState({
        id: null,
        name: '',
        venue_category: '',
        venue_image: null,
        price: '',
        rating: '',
        venue_capacity: '',
        status: '',
        description: '',
        city: '',
        state: '',
        pincode: '',
        location: '',
        contact: '',
        food_facility: '',
        special_facility: '',
    });

    const [foodcheckboxValues, setFoodCheckboxValues] = useState([]);
    const [facilitycheckboxValues, setFacilityCheckboxValues] = useState([]);

    const { swal } = props;

    const [state, setState] = useState(null);

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    console.log("venue",props.venueData)

    useEffect(() => {
        // Update updateFormData whenever props.userData changes
        setVenueUpdateFormData({
            id: props.venueData.id,
            name: props.venueData.name,
            venue_category: props.venueData.venue_category,
            venue_image: null,
            price: props.venueData.price,
            rating: props.venueData.rating,
            venue_capacity: props.venueData.venue_capacity,
            status: props.venueData.status,
            description: props.venueData.description,
            city: props.venueData.city,
            state: props.venueData.state,
            pincode: props.venueData.pincode,
            location: props.venueData.location,
            contact: props.venueData.contact,
            food_facility: props.venueData.food_facility,
            special_facility: props.venueData.special_facility,
        });
    }, [props.venueData]);

    console.log("form", venueUpdateformData)

    // handle image --------------------------
    const handleImageChange = (e) => {
        setVenueUpdateFormData({ ...venueUpdateformData, venue_image: e.target.files[0] });
    };

    // handle venue update api----------------------------
    const handleUpdateVenue = async (id, e) => {
        e.preventDefault();
        const formData = await new FormData();
        await formData.append('name', venueUpdateformData.name);
        await formData.append('venue_category', venueUpdateformData.venue_category);
        await formData.append('venue_image', venueUpdateformData.venue_image);
        await formData.append('price', venueUpdateformData.price);
        await formData.append('rating', venueUpdateformData.rating);
        await formData.append('venue_capacity', venueUpdateformData.venue_capacity);
        await formData.append('status', venueUpdateformData.status);
        await formData.append('description', venueUpdateformData.description);
        await formData.append('city', venueUpdateformData.city);
        await formData.append('state', venueUpdateformData.state);
        await formData.append('pincode', venueUpdateformData.pincode);
        await formData.append('location', venueUpdateformData.location);
        await formData.append('contact', venueUpdateformData.contact);
        await formData.append('food_facility', venueUpdateformData.food_facility);
        await formData.append('special_facility', venueUpdateformData.special_facility);

        await console.log(formData)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/admin/venue/update-venue/${id}`, formData, {
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
                        navigate('/admin/venue');
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


    // handle form filling function ---------------------
    // const handleChange = (e) => {
    //     setVenueUpdateFormData({ ...venueUpdateformData, [e.target.name]: e.target.value });
    // }
    const storefoodvalue = foodcheckboxValues.join(', ');
    const foodChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFoodCheckboxValues((prevValues) => [...prevValues, value]);
        } else {
            setFoodCheckboxValues((prevValues) => prevValues.filter((item) => item !== value));
        }
    }

    const handleChange = (e) => {
        setVenueUpdateFormData({ ...venueUpdateformData, [e.target.name]: e.target.value });
    };

    const storefacilityvalue = facilitycheckboxValues.join(', ');
    const facilitChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFacilityCheckboxValues((prevValues) => [...prevValues, value]);
        } else {
            setFacilityCheckboxValues((prevValues) => prevValues.filter((item) => item !== value));
        }
        // console.log(facilitycheckboxValues);
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
                        Venue Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='register-modal-body' style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <Form>
                        <div className="mb-1">
                            <label htmlFor="name" className="form-label">Venue Name:</label>
                            <input type="tet" className="form-control" name='name' id="name" value={venueUpdateformData.name} onChange={handleChange} />
                            {errors.name && <span className='text-danger'>{errors.name[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="venue_category" className="form-label">venue_category:</label>
                            <select name="venue_category" id="venue_category" className="form-control" value={venueUpdateformData.venue_category} onChange={handleChange} >
                                <option value=""></option>
                                <option value="hotel">Hotel</option>
                                <option value="farm">Farm</option>
                            </select>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="venue_image" className="form-label">Venue Image:</label><br />
                            <input type="file" name="venue_image" id="venue_image" onChange={handleImageChange} />
                            {errors.venue_image && <span className='text-danger'>{errors.venue_image[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="description" className="form-label">venue Description:</label>
                            <textarea name="description" id="description" cols="4" rows="3" value={venueUpdateformData.description} onChange={handleChange}></textarea>
                            {errors.description && <span className='text-danger'>{errors.description[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="state" className="form-label">State:</label>
                            <input type="text" className="form-control" name='state' id="state" value={venueUpdateformData.state} onChange={handleChange} />
                            {errors.state && <span className='text-danger'>{errors.state[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="city" className="form-label">City:</label>
                            <input type="text" className="form-control" name='city' id="city" value={venueUpdateformData.city} onChange={handleChange} />
                            {errors.city && <span className='text-danger'>{errors.city[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="pincode" className="form-label">Pincode:</label>
                            <input type="text" className="form-control" name='pincode' id="pincode" value={venueUpdateformData.pincode} onChange={handleChange} />
                            {errors.pincode && <span className='text-danger'>{errors.pincode[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="location" className="form-label">Location:</label>
                            <input type="text" className="form-control" name='location' id="location" value={venueUpdateformData.location} onChange={handleChange} />
                            {errors.location && <span className='text-danger'>{errors.location[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="price" className="form-label">Price:</label>
                            <input type="text" className="form-control" name='price' id="price" value={venueUpdateformData.price} onChange={handleChange} />
                            {errors.price && <span className='text-danger'>{errors.price[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="venue_capacity" className="form-label">venue_capacity:</label>
                            <input type="text" className="form-control" name='venue_capacity' id="venue_capacity" value={venueUpdateformData.venue_capacity} onChange={handleChange} />
                            {errors.venue_capacity && <span className='text-danger'>{errors.venue_capacity[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="contact" className="form-label">Contact:</label>
                            <input type="text" className="form-control" name='contact' id="contact" value={venueUpdateformData.contact} onChange={handleChange} />
                            {errors.password && <span className='text-danger'>{errors.password[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="foodfacility" className="form-label">Food Facility:</label><br />
                            <input type="checkbox" id="southindia" name="southindia" defaultValue="southindia" checked={foodcheckboxValues.includes('southindia')} onChange={foodChange} />south india &nbsp;
                            <input type="checkbox" id="chinese" name="chinese" defaultValue="chinese" checked={foodcheckboxValues.includes('chinese')} onChange={foodChange} />chinese   &nbsp;
                            <input type="checkbox" id="gujarati" name="gujarati" defaultValue="gujarati" checked={foodcheckboxValues.includes('gujarati')} onChange={foodChange} />gujarati   &nbsp;
                            <input type="checkbox" id="italian" name="italian" defaultValue="italian" checked={foodcheckboxValues.includes('italian')} onChange={foodChange} />italian   &nbsp;
                            <input type="checkbox" id="maxican" name="maxican" defaultValue="maxican" checked={foodcheckboxValues.includes('maxican')} onChange={foodChange} />maxican    &nbsp;
                            <input type="checkbox" id="garlicfree" name="garlicfree" defaultValue="garlicfree" checked={foodcheckboxValues.includes('garlicfree')} onChange={foodChange} />garlic free/onion free   &nbsp;
                            <input type="checkbox" id="drinks" name="drinks" defaultValue="drinks" checked={foodcheckboxValues.includes('drinks')} onChange={foodChange} />drinks(non-alcoholic)  &nbsp;
                            <input type="checkbox" id="seafood" name="seafood" defaultValue="seafood" checked={foodcheckboxValues.includes('seafood')} onChange={foodChange} />sea food   &nbsp;
                            <input type="checkbox" id="chaat" name="chaat" defaultValue="chaat" checked={foodcheckboxValues.includes('chaat')} onChange={foodChange} />chaat  &nbsp;
                            <input type="checkbox" id="marathi" name="marathi" defaultValue="marathi" checked={foodcheckboxValues.includes('marathi')} onChange={foodChange} />marathi  &nbsp;
                            <input type="checkbox" id="bangali" name="bangali" defaultValue="bangali" checked={foodcheckboxValues.includes('bangali')} onChange={foodChange} />bangali  &nbsp;
                            <input type="checkbox" id="softdrink" name="softdrink" defaultValue="softdrink" checked={foodcheckboxValues.includes('softdrink')} onChange={foodChange} />softdrink  &nbsp;
                            <input type="checkbox" id="alcohol" name="alcohol" defaultValue="alcohol" checked={foodcheckboxValues.includes('alcohol')} onChange={foodChange} />alcohol
                            <div className="mb-1">
                                <label htmlFor="food_facility" className="form-label">food_facility:</label>
                                <input type="text" className="form-control" name='food_facility' id="food_facility" value={storefoodvalue} onChange={handleChange} />
                                {errors.food_facility && <span className='text-danger'>{errors.food_facility[0]}</span>}
                            </div>
                        </div>
                        <div className="mb-1"><br />
                            <label htmlFor="specialfacility" className="form-label">Special Facility:</label><br />
                            <input type="checkbox" id="parking" name="parking" defaultValue="parking" checked={facilitycheckboxValues.includes('parking')} onChange={facilitChange} />Parking  &nbsp;
                            <input type="checkbox" id="pool" name="pool" defaultValue="pool" checked={facilitycheckboxValues.includes('pool')} onChange={facilitChange} />pool    &nbsp;
                            <input type="checkbox" id="guestaccommodation" name="guestaccommodation" defaultValue="guestaccommodation" checked={facilitycheckboxValues.includes('guestaccommodation')} onChange={facilitChange} />guest accommodation  &nbsp;
                            <input type="checkbox" id="inhouserestaurant" name="inhouserestaurant" defaultValue="inhouserestaurant" checked={facilitycheckboxValues.includes('inhouserestaurant')} onChange={facilitChange} />in-house restaurant  &nbsp;
                            <input type="checkbox" id="valetparking" name="valetparking" defaultValue="valetparking" checked={facilitycheckboxValues.includes('valetparking')} onChange={facilitChange} />valet parking  &nbsp;
                            <input type="checkbox" id="bridaldressingroom" name="bridaldressingroom" defaultValue="bridaldressingroom" checked={facilitycheckboxValues.includes('bridaldressingroom')} onChange={facilitChange} />bridal dressing room  &nbsp;
                            <input type="checkbox" id="groomdressingroom" name="groomdressingroom" defaultValue="groomdressingroom" checked={facilitycheckboxValues.includes('groomdressingroom')} onChange={facilitChange} />groom dressing room  &nbsp;
                            <div className="mb-1">
                                <label htmlFor="special_facility" className="form-label">special_facility:</label>
                                <input type="text" className="form-control" name='special_facility' id="special_facility" value={storefacilityvalue} onChange={handleChange} />
                                {errors.special_facility && <span className='text-danger'>{errors.special_facility[0]}</span>}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="rating" className="form-label">Venue Rating:</label><br />
                            <input type="text" name="rating" id="rating" value={venueUpdateformData.rating} onChange={handleChange} />
                            {errors.rating && <span className='text-danger'>{errors.rating[0]}</span>}
                        </div>
                        <div className="mb-1">
                            <label htmlFor="status" className="form-label">Status:</label><br />
                            <select name="status" id="status" className="form-control" value={venueUpdateformData.status} onChange={handleChange} >
                                <option value=""></option>
                                <option value="notbooked">Not Booked</option>
                                <option value="booked">Booked</option>
                            </select>
                            {errors.status && <span className='text-danger'>{errors.status[0]}</span>}
                        </div>
                        <div className="mt-3">
                            <button name='btnUpdateVenue' id='btnUpdateVenue' className='btn btn-outline-dark' onClick={(event)=>handleUpdateVenue(venueUpdateformData.id,event)} >Update</button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} >Close</Button>
                </Modal.Footer>
            </Modal>
            {/* <p>Selected items: {storefoodvalue}</p> */}
        </>
    )
}

export default withSwal(Admin_updatevenueform)
