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
        {/*Logo section*/}
              <div className="navbar-logo">
                <div className="logo-container">
                    <div className="logo-monogram">Nu</div>
                    <div className="logo-text">
                        <div className="logo-english">Nile University</div>
                        <div className="logo-arabic">جامعة النيل </div>
                    </div>
                </div>
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