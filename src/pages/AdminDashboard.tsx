// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import './AdminDashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

interface DashboardMetrics {
  total_members: number;
  pending_requests: number;
  upcoming_events: number;
}

interface Notification {
  notification_id: number;
  title: string;
  type: string;
  status: string;
  created_at: string;
  is_read: boolean;
  club_name?: string;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
}

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_members: 0,
    pending_requests: 0,
    upcoming_events: 0
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

      const userData = JSON.parse(userDataStr);
      setUserData(userData);

      // Verify user is SU_ADMIN only - redirect STUDENT_LIFE_ADMIN to their dashboard
      if (userData.role === 'STUDENT_LIFE_ADMIN') {
        navigate('/student-life-dashboard');
        return;
      }
      if (userData.role !== 'SU_ADMIN') {
        navigate('/dashboard');
        return;
      }

      // Fetch all requests from all clubs
      const requestsResponse = await fetch(`http://localhost:5000/api/admin/requests?user_id=${userData.user_id}`);
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        
        // Calculate total members across all clubs (hardcoded for now)
        const totalMembers = 45 + 38 + 52 + 41; // NIMUN + RPM + ICPC + IEEE
        
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
          upcoming_events: upcomingEvents
        });

        // Get the latest request (most recent)
        const latestRequest = requests.length > 0 
          ? requests.sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
          : null;

        // Create notification for the latest request
        const notifs = latestRequest ? [{
          notification_id: latestRequest.request_id,
          title: latestRequest.title,
          type: latestRequest.type,
          status: latestRequest.status,
          created_at: latestRequest.created_at,
          is_read: latestRequest.status === 'PENDING' ? false : true,
          club_name: latestRequest.club_name || 'Club'
        }] : [];

        setNotifications(notifs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Immediate check on mount - redirect STUDENT_LIFE_ADMIN users
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.role === 'STUDENT_LIFE_ADMIN') {
          navigate('/student-life-dashboard', { replace: true });
          return;
        }
      } catch (e) {
        // If parsing fails, continue
      }
    }
  }, [navigate]);

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

  // Early return if user is STUDENT_LIFE_ADMIN - prevent rendering
  const userDataStrCheck = localStorage.getItem('userData');
  if (userDataStrCheck) {
    try {
      const userDataCheck = JSON.parse(userDataStrCheck);
      if (userDataCheck.role === 'STUDENT_LIFE_ADMIN') {
        // Redirect will happen in useEffect, but prevent rendering
        return null;
      }
    } catch (e) {
      // Continue if parsing fails
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="dashboard-container admin-dashboard">
      <NavigationBar onLogout={onLogout} />
      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                SU
              </div>
            </div>
            <h2 className="sidebar-title">
              STUDENT UNION
            </h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/admin-dashboard" 
            className={`sidebar-nav-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
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
            to="/admin-requests" 
            className={`sidebar-nav-item ${location.pathname === '/admin-requests' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>View All Requests</span>
          </Link>
          
          <Link 
            to="/student-life-edit-requests" 
            className={`sidebar-nav-item ${location.pathname === '/student-life-edit-requests' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M14.5 1.5L18.5 5.5M18.5 5.5L14.5 9.5M18.5 5.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Edit Requests</span>
          </Link>
          
          <Link 
            to="/#calendar" 
            className={`sidebar-nav-item ${location.pathname === '/' && window.location.hash === '#calendar' ? 'active' : ''}`}
            onClick={(e) => {
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
        {/* Top Navigation Bar */}
        

        {/* Key Metrics Section - NO BUDGET BOX */}
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
            <h3 className="metric-label">Total Members</h3>
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
                          {notification.club_name || 'Club'} • {notification.type === 'ROOM_BOOKING' ? 'Room' : 
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

export default AdminDashboard;

