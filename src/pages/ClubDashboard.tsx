// src/pages/ClubDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import './ClubDashboard.css';
import NavigationBar from '../components/Navbar';

interface ClubDashboardProps {
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
  type: string;
  status: string;
  created_at: string;
  is_read: boolean;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
  club_id?: number;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ onLogout }) => {
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

  const fetchDashboardData = async () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataStr) as UserData;
      setUserData(userData);

      // Set club name and logo based on club_id
      let clubName = 'Club';
      let logoUrl = '';
      let totalMembers = 0;
      
      if (userData.club_id === 1) {
        clubName = 'NIMUN';
        logoUrl = '/nimun-logo.jpg';
        totalMembers = 45;
      } else if (userData.club_id === 2) {
        clubName = 'RPM';
        logoUrl = '/rpm-logo.jpg';
        totalMembers = 38;
      } else if (userData.club_id === 3) {
        clubName = 'ICPC';
        logoUrl = '/icpc-logo.jpg';
        totalMembers = 52;
      } else if (userData.club_id === 4) {
        clubName = 'IEEE';
        logoUrl = '/ieee-logo.jpg';
        totalMembers = 41;
      }

      setClubData({
        club_id: userData.club_id || 0,
        club_name: clubName,
        logo_url: logoUrl,
        budget: 5000
      });

      // Fetch requests to get metrics and latest request
      if (userData.club_id) {
        const requestsResponse = await fetch(`http://localhost:5000/api/clubs/${userData.club_id}/requests`);
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          
          // Count pending requests
          const pendingCount = requests.filter((r: any) => r.status === 'PENDING').length;
          
          // Count upcoming approved events
          const today = new Date().toISOString().split('T')[0];
          const upcomingEvents = requests.filter((r: any) => 
            r.status === 'APPROVED' && r.event_date && r.event_date >= today
          ).length;

          setMetrics({
            total_members: totalMembers,
            pending_requests: pendingCount,
            upcoming_events: upcomingEvents,
            current_budget: 5000
          });

          // ✅ Get ONLY the LATEST request (most recent)
          const latestRequest = requests.length > 0 
            ? requests.sort((a: any, b: any) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0]
            : null;

          // ✅ Create notification ONLY for the latest request
          const notifs = latestRequest ? [{
            notification_id: latestRequest.request_id,
            title: latestRequest.title,
            type: latestRequest.type,
            status: latestRequest.status,
            created_at: latestRequest.created_at,
            is_read: latestRequest.status === 'PENDING' ? false : true
          }] : [];

          setNotifications(notifs);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchDashboardData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Club Logo Component
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
      <NavigationBar onLogout={onLogout} />
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
            to="/view-requests" 
            className={`sidebar-nav-item ${location.pathname === '/view-requests' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>View my Requests</span>
          </Link>
          
          <Link 
            to="/#calendar" 
            className={`sidebar-nav-item ${location.pathname === '/' && window.location.hash === '#calendar' ? 'active' : ''}`}
            onClick={(e: React.MouseEvent) => {
              // Optional: Scroll to #calendar if already on home page
              if (location.pathname === '/') {
                e.preventDefault();
                document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>Calendar</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
                notifications.map((notification) => (
                  <li key={notification.notification_id} className="notification-item">
                    <div className="notification-content">
                      <div className="notification-info">
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-subtitle">
                          {notification.type === 'ROOM_BOOKING' ? 'Room' : 
                           notification.type === 'EVENT' ? 'Event' : 'Funding'} • 
                          Submitted {new Date(notification.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div className="notification-status">
                        <span className={`status-badge status-${notification.status.toLowerCase()}`}>
                          {notification.status === 'PENDING' ? 'Pending' : 
                           notification.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                        </span>
                      </div>
                    </div>
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