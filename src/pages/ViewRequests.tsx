// src/pages/ViewRequests.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import './ClubDashboard.css';
import './ViewRequests.css';

interface DashboardProps {
  onLogout?: () => void;
}

interface ClubData {
  club_id: number;
  club_name: string;
  logo_url: string;
  budget: number;
}

interface Request {
  request_id: number;
  title: string;
  type: string;
  status: string;
  event_date: string | null;
  created_at: string;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
}

const ViewRequests: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchRequests = async () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      setUserData(userData);

      // Set club name and logo based on club_id
      let clubName = 'Club';
      let logoUrl = '';
      
      if (userData.club_id === 1) {
        clubName = 'NIMUN';
        logoUrl = '/nimun-logo.jpg';
      } else if (userData.club_id === 2) {
        clubName = 'RPM';
        logoUrl = '/rpm-logo.jpg';
      } else if (userData.club_id === 3) {
        clubName = 'ICPC';
        logoUrl = '/icpc-logo.jpg';
      } else if (userData.club_id === 4) {
        clubName = 'IEEE';
        logoUrl = '/ieee-logo.jpg';
      }

      setClubData({
        club_id: userData.club_id,
        club_name: clubName,
        logo_url: logoUrl,
        budget: 5000
      });

      // Fetch all requests for this club
      if (userData.club_id) {
        const requestsResponse = await fetch(`http://localhost:5000/api/clubs/${userData.club_id}/requests`);
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          // Sort by created_at descending (newest first)
          const sortedRequests = requestsData.sort((a: Request, b: Request) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setRequests(sortedRequests);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
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
  onClick={(e) => {
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
        {/* Top Navigation Bar */}
        

        {/* Requests Section */}
        <section className="view-requests-section">
          <div className="view-requests-header">
            <h2 className="view-requests-title">My Requests</h2>
            <p className="view-requests-subtitle">
              View all past and current requests for {clubData?.club_name || 'your club'}
            </p>
          </div>

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
            {filteredRequests.length > 0 ? (
              <div className="requests-list">
                {filteredRequests.map((request) => (
                  <div key={request.request_id} className="request-card">
                    <div className="request-card-header">
                      <div className="request-card-title-section">
                        <h3 className="request-card-title">{request.title}</h3>
                        <div className="request-card-meta">
                          <span className="request-type">{getTypeLabel(request.type)}</span>
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
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-requests">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No requests found</p>
                <Link to="/request" className="btn-create-request">
                  Create New Request
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewRequests;

