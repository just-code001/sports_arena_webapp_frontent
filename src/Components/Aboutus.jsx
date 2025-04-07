import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './css/AboutPage.css'; // Custom CSS

const AboutPage = () => {
  return (
    <div className="about-page-bg">
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md={6}>
          <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14875.640029183394!2d72.83973144999999!3d21.2354169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1744023293351!5m2!1sen!2sin"
    width="100%"
    height="450"
    style={{ border: 0, borderRadius: '20px', width: '100%' }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Arena Location Map"
  ></iframe>
          </Col>

          <Col md={6}>
            <h1 className="about-title">About Us</h1>
            <p className="about-subtitle">
              Empowering Excellence in Sports and Event Management
            </p>
            <p className="about-description">
              At Sports Arena Management, we pride ourselves on delivering world-class facilities for athletes and unforgettable experiences for fans. 
              Our focus is on innovation, community engagement, and professional excellence.
            </p>
            <p className="about-description">
              Whether it's a thrilling sports tournament, a high-energy concert, or a global exhibition, we ensure every event is a resounding success.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="about-card h-100 text-center shadow p-3">
              <Card.Body>
                <i className="bi bi-award-fill about-icon"></i>
                <h5 className="fw-bold mt-3">Top Facilities</h5>
                <p>State-of-the-art arenas, stadiums, and event spaces built to global standards.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="about-card h-100 text-center shadow p-3">
              <Card.Body>
                <i className="bi bi-people-fill about-icon"></i>
                <h5 className="fw-bold mt-3">Community Driven</h5>
                <p>We work hand-in-hand with the local community to inspire the next generation of athletes.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="about-card h-100 text-center shadow p-3">
              <Card.Body>
                <i className="bi bi-globe-americas about-icon"></i>
                <h5 className="fw-bold mt-3">Global Vision</h5>
                <p>Hosting international events and building connections that span the world.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer className="footer-section">
      <Container>
        <Row className="gy-4">
          {/* About Section */}
          <Col md={4} className="text-center text-md-start">
            <h5 className="footer-logo">Sports Arena</h5>
            <p className="small-text">
              Sports Arena Management provides world-class facilities, training, and event management services for athletes, fans, and organizers. Join us in creating unforgettable sports moments!
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="text-center">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li><a href="/">🏠 Home</a></li>
              <li><a href="/about">📖 About Us</a></li>
              <li><a href="/events">🏟️ Events</a></li>
              <li><a href="/contact">✉️ Contact</a></li>
              <li><a href="/gallery">📸 Gallery</a></li>
            </ul>
          </Col>

          {/* Contact + Social */}
          <Col md={4} className="text-center text-md-end">
            <h6 className="footer-heading">Contact Us</h6>
            <p className="small-text"><FaMapMarkerAlt className="icon" /> 123 Arena Street, Cityville, Country</p>
            <p className="small-text"><FaPhoneAlt className="icon" /> +1 (234) 567-8901</p>
            <p className="small-text"><FaEnvelope className="icon" /> info@sportsarena.com</p>

            <div className="social-icons mt-3">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />
        <Row>
          <Col className="text-center small-text">
            © {new Date().getFullYear()} Sports Arena Management. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
    </div>
    
  );
};

export default AboutPage;
