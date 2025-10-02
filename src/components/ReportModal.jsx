import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const ReportModal = ({ show, onHide, reportedEntity, reportedBy, onReportSubmit }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportType || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const reportData = {
        type: reportType,
        reportedItem: `${reportedEntity.type}: ${reportedEntity.name}`,
        reportedBy: reportedBy.name,
        description: description.trim(),
        priority: priority,
        status: 'pending',
        reportedEntityId: reportedEntity.id,
        reportedEntityType: reportedEntity.type,
        date: new Date().toLocaleDateString(),
        created_at: new Date().toISOString(),
        id: Date.now() // Generate a temporary ID
      };

      try {
        // Try to submit report to backend
        await api.post('/admin/reports', reportData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (apiError) {
        console.log('Reports API not available, storing locally');
        
        // Since the API doesn't exist yet, store reports locally
        const existingReports = JSON.parse(localStorage.getItem('platformReports') || '[]');
        existingReports.push(reportData);
        localStorage.setItem('platformReports', JSON.stringify(existingReports));
      }

      // Call success callback regardless of API success/failure
      if (onReportSubmit) {
        onReportSubmit(reportData);
      }

      // Reset form and close modal
      setReportType('');
      setDescription('');
      setPriority('medium');
      onHide();

    } catch (error) {
      console.error('Failed to submit report:', error);
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReportType('');
    setDescription('');
    setPriority('medium');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Report {reportedEntity?.type}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="mb-3">
            <h6>Reporting: {reportedEntity?.name}</h6>
            <p className="text-muted">
              {reportedEntity?.type === 'restaurant' 
                ? 'You are reporting a restaurant'
                : 'You are reporting a welfare organization'
              }
            </p>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Report Type *</Form.Label>
            <Form.Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">Select report type</option>
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="user_behavior">Poor Behavior/Service</option>
              <option value="no_show">No Show for Pickup</option>
              <option value="food_quality">Food Quality Issues</option>
              <option value="communication">Communication Problems</option>
              <option value="spam">Spam/Fake Posts</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority Level</Form.Label>
            <Form.Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about the issue you're reporting..."
              required
            />
            <Form.Text className="text-muted">
              Minimum 20 characters. Be specific about what happened.
            </Form.Text>
          </Form.Group>

          <Alert variant="info" className="mb-0">
            <small>
              <strong>Note:</strong> All reports are reviewed by administrators. 
              False reports may result in account suspension.
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            type="submit" 
            disabled={loading || !reportType || description.length < 20}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportModal;