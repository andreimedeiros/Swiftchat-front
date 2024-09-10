import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (isAuthenticated && allowedRoles.includes(userType)) {
    return <Outlet />;
  } else {
    return <Navigate to="/home" />;
  }
};

export default PrivateRoute;
