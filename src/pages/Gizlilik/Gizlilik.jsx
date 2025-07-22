// Gizlilik.js
import React from 'react';
import './Gizlilik.css';
import { FaUserSecret, FaCookie, FaShieldAlt } from 'react-icons/fa';

const Gizlilik = () => {
  return (
    <div className="gizlilik">
      <h1>Gizlilik Politikası</h1>
      <p className="guncelleme">Son Güncelleme: 23 Nisan 2025</p>

      <section>
        <h2><FaUserSecret /> Hangi Bilgileri Topluyoruz?</h2>
        <p>
          Sitemizi kullandığınızda bazı bilgilerinizi topluyoruz. Bunlar genellikle adınız, e-posta adresiniz gibi sizin 
          bizimle iletişime geçtiğinizde verdiğiniz bilgiler olabilir. Ayrıca IP adresiniz, kullandığınız tarayıcı ve cihaz 
          bilgileri de otomatik olarak kaydedilebilir.
        </p>
      </section>

      <section>
        <h2><FaCookie /> Çerezler Nedir ve Neden Kullanıyoruz?</h2>
        <p>
          Sitemiz daha iyi çalışsın ve size özel bir deneyim sunabilsin diye çerez (cookie) kullanıyoruz. Çerezler, 
          ziyaret ettiğiniz sayfaları hatırlamamıza ve size daha uygun içerikler sunmamıza yardımcı olur. 
          Tarayıcı ayarlarınızdan çerezleri kapatabilirsiniz, ama bazı özellikler düzgün çalışmayabilir.
        </p>
      </section>

      <section>
        <h2><FaShieldAlt /> Verilerinizle İlgili Haklarınız</h2>
        <p>
          Kişisel Verilerin Korunması Kanunu (KVKK) sayesinde bazı haklara sahipsiniz. Örneğin, hangi verilerinizin 
          toplandığını öğrenebilir, düzeltilmesini veya silinmesini isteyebilirsiniz. Bu konuda bize her zaman ulaşabilirsiniz.
        </p>
      </section>

      <section>
        <h2>İletişim Bilgileri</h2>
        <p>
          Gizlilikle ilgili her türlü soru ve talepleriniz için bizimle şu adresten iletişime geçebilirsiniz:
        </p>
        <p><strong>E-posta:</strong> privacy@ytuskylab.com</p>
      </section>
    </div>
  );
};

export default Gizlilik;
