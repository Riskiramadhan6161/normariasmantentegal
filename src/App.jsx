import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './App.css';

import HomePage       from './pages/HomePage';
import LoginPage      from './pages/LoginPage';
import AdminLayout    from './pages/AdminLayout';
import DashboardPage  from './pages/admin/DashboardPage';
import ServicesPage   from './pages/admin/ServicesPage';
import OrdersPage     from './pages/admin/OrdersPage';
import ClassesAdminPage from './pages/admin/ClassesAdminPage';
import SettingsPage   from './pages/admin/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Admin Auth */}
          <Route path="/admin"       element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Protected */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="services"  element={<ServicesPage />} />
            <Route path="classes"   element={<ClassesAdminPage />} />
            <Route path="orders"    element={<OrdersPage />} />
            <Route path="settings"  element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
