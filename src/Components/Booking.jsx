import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/BookingPage.css';

const Booking = () => {
  const { venueId } = useParams();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`https://localhost:7250/api/Tblvenueslots/Client/available-slots/${venueId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allSlots = response.data.data;
        setSlots(allSlots);
        if (allSlots.length > 0) {
          setSelectedDate(allSlots[0].date);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [venueId]);

  const handleBookSlot = async (slot) => {
    if (slot.isBooked) return;
  
    const token = sessionStorage.getItem("token");
  
    try {
      const response = await axios.post(
        "https://localhost:7250/api/Tblbookings",
        {
          slotId: slot.slotId,
          payableAmount: slot.priceperhour
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
      );
  
      const booking = response.data.data;
      // Redirect to payment page with bookingId
      navigate(`/payment/${booking.bookingId}`);

    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to book slot.");
    }
  };
  

  // Extract unique dates from slots
  const uniqueDates = [...new Set(slots.map(slot => slot.date))];

  // Filter slots for the selected date
  const filteredSlots = slots.filter(slot => slot.date === selectedDate);

  return (
    <div className="booking-page">
      {/* Header */}
      {/* <div className="header">
        <img src="/logo.png" alt="DotBall Logo" className="logo" />
        <button className="check-slots-btn">Check Available Slots</button>
      </div> */}

      {/* Date Selector */}
      <div className="date-selector">
        {uniqueDates.map(date => (
          <div
            key={date}
            className={`date-item ${selectedDate === date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date).toDateString()}
          </div>
        ))}
      </div>

      {/* Slot Cards */}
      {loading ? (
        <p style={{ color: 'white' }}>Loading slots...</p>
      ) : filteredSlots.length === 0 ? (
        <p style={{ color: 'white' }}>No available slots for selected date.</p>
      ) : (
        <div className="slots-grid">
          {filteredSlots.map((slot) => (
            <div key={slot.slotId} className="slot-card">
              <div className="slot-time">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className="slot-options">
                <div
                  className={`slot-option ${slot.isBooked ? 'booked' : ''}`}
                  onClick={() => handleBookSlot(slot)}
                  style={{ cursor: slot.isBooked ? 'not-allowed' : 'pointer' }}
                >
                  {slot.isBooked ? 'Booked!' : `₹${slot.priceperhour}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
