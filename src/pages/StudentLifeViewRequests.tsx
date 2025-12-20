// src/pages/StudentLifeViewRequests.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import './StudentLifeAdminDashboard.css';
import './ViewRequests.css';

interface DashboardProps {
  onLogout?: () => void;
}

interface Request {
  request_id: number;
  title: string;
  type: string;
  status: string;
  event_date: string | null;
  created_at: string;
  club_id: number;
  club_name: string;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
}

const StudentLifeViewRequests: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      setUserData(userData);

      // Verify user is STUDENT_LIFE_ADMIN
      if (userData.role !== 'STUDENT_LIFE_ADMIN') {
        navigate('/dashboard');
        return;
      }

      // Fetch all requests from all clubs
      const requestsResponse = await fetch(`http://localhost:5000/api/admin/requests?user_id=${userData.user_id}`);
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        console.log('Fetched requests:', requestsData); // Debug log
        // Sort by created_at descending (newest first)
        const sortedRequests = requestsData.sort((a: Request, b: Request) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRequests(sortedRequests);
        setError(null);
      } else {
        const errorData = await requestsResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        setError(errorData.error || 'Failed to fetch requests');
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Network error. Please check if the backend server is running.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('StudentLifeViewRequests component mounted');
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredRequests = filterStatus === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#10b981'; // green
      case 'REJECTED':
        return '#ef4444'; // red
      case 'PENDING':
        return '#f59e0b'; // yellow/orange
      case 'CANCELLED':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ROOM_BOOKING':
        return 'Room Booking';
      case 'EVENT':
        return 'Event';
      case 'FUNDING':
        return 'Funding';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container student-life-admin-dashboard">
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
                SL
              </div>
            </div>
            <h2 className="sidebar-title">STUDENT LIFE</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/student-life-dashboard" 
            className={`sidebar-nav-item ${location.pathname === '/student-life-dashboard' ? 'active' : ''}`}
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
            to="/student-life-requests" 
            className={`sidebar-nav-item ${location.pathname === '/student-life-requests' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>View All Requests</span>
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
        <header className="dashboard-header">
          <div className="dashboard-header-left" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <div className="header-logo-small">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                backgroundColor: '#298a1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                SL
              </div>
            </div>
            <div className="dashboard-header-title-container">
              <h1 className="dashboard-header-title">STUDENT LIFE</h1>
              <p className="dashboard-header-subtitle">View All Requests</p>
            </div>
          </div>
          <nav className="dashboard-header-nav">
            <div className="header-nav-links">
              <Link to="/" className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Home</span>
              </Link>
              <Link to="/student-life-dashboard" className={`header-nav-link ${location.pathname === '/student-life-dashboard' ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="16" y="2" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="2" y="16" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="16" y="16" width="6" height="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Dashboard</span>
              </Link>
            </div>

            <div className="header-actions">
              <div className="header-user-profile">
                <div className="user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="user-info">
                  <span className="user-name">{userData?.fullname || 'User'}</span>
                  <span className="user-role">Student Life Admin</span>
                </div>
                <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </nav>
        </header>

        {/* Requests Section */}
        <section className="view-requests-section">
          <div className="view-requests-header">
            <h2 className="view-requests-title">All Club Requests</h2>
            <p className="view-requests-subtitle">
              Monitor all requests submitted by all clubs (Read-only view)
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '1.5rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="requests-filter">
            <button
              className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All ({requests.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterStatus('PENDING')}
            >
              Pending ({requests.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('APPROVED')}
            >
              Approved ({requests.filter(r => r.status === 'APPROVED').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('REJECTED')}
            >
              Rejected ({requests.filter(r => r.status === 'REJECTED').length})
            </button>
          </div>

          {/* Requests List */}
          <div className="requests-list-container">
            {!error && filteredRequests.length > 0 ? (
              <div className="requests-list">
                {filteredRequests.map((request) => (
                  <div key={request.request_id} className="request-card">
                    <div className="request-card-header">
                      <div className="request-card-title-section">
                        <h3 className="request-card-title">{request.title}</h3>
                        <div className="request-card-meta">
                          <span className="request-type">{getTypeLabel(request.type)}</span>
                          <span className="request-type" style={{ fontWeight: 600, color: '#153966' }}>
                            {request.club_name || 'Unknown Club'}
                          </span>
                          {request.event_date && (
                            <span className="request-date">
                              {new Date(request.event_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="request-status-badge-container">
                        <span
                          className="request-status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="request-card-footer">
                      <span className="request-submitted-date">
                        Submitted {new Date(request.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} by {request.club_name || 'Unknown Club'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : !error ? (
              <div className="no-requests">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No requests found</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  There are currently no requests from any clubs.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentLifeViewRequests;

