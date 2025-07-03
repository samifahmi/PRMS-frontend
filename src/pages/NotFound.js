import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';
import { AuthContext } from '../contexts/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const { user } = useContext(AuthContext) || {};

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, just redirect to home with search query (could be improved to search site content)
    navigate(`/?q=${encodeURIComponent(search)}`);
  };

  // Determine dashboard link based on user role
  let dashboardLink = null;
  if (user && user.role) {
    if (user.role === 'admin') dashboardLink = { to: '/admin', label: 'Go to Admin Dashboard' };
    else if (user.role === 'doctor') dashboardLink = { to: '/doctor', label: 'Go to Doctor Dashboard' };
    else if (user.role === 'staff') dashboardLink = { to: '/staff', label: 'Go to Staff Dashboard' };
    else if (user.role === 'patient') dashboardLink = { to: '/patient', label: 'Go to Patient Dashboard' };
  }

  return (
    <div className="not-found-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center', maxWidth: 420, background: 'white', padding: '2.5rem 2rem', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <img
          src="https://webartdevelopers.com/blog/wp-content/uploads/2018/10/CodePen-404-Page.gif"
          alt="404 not found animation"
          style={{ width: '100%', maxWidth: 320, margin: '0 auto 1rem auto', borderRadius: 12 }}
        />
        <h1 style={{ fontSize: 36, color: '#234567', marginBottom: 8 }}>404 - Page Not Found</h1>
        <p style={{ color: '#555', marginBottom: 24 }}>
          Oops! The page you are looking for doesn't exist or has been moved.<br />
          Try searching for what you need or go back to your dashboard.
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search for help, features, or pages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #b6d4f7', fontSize: 16 }}
            aria-label="Search site"
          />
          <button type="submit" style={{ background: '#10b3b3', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Search</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dashboardLink ? (
            <Link to={dashboardLink.to} style={{ color: '#10b3b3', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>{dashboardLink.label}</Link>
          ) : (
            <Link to="/" style={{ color: '#10b3b3', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>Go to Home</Link>
          )}
          <button
            onClick={() => navigate(-1)}
            style={{ background: '#eee', color: '#234567', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
          >Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;