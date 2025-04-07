import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './css/ContactPage.css'; // Import custom CSS

const ContactPage = () => {
  return (
    <div className="contact-page-bg">
      <Container className="py-5">
        <Row className="mb-4 text-center text-white">
          <Col>
            <h2 className="fw-bold">Contact Us</h2>
            <p className="text-light">We'd love to hear from you. Reach out with any questions or feedback!</p>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="p-4 shadow contact-card">
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" placeholder="Subject" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Your message..." required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={6} className="mt-4 mt-md-0">
          <Card className="p-4 h-100 shadow contact-card text-center">
  <h5 className="fw-bold mb-3">Arena Location</h5>
  <p>🏟️ <strong>Sports Arena Complex</strong></p>
  <p>123 Arena Road, City Name, State, 12345</p>
  <p>📞 +1 (234) 567-8901</p>
  <p>📧 support@sportsarena.com</p>

  {/* <hr className="my-4" /> */}
{/* 
  <h6 className="fw-bold mb-2">Opening Hours</h6>
  <p>🕒 Monday - Friday: 9:00 AM - 8:00 PM</p>
  <p>🕒 Saturday - Sunday: 10:00 AM - 6:00 PM</p> */}

  <hr className="my-4" />

  <h6 className="fw-bold mb-2">Facilities Available</h6>
  <p>🏀 Basketball Courts</p>
  <p>⚽ Soccer Fields</p>
  <p>🎾 Tennis Courts</p>
  <p>🏋️ Fitness Center</p>

  <hr className="my-4" />

  <h6 className="fw-bold mb-2">Follow Us</h6>
  <div className="d-flex justify-content-center gap-3">
    <a href="#" className="text-decoration-none text-primary">
      <i className="bi bi-facebook fs-4"></i>
    </a>
    <a href="#" className="text-decoration-none text-info">
      <i className="bi bi-twitter fs-4"></i>
    </a>
    <a href="#" className="text-decoration-none text-danger">
      <i className="bi bi-instagram fs-4"></i>
    </a>
  </div>
</Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
