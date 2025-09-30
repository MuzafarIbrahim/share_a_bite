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
        activeDonations: 12,
        completedDonations: 45,
        reportedIssues: 3,
        restaurants: [...pending, ...verified].filter(org => org.organizationType === 'restaurant').length,
        welfareOrgs: [...pending, ...verified].filter(org => org.organizationType === 'welfare_organization').length
      };

      setStats(currentStats);
      setPendingOrganizations(pending.map(org => ({
        ...org,
        submittedDate: org.created_at ? new Date(org.created_at).toLocaleDateString() : 'Unknown'
      })));
      setVerifiedOrganizations(verified.map(org => ({
        ...org,
        verifiedDate: org.verified_at ? new Date(org.verified_at).toLocaleDateString() : 'Unknown'
      })));
      
    } catch (error) {
      console.error('Failed to load organization data:', error);
      setAlert({ type: 'danger', message: 'Failed to load organization data' });
      
      // Set fallback data if API fails
      const mockVerified = [
        {
          id: 1,
          name: 'Green Garden Restaurant',
          email: 'contact@greengardenrestaurant.com',
          organizationType: 'restaurant',
          registrationNumber: 'REST001',
          verifiedDate: 'Sept 1, 2024',
          suspended: false
        },
        {
          id: 2,
          name: 'Hope Foundation',
          email: 'info@hopefoundation.org',
          organizationType: 'welfare_organization',
          registrationNumber: 'WEL001',
          verifiedDate: 'Aug 15, 2024',
          suspended: false
        }
      ];
      
      setVerifiedOrganizations(mockVerified);
      setPendingOrganizations([]);
      setStats({
        totalOrganizations: 2,
        pendingVerifications: 0,
        activeDonations: 12,
        completedDonations: 45,
        reportedIssues: 3,
        restaurants: 1,
        welfareOrgs: 1
      });
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
                    <p>New restaurant "Green Cafe" registered (2 hours ago)</p>
                    <p>Food donation "Fresh Sandwiches" posted (4 hours ago)</p>
                    <p>Organization "Hope Foundation" claimed donation (6 hours ago)</p>
                    <p>New welfare organization "City Food Bank" registered (1 day ago)</p>
                    <p>Food donation "Pasta Meals" completed (1 day ago)</p>
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
            {/* ...existing pending organizations content... */}
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
                            ? '3 active donations'
                            : '8 total claims'
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
            {/* ...existing reports content... */}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* ...existing modals... */}
    </Container>
  );
};

export default AdminDashboard;