import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ForecastMain from './pages/ForecastMain';
import CompanyDetails from './pages/CompanyDetails';
import Research from './pages/Research';
import UserDashboard from './pages/UserDashboard';
import Signup from './components/signup';

// --- NEW SECURITY COMPONENT ---
// This acts as a Guard. If no user key, kick them to Login.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user'); // Check for key
  
  if (!isAuthenticated) {
    alert("You have to sign in or up first!");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      {/* --- YOUR NAVBAR (UNCHANGED) --- */}
      <nav style={{ padding: '15px 40px', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center' }}>
        <h3 style={{margin:0, fontFamily: 'Courier New', fontSize: '1.5rem', marginRight: '40px'}}>NOMIX</h3>
        
        <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: '#ccc', fontSize: '0.9rem' }}>Home</Link>
            <Link to="/market" style={{ color: '#ccc', fontSize: '0.9rem' }}>Forecast</Link>
            <Link to="/research" style={{ color: '#ccc', fontSize: '0.9rem' }}>Research</Link>
            <Link to="/dashboard" style={{ color: '#ccc', fontSize: '0.9rem' }}>Dashboard</Link>
        </div>
        
        <div style={{marginLeft: 'auto', display: 'flex', gap: '15px'}}>
            <Link to="/login" style={{ color: 'white', fontWeight: 'bold' }}>Login</Link>
            <Link to="/signup" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </nav>

      {/* --- ROUTES --- */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/market" element={<ForecastMain />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/research" element={<Research />} />
      </Routes>
    </Router>
  );
}

export default App;