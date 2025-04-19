import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setLocalError("");
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setLocalError("Tous les champs sont obligatoires");
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setLoading(true);
    console.log("Tentative d'inscription avec les informations fournies");
    
    try {
      const success = await register(username, email, password);
      console.log("Résultat de l'inscription:", success);
      
      if (success) {
        console.log("Inscription réussie, redirection vers l'accueil");
        // Redirection vers la page d'accueil
        navigate("/");
      } else {
        console.log("Échec de l'inscription:", authError);
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setLocalError("Une erreur s'est produite lors de l'inscription: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Afficher les erreurs détaillées pour le débogage
  const displayError = localError || authError;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Inscription</h2>
        
        {displayError && (
          <div className="auth-error">
            {displayError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choisissez un nom d'utilisateur"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créez un mot de passe"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 