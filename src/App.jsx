import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SideNav from "./components/SideNav";
import Register from "./components/Register";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("https://chatify-api.up.railway.app/csrf", {
          method: "PATCH",
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

  return (
    <Router>
      <div className="app">
        <SideNav user={user} setUser={setUser} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/chat" element={<Chat user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
