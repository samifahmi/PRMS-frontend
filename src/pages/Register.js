import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import logo from '../assets/photo_2024-07-19_11-40-39.jpg';
import heroImg from '../assets/african_american_man_patient_dental_chair_dentist_office_doctor.jpg';
import './AuthForm.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const { register, loading, error, getUserRole } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const validateEmail = (value) => {
    // RFC 5322 Official Standard regex (simplified)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };
  const validatePassword = (value) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return re.test(value);
  };
  const validateName = (value) => value.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setNameError('');
    if (!validateName(name)) {
      setNameError('Name is required.');
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character.');
      valid = false;
    }
    if (!valid) return;
    try {
      if (register) {
        await register({ name, email, password });
        // Redirect based on role
        const userRole = getUserRole();
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'doctor') navigate('/doctor');
        else if (userRole === 'staff') navigate('/staff');
        else navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  // Password requirement checks
  const passwordChecks = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
    { label: 'One number', test: (v) => /\d/.test(v) },
    { label: 'One special character', test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
  ];
  const fulfilledCount = passwordChecks.filter(c => c.test(password)).length;

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
          <div className="auth-icon">📝</div>
          <h2 className="auth-title">Create Account</h2>
          <div className="auth-subtext">Sign up to get started</div>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              autoFocus
              aria-describedby={nameError ? 'name-error' : undefined}
            />
            {nameError && <div className="error" id="name-error" aria-live="assertive">{nameError}</div>}
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
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
            {passwordError && <div className="error" id="password-error" aria-live="assertive">{passwordError}</div>}
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading || !!emailError || !!passwordError || !!nameError}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
          <div className="auth-help">Having trouble? Contact our support team</div>
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

export default Register;
