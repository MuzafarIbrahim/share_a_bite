import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { foodService } from '../services/foodService';
import { useAuth } from '../context/AuthContext';
import ReportModal from '../components/ReportModal';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportSuccess, setReportSuccess] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await foodService.getUserFoodPosts();
      setPosts(response.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load your posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'claimed': return 'warning';
      case 'expired': return 'danger';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    
    if (post?.status === 'claimed') {
      setError('Cannot delete a post that has been claimed. Once claimed, the food should be picked up.');
      return;
    }
    
    if (post?.status === 'completed') {
      setError('Cannot delete a completed post.');
      return;
    }

    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      setError('');
      setShowDeleteModal(false);
      
      await foodService.deleteFoodPost(postToDelete.id);
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      
      setSuccessMessage('Post deleted successfully!');
      setShowSuccessModal(true);
      
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setPostToDelete(null);
      
      if (error.response?.status === 403) {
        setError('You can only delete your own posts.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.error || 'Cannot delete this post. It may have been claimed by someone.');
      } else if (error.response?.status === 404) {
        setError('Post not found. It may have already been deleted.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorMessage = error.response?.data?.error || 'Failed to delete post. Please try again.';
        setError(errorMessage);
      }
    }
  };

  const handleMarkCompleted = async (postId) => {
    try {
      setError('');
      await foodService.updateFoodPostStatus(postId, 'completed');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, status: 'completed' } : post
      ));
      
      setSuccessMessage('Post marked as completed!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating post status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update post status. Please try again.';
      setError(errorMessage);
    }
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const handleReportOrganization = (claimant) => {
    setReportTarget({
      type: 'welfare_organization',
      name: claimant.name,
      id: claimant.id
    });
    setShowReportModal(true);
  };

  const handleReportSubmit = (reportData) => {
    setReportSuccess(`Report submitted against ${reportTarget.name}. Reference: ${Date.now()}`);
    setTimeout(() => setReportSuccess(''), 5000);
    setReportTarget(null);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your posts...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>My Posts</h1>
              <p className="lead">Manage your food sharing posts</p>
            </div>
            <LinkContainer to="/create-post">
              <Button variant="primary">Create New Post</Button>
            </LinkContainer>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {reportSuccess && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" dismissible onClose={() => setReportSuccess('')}>
              {reportSuccess}
            </Alert>
          </Col>
        </Row>
      )}
      
      {posts.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h5>No Posts Yet</h5>
                <p>You haven't created any food posts yet. Create your first post to start sharing!</p>
                <LinkContainer to="/create-post">
                  <Button variant="primary">Create Your First Post</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Your Food Posts ({posts.length})</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleRefresh}
                  >
                    Refresh
                  </Button>
                </div>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Pickup Time</th>
                      <th>Posted Date</th>
                      <th>Status</th>
                      <th>Claimed By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id}>
                        <td>
                          <strong>{post.title}</strong>
                        </td>
                        <td>
                          <span title={post.description}>
                            {post.description?.length > 50 
                              ? `${post.description.substring(0, 50)}...` 
                              : post.description
                            }
                          </span>
                        </td>
                        <td>{post.quantity}</td>
                        <td>{post.pickup_time || 'Not specified'}</td>
                        <td>{formatDate(post.created_at)}</td>
                        <td>
                          <Badge bg={getStatusVariant(post.status)}>
                            {post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          {post.claimant ? (
                            <div>
                              <small className="text-muted">
                                {post.claimant.name}
                              </small>
                            </div>
                          ) : (
                            <Badge bg="secondary">No claims</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {post.status === 'claimed' && (
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleMarkCompleted(post.id)}
                                title="Mark as completed when food is picked up"
                              >
                                Mark Complete
                              </Button>
                            )}
                            {post.status === 'available' && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                title="Delete this post"
                              >
                                Delete
                              </Button>
                            )}
                            {post.claimant && (
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleReportOrganization(post.claimant)}
                              >
                                Report Organization
                              </Button>
                            )}
                          </div>
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{fontSize: '3rem'}}></i>
            </div>
            <h5>Are you sure you want to delete this post?</h5>
            {postToDelete && (
              <p className="text-muted mb-3">
                "{postToDelete.title}" - This action cannot be undone.
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Post
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
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

export default MyPosts;