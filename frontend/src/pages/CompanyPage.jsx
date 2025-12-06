import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { FaArrowUp, FaArrowDown, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import './CompanyPage.css';

const CompanyPage = () => {
  const { symbol } = useParams();
  const [company, setCompany] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: Time Span State ---
  const [timeRange, setTimeRange] = useState('30D'); // Options: 1D, 7D, 30D, ALL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailsRes = await fetch(`http://127.0.0.1:8000/company/${symbol}`);
        if (!detailsRes.ok) throw new Error("Company not found");
        const details = await detailsRes.json();
        
        setCompany(details.profile);
        setMarketData(details.latest_market);

        const graphRes = await fetch(`http://127.0.0.1:8000/company/${symbol}/graph`);
        const graph = await graphRes.json();
        setGraphData(graph);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) return <div className="loading-screen">Loading Intelligence...</div>;
  if (!company) return <div className="loading-screen">Company Not Found</div>;

  // --- FILTER DATA BASED ON TIME RANGE ---
  const getFilteredData = () => {
    if (!graphData.length) return [];
    
    let sliceNum = 0;
    switch(timeRange) {
        case '1D': 
            // For daily data, "1 Day" context usually means showing the very recent trend (last 3 points)
            // so the user can see the immediate jump to prediction.
            sliceNum = 3; 
            break;
        case '7D': 
            sliceNum = 10; // 7 days + a bit of history context
            break;
        case '30D': 
            sliceNum = 30; 
            break;
        case 'ALL':
        default:
            return graphData;
    }
    return graphData.slice(-sliceNum);
  };

  const processedData = getFilteredData();

  // Process Data for Plotly
  const dates = processedData.map(d => d.date);
  const actuals = processedData.map(d => d.last);
  const preds = processedData.map(d => d.pred_close);
  const upper = processedData.map(d => d.confidence_upper);
  const lower = processedData.map(d => d.confidence_lower);

  const priceChange = marketData.last - marketData.open;
  const percentChange = ((priceChange / marketData.open) * 100).toFixed(2);
  const isUp = priceChange >= 0;

  return (
    <div className="company-page-container">
      {/* HEADER */}
      <div className="company-header">
        <div className="title-block">
            <h1>{company.name}</h1>
            <div className="badges">
                <span className="badge sector">{company.sector}</span>
                {company.status !== "Compliant" && 
                    <span className="badge danger"><FaExclamationTriangle/> NON-COMPLIANT</span>
                }
            </div>
        </div>
        <div className="price-block">
            <h2 className={`price-display ${isUp ? 'green' : 'red'}`}>
                Rs. {marketData.last.toFixed(2)}
            </h2>
            <div className={`price-change ${isUp ? 'green' : 'red'}`}>
                {isUp ? <FaArrowUp/> : <FaArrowDown/>} {Math.abs(priceChange).toFixed(2)} ({percentChange}%)
            </div>
            <span className="timestamp">Last Updated: {marketData.date}</span>
        </div>
      </div>

      {/* CHART & SUMMARY */}
      <div className="chart-section">
        <div className="chart-container">
            <div className="chart-title-row">
                <div className="chart-title-group">
                    <h3>{company.symbol} Price Forecast</h3>
                    <span className="chart-tag">AI Confidence Interval</span>
                </div>
                
                {/* --- TIME SPAN CONTROLS --- */}
                <div className="time-controls">
                    {['1D', '7D', '30D', 'ALL'].map(range => (
                        <button 
                            key={range}
                            className={`time-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <Plot
                data={[
                    {
                        x: dates.concat([...dates].reverse()),
                        y: upper.concat([...lower].reverse()),
                        fill: 'tozerox',
                        fillcolor: 'rgba(0, 212, 255, 0.1)',
                        line: {color: 'transparent'},
                        name: 'Confidence Range',
                        type: 'scatter',
                        showlegend: false
                    },
                    {
                        x: dates,
                        y: actuals,
                        type: 'scatter',
                        mode: 'lines',
                        line: {color: '#00d4ff', width: 2},
                        name: 'Actual Price'
                    },
                    {
                        x: dates,
                        y: preds,
                        type: 'scatter',
                        mode: 'lines',
                        line: {color: '#FFD700', dash: 'dot', width: 2},
                        name: 'AI Prediction'
                    }
                ]}
                layout={{
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#8b9bb4', family: 'Segoe UI' },
                    margin: {t: 20, l: 50, r: 20, b: 50}, // Increased margins for axis labels
                    autosize: true, 
                    // --- AXIS LABELS ADDED HERE ---
                    xaxis: { 
                        title: 'Date (Time)', 
                        gridcolor: '#1f2937', 
                        showgrid: true,
                        tickfont: { size: 10 }
                    },
                    yaxis: { 
                        title: 'Stock Price (PKR)', 
                        gridcolor: '#1f2937', 
                        showgrid: true 
                    },
                    showlegend: true,
                    legend: {x: 0, y: 1, orientation: 'h', font: {size: 10}}
                }}
                style={{width: '100%', height: '100%', minHeight: '350px'}}
                useResizeHandler={true}
                config={{displayModeBar: false}}
            />
        </div>

        <div className="summary-panel">
            <div className="strength-card">
                <h3>Company Strength</h3>
                <div className="strength-row"><span>Total Assets</span><span className="val">{company.total_assets}</span></div>
                <div className="strength-row"><span>Liabilities</span><span className="val">{company.total_liabilities}</span></div>
                <div className="strength-row"><span>Loss/Share</span><span className="val">{company.loss_per_share}</span></div>
                <div className="strength-row"><span>Volumetric Growth</span><span className="val growth">{company.volumetric_growth}</span></div>
            </div>
            
            <div className="mini-prediction-table">
                <h4>Forecast (Next 3 Entries)</h4>
                <table>
                    <thead>
                        <tr>
                            <th style={{textAlign:'left'}}>Date</th>
                            <th style={{textAlign:'right'}}>Pred</th>
                        </tr>
                    </thead>
                    <tbody>
                        {graphData.slice(-3).map((d, i) => (
                           <tr key={i}>
                               <td>{d.date}</td>
                               <td className="pred-val">{d.pred_close.toFixed(2)}</td>
                           </tr> 
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
            <h4>Key Trading Data</h4>
            <div className="gauges-container">
                <div className="gauge-item">
                    <div className="circle-ring" style={{'--p': '80', '--c': '#4CAF50'}}><span>{marketData.high.toFixed(0)}</span></div>
                    <p>High</p>
                </div>
                <div className="gauge-item">
                    <div className="circle-ring" style={{'--p': '40', '--c': '#ff4d4d'}}><span>{marketData.low.toFixed(0)}</span></div>
                    <p>Low</p>
                </div>
                <div className="gauge-item">
                     <div className="vol-display">
                        <small>VOLUME</small>
                        <h3>{marketData.volume ? (marketData.volume/1000000).toFixed(2) + 'M' : 'N/A'}</h3>
                     </div>
                </div>
            </div>
        </div>

        <div className="stat-card">
            <h4>Equity Profile</h4>
            <div className="equity-grid">
                <div className="eq-box"><label>Market Cap</label><span>{company.market_cap}</span></div>
                <div className="eq-box"><label>Shares</label><span>{company.shares_outstanding}</span></div>
                <div className="eq-box"><label>Free Float</label><span>{company.free_float}</span></div>
                <div className="eq-box"><label>Status</label><span style={{color: company.status==='Compliant'?'#4CAF50':'#ff4d4d'}}>{company.status}</span></div>
            </div>
        </div>
      </div>

      <div className="downloads-bar">
        <span>Financial Reports Available For Download</span>
        <div className="dl-buttons">
            <button><FaDownload/> Annual 2024</button>
            <button><FaDownload/> Quarterly Q3 24</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;