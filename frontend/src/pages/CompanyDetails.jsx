import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';

const CompanyDetails = () => {
  const { id } = useParams(); // Gets the company ID from URL (e.g., OGDC)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Analysis for: {id}</h2>
      
      {/* Placeholder for Plotly Chart */}
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h3>Price Forecast Chart</h3>
        <Plot
          data={[
            {
              x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              y: [100, 102, 98, 105, 110],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'green'},
            },
          ]}
          layout={ {width: 600, height: 300, title: 'Predicted vs Actual'} }
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Equity Profile</h3>
        <p>Sector: Technology | P/E Ratio: 5.4 | Dividend Yield: 8%</p>
      </div>
    </div>
  );
};

export default CompanyDetails;