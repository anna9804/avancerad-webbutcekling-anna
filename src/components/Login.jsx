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
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/chat");
    }
  }, [setUser, navigate]);

  const decodeJWT = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const csrfToken = localStorage.getItem("csrfToken");

    if (!csrfToken) {
      setError("CSRF token is missing. Please try again.");
      return;
    }

    try {
      const response = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        const decodedJWT = decodeJWT(userData.token);

        if (decodedJWT) {
          const user = {
            id: decodedJWT.id,
            username: decodedJWT.user,
            avatar: selectedAvatar,
            token: userData.token,
          };

          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/chat");
        } else {
          setError("Failed to decode token.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Log in</h2>
      <form className="login-form" onSubmit={handleLogin}>
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
        
        <div className="avatar-selection">
          <label>Select Avatar</label>
          <div className="avatar-options">
            {avatarOptions.map((avatar) => (
              <img
                key={avatar}
                src={avatar}
                alt="Avatar option"
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="login-btn">Log in</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
