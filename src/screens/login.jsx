import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Importer 'useAuth' pour gérer l'authentification

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();  // Utiliser la fonction 'login' du contexte

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple validation (you can replace this with actual auth logic)
        if (username === "user" && password === "password") {
            login();  // Appeler la fonction 'login' pour marquer l'utilisateur comme authentifié
            navigate("/"); // Redirect to home page on successful login
        } else {
            alert("Invalid credentials, please try again.");
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
