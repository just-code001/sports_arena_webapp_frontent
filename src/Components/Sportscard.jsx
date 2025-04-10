import React from 'react';
import im1 from './../Photos/test1.jpg';
import im2 from './../Photos/test1.jpg';
import im3 from './../Photos/test1.jpg';
import './css/Sportscard.css'; // Link to the CSS we'll create

const Sportscard = () => {
  const facilities = [
    {
      image: im1,
      title: 'Facility 1',
      description: 'Top-quality arenas designed for your ultimate sports experience. Reserve your spot now!',
      date: 'MAY 9',
    },
    {
      image: im2,
      title: 'Facility 2',
      description: 'State-of-the-art courts and fields ready for action. Join the thrill!',
      date: 'JUN 15',
    },
    {
      image: im3,
      title: 'Facility 3',
      description: 'Experience premium sports training with world-class amenities.',
      date: 'JUL 21',
    }
  ];

  return (
    <div className="sports-card-main">
      <div className="sports-card-container">
        <h2 className="sports-card-heading">Explore Our Sports Facilities</h2>

        <div className="sports-card-list">
          {facilities.map((facility, index) => (
            <div key={index} className="sports-card-item">
              <div className="sports-card-date">
                <span className="month">{facility.date.split(' ')[0]}</span>
                <span className="day">{facility.date.split(' ')[1]}</span>
              </div>

              <img src={facility.image} alt={facility.title} className="sports-card-image" />

              <div className="sports-card-content">
                <h3 className="sports-card-title">{facility.title}</h3>
                <p className="sports-card-description">{facility.description}</p>
                <button className="sports-card-button">Book Now</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Sportscard;
