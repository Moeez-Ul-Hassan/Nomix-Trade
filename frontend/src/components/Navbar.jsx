import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import MainLogo from '../assets/images/Main_Logo_.png'; 
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const location = useLocation(); // Triggers re-render when route changes
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  // CHECK LOGIN STATUS
  // We check this every time the location changes (page navigation)
  const isLoggedIn = localStorage.getItem('user_id');

  const handleLogout = () => {
    // 1. Clear Data
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    
    // 2. Alert & Redirect
    alert("You have been logged out.");
    navigate('/login');
    closeMobileMenu();
  };

  return (
    <nav className="navbar-container">
      {/* 1. LOGO */}
      <div className="navbar-logo-section">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <img src={MainLogo} alt="Nomix Trade" className="nav-logo-img" />
          <span className="brand-text">Nomix Trade</span>
        </Link>
      </div>

      {/* 2. HAMBURGER ICON */}
      <div className="menu-icon" onClick={handleClick}>
        {click ? <FaTimes /> : <FaBars />}
      </div>

      {/* 3. MENU ITEMS */}
      <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        <li>
          <Link to="/" className={`nav-item ${isActive('/')}`} onClick={closeMobileMenu}>Home</Link>
        </li>
        <li>
          <Link to="/market" className={`nav-item ${isActive('/market')}`} onClick={closeMobileMenu}>Explore</Link>
        </li>
        <li>
          <Link to="/research" className={`nav-item ${isActive('/research')}`} onClick={closeMobileMenu}>Research</Link>
        </li>
        
        {/* Only show Dashboard link if logged in (Optional, but good UX) */}
        {isLoggedIn && (
          <li>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`} onClick={closeMobileMenu}>Dashboard</Link>
          </li>
        )}

        {/* 4. DYNAMIC AUTH BUTTON */}
        <li className="mobile-auth-btn-container">
          {isLoggedIn ? (
            // LOG OUT BUTTON
            <button className="btn-signin" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            // SIGN IN LINK
            <Link to="/login" className="btn-signin" onClick={closeMobileMenu}>
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;