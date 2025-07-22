// Guvenlik.js
import React from 'react';
import './Guvenlik.css';
import { FaLock, FaShieldAlt, FaUserShield, FaExclamationTriangle, FaKey } from 'react-icons/fa';

const Guvenlik = () => {
  return (
    <div className="security-page">
      <div className="security-container">
        <div className="security-content">
          <h1>Güvenlik Politikamız</h1>
          <div className="security-updated">Son Güncelleme: 23 Nisan 2025</div>

          <section className="security-section">
            <div className="section-header">
              <FaLock className="section-icon" />
              <h2>Veri Şifreleme</h2>
            </div>
            <p>SSL/TLS ile veri iletimi korunur. Hassas bilgiler şifrelenerek saklanır. 2FA kullanılır.</p>
          </section>

          <section className="security-section">
            <div className="section-header">
              <FaUserShield className="section-icon" />
              <h2>Erişim Kontrolü</h2>
            </div>
            <p>Sadece yetkili kişiler verilere erişebilir. Oturum süreleri ve kayıtlar takip edilir.</p>
          </section>

          <section className="security-section">
            <div className="section-header">
              <FaShieldAlt className="section-icon" />
              <h2>Altyapı Güvenliği</h2>
            </div>
            <p>Güvenlik duvarları, DDoS koruması, yedekleme ve güncellemeler uygulanır.</p>
          </section>

          <section className="security-section">
            <div className="section-header">
              <FaKey className="section-icon" />
              <h2>Şifre Politikamız</h2>
            </div>
            <p>Güçlü şifreler zorunludur. Hash algoritmaları kullanılır. Hesaplar korunur.</p>
          </section>

          <section className="security-section">
            <div className="section-header">
              <FaExclamationTriangle className="section-icon" />
              <h2>Güvenlik İhlali</h2>
            </div>
            <p>Hızlı müdahale edilir ve bildirim yapılır. Gerekirse iletişime geçin.</p>
          </section>

          
          <div className="security-footer">
            Bu politika düzenli olarak güncellenir.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guvenlik;
