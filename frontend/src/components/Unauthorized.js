import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user) {
      if (user.role === 'admin' || user.role === 'lecturer') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-h-[calc(100vh-120px)] pb-8">
      <Alert variant="danger" className="max-w-lg bg-red-50 border-red-500/50 text-black">
        <Alert.Heading className="text-red-600 font-bold">Access Denied</Alert.Heading>
        <p className="text-black">You don't have permission to access this page.</p>
        <hr className="border-red-500/50" />
        <div className="d-flex justify-content-end mt-3">
          <Button 
            variant="outline-danger" 
            onClick={handleGoBack}
            className="border-red-500/50 text-red-600 hover:bg-red-500/20 transition-all duration-200"
          >
            Go Back
          </Button>
        </div>
      </Alert>
    </Container>
  );
};

export default Unauthorized;

