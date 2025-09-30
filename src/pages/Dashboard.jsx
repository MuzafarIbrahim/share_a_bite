import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isRestaurant = user?.role === 'restaurant';
  const isWelfareOrg = user?.role === 'welfare_org';

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Welcome, {user?.name}!</h1>
          <p className="lead">
            {isRestaurant 
              ? "Manage your food donations and help reduce waste while supporting your community."
              : "Find and claim food donations to support your mission of feeding those in need."
            }
          </p>
        </Col>
      </Row>
      
      <Row>
        {isRestaurant && (
          <>
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h4>Create Food Post</h4>
                  <p>Share your surplus food with welfare organizations</p>
                  <LinkContainer to="/create-post">
                    <Button variant="success">Create Donation</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h4>My Donations</h4>
                  <p>View and manage your food donation posts</p>
                  <LinkContainer to="/my-posts">
                    <Button variant="info">View Donations</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
        
        {isWelfareOrg && (
          <>
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h4>Browse Donations</h4>
                  <p>Find available food donations from restaurants</p>
                  <LinkContainer to="/browse-food">
                    <Button variant="primary">Browse</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <h4>My Claims</h4>
                  <p>Track your claimed food donations</p>
                  <LinkContainer to="/my-claims">
                    <Button variant="warning">View Claims</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
      
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h5>Recent Activity</h5>
              {isRestaurant ? (
                <p className="text-muted">No recent donations to display. Start by creating a food donation post!</p>
              ) : (
                <p className="text-muted">No recent claims to display. Start by browsing available food donations!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;