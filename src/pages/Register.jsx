import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    phoneNumber: '',
    contactPerson: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.organizationName.trim()) {
      setError('Organization name is required');
      return false;
    }
    if (!formData.organizationType) {
      setError('Please select organization type');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.registrationNumber.trim()) {
      setError('Registration number is required');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setError('');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      setSuccess('Registration successful! Please wait for admin approval before you can login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="text-center mb-4">
        <div className="mb-3" style={{ fontSize: '4rem' }}>
          {formData.organizationType === 'restaurant' ? '🏪' : formData.organizationType === 'welfare_organization' ? '🤝' : '📝'}
        </div>
        <h3 className="fw-bold text-dark mb-2">Tell Us About Your Organization</h3>
        <p className="text-muted">
          Help us understand how you'll make an impact
        </p>
      </div>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-dark mb-3">
          What type of organization are you?
        </Form.Label>
        <Row>
          <Col md={6} className="mb-3">
            <Card 
              className={`h-100 ${formData.organizationType === 'restaurant' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
              onClick={() => setFormData({...formData, organizationType: 'restaurant'})}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="text-center p-4">
                <div style={{ fontSize: '3rem' }}>🏪</div>
                <h6 className="fw-bold mt-2">Restaurant</h6>
                <small className="text-muted">Share surplus food with those in need</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card 
              className={`h-100 ${formData.organizationType === 'welfare_organization' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
              onClick={() => setFormData({...formData, organizationType: 'welfare_organization'})}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="text-center p-4">
                <div style={{ fontSize: '3rem' }}>🤝</div>
                <h6 className="fw-bold mt-2">Welfare Organization</h6>
                <small className="text-muted">Collect food for community support</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-dark mb-2">
          Organization Name
        </Form.Label>
        <Form.Control
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          placeholder="Enter your organization name"
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-dark mb-2">
          Email Address
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
          className="form-control"
        />
      </Form.Group>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="text-center mb-4">
        <div className="mb-3" style={{ fontSize: '4rem' }}>
          🔐
        </div>
        <h3 className="fw-bold text-dark mb-2">Complete Your Profile</h3>
        <p className="text-muted">
          Final step to join our community
        </p>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              Registration Number
            </Form.Label>
            <Form.Control
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="Business registration number"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              Phone Number
            </Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contact phone number"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-dark mb-2">
          Contact Person
        </Form.Label>
        <Form.Control
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Primary contact person name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-dark mb-2">
          Address (Optional)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Your organization's address"
        />
      </Form.Group>
    </>
  );

  return (
    <div className="min-vh-100 py-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                {/* Progress Indicator */}
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '40px', height: '40px' }}>
                      1
                    </div>
                    <div className={`border-top ${currentStep >= 2 ? 'border-primary' : 'border-light'}`} style={{ width: '100px' }}></div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ms-3 ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '40px', height: '40px' }}>
                      2
                    </div>
                  </div>
                  <p className="text-muted mb-0">
                    Step {currentStep} of 2 - {currentStep === 1 ? 'Organization Details' : 'Account Setup'}
                  </p>
                </div>

                <Form onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success" className="mb-4">
                      {success}
                    </Alert>
                  )}

                  {currentStep === 1 ? renderStep1() : renderStep2()}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between mt-4">
                    {currentStep === 1 ? (
                      <div className="w-100">
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="w-100"
                          size="lg"
                          disabled={!formData.organizationType || !formData.organizationName || !formData.email}
                        >
                          Continue to Next Step →
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={handleBack}
                          variant="outline-secondary"
                          className="me-3"
                        >
                          ← Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          variant="success"
                          className="flex-grow-1"
                          size="lg"
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Create Account
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </Form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <hr />
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in to your account
                    </Link>
                  </p>
                </div>

                {/* Impact Message */}
                <div className="text-center mt-4 p-3 bg-light rounded">
                  <small className="text-muted fst-italic">
                    "Join thousands of organizations making a real difference in the fight against hunger"
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;