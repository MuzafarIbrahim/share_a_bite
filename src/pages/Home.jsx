import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-4">Welcome to Share a Bite</h1>
          <p className="lead mb-4">
            Connecting restaurants with welfare organizations to reduce food waste and feed those in need. 
            Join our platform where restaurants can share surplus food with registered welfare organizations.
          </p>
          {!isAuthenticated && (
            <div>
              <LinkContainer to="/register">
                <Button variant="primary" size="lg" className="me-3">
                  Register Your Organization
                </Button>
              </LinkContainer>
              <LinkContainer to="/login">
                <Button variant="outline-primary" size="lg">
                  Login
                </Button>
              </LinkContainer>
            </div>
          )}
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h4>For Restaurants</h4>
              <p>Share your surplus food items with welfare organizations and help reduce food waste while supporting your community.</p>
              <ul className="text-start">
                <li>Post available surplus food</li>
                <li>Set pickup times and locations</li>
                <li>Track food donation impact</li>
                <li>Build community relationships</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h4>For Welfare Organizations</h4>
              <p>Find and claim food donations from local restaurants to support your mission of feeding those in need.</p>
              <ul className="text-start">
                <li>Browse available food donations</li>
                <li>Quick claiming process</li>
                <li>Coordinate pickup schedules</li>
                <li>Help feed your community</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col className="text-center">
          <h3>Making a Difference Together</h3>
          <p className="lead">
            Reduce food waste, feed the hungry, and strengthen community bonds through our platform.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;