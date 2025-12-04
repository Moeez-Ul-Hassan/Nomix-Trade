import React, { useState, useEffect } from 'react';
import { FaBell, FaCog, FaHistory, FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [favStockData, setFavStockData] = useState([]);
  
  // Notification States
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);

  // --- GET USER INFO FROM LOCAL STORAGE ---
  const userId = localStorage.getItem('user_id');
  const userName = localStorage.getItem('user');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch All Stocks (For Notifications & Card Data)
        const stocksRes = await fetch('http://127.0.0.1:8000/stocks');
        const stocksData = await stocksRes.json();
        setAllStocks(stocksData);

        // 2. Calculate Notifications (Gainers/Losers)
        const stocksWithChange = stocksData.map(s => ({
            ...s,
            changePercent: ((s.last - s.open) / s.open) * 100
        }));

        stocksWithChange.sort((a, b) => b.changePercent - a.changePercent);
        
        setTopGainers(stocksWithChange.slice(0, 3)); // Top 3
        setTopLosers(stocksWithChange.slice(-2).reverse()); // Bottom 2

        // 3. Fetch User Favorites (Only if logged in)
        if (userId) {
          const favRes = await fetch(`http://127.0.0.1:8000/favorites/${userId}`);
          if (favRes.ok) {
            const favSymbols = await favRes.json();
            setFavorites(favSymbols);

            // Filter full stock data for just the favorites
            const userFavStocks = stocksData.filter(s => favSymbols.includes(s.symbol));
            setFavStockData(userFavStocks);
          }
        }

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Handle Remove Favorite
  const removeStock = async (symbol) => {
    // Optimistic UI Update
    setFavStockData(favStockData.filter(s => s.symbol !== symbol));
    
    try {
      await fetch('http://127.0.0.1:8000/favorites/remove', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id: userId, stock_symbol: symbol })
      });
    } catch (err) {
      alert("Failed to update database");
    }
  };

  return (
    <div className="dashboard-container">
      {/* DYNAMIC WELCOME MESSAGE */}
      <h1 className="page-title">Welcome, {userName || "Trader"}</h1>

      <div className="dashboard-layout">
        
        {/* --- Left Side: Main Content --- */}
        <div className="main-content">
          <h3 className="section-header">My Liked PSX Companies</h3>
          
          {favStockData.length === 0 ? (
             <div className="empty-state">
                <p>No favorites yet. Go to <a href="/market" style={{color:'#4CAF50'}}>Forecast</a> to add some!</p>
             </div>
          ) : (
            <div className="cards-grid-dashboard">
              {favStockData.map((stock) => (
                <div className="stock-card" key={stock.symbol}>
                  <div className="card-header">
                    <h4>{stock.name}</h4>
                    <button className="btn-deselect" onClick={() => removeStock(stock.symbol)}>
                        <FaTrash /> 
                    </button>
                  </div>
                  
                  {/* Stock Data */}
                  <div className="stock-info">
                    <div className="price-box">
                        <span className="label">Current</span>
                        <span className="value">Rs {stock.last}</span>
                    </div>
                    <div className="price-box">
                        <span className="label">Prediction (1D)</span>
                        <span className="value" style={{color: '#FFD700'}}>Rs {stock.pred1}</span>
                    </div>
                  </div>

                  {/* Mini Graph Visual */}
                  <div className="mini-chart-container">
                    <svg width="100%" height="40" viewBox="0 0 100 40">
                       <polyline 
                          points="0,35 30,30 60,15 100,5" 
                          fill="none" 
                          stroke={stock.pred1 > stock.last ? "#4CAF50" : "#F44336"} 
                          strokeWidth="3" 
                       />
                    </svg>
                  </div>
                  <div style={{marginTop:'10px', fontSize:'0.8rem', color:'#666'}}>
                      Trend: <span style={{color: stock.pred1 > stock.last ? "#4CAF50" : "#F44336", fontWeight:'bold'}}>
                          {stock.pred1 > stock.last ? "Bullish" : "Bearish"}
                      </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="section-header" style={{marginTop:'40px'}}>Quick Actions</h3>
          <div className="search-bar-container">
            <input type="text" placeholder="Search Markets..." className="search-input" />
            <button className="add-btn">Search</button>
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

          {/* AI Generated Notifications */}
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span>Market Movers</span>
            </div>
            <div style={{marginBottom:'15px', color:'#2196F3', fontSize:'0.9rem'}}>Top AI Insights</div>

            {/* TOP 3 GAINERS */}
            {topGainers.map((stock) => (
                <div className="notification-item" key={stock.symbol}>
                    <div className="notif-icon"><FaArrowUp /></div>
                    <div className="notif-text">
                        <strong>{stock.symbol}: UP {stock.changePercent.toFixed(2)}%</strong>
                        <div className="time">Top Gainer Today</div>
                    </div>
                </div>
            ))}

            <hr style={{borderColor:'rgba(255,255,255,0.1)', margin:'10px 0'}}/>

            {/* TOP 2 LOSERS */}
            {topLosers.map((stock) => (
                <div className="notification-item" key={stock.symbol}>
                    <div className="notif-icon"><FaArrowDown style={{color:'red'}}/></div>
                    <div className="notif-text">
                        <strong>{stock.symbol}: DOWN {Math.abs(stock.changePercent).toFixed(2)}%</strong>
                        <div className="time">Major Drop</div>
                    </div>
                </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;