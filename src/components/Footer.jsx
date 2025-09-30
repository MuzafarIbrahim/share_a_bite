import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Share a Bite</h5>
            <p className="mb-0">Connecting communities through food sharing</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">&copy; 2025 Share a Bite. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;