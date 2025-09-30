import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { foodService } from '../services/foodService';

const Dashboard = () => {
  const { user } = useAuth();
  const isRestaurant = user?.role === 'restaurant';
  const isWelfareOrg = user?.role === 'welfare_organization';

  // State for recent activity
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');

  // Fetch recent activity data
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) {
        setActivityLoading(false);
        return;
      }

      try {
        setActivityLoading(true);
        setActivityError('');

        if (isRestaurant) {
          // Fetch recent donations for restaurants
          const response = await foodService.getUserFoodPosts();
          const posts = response.data || [];
          // Get the 5 most recent posts
          const recentPosts = posts
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setRecentActivity(recentPosts);
        } else if (isWelfareOrg) {
          // Fetch recent claims for welfare organizations
          const response = await foodService.getUserClaims();
          const claims = response.data || [];
          // Get the 5 most recent claims
          const recentClaims = claims
            .sort((a, b) => new Date(b.claimed_at || b.created_at) - new Date(a.claimed_at || a.created_at))
            .slice(0, 5);
          setRecentActivity(recentClaims);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setActivityError('Failed to load recent activity');
      } finally {
        setActivityLoading(false);
      }
    };

    fetchRecentActivity();
  }, [user, isRestaurant, isWelfareOrg]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'success';
      case 'claimed': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'secondary';
      case 'expired': return 'danger';
      default: return 'secondary';
    }
  };

  const renderRecentActivity = () => {
    if (activityLoading) {
      return (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading recent activity...
        </div>
      );
    }

    if (activityError) {
      return (
        <Alert variant="warning" className="mb-0">
          {activityError}
        </Alert>
      );
    }

    if (recentActivity.length === 0) {
      return (
        <p className="text-muted mb-0">
          {isRestaurant 
            ? "No recent donations to display. Start by creating a food donation post!"
            : isWelfareOrg 
            ? "No recent claims to display. Start by browsing available food donations!"
            : "Welcome to Share a Bite! Please log in to access your dashboard."
          }
        </p>
      );
    }

    return (
      <div className="recent-activity-list">
        {recentActivity.map((item, index) => (
          <div key={item.id || index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center">
                <strong className="me-2">{item.title}</strong>
                <Badge bg={getStatusVariant(item.status)} className="me-2">
                  {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
                </Badge>
              </div>
              <small className="text-muted">
                {isRestaurant ? (
                  <>
                    Quantity: {item.quantity || 'N/A'} • 
                    Posted: {formatDate(item.created_at)}
                    {item.claimant && (
                      <> • Claimed by: {item.claimant.name}</>
                    )}
                  </>
                ) : (
                  <>
                    From: {item.restaurant?.name || item.postedBy || 'Restaurant'} • 
                    Claimed: {formatDate(item.claimed_at || item.created_at)}
                    {item.pickup_time && (
                      <> • Pickup: {item.pickup_time}</>
                    )}
                  </>
                )}
              </small>
            </div>
            <div className="text-end">
              <small className="text-muted">
                {formatDate(item.created_at)}
              </small>
            </div>
          </div>
        ))}
        
        <div className="text-center mt-3">
          <LinkContainer to={isRestaurant ? "/my-posts" : "/my-claims"}>
            <Button variant="outline-primary" size="sm">
              View All {isRestaurant ? 'Donations' : 'Claims'}
            </Button>
          </LinkContainer>
        </div>
      </div>
    );
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Welcome, {user?.name}!</h1>
          <p className="lead">
            {isRestaurant 
              ? "Manage your food donations and help reduce waste while supporting your community."
              : isWelfareOrg
              ? "Find and claim food donations to support your mission of feeding those in need."
              : "Welcome to Share a Bite platform."
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
              {renderRecentActivity()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;