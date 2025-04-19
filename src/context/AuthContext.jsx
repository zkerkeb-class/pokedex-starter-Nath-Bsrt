import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Vérifier si un token existe déjà dans le localStorage au chargement
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Configure axios pour inclure le token dans toutes les requêtes
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Vérifier la validité du token en appelant une API protégée
            axios.get('http://localhost:3000/api/auth/verify')
                .then(response => {
                    setCurrentUser(response.data.user);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    // Token invalide ou expiré
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            setError('');
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
            
            // Vérifier si la réponse contient le token et les données utilisateur
            if (response.data && response.data.token) {
                const { token } = response.data;
                
                // Sauvegarder le token dans le localStorage
                localStorage.setItem('token', token);
                
                // Configure axios pour inclure le token dans toutes les requêtes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setCurrentUser(response.data);
                setIsAuthenticated(true);
                return true;
            } else {
                throw new Error("Réponse du serveur incorrecte");
            }
        } catch (err) {
            console.error("Erreur de connexion:", err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Email ou mot de passe incorrect');
            } else if (err.request) {
                setError("Pas de réponse du serveur. Vérifiez que l'API est bien lancée.");
            } else {
                setError(err.message || 'Erreur de connexion');
            }
            return false;
        }
    };

    // Fonction d'inscription
    const register = async (username, email, password) => {
        try {
            setError('');
            console.log("Tentative d'inscription avec:", { username, email, password: '***' });
            
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                username,
                email,
                password
            });
            
            console.log("Réponse du serveur:", response.data);
            
            if (response.data && response.data.token) {
                const { token } = response.data;
                
                // Sauvegarder le token dans le localStorage
                localStorage.setItem('token', token);
                
                // Configure axios pour inclure le token dans toutes les requêtes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setCurrentUser(response.data);
                setIsAuthenticated(true);
                return true;
            } else {
                throw new Error("Réponse du serveur incorrecte");
            }
        } catch (err) {
            console.error("Erreur lors de l'inscription:", err);
            if (err.response && err.response.data) {
                console.error("Détails de l'erreur:", err.response.data);
                setError(err.response.data.message || "Erreur lors de l'inscription");
            } else if (err.request) {
                console.error("Pas de réponse du serveur:", err.request);
                setError("Pas de réponse du serveur. Vérifiez que l'API est bien lancée.");
            } else {
                console.error("Erreur:", err.message);
                setError(err.message || "Erreur lors de l'inscription");
            }
            return false;
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // Fonction de connexion de développement (à ne pas utiliser en production)
    const devLogin = async () => {
        try {
            setError('');
            console.log("Tentative de connexion en mode développement...");
            
            // Afficher les headers pour le débogage
            const headers = axios.defaults.headers.common;
            console.log("Headers actuels:", headers);
            
            const response = await axios.get('http://localhost:3000/api/auth/dev-login');
            
            console.log("Réponse du serveur:", response.data);
            
            if (response.data && response.data.token) {
                const { token } = response.data;
                
                // Sauvegarder le token dans le localStorage
                localStorage.setItem('token', token);
                
                // Configure axios pour inclure le token dans toutes les requêtes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setCurrentUser(response.data);
                setIsAuthenticated(true);
                return true;
            } else {
                console.error("Erreur: Réponse sans token");
                setError("Réponse du serveur incorrecte (pas de token)");
                return false;
            }
        } catch (error) {
            console.error("Erreur de connexion dev:", error);
            
            if (error.response) {
                // La requête a été faite et le serveur a répondu avec un code d'état
                // qui ne fait pas partie de la plage 2xx
                console.error("Détails de l'erreur:", {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
                setError(`Erreur ${error.response.status}: ${error.response.data.message || "Erreur côté serveur"}`);
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                console.error("Pas de réponse du serveur:", error.request);
                setError("Pas de réponse du serveur. Assurez-vous que l'API est en cours d'exécution sur le port 3000.");
            } else {
                // Une erreur s'est produite lors de la configuration de la requête
                console.error("Erreur de configuration:", error.message);
                setError(`Erreur de configuration: ${error.message}`);
            }
            
            return false;
        }
    };

    // Fonction de création et connexion avec utilisateur de test
    const createAndLoginDevUser = async () => {
        try {
            setError('');
            console.log("Création et connexion avec utilisateur de test...");
            
            const response = await axios.get('http://localhost:3000/api/auth/create-dev-user');
            
            console.log("Réponse du serveur:", response.data);
            
            if (response.data && response.data.token) {
                const { token } = response.data;
                
                // Sauvegarder le token dans le localStorage
                localStorage.setItem('token', token);
                
                // Configure axios pour inclure le token dans toutes les requêtes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setCurrentUser(response.data);
                setIsAuthenticated(true);
                return true;
            } else {
                console.error("Erreur: Réponse sans token");
                setError("Réponse du serveur incorrecte (pas de token)");
                return false;
            }
        } catch (error) {
            console.error("Erreur de création utilisateur:", error);
            
            if (error.response) {
                console.error("Détails de l'erreur:", {
                    data: error.response.data,
                    status: error.response.status
                });
                setError(`Erreur ${error.response.status}: ${error.response.data.message || "Erreur côté serveur"}`);
            } else if (error.request) {
                console.error("Pas de réponse du serveur:", error.request);
                setError("Pas de réponse du serveur. Assurez-vous que l'API est en cours d'exécution sur le port 3000.");
            } else {
                console.error("Erreur de configuration:", error.message);
                setError(`Erreur de configuration: ${error.message}`);
            }
            
            return false;
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        devLogin,
        createAndLoginDevUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
