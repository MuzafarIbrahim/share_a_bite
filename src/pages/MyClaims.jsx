import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { foodService } from '../services/foodService';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Add modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [claimToCancel, setClaimToCancel] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  // Fetch user claims from API
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await foodService.getUserClaims();
      setClaims(response.data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
      if (error.response?.status === 401) {
        setError('Please log in to view your claims.');
      } else {
        setError('Failed to load your claims. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'available': return 'primary';
      case 'claimed': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleCancelClaim = async (claimId) => {
    const claim = claims.find(c => c.id === claimId);
    
    // Show custom cancel confirmation modal
    setClaimToCancel(claim);
    setShowCancelModal(true);
  };

  const confirmCancelClaim = async () => {
    if (!claimToCancel) return;

    try {
      setShowCancelModal(false); // Close cancel modal
      
      // TODO: Implement cancel claim API call when backend supports it
      console.log('Cancel claim functionality to be implemented:', claimToCancel.id);
      
      // For now, show info modal instead of success since it's not implemented
      setModalMessage('Cancel claim functionality will be implemented soon. This feature is currently under development.');
      setShowInfoModal(true);
      
      setClaimToCancel(null);
    } catch (error) {
      console.error('Error cancelling claim:', error);
      setClaimToCancel(null);
      setError('Failed to cancel claim. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchClaims();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading your claims...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>My Claims</h1>
          <p className="lead">Track the status of your claimed food items</p>
          <Button variant="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      
      {claims.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h5>No Claims Yet</h5>
                <p>You haven't claimed any food items yet. Browse available food to get started!</p>
                <Button variant="primary" href="/browse-food">
                  Browse Donations
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Pickup Time</th>
                      <th>Restaurant</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map(claim => (
                      <tr key={claim.id}>
                        <td><strong>{claim.title}</strong></td>
                        <td>{claim.description || 'No description'}</td>
                        <td>{claim.quantity}</td>
                        <td>
                          <Badge bg={getStatusVariant(claim.status)}>
                            {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Unknown'}
                          </Badge>
                        </td>
                        <td>{claim.pickup_time || 'Not specified'}</td>
                        <td>
                          {claim.restaurant ? (
                            <div>
                              <strong>{claim.restaurant.name}</strong>
                              {claim.restaurant.address && (
                                <><br/><small className="text-muted">{claim.restaurant.address}</small></>
                              )}
                            </div>
                          ) : (
                            'Restaurant info not available'
                          )}
                        </td>
                        <td>
                          {claim.restaurant ? (
                            <div>
                              <small>
                                📧 {claim.restaurant.email}<br/>
                                {claim.restaurant.phone && (
                                  <>📞 {claim.restaurant.phone}</>
                                )}
                              </small>
                            </div>
                          ) : (
                            'Contact info not available'
                          )}
                        </td>
                        <td>
                          {claim.status === 'claimed' && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleCancelClaim(claim.id)}
                            >
                              Cancel
                            </Button>
                          )}
                          {claim.status === 'confirmed' && (
                            <Badge bg="success">Ready for Pickup</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Custom Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Claim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-question-circle text-warning" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>Are you sure you want to cancel this claim?</h5>
            {claimToCancel && (
              <div className="text-muted mb-3">
                <p><strong>Food Item:</strong> {claimToCancel.title}</p>
                <p><strong>Restaurant:</strong> {claimToCancel.restaurant?.name || 'N/A'}</p>
                <p className="small">This action will make the food available for others to claim.</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Claim
          </Button>
          <Button variant="danger" onClick={confirmCancelClaim}>
            Cancel Claim
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-check-circle text-success" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>{modalMessage}</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Info Modal */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-info-circle text-primary" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>{modalMessage}</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInfoModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyClaims;