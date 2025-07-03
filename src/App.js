import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import NotificationCard from './components/NotificationCard';
import AdminSidebar from './components/AdminSidebar';
import './styles/main.css';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [rateLimitMsg, setRateLimitMsg] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setRateLimitMsg(e.detail);
      setTimeout(() => setRateLimitMsg(''), 6000);
    };
    window.addEventListener('rateLimit', handler);
    return () => window.removeEventListener('rateLimit', handler);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        {rateLimitMsg && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 2000, display: 'flex', justifyContent: 'center' }} aria-live="assertive">
            <NotificationCard
              icon="🚦"
              title="Rate Limit Exceeded"
              message={rateLimitMsg}
              type="error"
            />
          </div>
        )}
        <AuthProvider>
          <AdminSidebar />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;