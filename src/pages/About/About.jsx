import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Biz Kimiz?</h1>
          <p>Email Management System; sade, güvenli ve etkili toplu e-posta gönderimi için geliştirilen modern bir çözümdür. Amacımız tamamen hayat kolaylaştıran bir mail gönderme sitesi yapmaktır.</p>
        </div>
      </section>

      <div className="about-container">
        <div className="about-card">
          <h2>Misyonumuz</h2>
          <p>İletişimi kolaylaştırmak için herkesin kullanabileceği güvenli ve esnek bir e-posta sistemi sunmak.</p>
        </div>
        <div className="about-card">
          <h2>Vizyonumuz</h2>
          <p>Dijital iletişimde öncü olarak global çapta en çok tercih edilen platform olmak.</p>
        </div>

        <h2>Ekibimiz</h2>
        <div className="team-section">
          <div className="team-member">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" className="team-avatar" />
            <div className="team-name">Zeynep Kaya</div>
            <div className="team-position">Frontend Developer</div>
          </div>
          <div className="team-member">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" className="team-avatar" />
            <div className="team-name">Emir Karaca</div>
            <div className="team-position">Backend Developer</div>
          </div>
        </div>

        

       
      </div>
    </div>
  );
};

export default About;
