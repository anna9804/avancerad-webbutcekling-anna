import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideNav.css'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {location.pathname === '/chat' ? (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <button className="nav-btn" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="nav-btn" onClick={() => navigate('/register')}>
            Register
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
