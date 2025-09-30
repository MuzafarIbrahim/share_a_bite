import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { foodService } from '../services/foodService';
import { useAuth } from '../context/AuthContext';

const BrowseFood = () => {
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  
  // Modal states
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donationToClaim, setDonationToClaim] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user } = useAuth();

  // Fetch donations from API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError('');
        // Only fetch available food posts for welfare organizations
        const response = await foodService.getAvailableFoodPosts();
        setDonations(response.data || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to load food donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(donation => {
    // Only show available donations
    const isAvailable = donation.status === 'available';
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || donation.category === filterCategory;
    return isAvailable && matchesSearch && matchesCategory;
  });

  const handleClaim = async (donationId) => {
    // Check if user is a welfare organization
    if (user?.role !== 'welfare_organization') {
      setError('Only welfare organizations can claim food donations.');
      return;
    }

    const donation = donations.find(d => d.id === donationId);
    setDonationToClaim(donation);
    setShowClaimModal(true);
  };

  const confirmClaim = async () => {
    if (!donationToClaim) return;

    try {
      setClaimingId(donationToClaim.id);
      setError('');
      setShowClaimModal(false);
      
      const response = await foodService.claimFood(donationToClaim.id);
      
      // Update the donations list to reflect the claimed status
      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === donationToClaim.id 
            ? { ...donation, status: 'claimed', claimed_by: user.id }
            : donation
        )
      );
      
      // Show success modal
      setSuccessMessage('Food donation claimed successfully! You can view it in "My Claims" page. The restaurant will be notified.');
      setShowSuccessModal(true);
      
      setDonationToClaim(null);
    } catch (error) {
      console.error('Error claiming food:', error);
      setDonationToClaim(null);
      
      // Better error handling
      if (error.response?.status === 403) {
        setError('Only welfare organizations can claim food donations.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.error || 'This donation has already been claimed by someone else.');
      } else if (error.response?.status === 404) {
        setError('This donation is no longer available.');
      } else if (error.response?.status === 401) {
        setError('Please log in to claim donations.');
      } else {
        setError(error.response?.data?.error || 'Failed to claim food donation. Please try again.');
      }
    } finally {
      setClaimingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading food donations...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Browse Food Donations</h1>
          <p className="lead">Find and claim food donations from local restaurants to support your mission</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search for food donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="prepared_meals">Prepared Meals</option>
            <option value="sandwiches">Sandwiches</option>
            <option value="salads">Salads</option>
            <option value="soups">Soups</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
            <option value="baked_goods">Baked Goods</option>
            <option value="other">Other</option>
          </Form.Select>
        </Col>
      </Row>
      
      <Row>
        {filteredDonations.length === 0 ? (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <p>No food donations found matching your criteria.</p>
                {donations.length === 0 && !loading && (
                  <p className="text-muted">There are currently no food donations available.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredDonations.map(donation => (
            <Col md={6} lg={4} key={donation.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{donation.title}</Card.Title>
                    <Badge bg="secondary">
                      {donation.category ? donation.category.replace('_', ' ') : 'General'}
                    </Badge>
                  </div>
                  <Card.Text>{donation.description}</Card.Text>
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Quantity:</strong> {donation.quantity || 'Not specified'}<br/>
                      <strong>Pickup Location:</strong> {donation.location || 'See restaurant details'}<br/>
                      <strong>Pickup Time:</strong> {formatTime(donation.pickupTimeStart)} - {formatTime(donation.pickupTimeEnd)}<br/>
                      <strong>Best Before:</strong> {formatDate(donation.expiryDate)}<br/>
                      <strong>Restaurant:</strong> {donation.postedBy || donation.restaurant?.name || 'Restaurant'}<br/>
                      {donation.registrationNumber && (
                        <>
                          <strong>Reg. No:</strong> {donation.registrationNumber}<br/>
                        </>
                      )}
                      <strong>Posted:</strong> {formatDate(donation.created_at)}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => handleClaim(donation.id)}
                    disabled={claimingId === donation.id || donation.user_id === user?.id}
                  >
                    {claimingId === donation.id ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Claiming...
                      </>
                    ) : donation.user_id === user?.id ? (
                      'Your Post'
                    ) : (
                      'Claim This Donation'
                    )}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Custom Claim Confirmation Modal */}
      <Modal show={showClaimModal} onHide={() => setShowClaimModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Claim Food Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-hand-holding-heart text-primary" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>Confirm your claim for this donation</h5>
            {donationToClaim && (
              <div className="text-muted mb-3">
                <p><strong>Food Item:</strong> {donationToClaim.title}</p>
                <p><strong>Quantity:</strong> {donationToClaim.quantity}</p>
                <p><strong>Restaurant:</strong> {donationToClaim.postedBy || donationToClaim.restaurant?.name || 'Restaurant'}</p>
                <p className="small">The restaurant will be notified of your claim and you can coordinate pickup details.</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClaimModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmClaim}>
            Confirm Claim
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Claim Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-check-circle text-success" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>{successMessage}</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BrowseFood;