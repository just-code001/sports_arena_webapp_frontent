import React, { useEffect } from 'react';
import i1 from './../Photos/test4.jpg';
import i2 from './../Photos/test3.jpg';
import i3 from './../Photos/bg1.jpg';

const Slider = () => {
  useEffect(() => {
    const carousel = document.querySelector("#carouselExample");
    const prevButton = document.querySelector(".carousel-control-prev");
    const nextButton = document.querySelector(".carousel-control-next");

    if (carousel && prevButton && nextButton) {
      prevButton.addEventListener("mouseenter", () => {
        carousel?.classList.add("paused"); // Prevent auto-slide when hovering
      });
      prevButton.addEventListener("mouseleave", () => {
        carousel?.classList.remove("paused"); // Resume auto-slide when leaving
      });

      nextButton.addEventListener("mouseenter", () => {
        carousel?.classList.add("paused");
      });
      nextButton.addEventListener("mouseleave", () => {
        carousel?.classList.remove("paused");
      });
    }

    return () => {
      prevButton?.removeEventListener("mouseenter", () => carousel?.classList.add("paused"));
      prevButton?.removeEventListener("mouseleave", () => carousel?.classList.remove("paused"));
      nextButton?.removeEventListener("mouseenter", () => carousel?.classList.add("paused"));
      nextButton?.removeEventListener("mouseleave", () => carousel?.classList.remove("paused"));
    };
  }, []);

  return (
    <div
      id="carouselExample"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={i1} className="d-block w-100 img-fluid" style={{ height: "100vh", objectFit: "cover" }} alt="Slide 1" />
        </div>
        <div className="carousel-item">
          <img src={i2} className="d-block w-100 img-fluid" style={{ height: "100vh", objectFit: "cover" }} alt="Slide 2" />
        </div>
        <div className="carousel-item">
          <img src={i3} className="d-block w-100 img-fluid" style={{ height: "100vh", objectFit: "cover" }} alt="Slide 3" />
        </div>
      </div>

      {/* Prev & Next Buttons */}
      {/* <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
        <span className="visually-hidden">Next</span>
      </button> */}
    </div>
  );
};

export default Slider;
