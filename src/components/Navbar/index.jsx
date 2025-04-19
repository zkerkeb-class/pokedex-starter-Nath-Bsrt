import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './index.css';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Pokédex</Link>
      </div>
      
      <ul className="navbar-links">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Accueil</Link>
        </li>
        <li className="navbar-item">
          <Link to="/wtp" className="navbar-link">Qui est ce Pokémon?</Link>
        </li>
      </ul>
      
      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <span className="username">Bonjour, {currentUser?.username || 'Dresseur'}</span>
            <button 
              className="logout-button" 
              onClick={handleLogout} 
              title="Se déconnecter"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="login-links">
            <Link to="/login" className="login-button">Connexion</Link>
            <Link to="/register" className="register-button">Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 