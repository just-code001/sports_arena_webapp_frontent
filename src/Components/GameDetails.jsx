// src/Components/GameDetails.jsx
import React, { useEffect, useState } from 'react';
import './css/GameDetails.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GameDetails = () => {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("https://localhost:7250/api/Tblvenues/Client/GetAllActiveVenues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenues(response.data.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const handleBookNow = (venueId) => {
    navigate(`/book/${venueId}`);
  };

  return (
    <div className="game-details-main">
      <h2 className="game-details-heading">Explore Our Arenas</h2>
      <div className="game-details-grid">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div className="game-card" key={venue.venueId}>
              <img
                src={`https://localhost:7250/images/${venue.venueImage}`}
                alt={venue.venuename}
                className="game-image"
              />
              <div className="game-content">
                <h3 className="game-title">{venue.venuename}</h3>
                <p className="game-description">{venue.description}</p>
                <ul className="game-features">
                  <li>📍 {venue.location}</li>
                  <li>🏷️ {venue.categoryName}</li>
                  <li>👤 {venue.providerName}</li>
                  <li>👥 Capacity: {venue.capacity}</li>
                  <li>💰 ₹{venue.priceperhour}/hour</li>
                </ul>
                <button className="book-now-btn" onClick={() => handleBookNow(venue.venueId)}>
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-venues">No venues available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
