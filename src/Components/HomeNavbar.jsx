import React from 'react';
import background from "../Photos/test4.jpg";

const HomeNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg"
    //  style={{
    //   backgroundImage: `url(${background})`,
    //   backgroundSize: "cover",
    //   backgroundPosition: "center",
    //   width: "100%"
    // }}
    >
      <div className="container-fluid mx-5">
        <a className="navbar-brand text-light" href="#">SPORTS ARENA</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto"> {/* Aligns items to the left */}
            <li className="nav-item">
              <a className="nav-link active text-warning" aria-current="page" href="#">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">PLACE</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">BOOKING</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">ABOUT US</a>
            </li>
          </ul>
          <div className="d-flex gap-2"> {/* Adds spacing between buttons */}
            <button type="button" className="btn btn-warning">Log in</button>
            <button type="button" className="btn btn-warning">Sign up</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
