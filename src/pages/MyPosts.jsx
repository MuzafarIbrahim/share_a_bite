import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { foodService } from '../services/foodService';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's food posts from API
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
    
    // Check if post can be deleted before making API call
    if (post?.status === 'claimed') {
      setError('Cannot delete a post that has been claimed. Once claimed, the food should be picked up.');
      return;
    }
    
    if (post?.status === 'completed') {
      setError('Cannot delete a completed post.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        setError(''); // Clear any previous errors
        await foodService.deleteFoodPost(postId);
        setPosts(posts.filter(post => post.id !== postId));
        // Show success message briefly
        alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        
        // More specific error messages based on response
        if (error.response?.status === 403) {
          setError('You can only delete your own posts.');
        } else if (error.response?.status === 400) {
          setError(error.response?.data?.error || 'Cannot delete this post. It may have been claimed by someone.');
        } else if (error.response?.status === 404) {
          setError('Post not found. It may have already been deleted.');
        } else if (error.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          const errorMessage = error.response?.data?.error || 'Failed to delete post. Please try again.';
          setError(errorMessage);
        }
      }
    }
  };

  const handleMarkCompleted = async (postId) => {
    try {
      setError(''); // Clear any previous errors
      await foodService.updateFoodPostStatus(postId, 'completed');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, status: 'completed' } : post
      ));
      alert('Post marked as completed!');
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
    </Container>
  );
};

export default MyPosts;