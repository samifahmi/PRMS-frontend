import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import logo from '../assets/photo_2024-07-19_11-40-39.jpg';
import heroImg from '../assets/full-equiped-medical-cabinet.jpg';
import './AuthForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, loading, error, getUserRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };
  const validatePassword = (value) => value.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    }
    if (!valid) return;
    try {
      await login(email, password);
      // Redirect based on role
      const role = getUserRole();
      if (role === 'admin') navigate('/admin');
      else if (role === 'doctor') navigate('/doctor');
      else if (role === 'staff') navigate('/staff');
      else navigate('/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="auth-bg auth-bg-img" style={{ backgroundImage: `url(${heroImg})` }}>
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={logo} alt="Logo" className="header-logo-img" />
            <span className="header-title">Dr. Seid Nur</span>
          </div>
          <nav>
            <Link to="/login"><Button variant="secondary" style={{ minWidth: 70 }}>Login</Button></Link>
          </nav>
        </div>
      </header>
      <div className="auth-flex-wrapper">
        <div className="auth-card">
          <div className="auth-icon">👤</div>
          <h2 className="auth-title">Welcome Back</h2>
          <div className="auth-subtext">Sign in to access your account</div>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
              autoFocus
              aria-describedby={emailError ? 'email-error' : undefined}
            />
            {emailError && <div className="error" id="email-error" aria-live="assertive">{emailError}</div>}
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your password"
              aria-describedby={passwordError ? 'password-error' : undefined}
            />
            {passwordError && <div className="error" id="password-error" aria-live="assertive">{passwordError}</div>}
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading || !!emailError || !!passwordError}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
          <div className="auth-help">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <span className="footer-title">Dr. Seid Nur</span>
          <span className="footer-copy">&copy; 2024 Dr. Seid Nur Dental Practice. All rights reserved. | Creating beautiful smiles with exceptional care.</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;