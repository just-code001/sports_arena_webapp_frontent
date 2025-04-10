import React, { useState } from 'react';
import './css/BookingPage.css'; // Importing CSS file

const dates = ["Apr 9 Wed", "Apr 10 Thu", "Apr 11 Fri", "Apr 12 Sat", "Apr 13 Sun", "Apr 14 Mon", "Apr 15 Tue"];

const slots = [
  "12 AM - 1 AM", "1 AM - 2 AM", "2 AM - 3 AM", "3 AM - 4 AM", "4 AM - 5 AM", "5 AM - 6 AM",
  "6 AM - 7 AM", "7 AM - 8 AM", "8 AM - 9 AM", "9 AM - 10 AM", "10 AM - 11 AM", "11 AM - 12 PM",
  "12 PM - 1 PM", "1 PM - 2 PM", "2 PM - 3 PM", "3 PM - 4 PM", "4 PM - 5 PM", "5 PM - 6 PM",
  "6 PM - 7 PM", "7 PM - 8 PM", "8 PM - 9 PM", "9 PM - 10 PM", "10 PM - 11 PM", "11 PM - 12 AM",
];

const bookedSlots = ["7 AM - 8 AM", "10 AM - 11 AM", "11 AM - 12 PM", "9 PM - 10 PM", "10 PM - 11 PM"];

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const isBooked = (time) => bookedSlots.includes(time);

  const getPrice = (time) => {
    const hour = parseInt(time.split(' ')[0]);
    return (hour >= 8 && hour <= 17) ? 700 : 1000; // Morning/Evening Rs.700, Night Rs.1000
  };

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="header">
        <img src="/logo.png" alt="DotBall Logo" className="logo" />
        <button className="check-slots-btn">Check Available Slots</button>
      </div>

      {/* Date Selector */}
      <div className="date-selector">
        {dates.map(date => (
          <div
            key={date}
            className={`date-item ${selectedDate === date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </div>
        ))}
      </div>

      {/* Slots Grid */}
      <div className="slots-grid">
        {slots.map(time => (
          <div className="slot-card" key={time}>
            <div className="slot-time">{time}</div>
            <div className="slot-options">
              {[1, 2].map((court) => (
                <div
                  key={court}
                  className={`slot-option ${isBooked(time) ? 'booked' : ''}`}
                >
                  {isBooked(time) ? 'Booked!' : `₹${getPrice(time)}`}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default BookingPage;
