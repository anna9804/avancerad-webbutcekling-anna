import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const avatarOptions = [
  'https://api.multiavatar.com/seed1.svg',
  'https://api.multiavatar.com/seed2.svg',
  'https://api.multiavatar.com/seed3.svg',
  'https://api.multiavatar.com/seed4.svg',
  'https://api.multiavatar.com/seed5.svg',
  'https://api.multiavatar.com/seed6.svg',
];

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("https://chatify-api.up.railway.app/csrf", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.csrfToken) {
          localStorage.setItem("csrfToken", data.csrfToken);
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const csrfToken = localStorage.getItem("csrfToken");
    const payload = { email, username, password, avatar };

    try {
      const registerResponse = await fetch("https://chatify-api.up.railway.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const registerResult = await registerResponse.json();

      if (registerResponse.status === 400) {
        setError(registerResult.message || "Registration failed. Please try again.");
      } else if (registerResponse.ok) {
        navigate("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <div className="avatar-container">
          <h4>Choose your avatar</h4>
          <div className="avatars">
            {avatarOptions.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Avatar ${index + 1}`}
                className={`avatar ${avatar === imgUrl ? "selected" : ""}`}
                onClick={() => setAvatar(imgUrl)}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="register-btn">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;
