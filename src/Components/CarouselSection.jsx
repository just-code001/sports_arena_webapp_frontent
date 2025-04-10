import React from "react";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
// import slide1 from "../../Photos/slide1.jpg";
// import slide2 from "../../Photos/slide2.jpg";
// import slide3 from "../../Photos/slide3.jpg";

const CarouselSection = () => {
  return (
    <Carousel fade interval={4000}>
      {/* {[slide1, slide2, slide3].map((img, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={img} alt={`Slide ${index + 1}`} style={{ height: "90vh", objectFit: "cover" }} />
          <Carousel.Caption>
            <h3 className="text-warning fw-bold display-5">Welcome to Sports Arena</h3>
            <p className="text-light">Book and manage your favorite sports venues seamlessly</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))} */}
    </Carousel>
  );
};

export default CarouselSection;