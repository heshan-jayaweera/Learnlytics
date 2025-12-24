import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    // Always set role to student for public registration
    registerData.role = 'student';

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-h-[calc(100vh-120px)] pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Card className="w-full max-w-lg bg-white backdrop-blur-xl border-2 border-primary/30 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-[1.02] relative z-10">
        <Card.Body className="p-8">
          <Card.Title className="text-center mb-6">
            <div className="inline-block mb-3 text-5xl animate-bounce">🎉</div>
            <h2 className="text-black font-bold text-4xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Register
            </h2>
            <p className="text-black text-sm mt-3 flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              Create your Learnlytics account
            </p>
          </Card.Title>
          
          {error && (
            <Alert variant="danger" className="bg-red-500/20 border-red-500/50 text-red-200 mb-4">
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-black font-medium">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black font-medium">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black font-medium">Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                placeholder="Enter Student ID"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
              />
              <Form.Text className="text-black text-sm">
                Student ID must be registered by an admin first
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-black font-medium">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-black font-medium">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-primary"
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-secondary-dark hover:to-accent-dark text-white font-bold py-3 border-0 transition-all duration-300 shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105 rounded-lg text-lg relative overflow-hidden group" 
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Registering...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Register
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            </Button>
          </Form>

          <div className="text-center mt-6 pt-6 border-t border-gray-300">
            <Link to="/login" className="text-accent hover:text-accent-light transition-all duration-300 hover:scale-110 inline-flex items-center gap-2 font-medium group">
              <span className="text-black">Already have an account?</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-black">Login →</span>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;

