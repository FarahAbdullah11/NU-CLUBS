import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

interface NavigationBarProps {
  onLogout?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLogout }) => {
  const location = useLocation()

  return (
    <nav className= "navbar">
      <div className="navbar-content">
        {/* Logo Section - Image */}
          <div className="navbar-logo">
          <img 
          src="/Nile_University_logo.png" 
          alt="Nile University Logo" 
          className="logo-image"
          />
          </div>

              
              
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
          {onLogout && (
            <button onClick={onLogout} className="nav-logout-button">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar;