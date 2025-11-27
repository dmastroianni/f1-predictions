import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Navbar.css';

function Navbar({ user }) {
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🏎️ F1 Predictions</h1>
        </div>
        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/predictions" 
            className={location.pathname === '/predictions' ? 'active' : ''}
          >
            Predictions
          </Link>
          <Link 
            to="/results" 
            className={location.pathname === '/results' ? 'active' : ''}
          >
            Results
          </Link>
        </div>
        <div className="navbar-user">
          <span>{user.email}</span>
          <button onClick={handleSignOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

