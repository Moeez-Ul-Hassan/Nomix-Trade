import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaUserTie } from 'react-icons/fa';
import stockVideo from '../assets/videos/stocks.mp4'; // Reusing the video or you can change it
import './Research.css';

const Research = () => {

  // --- ANIMATION OBSERVER (Same as Home Page) ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll('.reveal-text, .reveal-image');
    hiddenElements.forEach((el) => observer.observe(el));
    
    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="research-container">
      
      {/* 1. BACKGROUND ANIMATION */}
      <div className="background-animation">
        <div className="candle-scroll"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="hero-section research-hero">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={stockVideo} type="video/mp4" />
          </video>
        </div>
        <div className="video-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Our Methodology</h1>
          <p className="hero-slogan">
            Unveiling the "Nomix" approach. How we combine Sentiment, Technical, and Fundamental data to predict the future of PSX.
          </p>
        </div>
      </section>

      {/* 3. ANALYSIS SECTION 1: SENTIMENTAL */}
      <section className="section-block split-section">
        {/* Image Slides in from Left */}
        <div className="split-image-container reveal-image">
          {/* Placeholder Image - Replace with your Sentimental Analysis Chart/Image */}
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
            alt="Sentiment Analysis" 
            className="split-image" 
          />
        </div>
        
        {/* Text Fades in */}
        <div className="split-content reveal-text">
          <span className="section-subtitle">The Voice of the Market</span>
          <h2 className="section-title">Sentiment Analysis</h2>
          <p className="text-content">
            Markets are driven by human emotion. We scrape thousands of news headlines, tweets, and financial reports daily. 
          </p>
          <p className="text-content">
            Using Natural Language Processing (NLP) models like BERT and FinBERT, we quantify this text into a "Sentiment Score," allowing us to gauge market fear or greed before it reflects in the price.
          </p>
        </div>
      </section>

      {/* 4. ANALYSIS SECTION 2: TECHNICAL (REVERSE LAYOUT) */}
      <section className="section-block split-section reverse">
        {/* Image Slides in from Right */}
        <div className="split-image-container reveal-image">
           {/* Placeholder Image - Replace with Technical Charts */}
          <img 
            src="https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80" 
            alt="Technical Analysis" 
            className="split-image" 
          />
        </div>
        
        <div className="split-content reveal-text">
          <span className="section-subtitle">The Patterns of Price</span>
          <h2 className="section-title">Technical Analysis</h2>
          <p className="text-content">
            History often repeats itself. Our Deep Learning models (LSTM & GRU) analyze historical OHLC data, moving averages, and RSI indicators.
          </p>
          <p className="text-content">
            By recognizing complex patterns in price movements that are invisible to the naked eye, we forecast short-term volatility and trend directions.
          </p>
        </div>
      </section>

      {/* 5. ANALYSIS SECTION 3: FUNDAMENTAL */}
      <section className="section-block split-section">
        <div className="split-image-container reveal-image">
           {/* Placeholder Image - Replace with Fundamental/Balance Sheet Image */}
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" 
            alt="Fundamental Analysis" 
            className="split-image" 
          />
        </div>
        
        <div className="split-content reveal-text">
          <span className="section-subtitle">The Core Value</span>
          <h2 className="section-title">Fundamental Analysis</h2>
          <p className="text-content">
            Price is what you pay; value is what you get. We integrate quarterly financial results, P/E ratios, and dividend yields.
          </p>
          <p className="text-content">
            This layer ensures our predictions aren't just based on hype, but anchored in the financial health and stability of the company.
          </p>
        </div>
      </section>

      {/* 6. TEAM SECTION (RESEARCHERS) */}
      <section className="section-block" style={{textAlign:'center', marginTop:'50px'}}>
        <div className="reveal-text">
            <span className="section-subtitle">The Minds Behind Nomix</span>
            <h2 className="section-title">Meet the Researchers</h2>
        </div>

        <div className="team-grid reveal-image">
          
          {/* Team Member 1 */}
          <div className="team-card">
            <div className="team-img-wrapper">
               {/* Replace src with Moeez's photo */}
               <FaUserTie className="default-avatar" />
            </div>
            <h3 className="team-name">Moeez Ul Hassan</h3>
            <span className="team-role">AI & Backend Lead</span>
            <div className="team-socials">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="team-card">
            <div className="team-img-wrapper">
               <FaUserTie className="default-avatar" />
            </div>
            <h3 className="team-name">Talha Almas</h3>
            <span className="team-role">Data Scientist</span>
            <div className="team-socials">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="team-card">
            <div className="team-img-wrapper">
               <FaUserTie className="default-avatar" />
            </div>
            <h3 className="team-name">Unzela Noor</h3>
            <span className="team-role">Frontend & UI/UX</span>
            <div className="team-socials">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
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

export default Research;