import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'

interface NavigationBarProps {
  onLogout?: () => void;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLogout }) => {
  const location = useLocation()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const data = JSON.parse(userDataStr);
        setUserData(data);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CLUB_LEADER':
        return 'Club Leader';
      case 'SU_ADMIN':
        return 'Student Union Admin';
      case 'STUDENT_LIFE_ADMIN':
        return 'Student Life Admin';
      default:
        return role;
    }
  }

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  }

  return (
    <nav className= "navbar">
      <div className="navbar-content">
        {/*Logo section*/}
              <div className="navbar-logo">
                <div className="logo-container">
                    <img 
                      src="/Nile_University_logo.png" 
                      alt="Nile University Logo" 
                      className="logo-image"
                      onError={(e) => {
                        console.error('Logo image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                </div>
              </div>

              {location.pathname === '/request' && (
                <div className="navbar-title">CLUBS</div>
              )}
              
              {/* Navigation Links */}
        <div className="navbar-links">
          <Link 
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/request" 
            className={`nav-link ${location.pathname === '/request' ? 'active' : ''}`}
          >
            Request
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            Profile
          </Link>
          
          {/* User Profile Dropdown */}
          {userData && (
            <div 
              className="navbar-user-profile"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div 
                className="navbar-user-info"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="navbar-user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="navbar-user-details">
                  <span className="navbar-user-name">{userData.fullname || 'User'}</span>
                  <span className="navbar-user-role">{getRoleLabel(userData.role)}</span>
                </div>
                <svg 
                  className={`navbar-dropdown-icon ${dropdownOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              
              {dropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <button 
                    onClick={handleLogout} 
                    className="navbar-dropdown-item logout-item"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar;