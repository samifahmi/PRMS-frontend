import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import logo from '../assets/photo_2024-07-19_11-40-39.jpg';
import heroImg from '../assets/full-equiped-medical-cabinet.jpg';
import './AuthForm.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword, loading, error } = useContext(AuthContext);

  // Password requirement checks
  const passwordChecks = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
    { label: 'One number', test: (v) => /\d/.test(v) },
    { label: 'One special character', test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
  ];
  const fulfilledCount = passwordChecks.filter(c => c.test(password)).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const res = await resetPassword(token, password);
      if (res.status === 'success') {
        setSuccess('Password reset successful! You can now log in.');
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
          <div className="auth-icon">🔒</div>
          <h2 className="auth-title">Reset Password</h2>
          <div className="auth-subtext">Enter your new password</div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter new password"
              autoFocus
            />
            <div style={{ margin: '0.5rem 0 1rem 0' }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>Password requirements:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {passwordChecks.map((c, i) => (
                  <li key={i} style={{ color: c.test(password) ? 'green' : '#d32f2f', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {c.test(password) ? '✔️' : '❌'} {c.label}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 12, color: fulfilledCount === passwordChecks.length ? 'green' : '#d32f2f', marginTop: 4 }}>
                {fulfilledCount} of {passwordChecks.length} requirements fulfilled
              </div>
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword; 