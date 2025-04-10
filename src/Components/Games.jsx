import React from 'react';
import './css/Games.css'; // Make sure you create Games.css in the same folder
import cg1 from '../Photos/c2.jpg'
import cg2 from '../Photos/c1.jpg'
import cg3 from '../Photos/c3.jpg'

const sportsData = [
  {
    name: "Cricket",
    description: "Book world-class cricket stadiums for tournaments, practice, and coaching sessions.",
    image: cg1,
  },
  {
    name: "Football",
    description: "Experience professional football grounds with premium turf and lighting.",
    image: cg2,
  },
  {
    name: "Pickleball",
    description: "Fast-paced fun on high-quality pickleball courts available for booking.",
    image: cg3,
  },
];

const Games = () => {
  return (
    <div className="games-main">
      <div className="games-container">
        <h2 className="games-heading">Book Your Game Arena</h2>
        <div className="games-grid">
          {sportsData.map((sport, index) => (
            <div className="games-card" key={index}>
              <img src={sport.image} alt={sport.name} className="games-card-image" />
              <div className="games-card-content">
                <h3 className="games-card-title">{sport.name}</h3>
                <p className="games-card-description">{sport.description}</p>
                <button className="games-card-button">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games;
