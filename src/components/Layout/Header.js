import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import logo from '../../assets/photo_2024-07-19_11-40-39.jpg';
import '../../styles/main.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={logo} alt="Company Logo" style={{ height: '48px', width: '48px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        <h1 style={{ fontSize: '1.5rem', color: '#007bff', margin: 0 }}>Patient Record Management System</h1>
      </div>
      <nav className="navigation">
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <Link to="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </li>
          <li>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <Button variant="secondary">Profile</Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;