import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./index.css";

const Navbar = ({
  user,
  logout,
  showFavorites,
  toggleFavorites,
  isWTPPage = false,
}) => {
  const navigate = useNavigate();

  const handleWTPClick = () => {
    navigate("/wtp");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">Pokédex</Link>
        </div>
        <ul className="navbar-links">
          <li className="navbar-item">
            <NavLink to="/" className="navbar-link" onClick={handleHomeClick}>
              Accueil
            </NavLink>
          </li>
          <li className="navbar-item">
            <button 
              className={`navbar-link favorites-link ${showFavorites ? "active" : ""}`} 
              onClick={toggleFavorites}
            >
              Favoris
            </button>
          </li>
        </ul>
      </div>

      <div className="navbar-center">
        <button
          className="wtp-navbar-button"
          onClick={handleWTPClick}
          disabled={isWTPPage}
        >
          Who's that Pokémon?
        </button>
      </div>

      <div className="navbar-auth">
        {user ? (
          <div className="user-menu">
            <span className="username">{user.username}</span>
            <button className="logout-button" onClick={logout}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="login-links">
            <Link to="/login" className="login-button">
              Connexion
            </Link>
            <Link to="/register" className="register-button">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 