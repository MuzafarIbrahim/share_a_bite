import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { foodService } from '../services/foodService';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    expiryDate: '',
    pickupLocation: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    specialInstructions: '',
    servingSize: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API call with correct field names matching backend
      const postData = {
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity,
        pickupTimeStart: formData.pickupTimeStart,
        pickupTimeEnd: formData.pickupTimeEnd,
        category: formData.category,
        location: formData.pickupLocation,
        expiryDate: formData.expiryDate,
        specialInstructions: formData.specialInstructions
      };

      await foodService.createFood(postData);
      setSuccess('Food donation posted successfully! Welfare organizations can now view and claim this donation.');
      
      setTimeout(() => {
        navigate('/my-posts');
      }, 2000);
    } catch (error) {
      console.error('Error creating food post:', error);
      setError(error.response?.data?.error || 'Failed to create food post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">Create Food Donation</h2>
              <p className="text-muted mb-4">Share your surplus food with welfare organizations to help feed those in need.</p>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Food Item Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Fresh Sandwiches, Prepared Meals"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Food Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="prepared_meals">Prepared Meals</option>
                        <option value="sandwiches">Sandwiches</option>
                        <option value="salads">Salads</option>
                        <option value="soups">Soups</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                        <option value="baked_goods">Baked Goods</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the food items, ingredients, preparation time..."
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity Available *</Form.Label>
                      <Form.Control
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g., 50 portions, 20 meals"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Serving Size</Form.Label>
                      <Form.Control
                        type="text"
                        name="servingSize"
                        value={formData.servingSize}
                        onChange={handleChange}
                        placeholder="e.g., Individual portions, Family size"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Best Before Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pickup Location *</Form.Label>
                      <Form.Control
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Restaurant address or pickup point"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pickup Time Start *</Form.Label>
                      <Form.Control
                        type="time"
                        name="pickupTimeStart"
                        value={formData.pickupTimeStart}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pickup Time End *</Form.Label>
                      <Form.Control
                        type="time"
                        name="pickupTimeEnd"
                        value={formData.pickupTimeEnd}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Special Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special pickup instructions, storage requirements, contact person..."
                  />
                </Form.Group>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Donation'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePost;