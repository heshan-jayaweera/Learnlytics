import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'admin' || user.role === 'lecturer') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-h-[calc(100vh-120px)] pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white backdrop-blur-xl border-2 border-primary/30 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-[1.02] relative z-10">
        <Card.Body className="p-8">
          <Card.Title className="text-center mb-6">
            <div className="inline-block mb-3 text-5xl animate-bounce">🎓</div>
            <h2 className="text-black font-bold text-4xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Login
            </h2>
            <p className="text-black text-sm mt-3 flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              Welcome back to Learnlytics
            </p>
          </Card.Title>
          
          {error && (
            <Alert variant="danger" className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/50 text-red-200 mb-5 rounded-lg animate-shake">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-5">
              <Form.Label className="text-black font-semibold mb-2 flex items-center gap-2">
                <span>📧</span> Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-2 border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all duration-300 rounded-lg py-2.5 px-4 hover:border-primary/50"
              />
            </Form.Group>

            <Form.Group className="mb-6">
              <Form.Label className="text-black font-semibold mb-2 flex items-center gap-2">
                <span>🔒</span> Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-2 border-gray-300 text-black placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all duration-300 rounded-lg py-2.5 px-4 hover:border-primary/50"
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
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Login
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            </Button>
          </Form>

          <div className="text-center mt-6 pt-6 border-t border-gray-300">
            <Link to="/register" className="text-accent hover:text-accent-light transition-all duration-300 hover:scale-110 inline-flex items-center gap-2 font-medium group">
              <span className="text-black">Don't have an account?</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-black">Register →</span>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

