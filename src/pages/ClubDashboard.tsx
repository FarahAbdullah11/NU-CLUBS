import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ClubDashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

interface ClubData {
  club_id: number;
  club_name: string;
  logo_url: string;
  budget: number;
}

interface DashboardMetrics {
  total_members: number;
  pending_requests: number;
  upcoming_events: number;
  current_budget: number;
}

interface Notification {
  notification_id: number;
  title: string;
  message: string;
  is_read: boolean;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
}

const ClubDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_members: 0,
    pending_requests: 0,
    upcoming_events: 0,
    current_budget: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user data
      const userResponse = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const user = await userResponse.json();
        setUserData(user);

        // Fetch club data if user is a club leader
        if (user.role === 'CLUB_LEADER' && user.club_id) {
          const clubResponse = await fetch(`http://localhost:3001/api/clubs/${user.club_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (clubResponse.ok) {
            const club = await clubResponse.json();
            setClubData(club);
          }

          // Fetch dashboard metrics
          const metricsResponse = await fetch(`http://localhost:3001/api/clubs/${user.club_id}/metrics`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (metricsResponse.ok) {
            const metricsData = await metricsResponse.json();
            setMetrics(metricsData);
          }

          // Fetch notifications
          const notificationsResponse = await fetch('http://localhost:3001/api/notifications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (notificationsResponse.ok) {
            const notificationsData = await notificationsResponse.json();
            setNotifications(notificationsData);
          }
        }
      } else {
        // If token is invalid, redirect to login
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data for development
      setClubData({
        club_id: 1,
        club_name: 'NIMUN',
        logo_url: '/nimun-logo.jpg',
        budget: 5000
      });
      setMetrics({
        total_members: 50,
        pending_requests: 5,
        upcoming_events: 3,
        current_budget: 5000
      });
      setUserData({
        user_id: 1,
        fullname: 'Ahmed Hassan',
        role: 'CLUB_LEADER'
      });
      setNotifications([
        { notification_id: 1, title: 'Room Booking Approved', message: 'Your request has been approved', is_read: false },
        { notification_id: 2, title: 'Funding Request Pending', message: 'Your funding request is under review', is_read: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Club Logo Component - Dynamic based on club data
  const ClubLogo = ({ size = 80, className = "" }: { size?: number; className?: string }) => {
    if (clubData?.logo_url) {
      return (
        <img 
          src={clubData.logo_url} 
          alt={`${clubData.club_name} Logo`}
          width={size} 
          height={size}
          className={className}
          style={{ objectFit: 'contain' }}
        />
      );
    }
    // Fallback to default logo or text
    return (
      <div 
        className={className}
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '50%', 
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.4,
          fontWeight: 'bold'
        }}
      >
        {clubData?.club_name?.charAt(0) || 'C'}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">
              <ClubLogo size={80} className="" />
            </div>
            <h2 className="sidebar-title">{clubData?.club_name || 'Club'}</h2>
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
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Navigation Bar */}
        <header className="dashboard-header">
          <div className="dashboard-header-left" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <div className="header-logo-small">
              <ClubLogo size={40} className="" />
            </div>
            <div className="dashboard-header-title-container">
              <h1 className="dashboard-header-title">{clubData?.club_name || 'Club'}</h1>
              <p className="dashboard-header-subtitle">Club Dashboard</p>
            </div>
          </div>
          <nav className="dashboard-header-nav">
            {/* Navigation Links */}
            <div className="header-nav-links">
              <Link to="/" className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Home</span>
              </Link>
              <Link to="/dashboard" className={`header-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="16" y="2" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="2" y="16" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="16" y="16" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Notifications & User Profile */}
            <div className="header-actions">
              {/* Notifications Icon */}
              <button className="header-notification-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>

              {/* User Profile */}
              <div className="header-user-profile">
                <div className="user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="user-info">
                  <span className="user-name">{userData?.fullname || 'User'}</span>
                  <span className="user-role">{userData?.role === 'CLUB_LEADER' ? 'Club Leader' : userData?.role || 'User'}</span>
                </div>
                <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </nav>
        </header>

        {/* Key Metrics Section */}
        <section className="dashboard-metrics">
          <div className="metric-card">
            <div className="metric-icon members-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="metric-label">Members</h3>
            <p className="metric-value">{metrics.total_members}</p>
          </div>
          <div className="metric-card">
            <div className="metric-icon requests-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="metric-label">Pending Requests</h3>
            <p className="metric-value">{metrics.pending_requests}</p>
          </div>
          <div className="metric-card">
            <div className="metric-icon events-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="metric-label">Upcoming Events</h3>
            <p className="metric-value">{metrics.upcoming_events}</p>
          </div>
          <div className="metric-card">
            <div className="metric-icon budget-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="metric-label">Budget</h3>
            <p className="metric-value">${metrics.current_budget.toLocaleString()}</p>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="dashboard-notifications">
          <div className="notifications-content">
            <div className="notifications-title-container">
              <div className="notifications-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="notifications-title">Notifications</h2>
            </div>
            <ul className="notifications-list">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <li key={notification.notification_id} className="notification-item">
                    <span className="notification-dot"></span>
                    <span className="notification-text">{notification.title}: {notification.message}</span>
                  </li>
                ))
              ) : (
                <li className="notification-item">
                  <span className="notification-text">No notifications</span>
                </li>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubDashboard;

