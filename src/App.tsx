// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Homepage from './pages/Homepage';
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
  const handleLogin = (identifier: string, password: string) => {
    // 🔒 Replace this with real API call later
    if (identifier.trim() && password.trim()) {
      // Simulate successful login
      localStorage.setItem('authToken', 'valid-token');
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Please enter valid credentials');
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

