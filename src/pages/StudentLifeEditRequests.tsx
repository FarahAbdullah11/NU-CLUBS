// src/pages/StudentLifeEditRequests.tsx
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

const StudentLifeEditRequests: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null);

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
        console.log('Fetched requests:', requestsData);
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

  const updateRequestStatus = async (requestId: number, status: 'APPROVED' | 'REJECTED') => {
    if (!userData) return;

    setUpdatingRequestId(requestId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          status: status
        })
      });

      if (response.ok) {
        // Refresh the requests list
        await fetchRequests();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to update request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Network error. Please try again.');
    } finally {
      setUpdatingRequestId(null);
    }
  };

  useEffect(() => {
    console.log('StudentLifeEditRequests component mounted');
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
            <span>View My Requests</span>
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
        {/* Requests Section */}
        <section className="view-requests-section">
          <div className="view-requests-header">
            <h2 className="view-requests-title">Edit All Club Requests</h2>
            <p className="view-requests-subtitle">
              Review and approve or reject requests from all clubs
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="request-submitted-date">
                          Submitted {new Date(request.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} by {request.club_name || 'Unknown Club'}
                        </span>
                        {request.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                              onClick={() => updateRequestStatus(request.request_id, 'APPROVED')}
                              disabled={updatingRequestId === request.request_id}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: updatingRequestId === request.request_id ? 'not-allowed' : 'pointer',
                                opacity: updatingRequestId === request.request_id ? 0.6 : 1,
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (updatingRequestId !== request.request_id) {
                                  e.currentTarget.style.backgroundColor = '#059669';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (updatingRequestId !== request.request_id) {
                                  e.currentTarget.style.backgroundColor = '#10b981';
                                }
                              }}
                            >
                              {updatingRequestId === request.request_id ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.request_id, 'REJECTED')}
                              disabled={updatingRequestId === request.request_id}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: updatingRequestId === request.request_id ? 'not-allowed' : 'pointer',
                                opacity: updatingRequestId === request.request_id ? 0.6 : 1,
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (updatingRequestId !== request.request_id) {
                                  e.currentTarget.style.backgroundColor = '#dc2626';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (updatingRequestId !== request.request_id) {
                                  e.currentTarget.style.backgroundColor = '#ef4444';
                                }
                              }}
                            >
                              {updatingRequestId === request.request_id ? 'Processing...' : 'Deny'}
                            </button>
                          </div>
                        )}
                      </div>
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

export default StudentLifeEditRequests;

