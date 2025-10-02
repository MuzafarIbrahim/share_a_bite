import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const isRestaurant = user?.role === 'restaurant';
  const isWelfareOrg = user?.role === 'welfare_organization';

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  const getUserInitials = () => {
    if (user?.organizationName) {
      return user.organizationName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'restaurant': return '🍽️';
      case 'welfare_organization': return '🤝';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  const getRoleDisplayName = () => {
    switch(user?.role) {
      case 'restaurant': return 'Restaurant Partner';
      case 'welfare_organization': return 'Welfare Organization';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        expanded={expanded}
        onToggle={handleToggle}
        className="shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1020
        }}
      >
        <Container>
          <LinkContainer to="/" onClick={handleClose}>
            <Navbar.Brand 
              className="fw-bold d-flex align-items-center"
              style={{
                color: 'white',
                fontSize: '1.6rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span 
                className="me-2" 
                style={{ 
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              >
                🍽️
              </span>
              Share a Bite
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            className="border-0 shadow-none"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!isAuthenticated && (
                <LinkContainer to="/" onClick={handleClose}>
                  <Nav.Link 
                    className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-home me-2"></i>Home
                  </Nav.Link>
                </LinkContainer>
              )}
              
              {isAuthenticated ? (
                <>
                  {user?.role !== 'admin' && (
                    <LinkContainer to="/dashboard" onClick={handleClose}>
                      <Nav.Link 
                        className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  
                  {isRestaurant && (
                    <>
                      <LinkContainer to="/create-post" onClick={handleClose}>
                        <Nav.Link 
                          className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <i className="fas fa-plus-circle me-2"></i>Create Donation
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/my-posts" onClick={handleClose}>
                        <Nav.Link 
                          className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <i className="fas fa-heart me-2"></i>My Donations
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  
                  {isWelfareOrg && (
                    <>
                      <LinkContainer to="/browse-food" onClick={handleClose}>
                        <Nav.Link 
                          className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <i className="fas fa-search me-2"></i>Browse Donations
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/my-claims" onClick={handleClose}>
                        <Nav.Link 
                          className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <i className="fas fa-hand-holding-heart me-2"></i>My Claims
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <LinkContainer to="/admin" onClick={handleClose}>
                      <Nav.Link 
                        className="fw-semibold px-3 py-2 mx-1 rounded-pill position-relative"
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="fas fa-cog me-2"></i>Admin
                        <Badge 
                          pill 
                          bg="warning" 
                          className="ms-1 position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: '0.6rem' }}
                        >
                          {getRoleIcon()}
                        </Badge>
                      </Nav.Link>
                    </LinkContainer>
                  )}
                </>
              ) : null}
            </Nav>
            
            <Nav className="align-items-center">
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <Dropdown align="end">
                    <Dropdown.Toggle 
                      variant="none"
                      className="border-0 shadow-none d-flex align-items-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '50px',
                        padding: '6px 18px 6px 6px',
                        color: 'white',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div 
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center position-relative"
                        style={{
                          width: '38px',
                          height: '38px',
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {getUserInitials()}
                        <span 
                          className="position-absolute bottom-0 end-0 rounded-circle"
                          style={{
                            width: '14px',
                            height: '14px',
                            background: '#28a745',
                            border: '2px solid white',
                            fontSize: '8px'
                          }}
                        >
                          {getRoleIcon()}
                        </span>
                      </div>
                      <div className="d-none d-md-block text-start">
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                          {user?.organizationName || 'Organization'}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                          {getRoleDisplayName()}
                        </div>
                      </div>
                      <i className="fas fa-chevron-down ms-2" style={{ fontSize: '0.7rem' }}></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu 
                      className="border-0 shadow-lg"
                      style={{
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        minWidth: '280px',
                        padding: '12px',
                        marginTop: '8px'
                      }}
                    >
                      <div className="px-3 py-2 mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {getUserInitials()}
                          </div>
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                              {user?.organizationName || 'Organization'}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                              {user?.email}
                            </div>
                            <Badge 
                              bg={user?.role === 'admin' ? 'warning' : user?.role === 'restaurant' ? 'success' : 'info'}
                              className="mt-1"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {getRoleIcon()} {getRoleDisplayName()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Dropdown.Divider className="my-2" />
                      
                      <Dropdown.Item 
                        onClick={logout}
                        className="text-danger fw-semibold d-flex align-items-center"
                        style={{
                          borderRadius: '12px',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-3"></i>
                        <div>
                          <div>Sign Out</div>
                          <small className="text-muted">Log out of your account</small>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <LinkContainer to="/login" onClick={handleClose}>
                    <Button 
                      variant="outline-light"
                      className="border-0 fw-semibold"
                      style={{
                        borderRadius: '50px',
                        padding: '10px 24px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Sign In
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/register" onClick={handleClose}>
                    <Button 
                      className="border-0 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        borderRadius: '50px',
                        padding: '10px 24px',
                        color: 'white',
                        boxShadow: '0 6px 20px rgba(238, 90, 36, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(238, 90, 36, 0.5)';
                        e.target.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 36, 0.4)';
                        e.target.style.filter = 'brightness(1)';
                      }}
                    >
                      <i className="fas fa-rocket me-2"></i>Join Us
                    </Button>
                  </LinkContainer>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;