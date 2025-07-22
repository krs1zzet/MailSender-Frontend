import React from 'react';
import './TextBlock.css';

const TextBlock = () => {
  return (
    <div className="gradient-container">
      <div className="content-wrapper">
      
        <div className="center-content">
          <h1 className="main-title">
            Doğru Yazılımla<br />
            Mükemmel İşler<br />
            Ortaya Çıkarın
          </h1>
          <p className="description">
            Bu, bir paragraf. Kendi metninizi eklemek için tıklayın. İçeriğinizi 
            eklemek ve yazı tipini değiştirmek için "Metni Düzenle"ye tıklayın 
            veya buraya çift tıklayın. Bu alanı sayfanın istediğiniz bir yerine 
            sürükleyip bırakabilirsiniz. Burası, bir hikaye anlatmak ve 
            kullanıcılarınıza kendinizi tanıtmak için harika bir yer.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default TextBlock;