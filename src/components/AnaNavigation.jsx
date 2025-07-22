import React, { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { AuthContext } from './AuthContext';
import AuthForm from './AuthForm';

// Alt komponentler
import NavigationBar from './NavigationBar';
import HeroSection from './HeroSection';
import WelcomeSection from './WelcomeSection';
import FooterSection from './FooterSection';
import "./Navigationn.css";
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';

const AnaNavigation = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);

    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    const handleLoginSuccess = () => {
        setShowAuthModal(false);
        navigate('/create-event');
    };

    const showMessage = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    return (
        <div className="site-wrapper">
            <NavigationBar 
                openAuthModal={openAuthModal}
                showMessage={showMessage}
            />

            {/* Hero Section - Sadece ana sayfa ve giriş yapmamış kullanıcılar için */}
            {location.pathname === '/' && !isAuthenticated && (
                <HeroSection openAuthModal={openAuthModal} />
            )}

        
            {isAuthenticated && location.pathname === '/' && (
                <WelcomeSection />
            )}

      
            <Modal 
                show={showAuthModal} 
                onHide={() => setShowAuthModal(false)} 
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Giriş / Kayıt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AuthForm onSuccess={handleLoginSuccess} />
                </Modal.Body>
            </Modal>

        
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Kapat
                    </Button>
                </Modal.Footer>
            </Modal>

         
            {location.pathname === '/' && !isAuthenticated && (
                <FooterSection />
            )}
        </div>
    );
};

export default AnaNavigation;