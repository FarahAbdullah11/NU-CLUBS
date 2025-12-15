// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Homepage from './pages/Homepage';
import ClubRequests from './pages/ClubRequests';
import Dashboard from './pages/ClubDashboard';
import './App.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in (via localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle successful login
  const handleLogin = async (identifier: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error. Please make sure the server is running.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
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

        {/* Dashboard Route (protected) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Club Requests Route (protected) */}
        <Route
          path="/request"
          element={
            isLoggedIn ? <ClubRequests onLogout={handleLogout} /> : <Navigate to="/login" replace />
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

