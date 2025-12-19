// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Homepage from './pages/Homepage';
import ClubRequests from './pages/ClubRequests';
import Dashboard from './pages/ClubDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ViewRequests from './pages/ViewRequests';
import './App.css';

// Dashboard Router Component - routes to AdminDashboard for SU_ADMIN, ClubDashboard for others
const DashboardRouter: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role === 'SU_ADMIN') {
        return <AdminDashboard onLogout={onLogout} />;
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

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in (via localStorage)
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        // Verify it's valid JSON before trusting it
        JSON.parse(userData);
        setIsLoggedIn(true);
      } catch (e) {
        // If corrupted, clear it
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Handle successful login
  const handleLogin = async (identifier: string, password: string) => {
    try {
      // ✅ Correct URL: port 5000, no /auth
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Store user data directly (no token needed for now)
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userData'); // ✅ Remove userData, not authToken
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="app">
      <Routes>
        {/* Login Route (public) */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Homepage Route (protected) */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Homepage onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Dashboard Route (protected) - routes to AdminDashboard for SU_ADMIN, ClubDashboard for others */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <DashboardRouter onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Admin Dashboard Route (protected) - only for SU_ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn ? <AdminDashboardGuard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Club Requests Route (protected) */}
        <Route
          path="/request"
          element={
            isLoggedIn ? <ClubRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* View Requests Route (protected) */}
        <Route
          path="/view-requests"
          element={
            isLoggedIn ? <ViewRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Calendar Route (protected) - placeholder for now */}
        <Route
          path="/calendar"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Funding Route (protected) - placeholder for now */}
        <Route
          path="/funding"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Profile Route (protected) - placeholder for now */}
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Fallback: Redirect unknown routes to login */}
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

