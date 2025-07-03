import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import DoctorDashboard from '../components/Dashboard/DoctorDashboard';
import PatientDashboard from '../components/Dashboard/PatientDashboard';
import ProtectedRoute from '../components/Shared/ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';
import ActivityLog from '../components/ActivityLog';
import UserManagement from '../pages/UserManagement';

const DashboardRedirect = () => {
  const { user, loading } = useContext(AuthContext) || {};
  console.log('DashboardRedirect:', user);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
  if (user.role === 'staff') return <Navigate to="/staff" replace />;
  if (user.role === 'user') return <Navigate to="/patient" replace />; // or change to /user-dashboard if you want
  return <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/dashboard" element={<DashboardRedirect />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute roles={['admin']} />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user-management" element={<UserManagement />} />
    </Route>
    <Route element={<ProtectedRoute roles={['doctor']} />}>
      <Route path="/doctor" element={<DoctorDashboard />} />
    </Route>
    <Route element={<ProtectedRoute roles={['user']} />}>
      <Route path="/patient" element={<PatientDashboard />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route element={<ProtectedRoute roles={['admin', 'staff']} />}>
      <Route path="/activity-log" element={<ActivityLog />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;