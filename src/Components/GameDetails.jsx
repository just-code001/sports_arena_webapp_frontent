// src/Components/GameDetails.jsx

import React from 'react';
import './css/GameDetails.css'; // create this file
import cricketImage from '../Photos/c1.jpg'; // cricket image

const GameDetails = () => {
  return (
    <div className="game-details-main">
      <div className="game-details-container">
        <img src={cricketImage} alt="Cricket" className="game-details-image" />
        <div className="game-details-content">
          <h1 className="game-details-title">Cricket Arena</h1>
          <p className="game-details-description">
            Experience world-class cricket stadiums perfect for tournaments, practice sessions, and coaching clinics.
            Book your premium cricket ground today with top-notch facilities and seating arrangements.
          </p>
          <ul className="game-details-features">
            <li>✅ Professional Turf Pitches</li>
            <li>✅ LED Floodlights for Night Matches</li>
            <li>✅ VIP Lounge and Spectator Stands</li>
            <li>✅ Coaching Sessions Available</li>
          </ul>
          <button className="game-details-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
