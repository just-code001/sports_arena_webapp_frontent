// Achievements.jsx
import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

const achievements = [
  { number: "100+", label: "Venues Listed" },
  { number: "5000+", label: "Bookings Completed" },
  { number: "2000+", label: "Happy Users" },
];

const Achievements = () => (
  <Container className="my-5">
    <h2 className="text-warning text-center mb-4">Our Achievements</h2>
    <Row className="text-center">
      {achievements.map((a, index) => (
        <Col key={index} md={4} className="mb-3">
          <h3 className="text-light display-5 fw-bold">{a.number}</h3>
          <p className="text-warning fs-5">{a.label}</p>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Achievements;