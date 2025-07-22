import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer/Footer';
import AuthForm from '../../components/AuthForm';


import { Modal } from 'react-bootstrap';

const Navigation = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  return (
    <>
   
      <HeroSection openAuthModal={openAuthModal} />
      <Footer />

      <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Giriş / Kayıt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AuthForm />
        </Modal.Body>
      </Modal>
    </>
  );
};


export default Navigation;
