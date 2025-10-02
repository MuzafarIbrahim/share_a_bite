import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { foodService } from '../services/foodService';
import ReportModal from '../components/ReportModal';

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

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportSuccess, setReportSuccess] = useState('');

  const { user } = useAuth();

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

  const handleReportRestaurant = (restaurant) => {
    setReportTarget({
      type: 'restaurant',
      name: restaurant.name,
      id: restaurant.id
    });
    setShowReportModal(true);
  };

  const handleReportSubmit = (reportData) => {
    setReportSuccess(`Report submitted against ${reportTarget.name}. Reference: ${Date.now()}`);
    setTimeout(() => setReportSuccess(''), 5000);
    setReportTarget(null);
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
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {reportSuccess && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success" dismissible onClose={() => setReportSuccess('')}>
              {reportSuccess}
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
                <LinkContainer to="/browse-food">
                  <Button variant="primary">Browse Food Donations</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {claims.map(claim => (
            <Col md={6} lg={4} key={claim.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{claim.title}</Card.Title>
                    <Badge bg={getStatusVariant(claim.status)}>
                      {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                  <Card.Text>{claim.description || 'No description'}</Card.Text>
                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Quantity:</strong> {claim.quantity}<br/>
                      <strong>Pickup Time:</strong> {claim.pickup_time || 'Not specified'}<br/>
                      <strong>Restaurant:</strong> {claim.restaurant?.name || 'Unknown'}<br/>
                      {claim.restaurant?.address && (
                        <>
                          <strong>Address:</strong> {claim.restaurant.address}<br/>
                        </>
                      )}
                      {claim.restaurant?.phone && (
                        <>
                          <strong>Phone:</strong> {claim.restaurant.phone}<br/>
                        </>
                      )}
                      <strong>Claimed:</strong> {formatDate(claim.claimed_at || claim.created_at)}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex gap-2">
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
                    {claim.restaurant && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleReportRestaurant(claim.restaurant)}
                      >
                        Report Restaurant
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
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

      {/* Report Modal */}
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        reportedEntity={reportTarget}
        reportedBy={{
          name: user?.name,
          id: user?.id,
          type: user?.role
        }}
        onReportSubmit={handleReportSubmit}
      />
    </Container>
  );
};

export default MyClaims;