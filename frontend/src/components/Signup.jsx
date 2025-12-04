import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signup.css';
import MainLogo from '../assets/images/Main_Logo_.png';

const Signup = () => {
  const navigate = useNavigate(); // Hook to redirect user after signup
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    terms: false,
    updates: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate
    if(!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }
    
    // Connect to Backend
    try {
        const response = await fetch('http://127.0.0.1:8000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert("Account created! Redirecting to login...");
            navigate('/login'); // Sends user to login page
        } else {
            alert("Signup Failed: " + data.detail);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to server. Is the backend running?");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="left-panel">
        <div className="brand-content">
          <h1 className="brand-logo">NOMIX TRADE</h1>
          <p className="brand-slogan">Sign up to the best<br />PSX Predictor!</p>
          <div className="chart-visual">
            <img src={MainLogo} alt="Nomix Trade Logo" className="main-logo-img" />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-panel">
        <div className="form-card">
          <h2>Sign up now</h2>
          <form onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="input-group">
                <label>First name</label>
                <input type="text" name="firstName" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Last name</label>
                <input type="text" name="lastName" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Email address</label>
              <input type="email" name="email" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Phone number</label>
              <div className="phone-input">
                <select className="flag-select"><option>🇺🇸 +1</option><option>🇵🇰 +92</option></select>
                <input type="tel" name="phone" onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} required />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />} Hide
                </span>
              </div>
              <small className="hint">Use 8 or more characters with letters, numbers & symbols</small>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" name="terms" onChange={handleChange} />
              <label>I agree to Terms of use & Privacy Policy</label>
            </div>

            <button type="submit" className="signup-btn">Sign up</button>
            
            <p className="login-link">Already have an account? <Link to="/login">Log in</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;