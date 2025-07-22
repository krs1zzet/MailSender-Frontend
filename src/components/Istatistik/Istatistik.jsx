import React from 'react';
import "./Istatistik.css"
import maill from "../../Assets/t.png";

const Istatistik = ({ openAuthModal }) => {
  return (
    <div className="istatistik-container">
      <div className="hero-section">
        
        <div className="hero-content-container">
          <div className="hero-content">
            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <span className="feature-title">Hız ve</span>
                  <span className="feature-subtitle">Güvenlik</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    <path d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <span className="feature-title">Esneklik ve</span>
                  <span className="feature-subtitle">Ölçekleme</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="feature-text">
                  <span className="feature-title">Daha İyi</span>

                  <span className="feature-subtitle">İşbirliği</span>
                </div>
              </div>
              <button className="create-button" onClick={openAuthModal}><br></br>
                <span className="create-button-text">OLUŞTURMAYA BAŞLAYIN+</span>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  
                </svg>
              </button>
            </div>
          
           
          </div>
        </div>
        

        <div className="hero-image-container">
          <div 
            className="hero-image"
            style={{
              backgroundImage: `url(${maill})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Istatistik;