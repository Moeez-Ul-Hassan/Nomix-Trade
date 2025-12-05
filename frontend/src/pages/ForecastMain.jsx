import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowUp, FaArrowDown, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import './ForecastMain.css';

const ForecastMain = () => {
  const [predictionPeriod, setPredictionPeriod] = useState('1 Day');
  
  // --- STATE MANAGEMENT ---
  const [stocks, setStocks] = useState([]); 
  const [indexData, setIndexData] = useState(null); // State for KSE-30 Index
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // --- DATE STATE (Defaults to Today) ---
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // --- 1. INITIAL DATA FETCHING ---
  useEffect(() => {
    // Get User ID from Local Storage
    const storedId = localStorage.getItem('user_id');
    if (storedId && storedId !== "undefined" && storedId !== "null") {
      setUserId(parseInt(storedId));
      console.log("Forecast Page: User ID found =", storedId);
    } else {
      console.log("Forecast Page: No User ID found. User is guest.");
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // A. Fetch Stocks
        const stockResponse = await fetch(`http://127.0.0.1:8000/stocks?target_date=${selectedDate}`);
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          setStocks(stockData);
        } else {
          console.error("Failed to load stocks");
        }

        // B. Fetch KSE-30 Index Data
        // Matches the /index_data endpoint in your main.py
        try {
          const indexResponse = await fetch(`http://127.0.0.1:8000/index_data?target_date=${selectedDate}`);
          if (indexResponse.ok) {
            const data = await indexResponse.json();
            setIndexData(data);
          } else {
            setIndexData(null); // Hide box if no data found for date
          }
        } catch (err) {
          console.error("Index fetch error:", err);
          setIndexData(null);
        }

        // C. Fetch Favorites
        if (storedId && storedId !== "undefined") {
          const favResponse = await fetch(`http://127.0.0.1:8000/favorites/${storedId}`);
          if (favResponse.ok) {
            const favData = await favResponse.json();
            setFavorites(favData); 
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // --- 2. HANDLE HEART CLICK ---
  const toggleFavorite = async (symbol) => {
    if (!userId) {
      alert("You need to Log In to save favorites!");
      return;
    }

    const isFav = favorites.includes(symbol);
    
    // Optimistic UI Update
    if (isFav) {
      setFavorites(favorites.filter(s => s !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }

    try {
      const endpoint = isFav ? '/favorites/remove' : '/favorites/add';
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, stock_symbol: symbol })
      });

      if (!response.ok) {
        setFavorites(favorites); // Revert if failed
        alert("Failed to update favorite. Please check your connection.");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getPrediction = (stock) => {
    switch (predictionPeriod) {
      case '7 Days': return stock.pred7;
      case '30 Days': return stock.pred30;
      case '1 Day': default: return stock.pred1;
    }
  };

  return (
    <div className="forecast-container">
      {/* HEADER */}
      <div className="market-header">
        <div className="header-left">
          <h1>MARKET FORECAST</h1>
          <div className="header-meta">
             <span className="date-badge">Live PSX Data</span>
             
             {/* DATE PICKER */}
             <div className="date-picker-container">
               <FaCalendarAlt style={{color:'#888'}}/>
               <input 
                 type="date" 
                 className="header-date-input"
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
               />
             </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="forecast-content">
        
        {/* LEFT COLUMN: INDEX & STOCK TABLE */}
        <div className="main-section-wrapper">
          
          {/* --- KSE-30 INDEX SUMMARY BOX --- */}
          {indexData && (
            <div className="index-summary-card">
              <div className="index-header-row">
                <div className="index-title-group">
                  <div className="index-icon-box"><FaChartLine /></div>
                  <div>
                    <h3>KSE-30 Index</h3>
                    <span className="index-subtitle">Karachi Stock Exchange</span>
                  </div>
                </div>
                
                {/* Calculate Change (Current - Open) */}
                <div className={`index-change-badge ${indexData.current >= indexData.open ? 'up' : 'down'}`}>
                  {indexData.current >= indexData.open ? <FaArrowUp/> : <FaArrowDown/>}
                  <span style={{marginLeft:'5px'}}>
                    {Math.abs(indexData.current - indexData.open).toFixed(2)} pts
                  </span>
                </div>
              </div>

              <div className="index-stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Current</span>
                  <span className="stat-value main-val">{indexData.current.toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Day High</span>
                  <span className="stat-value green-val">{indexData.high.toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Day Low</span>
                  <span className="stat-value red-val">{indexData.low.toLocaleString()}</span>
                </div>
                {/* Prediction Box Highlight */}
                <div className="stat-box pred-box">
                  <span className="stat-label">Pred Close</span>
                  <span className="stat-value gold-val">{indexData.pred_close.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* MAIN STOCKS TABLE */}
          <div className="main-card">
            <div className="card-header">
              <h2 className="card-title">Stocks Predictions</h2>
              <select 
                className="period-select"
                value={predictionPeriod}
                onChange={(e) => setPredictionPeriod(e.target.value)}
              >
                <option value="1 Day">Next Day</option>
                <option value="7 Days">Next 7 Days</option>
                <option value="30 Days">Next 30 Days</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-state">
                <h2>Loading Market Data...</h2>
              </div>
            ) : stocks.length === 0 ? (
              <div className="empty-state">
                <h3>No Data Found for {selectedDate}</h3>
                <p>Please run the Seed Script or select a different date.</p>
              </div>
            ) : (
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Last (PKR)</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Pred Close ({predictionPeriod})</th>
                    <th>Add Favourite</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => {
                    const prediction = getPrediction(stock);
                    const isBullish = prediction > stock.last;
                    const isFav = favorites.includes(stock.symbol);
                    
                    return (
                      <tr key={stock.id}>
                        <td className="stock-symbol">
                          {stock.symbol}
                          <span className="company-name-sub">{stock.name}</span>
                        </td>
                        <td>{stock.last.toFixed(2)}</td>
                        <td>{stock.open.toFixed(2)}</td>
                        <td>{stock.high.toFixed(2)}</td>
                        <td>{stock.low.toFixed(2)}</td>
                        
                        {/* --- PREDICTION CELL (Fixed Alignment) --- */}
                        <td style={{ color: isBullish ? '#4CAF50' : '#ff4d4d' }}>
                          <div className="pred-cell-wrapper">
                            {prediction.toFixed(2)}
                            {isBullish ? <FaArrowUp className="trend-icon"/> : <FaArrowDown className="trend-icon"/>}
                          </div>
                        </td>

                        {/* --- FAVORITE BUTTON CELL --- */}
                        <td style={{textAlign: 'center'}}>
                          <button 
                            className={`fav-btn ${isFav ? 'active' : ''}`}
                            onClick={() => toggleFavorite(stock.symbol)}
                            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            {isFav ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SIDEBAR (Visual Only) */}
        <div className="sidebar">
          <div className="side-card">
            <h3 style={{marginBottom:'10px', color:'#ccc'}}>Market Sentiment</h3>
            <div className="radar-placeholder">
              <div className="radar-inner"></div>
            </div>
            <p style={{fontSize:'0.8rem', color:'#888'}}>Deep Learning Sentiment Analysis of Market News.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Nomix Trade</h4>
            <p>The Future of PSX Trading.<br/>Powered by AI & Deep Learning.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/market">Market Forecast</Link>
            <Link to="/research">Research</Link>
          </div>
          <div className="footer-col">
             <h4>Contact</h4>
             <a href="#">support@nomixtrade.com</a>
             <a href="#">Lahore, Pakistan</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 Nomix Trade. Final Year Project. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default ForecastMain;