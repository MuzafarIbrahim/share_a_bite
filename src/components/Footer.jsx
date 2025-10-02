import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Footer = () => {
  return (
    <footer 
      className="text-light py-5 mt-auto"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1
        }}
      />
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="mb-4">
          <Col md={4} className="mb-4">
            <h4 className="mb-3 fw-bold">
              <span className="me-2 fs-3">🍽️</span>
              Share a Bite
            </h4>
            <p className="opacity-75 fs-6 lh-base">
              Connecting restaurants with welfare organizations to reduce food waste and help those in need. 
              Together, we're building a world where every meal matters.
            </p>
            <div className="mt-3">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                🌟 Making Impact Daily
              </span>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-3 fw-semibold text-warning">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <LinkContainer to="/">
                  <a 
                    href="#" 
                    className="text-light text-decoration-none d-flex align-items-center"
                    style={{ 
                      transition: 'all 0.3s ease',
                      opacity: 0.8
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.color = '#ffc107';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0px)';
                      e.target.style.color = 'white';
                    }}
                  >
                    <span className="me-2">🏠</span> Home
                  </a>
                </LinkContainer>
              </li>
              <li className="mb-3">
                <LinkContainer to="/browse-food">
                  <a 
                    href="#" 
                    className="text-light text-decoration-none d-flex align-items-center"
                    style={{ 
                      transition: 'all 0.3s ease',
                      opacity: 0.8
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.color = '#ffc107';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0px)';
                      e.target.style.color = 'white';
                    }}
                  >
                    <span className="me-2">🔍</span> Browse Food
                  </a>
                </LinkContainer>
              </li>
              <li className="mb-3">
                <LinkContainer to="/register">
                  <a 
                    href="#" 
                    className="text-light text-decoration-none d-flex align-items-center"
                    style={{ 
                      transition: 'all 0.3s ease',
                      opacity: 0.8
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.color = '#ffc107';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0px)';
                      e.target.style.color = 'white';
                    }}
                  >
                    <span className="me-2">📝</span> Join Us
                  </a>
                </LinkContainer>
              </li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-3 fw-semibold text-warning">Connect With Us</h5>
            <p className="opacity-75 mb-3 small">
              Follow us on social media for updates and inspiring stories
            </p>
            <div className="d-flex gap-3 mb-3">
              <a 
                href="#" 
                className="text-light fs-4 text-decoration-none p-2 rounded-circle"
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1877f2';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                📘
              </a>
              <a 
                href="#" 
                className="text-light fs-4 text-decoration-none p-2 rounded-circle"
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1da1f2';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                🐦
              </a>
              <a 
                href="#" 
                className="text-light fs-4 text-decoration-none p-2 rounded-circle"
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e4405f';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                📸
              </a>
              <a 
                href="#" 
                className="text-light fs-4 text-decoration-none p-2 rounded-circle"
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0077b5';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                💼
              </a>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-warning text-dark small">🌍 Global Impact</span>
              <span className="badge bg-light text-dark small">💚 Eco-Friendly</span>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderWidth: '2px' }} />
        
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 opacity-75">
              © {new Date().getFullYear()} Share a Bite. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0 opacity-75">
              <span className="me-2">💝</span>
              Made with love for a better world
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;