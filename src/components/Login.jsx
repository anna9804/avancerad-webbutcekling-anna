import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const avatarOptions = [
  'https://api.multiavatar.com/seed1.svg',
  'https://api.multiavatar.com/seed2.svg',
  'https://api.multiavatar.com/seed3.svg',
  'https://api.multiavatar.com/seed4.svg',
  'https://api.multiavatar.com/seed5.svg',
  'https://api.multiavatar.com/seed6.svg',
];

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/chat");
    }
  }, [navigate, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://chatify-api.up.railway.app/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          username: userData.username,
          token: userData.token,
          avatar: userData.avatar || 'https://api.multiavatar.com/seed3.svg',
        }));
  
        console.log("User logged in and data saved to localStorage:", userData);
        setUser(userData);
        navigate("/chat");
      } else {
        const errorDetails = await response.text();
        setError(errorDetails || "Login failed."); 
        console.error("Login Error:", errorDetails);
      }
    } catch (err) {
      setError("Error during login. Please try again.");
      console.error("Error during login:", err);
    }
  };   

  return (
    <div className="login-container">
      <h2>Logga in</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-btn">Logga in</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
