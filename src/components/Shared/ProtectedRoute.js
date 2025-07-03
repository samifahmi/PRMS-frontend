import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // <-- fix the path

const ProtectedRoute = ({ roles, ...rest }) => {
  const { user, loading } = useContext(AuthContext);
  console.log('DashboardRedirect:', user);
  console.log('ProtectedRoute:', { user, roles });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';

// const ProtectedRoute = ({ roles }) => {
//   const { isAuthenticated, userRole } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.includes(userRole)) {
//     return <Navigate to="/not-found" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;