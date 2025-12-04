// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import MainLogo from '../assets/images/logos/ntlogo.png'; 
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="navbar-container">
      {/* 1. Logo Section */}
      <div className="navbar-logo-section">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <img src={MainLogo} alt="Nomix Trade" className="nav-logo-img" />
          <span className="brand-text">Nomix Trade</span>
        </Link>
      </div>

      {/* 2. Hamburger Icon */}
      <div className="menu-icon" onClick={handleClick}>
        {click ? <FaTimes /> : <FaBars />}
      </div>

      {/* 3. Menu (Links + Button) */}
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
        <li>
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`} onClick={closeMobileMenu}>Dashboard</Link>
        </li>

        {/* Auth Button */}
        <li className="mobile-auth-btn-container">
          <Link to="/login" className="btn-signin" onClick={closeMobileMenu}>
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;