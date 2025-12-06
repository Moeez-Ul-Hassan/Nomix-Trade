import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";

// Import Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ForecastMain from './pages/ForecastMain';
import CompanyPage from './pages/CompanyPage'; // <--- NEW IMPORT
import Research from './pages/Research';
import UserDashboard from './pages/UserDashboard';
import Signup from './components/signup';

// Guard Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user'); 
  if (!isAuthenticated) {
    alert("You have to sign in or up first!");
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/market" element={<ForecastMain />} />
        
        {/* --- NEW ROUTE FOR COMPANY DETAILS --- */}
        <Route path="/company/:symbol" element={<CompanyPage />} />
        
        <Route path="/research" element={<Research />} />
      </Routes>
    </Router>
  );
}

export default App;