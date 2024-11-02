import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SideNav.css';

const SideNav = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {user ? (
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
