// src/components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (identifier: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState(''); // Can be ID or email
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      alert('Please enter your University ID or email and password');
      return;
    }
    onLogin(identifier, password); // Pass to App.tsx — backend will decide if it's ID or email
  };

  return (
    <div className="login-container">
      <div className="welcome-panel">
        <h3>NU | Clubs Portal</h3>
        <h1>Welcome to NU Clubs Portal</h1>
        <p>Connect | Organize | Lead</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <p>Access your clubs dashboard</p>

        <input
          type="text"
          placeholder="University ID or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <a href="#" className="forgot-password">Forgot your password?</a>

        <button type="submit" className="login-button">
          Log In
        </button>

        <p className="signup-link">
          Don't have an account? <a href="#">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;