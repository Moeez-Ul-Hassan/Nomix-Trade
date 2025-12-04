const Research = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Market Research & Learning</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h3>Fundamental Analysis</h3>
          <p>Understanding company financial health, balance sheets, and earnings.</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h3>Technical Analysis</h3>
          <p>Analyzing price trends using indicators like RSI, MACD, and Moving Averages.</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h3>Sentimental Analysis</h3>
          <p>AI-driven analysis of news and social media to gauge market mood.</p>
        </div>
      </div>
    </div>
  );
};

export default Research;