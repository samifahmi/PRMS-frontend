import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button';
import '../../styles/main.css';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <h2 style={{ color: '#007bff', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2rem' }}>Patient Record Management System</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {user.role === 'admin' && (
          <>
            <li>
              <Link to="/admin">
                <Button variant="primary" style={{ width: '100%' }}>Admin Dashboard</Button>
              </Link>
            </li>
            <li>
              <Link to="/users">
                <Button variant="secondary" style={{ width: '100%' }}>User Management</Button>
              </Link>
            </li>
          </>
        )}
        {user.role === 'doctor' && (
          <>
            <li>
              <Link to="/doctor">
                <Button variant="primary" style={{ width: '100%' }}>Doctor Dashboard</Button>
              </Link>
            </li>
            <li>
              <Link to="/appointments">
                <Button variant="secondary" style={{ width: '100%' }}>Manage Appointments</Button>
              </Link>
            </li>
          </>
        )}
        {user.role === 'patient' && (
          <>
            <li>
              <Link to="/patient">
                <Button variant="primary" style={{ width: '100%' }}>Patient Dashboard</Button>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <Button variant="secondary" style={{ width: '100%' }}>Profile</Button>
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/logout">
            <Button variant="secondary" style={{ width: '100%' }}>Logout</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;