import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { SchedulingPage } from './pages/SchedulingPage';
import { MapViewPage } from './pages/MapViewPage';
import { TechniciansPage } from './pages/TechniciansPage';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DispatchBoardPage } from './pages/DispatchBoardPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CustomersPage } from './pages/CustomersPage';
import { TechnicianViewPage } from './pages/TechnicianViewPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { RegisterPage } from './pages/RegisterPage';
import './styles/designTokens.css';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Operations & Dispatch Portals */}
              <Route element={<ProtectedRoute allowedRoles={['DISPATCHER', 'MANAGER']} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/work-orders" element={<WorkOrdersPage />} />
                <Route path="/scheduling" element={<SchedulingPage />} />
                <Route path="/map" element={<MapViewPage />} />
                <Route path="/technicians" element={<TechniciansPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/board" element={<DispatchBoardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Technician Field View */}
              <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN', 'DISPATCHER', 'MANAGER']} />}>
                <Route path="/my-jobs" element={<TechnicianViewPage />} />
              </Route>

              {/* Customer Self-Service Portal */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'DISPATCHER', 'MANAGER']} />}>
                <Route path="/portal" element={<CustomerPortalPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

