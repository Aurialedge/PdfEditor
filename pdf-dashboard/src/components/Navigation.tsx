import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiZap } from 'react-icons/fi';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <FiHome className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li className={location.pathname === '/viewer' ? 'active' : ''}>
          <Link to="/viewer">
            <FiFileText className="nav-icon" />
            <span>PDF Viewer</span>
          </Link>
        </li>
        <li className={location.pathname === '/ai-extract' ? 'active' : ''}>
          <Link to="/ai-extract">
            <FiZap className="nav-icon" />
            <span>AI Extraction</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
