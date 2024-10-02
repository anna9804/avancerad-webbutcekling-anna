import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { username, password };

    try {
      const registerResponse = await fetch("https://chatify-api.up.railway.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const registerResult = await registerResponse.json();

      if (registerResponse.status === 400) {
        if (registerResult.message === "Username or email already exists") {
          setError("Username or email already exists");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else if (registerResponse.ok) {
        const tokenPayload = { username, password };
        const tokenResponse = await fetch("https://chatify-api.up.railway.app/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(tokenPayload),
        });

        const tokenResult = await tokenResponse.json();

        if (tokenResponse.ok) {
          localStorage.setItem("token", tokenResult.token);

          navigate("/login");
        } else {
          setError("Failed to generate token. Please try again.");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
