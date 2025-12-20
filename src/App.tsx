// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Homepage from './pages/Homepage';
import ClubRequests from './pages/ClubRequests';
import Dashboard from './pages/ClubDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminViewRequests from './pages/AdminViewRequests';
import StudentLifeAdminDashboard from './pages/StudentLifeAdminDashboard';
import StudentLifeViewRequests from './pages/StudentLifeViewRequests';
import ViewRequests from './pages/ViewRequests';
import './App.css';

// Dashboard Router Component - routes to appropriate dashboard based on role
const DashboardRouter: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role === 'SU_ADMIN') {
        return <AdminDashboard onLogout={onLogout} />;
      }
      if (userData.role === 'STUDENT_LIFE_ADMIN') {
        return <StudentLifeAdminDashboard onLogout={onLogout} />;
      }
    } catch (e) {
      // If parsing fails, default to ClubDashboard
    }
  }
  return <Dashboard onLogout={onLogout} />;
};

// Admin Dashboard Guard - only allows SU_ADMIN
const AdminDashboardGuard: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role === 'SU_ADMIN') {
        return <AdminDashboard onLogout={onLogout} />;
      }
    } catch (e) {
      // If parsing fails, redirect to dashboard
    }
  }
  return <Navigate to="/dashboard" replace />;
};

// Admin View Requests Guard - only allows SU_ADMIN
const AdminViewRequestsGuard: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role === 'SU_ADMIN') {
        return <AdminViewRequests onLogout={onLogout} />;
      }
    } catch (e) {
      // If parsing fails, redirect to dashboard
    }
  }
  return <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        JSON.parse(userData);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleLogin = async (identifier: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(data));
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error. Please make sure the Flask server is running on http://localhost:5000');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? <Homepage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <DashboardRouter onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn ? <AdminDashboardGuard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/student-life-dashboard"
          element={
            isLoggedIn ? <StudentLifeAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/request"
          element={
            isLoggedIn ? <ClubRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/view-requests"
          element={
            isLoggedIn ? <ViewRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* SU Admin: Editable view */}
        <Route
          path="/admin-requests"
          element={
            isLoggedIn ? <AdminViewRequestsGuard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Student Life Admin: Read-only view — with logout */}
        <Route
          path="/student-life-requests"
          element={
            isLoggedIn ? <StudentLifeViewRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/calendar"
          element={
            isLoggedIn ? <DashboardRouter onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/funding"
          element={
            isLoggedIn ? <DashboardRouter onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? <DashboardRouter onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;