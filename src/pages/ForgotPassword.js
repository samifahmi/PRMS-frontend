import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import logo from '../assets/photo_2024-07-19_11-40-39.jpg';
import heroImg from '../assets/full-equiped-medical-cabinet.jpg';
import './AuthForm.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const { forgotPassword, loading, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const res = await forgotPassword(email);
      if (res.status === 'success') {
        setSuccess('Check your email for password reset instructions.');
      }
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="auth-bg auth-bg-img" style={{ backgroundImage: `url(${heroImg})` }}>
      <header className="main-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={logo} alt="Logo" className="header-logo-img" />
            <span className="header-title">Dr. Seid Nur</span>
          </div>
        </div>
      </header>
      <div className="auth-flex-wrapper">
        <div className="auth-card">
          <div className="auth-icon">🔑</div>
          <h2 className="auth-title">Forgot Password</h2>
          <div className="auth-subtext">Enter your email to reset your password</div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
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
            />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="auth-switch">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
      <footer className="main-footer">
        <div className="footer-content">
          <span className="footer-title">Dr. Seid Nur</span>
          <span className="footer-copy">&copy; 2024 Dr. Seid Nur Dental Practice. All rights reserved. | Creating beautiful smiles with exceptional care.</span>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword; 