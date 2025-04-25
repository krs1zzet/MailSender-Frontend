import React from 'react';
import './iletisim.css';

const Iletisim = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mesajınız başarıyla gönderildi!');
  };

  return (
    <div className="iletisim-container">
      <h2>Bizimle İletişime Geçin</h2>
      <form className="iletisim-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Adınız Soyadınız" required />
        <input type="email" placeholder="E-posta Adresiniz" required />
        <textarea placeholder="Mesajınız..." rows="5" required></textarea>
        <button type="submit">Gönder</button>
      </form>

      <div className="sosyal-medya">
        <h3>Sosyal Medya</h3>
        <ul>
          <li><a href="https://www.instagram.com/ytuskylab/" target="_blank" rel="noreferrer">📸 Instagram</a></li>
          <li><a href="https://www.linkedin.com/company/skylabytu/" target="_blank" rel="noreferrer">🔗 LinkedIn</a></li>
          <li><a href="https://www.youtube.com/@ytuskylab" target="_blank" rel="noreferrer">▶️ YouTube</a></li>
          <li>📧 E-posta: <a href="mailto:skylab@ytu.edu.tr">skylab@ytu.edu.tr</a></li>
          <li>📞 Telefon: +90 212 123 45 67</li>
        </ul>
      </div>
    </div>
  );
};

export default Iletisim;
