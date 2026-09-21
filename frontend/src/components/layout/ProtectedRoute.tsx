import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { UserRole } from '../../types/workOrder';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const ProtectedRoute: React.FC<{ allowedRoles?: UserRole[] }> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  const isLight = theme === 'zidio-light';

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <p style={{ color: '#6C5CE7', fontWeight: 600 }}>Loading Keystone Platform...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'MANAGER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'DISPATCHER') return <Navigate to="/board" replace />;
    if (user.role === 'TECHNICIAN') return <Navigate to="/my-jobs" replace />;
    if (user.role === 'CUSTOMER') return <Navigate to="/portal" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isLight ? '#F8FAFC' : '#0B0F19' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
