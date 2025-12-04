import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaUserPlus, FaBrain } from 'react-icons/fa'; 
import stockVideo from '../assets/videos/stocks.mp4'; 

// --- LOGO IMPORTS ---
import ENGRO from '../assets/images/logos/engro.png'; 
import LUCK from '../assets/images/logos/lucky.png';
import OGDC from '../assets/images/logos/ogd.png';
import MCB from '../assets/images/logos/mcb.svg';
import HBL from '../assets/images/logos/hbl.png';
import SYS from '../assets/images/logos/Systems.svg';
import FFC from '../assets/images/logos/fauji.png';
import MEBL from '../assets/images/logos/meezan.png';
import MARI from '../assets/images/logos/mari.png';
import PPL from '../assets/images/logos/ppl.webp';
import EFERT from '../assets/images/logos/engro_h.png';
import POL from '../assets/images/logos/pol.png';
import PEL from '../assets/images/logos/pel.png'; 
import MLCF from '../assets/images/logos/mcb.svg'; 
import SEARL from '../assets/images/logos/sn.png';
import ATRL from '../assets/images/logos/ARL.png';
import NRL from '../assets/images/logos/NBP.jpg'; 
import PAEL from '../assets/images/logos/pel.png';
import SSGC from '../assets/images/logos/Systems.svg'; 

import './LandingPage.css';

const LandingPage = () => {
  // Map company symbols to their imported image path
  const companyLogos = [
    { symbol: "ENGRO", logo: ENGRO },
    { symbol: "LUCK", logo: LUCK },
    { symbol: "OGDC", logo: OGDC },
    { symbol: "MCB", logo: MCB },
    { symbol: "HBL", logo: HBL },
    { symbol: "SYS", logo: SYS },
    { symbol: "FFC", logo: FFC },
    { symbol: "MEBL", logo: MEBL },
    { symbol: "MARI", logo: MARI },
    { symbol: "PPL", logo: PPL },
    { symbol: "EFERT", logo: EFERT },
    { symbol: "POL", logo: POL },
    { symbol: "PIOC", logo: PEL }, 
    { symbol: "MLCF", logo: MLCF },
    { symbol: "SEARL", logo: SEARL },
    { symbol: "ATRL", logo: ATRL },
    { symbol: "NRL", logo: NRL },
    { symbol: "PAEL", logo: PAEL },
    { symbol: "SSGC", logo: SSGC },
  ];

  // Duplicate for infinite scroll
  const duplicatedCompanies = [...companyLogos, ...companyLogos];

  // --- ANIMATION OBSERVER LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    // Target generic reveal elements AND the special heading container
    const hiddenElements = document.querySelectorAll('.reveal-text, .reveal-image, .animated-heading-container');
    hiddenElements.forEach((el) => observer.observe(el));
    
    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="landing-container">
      
      {/* 1. BACKGROUND ANIMATION */}
      <div className="background-animation">
        <div className="candle-scroll"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={stockVideo} type="video/mp4" />
          </video>
        </div>
        <div className="video-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Nomix Trade</h1>
          <p className="hero-slogan">
            Master the PSX with AI-Powered Insights. From breaking news to bullish numbers, we tell the complete market story.
          </p>
          <Link to="/signup" className="cta-button">Start Your Journey</Link>
        </div>
      </section>

      {/* 3. SPLIT SECTION 1: OUR MOTIVATION */}
      <section className="section-block split-section">
        <div className="split-image-container reveal-image">
          <img src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80" alt="Market Analysis" className="split-image" />
        </div>
        
        <div className="split-content reveal-text">
          <span className="section-subtitle">Our Motivation</span>
          <h2 className="section-title">Bridging the Gap Between News & Numbers.</h2>
          <p className="text-content">
            The Pakistan Stock Exchange is driven by more than just charts. Political stability, economic reports, and breaking news create volatility that traditional tools miss.
          </p>
          <p className="text-content">
            Nomix Trade was born to quantify this "Human Sentiment." We don't just show you what happened; our AI analyzes thousands of data points to predict what's likely to happen next.
          </p>
        </div>
      </section>

      {/* 4. SPLIT SECTION 2: WHY CHOOSE US */}
      <section className="section-block split-section reverse">
        <div className="split-image-container reveal-image">
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" alt="AI Technology" className="split-image" />
        </div>
        
        <div className="split-content reveal-text">
          <span className="section-subtitle">Why Choose Us</span>
          <h2 className="section-title">Deep Learning Meets Financial Expertise.</h2>
          <p className="text-content">
            Unlike basic technical indicators, our models are trained on years of PSX historical data and news archives. 
          </p>
          <p className="text-content">
            We provide a clear, actionable "Sentiment Score" and directional prediction for the top 30 companies, helping you cut through the noise and trade with confidence.
          </p>
        </div>
      </section>

      {/* 5. CARDS SECTION: SERVICES (WITH SPECIAL ANIMATION) */}
      <section className="section-block" style={{textAlign:'center'}}>
        <div className="reveal-text">
            <span className="section-subtitle">Our Services</span>
            
            {/* --- SPECIAL ANIMATED HEADING --- */}
            <div className="animated-heading-container">
              <span className="animated-word">Everything</span>
              <span className="animated-word">You</span>
              <span className="animated-word">Need</span>
              <span className="animated-word">to</span>
              <span className="animated-word">Succeed.</span>
            </div>
            {/* -------------------------------- */}
        </div>
        
        <div className="cards-grid reveal-image">
          {/* Card 1 */}
          <div className="feature-card">
            <FaChartLine className="card-icon" />
            <h3 className="card-title">Explore Market</h3>
            <p className="text-content">
              View real-time data and historical trends for KSE-100 giants in an intuitive dashboard.
            </p>
          </div>
           {/* Card 2 */}
           <div className="feature-card">
            <FaUserPlus className="card-icon" />
            <h3 className="card-title">Make Account</h3>
            <p className="text-content">
              Create your personalized profile to save favorite stocks and get custom alerts.
            </p>
          </div>
           {/* Card 3 */}
           <div className="feature-card">
            <FaBrain className="card-icon" />
            <h3 className="card-title">AI Prediction</h3>
            <p className="text-content">
              Access our proprietary Deep Learning forecasts and sentiment analysis reports.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LOGO CAROUSEL SECTION */}
    <section className="section-block" style={{maxWidth: '100%', padding: '80px 0'}}>
      <div className="section-block reveal-text" style={{textAlign:'center', paddingBottom:'30px'}}>
        <span className="section-subtitle">Trusted Giants</span>
        <h2 className="section-title">Tracking the PSX Top 30</h2>
      </div>
      
      <div className="logo-carousel-container reveal-image">
        <div className="logo-track">
          {duplicatedCompanies.map((company, index) => (
            <div key={index} className="logo-item">
              <img 
                src={company.logo} 
                alt={`${company.symbol} Logo`} 
                className="company-logo"
              />
            </div>
          ))}
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

export default LandingPage;