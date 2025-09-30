import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    address: '',
    contactPerson: '',
    phoneNumber: '',
    registrationCertificate: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    console.log('Form submission started with data:', formData); // Debug log
    
    // Check all required fields (registration certificate is now optional)
    const requiredFields = {
      organizationType: 'Organization Type',
      organizationName: 'Organization Name', 
      registrationNumber: 'Registration Number',
      phoneNumber: 'Phone Number',
      contactPerson: 'Contact Person Name',
      email: 'Email Address',
      address: 'Address',
      password: 'Password',
      confirmPassword: 'Confirm Password'
      // Removed registrationCertificate from required fields
    };
    
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        setError(`${label} is required`);
        setLoading(false);
        return;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare organization data for backend API
      const organizationData = {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        email: formData.email,
        password: formData.password,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        contactPerson: formData.contactPerson,
        // Include registration certificate only if provided
        hasRegistrationCertificate: formData.registrationCertificate ? true : false
      };
      
      console.log('Sending registration data to backend:', organizationData);
      
      const response = await register(organizationData);
      console.log('Registration response:', response);
      
      // Show success message and redirect to login
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Error response:', error.response?.data);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Register Your Organization</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Type *</Form.Label>
                  <Form.Select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select organization type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="welfare_organization">Welfare Organization</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter your organization name"
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Registration Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="Official registration number"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
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
                
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Primary contact person"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Organization email"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete organization address"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Registration Certificate (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    name="registrationCertificate"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Form.Text className="text-muted">
                    Upload official registration certificate (PDF, JPG, PNG) - Optional
                  </Form.Text>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Organization'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p>Already registered? <Link to="/login">Login here</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;