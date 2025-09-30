import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isRestaurant = user?.role === 'restaurant';
  const isWelfareOrg = user?.role === 'welfare_organization'; // Fixed: changed from 'welfare_org' to 'welfare_organization'

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Share a Bite</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated && (
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
            )}
            
            {isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                )}
                
                {isRestaurant && (
                  <>
                    <LinkContainer to="/create-post">
                      <Nav.Link>Create Donation</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/my-posts">
                      <Nav.Link>My Donations</Nav.Link>
                    </LinkContainer>
                  </>
                )}
                
                {isWelfareOrg && (
                  <>
                    <LinkContainer to="/browse-food">
                      <Nav.Link>Browse Donations</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/my-claims">
                      <Nav.Link>My Claims</Nav.Link>
                    </LinkContainer>
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <LinkContainer to="/admin">
                    <Nav.Link>Admin</Nav.Link>
                  </LinkContainer>
                )}
              </>
            ) : null}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user?.name || 'Organization'}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;