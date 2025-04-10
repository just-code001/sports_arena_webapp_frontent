// FeatureCards.jsx
import React from "react";
import { Card, Row, Col, Container } from 'react-bootstrap';
import { MdSportsCricket, MdOutlineSportsTennis } from "react-icons/md";
import { FaFootballBall } from "react-icons/fa";

const features = [
  { title: "Cricket Grounds", icon: <MdSportsCricket size={40} className="text-warning" /> },
  { title: "Football Arenas", icon: <FaFootballBall size={40} className="text-warning" /> },
  { title: "Tennis Courts", icon: <MdOutlineSportsTennis size={40} className="text-warning" /> },
];

const FeatureCards = () => (
  <Container className="my-5">
    <h2 className="text-center text-warning mb-4">Explore Our Sports Categories</h2>
    <Row>
      {features.map((f, index) => (
        <Col md={4} key={index} className="mb-4">
          <Card className="text-center shadow-lg border-0">
            <Card.Body>
              {f.icon}
              <Card.Title className="mt-3 text-dark fw-bold">{f.title}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default FeatureCards;