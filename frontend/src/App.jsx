import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";

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
      {/* --- NEW NAVBAR (Replaces the old <nav> code) --- */}
      <Navbar />

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