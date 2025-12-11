import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NIMUN_Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logo Component - Using JPG image
  const NIMUNLogo = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
    <img 
      src="/nimun-logo.jpg" 
      alt="NIMUN Logo" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">
              <NIMUNLogo size={80} className="nimun-logo" />
            </div>
            <h2 className="sidebar-title">NIMUN</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`sidebar-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="12" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="2" y="12" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="12" y="12" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/request" 
            className={`sidebar-nav-item ${location.pathname === '/request' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Requests</span>
          </Link>
          
          <Link 
            to="/calendar" 
            className={`sidebar-nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>Calendar</span>
          </Link>
          
          <Link 
            to="/funding" 
            className={`sidebar-nav-item ${location.pathname === '/funding' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <text x="10" y="15" textAnchor="middle" fontSize="16" fontWeight="bold" fill="currentColor">$</text>
            </svg>
            <span>Funding</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`sidebar-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M3 18 C3 14 6 11 10 11 C14 11 17 14 17 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Navigation Bar */}
        <header className="dashboard-header">
          <h1 className="dashboard-header-title">NIMUN</h1>
          <nav className="dashboard-header-nav">
            <Link to="/dashboard" className={`header-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/request" className={`header-nav-link ${location.pathname === '/request' ? 'active' : ''}`}>
              Requests
            </Link>
            <Link to="/calendar" className={`header-nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
              Calendar
            </Link>
            <Link to="/funding" className={`header-nav-link ${location.pathname === '/funding' ? 'active' : ''}`}>
              Funding
            </Link>
            <div className="header-user-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M4 20 C4 16 7 13 12 13 C17 13 20 16 20 20" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </nav>
        </header>

        {/* Key Metrics Section */}
        <section className="dashboard-metrics">
          <div className="metric-card">
            <h3 className="metric-label">Members</h3>
            <p className="metric-value">50</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Pending Requests</h3>
            <p className="metric-value">5</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Upcoming Events</h3>
            <p className="metric-value">3</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Budget</h3>
            <p className="metric-value">$2000</p>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="dashboard-notifications">
          <div className="notifications-content">
            <h2 className="notifications-title">Notifications</h2>
            <ul className="notifications-list">
              <li className="notification-item">
                Announcement: Club meeting on Friday
              </li>
              <li className="notification-item">
                New funding request submitted
              </li>
            </ul>
          </div>
          <div className="notifications-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/request')}
            >
              Submit Request
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/calendar')}
            >
              View Calendar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

