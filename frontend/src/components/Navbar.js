import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar expand="lg" className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <Container>
        <BootstrapNavbar.Brand className="text-black font-bold text-2xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center gap-3">
          <img src="/LEARN.jpg" alt="Learnlytics Logo" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200" />
          Learnlytics
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="border-primary/50 focus:ring-2 focus:ring-primary/50 rounded-lg" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                {user.role === 'admin' || user.role === 'lecturer' ? (
                  <Nav.Link 
                    onClick={() => navigate('/admin/dashboard')}
                    className="text-black hover:text-primary transition-all duration-300 hover:scale-110 hover:font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    
                  </Nav.Link>
                ) : (
                  <Nav.Link 
                    onClick={() => navigate('/student/dashboard')}
                    className="text-black hover:text-primary transition-all duration-300 hover:scale-110 hover:font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    📈 My Dashboard
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user && (
              <>
                <span className="navbar-text me-4 text-black flex items-center">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                  Welcome, <span className="text-accent font-semibold mx-1">{user.name}</span> 
                  <span className="text-secondary font-medium">({user.role})</span>
                </span>
                <Button 
                  variant="outline-primary" 
                  onClick={handleLogout}
                  className="border-2 border-primary/50 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 px-4 py-2 rounded-lg font-semibold"
                >
                  🚪 Logout
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

