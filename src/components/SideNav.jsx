import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SideNav.css'; 

const SideNav = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {loggedInUser ? (
        <>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
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

export default SideNav;
