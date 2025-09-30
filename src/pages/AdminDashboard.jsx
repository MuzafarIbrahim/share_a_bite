import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Nav, Tab, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [pendingOrganizations, setPendingOrganizations] = useState([]);
  const [verifiedOrganizations, setVerifiedOrganizations] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedOrgDetails, setSelectedOrgDetails] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      setLoading(true);
      
      const pendingResponse = await api.get('/admin/pending-organizations');
      const pending = pendingResponse.data;
      
      const verifiedResponse = await api.get('/admin/verified-organizations');
      const verified = verifiedResponse.data;

      const currentStats = {
        totalOrganizations: pending.length + verified.length,
        pendingVerifications: pending.length,
        activeDonations: verified.filter(org => org.organizationType === 'restaurant').length * 2,
        completedDonations: verified.length * 5,
        reportedIssues: 3,
        restaurants: [...pending, ...verified].filter(org => org.organizationType === 'restaurant').length,
        welfareOrgs: [...pending, ...verified].filter(org => org.organizationType === 'welfare_organization').length
      };

      setStats(currentStats);
      setPendingOrganizations(pending);
      setVerifiedOrganizations(verified);
      
    } catch (error) {
      console.error('Failed to load organization data:', error);
      setAlert({ type: 'danger', message: 'Failed to load organization data' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (orgId, action, notes = '') => {
    try {
      setLoading(true);
      
      await api.post(`/admin/verify-organization/${orgId}`, {
        action: action,
        notes: notes
      });
      
      await loadOrganizationData();
      
      setAlert({ 
        type: 'success', 
        message: `Organization ${action} successfully!` 
      });
      
      setShowVerificationModal(false);
      setSelectedOrg(null);
      setVerificationNotes('');
      
    } catch (error) {
      console.error('Verification action failed:', error);
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.error || 'Action failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAction = async (orgId, action, reason = '') => {
    try {
      setLoading(true);
      
      await api.post(`/admin/suspend-organization/${orgId}`, {
        action: action,
        reason: reason
      });
      
      await loadOrganizationData();
      
      setAlert({ 
        type: 'success', 
        message: `Organization ${action}ed successfully!` 
      });
      
      setShowSuspendModal(false);
      setSelectedOrg(null);
      setSuspendReason('');
      
    } catch (error) {
      console.error('Suspend action failed:', error);
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.error || 'Action failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationDetails = async (orgId) => {
    try {
      const response = await api.get(`/admin/organization-details/${orgId}`);
      setSelectedOrgDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch organization details:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch organization details' });
    }
  };

  const openVerificationModal = (org) => {
    setSelectedOrg(org);
    setShowVerificationModal(true);
  };

  const openDetailsModal = async (org) => {
    setSelectedOrg(org);
    setSelectedOrgDetails(null);
    setShowDetailsModal(true);
    await fetchOrganizationDetails(org.id);
  };

  const openSuspendModal = (org) => {
    setSelectedOrg(org);
    setShowSuspendModal(true);
  };

  if (user?.role !== 'admin') {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h3>Access Denied</h3>
                <p>You don't have permission to access this page.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Admin Dashboard</h1>
          <p className="lead">Manage organizations and platform operations</p>
        </Col>
      </Row>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="pending">
              Pending Verifications 
              <Badge bg="warning" className="ms-2">{pendingOrganizations.length}</Badge>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="verified">Verified Organizations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reports">Reports</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <Row className="mb-5">
              <Col md={3} className="mb-3">
                <Card className="text-center">
                  <Card.Body>
                    <h3 className="text-primary">{stats.totalOrganizations}</h3>
                    <p className="mb-0">Total Organizations</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center">
                  <Card.Body>
                    <h3 className="text-warning">{stats.pendingVerifications}</h3>
                    <p className="mb-0">Pending Verifications</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center">
                  <Card.Body>
                    <h3 className="text-success">{stats.restaurants}</h3>
                    <p className="mb-0">Restaurants</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center">
                  <Card.Body>
                    <h3 className="text-info">{stats.welfareOrgs}</h3>
                    <p className="mb-0">Welfare Organizations</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Activity</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>• 3 new organizations registered today</p>
                    <p>• 15 food donations posted this week</p>
                    <p>• 8 successful food transfers completed</p>
                    <p>• 2 organizations verified today</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Button variant="primary" className="me-2 mb-2" onClick={() => setActiveTab('pending')}>
                      Review Pending ({pendingOrganizations.length})
                    </Button>
                    <Button variant="outline-secondary" className="me-2 mb-2">
                      Export Reports
                    </Button>
                    <Button variant="outline-info" className="mb-2">
                      Platform Settings
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="pending">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Organizations Pending Verification</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Organization Name</th>
                      <th>Type</th>
                      <th>Registration No.</th>
                      <th>Contact Person</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrganizations.map(org => (
                      <tr key={org.id}>
                        <td>
                          <strong>{org.name}</strong>
                          <br />
                          <small className="text-muted">{org.email}</small>
                        </td>
                        <td>
                          <Badge bg={org.organizationType === 'restaurant' ? 'primary' : 'success'}>
                            {org.organizationType === 'restaurant' ? 'Restaurant' : 'Welfare Org'}
                          </Badge>
                        </td>
                        <td>{org.registrationNumber}</td>
                        <td>
                          {org.contactPerson}
                          <br />
                          <small className="text-muted">{org.phoneNumber}</small>
                        </td>
                        <td>{org.submittedDate}</td>
                        <td>
                          <Badge bg={
                            org.status === 'pending' ? 'warning' : 
                            org.status === 'under_review' ? 'info' : 'secondary'
                          }>
                            {org.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openVerificationModal(org)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {pendingOrganizations.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No organizations pending verification</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="verified">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Verified Organizations</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Organization Name</th>
                      <th>Type</th>
                      <th>Registration No.</th>
                      <th>Verified Date</th>
                      <th>Status</th>
                      <th>Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedOrganizations.map(org => (
                      <tr key={org.id}>
                        <td>
                          <strong>{org.name}</strong>
                          <br />
                          <small className="text-muted">{org.email}</small>
                        </td>
                        <td>
                          <Badge bg={org.organizationType === 'restaurant' ? 'primary' : 'success'}>
                            {org.organizationType === 'restaurant' ? 'Restaurant' : 'Welfare Org'}
                          </Badge>
                        </td>
                        <td>{org.registrationNumber}</td>
                        <td>{org.verifiedDate}</td>
                        <td>
                          <Badge bg={org.suspended ? 'danger' : 'success'}>
                            {org.suspended ? 'Suspended' : 'Active'}
                          </Badge>
                        </td>
                        <td>
                          {org.organizationType === 'restaurant' 
                            ? `${org.activeDonations || 0} active donations`
                            : `${org.totalClaims || 0} total claims`
                          }
                        </td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openDetailsModal(org)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant={org.suspended ? "outline-success" : "outline-warning"} 
                            size="sm"
                            onClick={() => openSuspendModal(org)}
                          >
                            {org.suspended ? 'Unsuspend' : 'Suspend'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="reports">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Reports</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Reported By</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id}>
                        <td>{report.type.replace('_', ' ')}</td>
                        <td>{report.reportedBy}</td>
                        <td>
                          <Badge bg={report.status === 'pending' ? 'warning' : 'success'}>
                            {report.status}
                          </Badge>
                        </td>
                        <td>{report.date}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            Review
                          </Button>
                          {report.status === 'pending' && (
                            <Button variant="outline-success" size="sm">
                              Resolve
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Organization Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrg && (
            <>
              <Row>
                <Col md={6}>
                  <h6>Organization Details</h6>
                  <p><strong>Name:</strong> {selectedOrg.name}</p>
                  <p><strong>Type:</strong> {selectedOrg.type === 'restaurant' ? 'Restaurant' : 'Welfare Organization'}</p>
                  <p><strong>Registration No:</strong> {selectedOrg.registrationNumber}</p>
                  <p><strong>Contact Person:</strong> {selectedOrg.contactPerson}</p>
                  <p><strong>Phone:</strong> {selectedOrg.phoneNumber}</p>
                  <p><strong>Email:</strong> {selectedOrg.email}</p>
                  <p><strong>Address:</strong> {selectedOrg.address}</p>
                </Col>
                <Col md={6}>
                  <h6>Submitted Documents</h6>
                  {selectedOrg.documents && selectedOrg.documents.map((doc, index) => (
                    <div key={index} className="mb-2">
                      <Button variant="outline-primary" size="sm" className="me-2">
                        View {doc}
                      </Button>
                    </div>
                  ))}
                </Col>
              </Row>
              
              <Form.Group className="mt-3">
                <Form.Label>Verification Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add notes about the verification process..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerificationModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleVerificationAction(selectedOrg?.id, 'rejected', verificationNotes)}
          >
            Reject
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleVerificationAction(selectedOrg?.id, 'verified', verificationNotes)}
          >
            Approve
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Organization Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrg && (
            <>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Basic Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Name:</strong> {selectedOrgDetails?.name || selectedOrg.name}</p>
                      <p><strong>Type:</strong> 
                        <Badge className="ms-2" bg={selectedOrg.organizationType === 'restaurant' ? 'primary' : 'success'}>
                          {selectedOrg.organizationType === 'restaurant' ? 'Restaurant' : 'Welfare Organization'}
                        </Badge>
                      </p>
                      <p><strong>Registration No:</strong> {selectedOrgDetails?.registrationNumber || selectedOrg.registrationNumber}</p>
                      <p><strong>Contact Person:</strong> {selectedOrgDetails?.contactPerson || selectedOrg.contactPerson}</p>
                      <p><strong>Phone:</strong> {selectedOrgDetails?.phoneNumber || selectedOrg.phoneNumber}</p>
                      <p><strong>Email:</strong> {selectedOrgDetails?.email || selectedOrg.email}</p>
                      <p><strong>Address:</strong> {selectedOrgDetails?.address || selectedOrg.address}</p>
                      <p><strong>Status:</strong> 
                        <Badge className="ms-2" bg={selectedOrgDetails?.suspended ? 'danger' : 'success'}>
                          {selectedOrgDetails?.suspended ? 'Suspended' : 'Active'}
                        </Badge>
                      </p>
                      <p><strong>Verified Date:</strong> {selectedOrgDetails?.verifiedDate || selectedOrg.verifiedDate}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Activity Statistics</h6>
                    </Card.Header>
                    <Card.Body>
                      {selectedOrgDetails ? (
                        selectedOrg.organizationType === 'restaurant' ? (
                          <>
                            <p><strong>Total Food Posts:</strong> {selectedOrgDetails.totalPosts}</p>
                            <p><strong>Active Donations:</strong> {selectedOrgDetails.activeDonations}</p>
                            <p><strong>Completed Donations:</strong> {selectedOrgDetails.completedDonations}</p>
                            <p><strong>Food Saved (kg):</strong> {selectedOrgDetails.foodSaved}</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Total Claims:</strong> {selectedOrgDetails.totalClaims}</p>
                            <p><strong>Active Claims:</strong> {selectedOrgDetails.activeClaims}</p>
                            <p><strong>Completed Claims:</strong> {selectedOrgDetails.completedClaims}</p>
                            <p><strong>Food Received (kg):</strong> {selectedOrgDetails.foodReceived}</p>
                          </>
                        )
                      ) : (
                        <p className="text-muted">Loading statistics...</p>
                      )}
                      <p><strong>Join Date:</strong> {selectedOrgDetails?.joinDate || 'N/A'}</p>
                      <p><strong>Last Activity:</strong> {selectedOrgDetails?.lastActivity || 'N/A'}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Recent Activity Log</h6>
                </Card.Header>
                <Card.Body>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedOrgDetails?.activityLog ? (
                      selectedOrgDetails.activityLog.map((activity, index) => (
                        <p key={index} className="text-muted mb-2">• {activity}</p>
                      ))
                    ) : (
                      <p className="text-muted">Loading activity log...</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button 
            variant="outline-primary"
            onClick={() => {
              setShowDetailsModal(false);
              openSuspendModal(selectedOrg);
            }}
          >
            {selectedOrg?.suspended ? 'Unsuspend Organization' : 'Suspend Organization'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuspendModal} onHide={() => setShowSuspendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedOrg?.suspended ? 'Unsuspend' : 'Suspend'} Organization
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrg && (
            <>
              <Alert variant={selectedOrg.suspended ? "info" : "warning"}>
                {selectedOrg.suspended 
                  ? `Are you sure you want to unsuspend "${selectedOrg.name}"? This will restore their access to the platform.`
                  : `Are you sure you want to suspend "${selectedOrg.name}"? This will prevent them from accessing the platform.`
                }
              </Alert>
              
              <Form.Group>
                <Form.Label>
                  {selectedOrg.suspended ? 'Reason for Unsuspension' : 'Reason for Suspension'} *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder={selectedOrg.suspended 
                    ? "Explain why you're unsuspending this organization..."
                    : "Explain why you're suspending this organization..."
                  }
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuspendModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedOrg?.suspended ? "success" : "danger"}
            onClick={() => handleSuspendAction(
              selectedOrg?.id, 
              selectedOrg?.suspended ? 'unsuspend' : 'suspend', 
              suspendReason
            )}
            disabled={!suspendReason.trim()}
          >
            {selectedOrg?.suspended ? 'Unsuspend' : 'Suspend'} Organization
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;