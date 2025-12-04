import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './ForecastMain.css';

const ForecastMain = () => {
  const [predictionPeriod, setPredictionPeriod] = useState('1 Day');
  
  // State for Data
  const [stocks, setStocks] = useState([]); 
  const [favorites, setFavorites] = useState([]); // Stores symbols like ["ENGRO", "SYS"]
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // 1. INITIAL DATA FETCHING
  useEffect(() => {
    // Get logged-in user ID
    const storedId = localStorage.getItem('user_id');
    if (storedId) setUserId(parseInt(storedId));

    const fetchData = async () => {
      try {
        // A. Fetch All Stocks
        const stockResponse = await fetch('http://127.0.0.1:8000/stocks');
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          setStocks(stockData);
        }

        // B. Fetch User's Existing Favorites (Only if logged in)
        if (storedId) {
          const favResponse = await fetch(`http://127.0.0.1:8000/favorites/${storedId}`);
          if (favResponse.ok) {
            const favData = await favResponse.json();
            setFavorites(favData); // Expecting list of symbols e.g. ["ENGRO", "LUCK"]
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. HANDLE HEART CLICK (API CONNECTION)
  const toggleFavorite = async (symbol) => {
    // Security Check
    if (!userId) {
      alert("You need to Log In to save favorites!");
      return;
    }

    const isFav = favorites.includes(symbol);
    
    // Optimistic UI Update (Update screen instantly)
    if (isFav) {
      setFavorites(favorites.filter(s => s !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }

    try {
      // Determine URL based on action
      const endpoint = isFav ? '/favorites/remove' : '/favorites/add';
      
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          stock_symbol: symbol 
        })
      });

      if (!response.ok) {
        // Revert UI if server fails
        alert("Failed to update favorite. Please try again.");
        // (Optional: fetch favorites again here to reset state)
      }

    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // Helper for Prediction Dropdown
  const getPrediction = (stock) => {
    switch (predictionPeriod) {
      case '7 Days': return stock.pred7;
      case '30 Days': return stock.pred30;
      case '1 Day': 
      default: return stock.pred1;
    }
  };

  return (
    <div className="forecast-container">
      {/* HEADER */}
      <div className="market-header">
        <div className="header-left">
          <h1>PSE-30 INDEX</h1>
          <span className="date-badge">Live Market Data</span>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="forecast-content">
        
        {/* MAIN TABLE */}
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
            <div style={{textAlign:'center', padding:'50px', color:'#888'}}>
              <h2>Loading Market Data...</h2>
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
                      
                      <td className="pred-value" style={{ color: isBullish ? '#4CAF50' : '#ff4d4d' }}>
                        {prediction.toFixed(2)}
                        {isBullish ? <FaArrowUp style={{fontSize:'10px', marginLeft:'5px'}}/> : <FaArrowDown style={{fontSize:'10px', marginLeft:'5px'}}/>}
                      </td>

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

        {/* SIDEBAR (Visual Only) */}
        <div className="sidebar">
          <div className="side-card">
            <h3 style={{marginBottom:'10px', color:'#ccc'}}>Market Summary</h3>
            <div className="radar-placeholder">
              <div className="radar-inner"></div>
            </div>
            <p style={{fontSize:'0.8rem', color:'#888'}}>This is the overall trend of PSE-30 Index</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Nomix Trade</h4>
            <p style={{color:'#666', lineHeight:'1.6'}}>
              The Future of PSX Trading.<br/>
              Powered by AI & Deep Learning.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/market">Market Forecast</Link>
            <Link to="/research">Research</Link>
            <Link to="/signup">Join Us</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#">support@nomixtrade.com</a>
            <a href="#">Lahore, Pakistan</a>
          </div>
          <div className="footer-col">
            <h4>Socials</h4>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
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