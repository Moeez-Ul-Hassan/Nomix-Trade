import React from 'react';
import { FaBell, FaCog, FaHistory, FaUserFriends, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="page-title">Profile</h1>

      <div className="dashboard-layout">
        
        {/* --- Left Side: Charts --- */}
        <div className="main-content">
          <h3 className="section-header">My Liked PSX Companies</h3>
          
          <div className="cards-row">
            {/* Card 1 */}
            <div className="stock-card">
              <div className="card-header">
                <h4>Engro Corp</h4>
                <button className="btn-select">Selected</button>
              </div>
              {/* Simple CSS Chart Visual */}
              <div className="mini-chart">
                <svg width="100%" height="100%" viewBox="0 0 100 50">
                   <polyline points="0,40 20,35 40,20 60,30 80,10 100,5" fill="none" stroke="#4CAF50" strokeWidth="2" />
                </svg>
              </div>
              <div style={{marginTop:'10px', fontSize:'0.8rem', color:'#666'}}>1D 1W 1M <span style={{color:'white'}}>Month</span></div>
            </div>

            {/* Card 2 */}
            <div className="stock-card">
              <div className="card-header">
                <h4>Lucky Cement</h4>
                <button className="btn-select">Selected</button>
              </div>
              <div className="mini-chart">
                 <svg width="100%" height="100%" viewBox="0 0 100 50">
                   <polyline points="0,30 30,30 50,40 70,15 100,20" fill="none" stroke="#2196F3" strokeWidth="2" />
                </svg>
              </div>
              <div style={{marginTop:'10px', fontSize:'0.8rem', color:'#666'}}>1D 1W 1M <span style={{color:'white'}}>Month</span></div>
            </div>

            {/* Card 3 */}
            <div className="stock-card">
              <div className="card-header">
                <h4>MCB Bank</h4>
                <button className="btn-deselect">Deselect</button>
              </div>
               <div className="mini-chart">
                 <svg width="100%" height="100%" viewBox="0 0 100 50">
                   <polyline points="0,25 25,25 50,10 75,30 100,15" fill="none" stroke="#FF9800" strokeWidth="2" />
                </svg>
              </div>
              <div style={{marginTop:'10px', fontSize:'0.8rem', color:'#666'}}>1D 1W 1M <span style={{color:'white'}}>Month</span></div>
            </div>
          </div>

          <h3 className="section-header">My Liked PSX Companies</h3>
          <div className="search-bar-container">
            <input type="text" placeholder="Discover Companies" className="search-input" />
            <button className="add-btn">Add New</button>
          </div>
        </div>

        {/* --- Right Side: Sidebar --- */}
        <div className="sidebar">
          
          {/* User Features */}
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span>User Features</span>
              <FaBell />
            </div>
            <div className="menu-item"><FaCog /> Account Settings</div>
            <div className="menu-item"><FaHistory /> Trade History</div>
          </div>

          {/* Notifications */}
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span>Notifications</span>
            </div>
            <div style={{marginBottom:'15px', color:'#2196F3', fontSize:'0.9rem'}}>3 New Alerts</div>

            <div className="notification-item">
               <div className="notif-icon"><FaUserFriends /></div>
               <div className="notif-text">
                  <strong>Refer a Friend</strong>
                  <div className="time">1 day ago</div>
               </div>
            </div>

            <div className="notification-item">
               <div className="notif-icon"><FaArrowDown style={{color:'red'}}/></div>
               <div className="notif-text">
                  <strong>Engro Corp: UP 3.5% today!</strong>
                  <span style={{color:'red'}}>Down 1.2%</span> - Market Open
               </div>
            </div>

             <div className="notification-item">
               <div className="notif-icon"><FaArrowUp /></div>
               <div className="notif-text">
                  <strong>Engro Corp: Added to Watchlist</strong>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;