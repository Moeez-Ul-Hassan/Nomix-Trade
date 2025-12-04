import { Link } from 'react-router-dom';

const ForecastMain = () => {
  // Dummy Data for KSE-30
  const companies = [
    { id: 'OGDC', name: 'Oil & Gas Development', price: 120.5, sentiment: 'Positive' },
    { id: 'TRG', name: 'TRG Pakistan', price: 85.2, sentiment: 'Neutral' },
    { id: 'LUCK', name: 'Lucky Cement', price: 450.0, sentiment: 'Negative' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 KSE-30 Index Forecast</h2>
      <div style={{ background: '#eee', padding: '15px', marginBottom: '20px' }}>
        <h3>Market Sentiment: Bullish 🐂</h3>
        <p>Current Index: 45,230 | Prediction: Up by 2%</p>
      </div>

      <h3>Top Companies</h3>
      <ul>
        {companies.map((company) => (
          <li key={company.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', padding: '10px' }}>
            <strong>{company.name} ({company.id})</strong> - Rs. {company.price} 
            <br />
            Sentiment: {company.sentiment}
            <br />
            <Link to={`/company/${company.id}`}>
                <button>View Analysis</button>
            </Link> 
            <button style={{ marginLeft: '10px' }}>+ Watchlist</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForecastMain;