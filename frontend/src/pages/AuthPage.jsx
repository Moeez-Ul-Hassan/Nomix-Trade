import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../components/Signup.css'; // Reusing styles
import MainLogo from '../assets/images/Main_Logo_.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

// In frontend/src/pages/AuthPage.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();

        if (response.ok) {
            // --- DEBUGGING LOG (Check your browser console!) ---
            console.log("LOGIN SUCCESS! Server sent:", data);

            // 1. Save Name
            localStorage.setItem('user', data.user); 
            
            // 2. SAVE THE ID (CRITICAL FIX)
            if (data.user_id) {
              localStorage.setItem('user_id', data.user_id);
            } else {
              console.error("ERROR: Server did not send user_id!");
              alert("Login Error: System did not receive User ID.");
              return;
            }

            alert("Login Successful! Welcome " + data.user);
            navigate('/dashboard'); 
        } else {
            alert("Login Failed: " + data.detail);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error.");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-content">
          <h1 className="brand-logo">NOMIX TRADE</h1>
          {/* UPDATED SLOGAN HERE */}
          <p className="brand-slogan">Welcome Back!<br />Login to become Rich..</p>
          <div className="chart-visual">
            <img src={MainLogo} alt="Nomix Trade Logo" className="main-logo-img" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-card">
          <h2>Log in</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email address</label>
              <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} placeholder="Enter your password" required />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />} Hide
                </span>
              </div>
            </div>

            <button type="submit" className="signup-btn">Log in</button>
            <p className="login-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;