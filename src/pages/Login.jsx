import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData); // Pass the entire formData object instead of separate parameters
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div className="position-absolute" style={{
        top: '-10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>
      <div className="position-absolute" style={{
        bottom: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>

      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={9}>
            <Card className="shadow-lg border-0" style={{
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}>
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-3" style={{ fontSize: '4rem' }}>
                    🍽️
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted mb-0">
                    Continue your journey of making a difference
                  </p>
                </div>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="mb-4 border-0" style={{
                      borderRadius: '12px',
                      background: 'rgba(220, 53, 69, 0.1)',
                      border: '1px solid rgba(220, 53, 69, 0.2)'
                    }}>
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="fas fa-envelope me-2 text-muted"></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="border-0 shadow-sm"
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="fas fa-lock me-2 text-muted"></i>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="border-0 shadow-sm"
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 border-0 fw-semibold"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                {/* Divider */}
                <div className="text-center my-4">
                  <div className="position-relative">
                    <hr className="text-muted" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Join the movement and create your account
                    <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>

                {/* Motivational Quote */}
                <div className="text-center mt-4 p-3" style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <small className="text-muted fst-italic">
                    "Every login brings us closer to a world without hunger"
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Features Preview */}
            <Row className="mt-4 text-white text-center">
              <Col xs={4}>
                <div className="p-3">
                  <div style={{ fontSize: '2rem' }}>🤝</div>
                  <small className="d-block mt-2">Connect</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-3">
                  <div style={{ fontSize: '2rem' }}>❤️</div>
                  <small className="d-block mt-2">Share</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-3">
                  <div style={{ fontSize: '2rem' }}>✨</div>
                  <small className="d-block mt-2">Impact</small>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          border-color: rgba(102, 126, 234, 0.5) !important;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
        }
        
        .card {
          transition: transform 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;