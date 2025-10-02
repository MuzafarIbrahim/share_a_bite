import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🍽️',
      title: 'Reduce Food Waste',
      description: 'Transform surplus food into hope. Every meal saved is a step towards a sustainable future and a world without hunger.'
    },
    {
      icon: '🤝',
      title: 'Connect Communities',
      description: 'Bridge the gap between abundance and need. Connect restaurants with welfare organizations to create lasting impact.'
    },
    {
      icon: '❤️',
      title: 'Feed the Hungry',
      description: 'Turn compassion into action. Help provide nutritious meals to families and individuals who need them most.'
    },
    {
      icon: '🌍',
      title: 'Environmental Impact',
      description: 'Be part of the solution. Reduce methane emissions from food waste while creating positive social change.'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Meals Saved', color: 'success' },
    { number: '500+', label: 'Restaurants', color: 'primary' },
    { number: '200+', label: 'Organizations', color: 'info' },
    { number: '50K+', label: 'People Fed', color: 'warning' }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Restaurant Owner',
      quote: 'Share a Bite helped us turn our daily surplus into hope for families. It feels amazing to know our food is making a difference.',
      avatar: '👩‍🍳'
    },
    {
      name: 'David Chen',
      role: 'Food Bank Director',
      quote: 'This platform revolutionized how we access fresh food. We can now provide better nutrition to more families in our community.',
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'Community Volunteer',
      quote: 'Witnessing the joy on faces when we deliver these meals... that\'s the real magic of Share a Bite. Pure human connection.',
      avatar: '👩‍🦰'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Restaurants Post',
      description: 'Restaurants upload details of surplus food with pickup times',
      icon: '📝'
    },
    {
      step: '2',
      title: 'Organizations Claim',
      description: 'Welfare organizations browse and claim food donations',
      icon: '🔍'
    },
    {
      step: '3',
      title: 'Lives Change',
      description: 'Food reaches those in need, creating smiles and full bellies',
      icon: '✨'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4">
                  Share a Bite,<br />
                  <span className="text-warning">Share Hope</span>
                </h1>
                <p className="lead mb-4 fs-5">
                  Every day, millions go hungry while tons of food go to waste. 
                  Join our mission to bridge this gap and create a world where 
                  every meal matters and every person counts.
                </p>
                <div className="hero-stats mb-4">
                  <Row className="text-center">
                    <Col xs={6} md={3}>
                      <h3 className="text-warning">1M+</h3>
                      <small>Meals Rescued</small>
                    </Col>
                    <Col xs={6} md={3}>
                      <h3 className="text-warning">500+</h3>
                      <small>Partners</small>
                    </Col>
                    <Col xs={6} md={3}>
                      <h3 className="text-warning">50K+</h3>
                      <small>Lives Touched</small>
                    </Col>
                    <Col xs={6} md={3}>
                      <h3 className="text-warning">24/7</h3>
                      <small>Impact</small>
                    </Col>
                  </Row>
                </div>
                {!user ? (
                  <div className="hero-buttons">
                    <LinkContainer to="/register">
                      <Button size="lg" variant="warning" className="me-3 px-4 py-3">
                        Start Making Impact
                      </Button>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Button size="lg" variant="outline-light" className="px-4 py-3">
                        Sign In
                      </Button>
                    </LinkContainer>
                  </div>
                ) : (
                  <LinkContainer to="/dashboard">
                    <Button size="lg" variant="warning" className="px-4 py-3">
                      Go to Dashboard
                    </Button>
                  </LinkContainer>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image" style={{ fontSize: '15rem' }}>
                🍽️
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-dark mb-3">How We Create Impact</h2>
              <p className="lead text-muted">
                Together, we're building a movement that transforms waste into hope
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm hover-lift" style={{ transition: 'transform 0.3s ease' }}>
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon mb-3" style={{ fontSize: '3rem' }}>
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-dark mb-3">Simple Steps, Powerful Impact</h2>
              <p className="lead text-muted">
                Making a difference has never been easier
              </p>
            </Col>
          </Row>
          <Row className="align-items-center">
            {howItWorks.map((step, index) => (
              <Col md={4} key={index} className="text-center mb-4">
                <div className="step-container position-relative">
                  <div 
                    className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                  >
                    {step.step}
                  </div>
                  <div className="step-icon mb-3" style={{ fontSize: '4rem' }}>
                    {step.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                  {index < howItWorks.length - 1 && (
                    <div className="d-none d-md-block position-absolute top-50 end-0 translate-middle-y" style={{ right: '-50px' }}>
                      <span style={{ fontSize: '2rem', color: '#dee2e6' }}>→</span>
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col className="mb-4">
              <h2 className="display-5 fw-bold mb-3">Our Impact in Numbers</h2>
              <p className="lead">Every number represents lives touched and hope restored</p>
            </Col>
          </Row>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col md={3} key={index} className="mb-4">
                <div className="stat-item">
                  <h2 className="display-4 fw-bold text-warning mb-2">{stat.number}</h2>
                  <p className="h5 mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-dark mb-3">Stories of Hope</h2>
              <p className="lead text-muted">
                Real people, real impact, real change
              </p>
            </Col>
          </Row>
          <Row>
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="text-center mb-3">
                      <div style={{ fontSize: '3rem' }}>{testimonial.avatar}</div>
                      <h5 className="fw-bold mt-2">{testimonial.name}</h5>
                      <Badge bg="primary" className="mb-3">{testimonial.role}</Badge>
                    </div>
                    <blockquote className="blockquote text-center">
                      <p className="mb-0 fst-italic">"{testimonial.quote}"</p>
                    </blockquote>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 bg-gradient-to-r" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-4 fw-bold mb-4">Ready to Make a Difference?</h2>
              <p className="lead mb-5">
                Join thousands of restaurants and organizations already creating positive impact. 
                Together, we can end hunger and reduce waste, one meal at a time.
              </p>
              {!user ? (
                <div>
                  <LinkContainer to="/register">
                    <Button size="lg" variant="warning" className="me-3 px-5 py-3">
                      Join the Movement
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Button size="lg" variant="outline-light" className="px-5 py-3">
                      Sign In
                    </Button>
                  </LinkContainer>
                </div>
              ) : (
                <LinkContainer to="/dashboard">
                  <Button size="lg" variant="warning" className="px-5 py-3">
                    Continue Your Impact
                  </Button>
                </LinkContainer>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h5 className="mb-2">Share a Bite</h5>
              <p className="mb-0 text-muted">Connecting hearts, sharing hope, ending hunger.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-0 text-muted">
                &copy; 2024 Share a Bite. Made with ❤️ for humanity.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-10px) !important;
        }
        
        .bg-gradient-to-r {
          position: relative;
          overflow: hidden;
        }
        
        .bg-gradient-to-r::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><polygon points="0,0 1000,0 1000,60 0,100"/></svg>');
          pointer-events: none;
        }
        
        .step-container {
          position: relative;
        }
        
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5rem !important;
          }
          
          .hero-image {
            font-size: 8rem !important;
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;