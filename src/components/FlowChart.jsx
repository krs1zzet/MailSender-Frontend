import React from "react";
import "./FlowChart.css";
import { FaUserAlt, FaPlusCircle, FaCheck, FaEnvelopeOpenText, FaUsers, FaPaperPlane } from "react-icons/fa";

const FlowChart = () => {
  const flowSteps = [
    {
      icon: <FaUserAlt />,
      title: "Giriş Yapın ya da Üye Olun",
      content: "Siteyi kullanabilmek için hesabınıza giriş yapın veya yeni bir hesap oluşturun.",
    },
    {
      icon: <FaPlusCircle />,
      title: "Yeni Etkinlik Oluşturun",
      content: 'Ardından, "Create Event" butonuna tıklayarak yeni bir etkinlik oluşturun.',
    },
    {
      icon: <FaCheck />,
      title: "Etkinlik Seçimi Yapın",
      content: 'Oluşturduğunuz etkinliği seçmek için "Select Event" seçeneğini kullanın.',
    },
    {
      icon: <FaEnvelopeOpenText />,
      title: "Mail Şablonları Oluşturun",
      content: "Yeni sayfada, etkinliğiniz için özel mail şablonları oluşturun.",
    },
    {
      icon: <FaUsers />,
      title: "Gönderen ve Alıcılar Ekleyin",
      content: '"Senders" ve "Receivers" kısmını ekleyin. Gmail App Şifrenizi oluşturmayı unutmayın.',
    },
    {
      icon: <FaPaperPlane />,
      title: "Gönderin",
      content: 'Etkinlik bilgilerini içeren maili göndermek için "Send" butonuna tıklayın.',
    },
  ];

  return (
    <>
      <div className="yazi">
        <h1>NASIL MAİL GÖNDEREBİLİRİZ?</h1>
      </div>
      <div className="flow-simple-container">
        {flowSteps.map((step, index) => (
          <div key={index} className="flow-simple-box">
            <div className="flow-title">
              <span className="step-icon">{step.icon}</span>
              <span className="step-title-text">{step.title}</span>
            </div>
            <p>{step.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default FlowChart;
