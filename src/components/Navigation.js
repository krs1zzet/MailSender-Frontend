import React, { useState, useEffect, useContext, useCallback } from "react";
import { Navbar, Container, Nav, Modal, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from './AuthContext'; 
import AuthForm from '../AuthForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import { FaInstagram, FaTwitter, FaYoutube, FaUser, FaSignOutAlt, FaCog, FaEnvelope, FaArrowRight } from "react-icons/fa";

import mail1 from './mail1.jpg'; 
import mail2 from './mail2.jpg';
import mail3 from './mail3.jpg';
import mail4 from './mail4.jpg';
import okkk from './okkk.png';

const Navigation = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, user, refreshUserInfo } = useContext(AuthContext);

    const images = [mail1, mail2, mail3, mail4];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Security enhancement: Use useCallback for functions used in useEffect
    const refreshUserData = useCallback(() => {
        if (isAuthenticated) {
            refreshUserInfo();
        }
    }, [isAuthenticated, refreshUserInfo]);
    
    // User data check and refresh effect
    useEffect(() => {
        refreshUserData();
    }, [refreshUserData]);

    // Auto rotate slider every 4 seconds (increased from 3 for better user experience)
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 4000);
        
        // Clean up interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Auth form modal show
    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    // Security enhancement: More robust logout handling
    const handleLogout = async () => {
        try {
            // Call the logout function from AuthContext first
            await logout();
            
            // Show success message
            setModalTitle("Çıkış Yapıldı");
            setModalMessage("Hesabınızdan başarıyla çıkış yaptınız.");
            setShowModal(true);
            
            // Security enhancement: Use navigate instead of direct location manipulation
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            
            setModalTitle("Çıkış Hatası");
            setModalMessage("Hesabınızdan çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.");
            setShowModal(true);
            
            // Even if there's an error, still navigate to main page after delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    };

    // Enhanced slider controls with smoother animations
    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 50);
    }, [isAnimating, images.length]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 50);
    }, [isAnimating, images.length]);

    // Enhanced image class calculation with improved logic
    const getImageClass = (index) => {
        if (index === activeIndex) return 'active fade-in';
        
        // Left position
        if ((index === activeIndex - 1) || (activeIndex === 0 && index === images.length - 1)) {
            return 'position-1'; 
        }
        
        // Right position
        if ((index === activeIndex + 1) || (activeIndex === images.length - 1 && index === 0)) {
            return 'position-3'; 
        }
        
        // Far left position
        if ((index === activeIndex - 2) || (activeIndex <= 1 && index === images.length - (2 - activeIndex))) {
            return 'position-2'; 
        }
        
        // Far right position
        if ((index === activeIndex + 2) || (activeIndex >= images.length - 2 && index === (activeIndex + 2) % images.length)) {
            return 'position-4';
        }
        
        return 'inactive'; 
    };

    // Function called when login is successful
    const handleLoginSuccess = () => {
        setShowAuthModal(false);
        navigate('/create-event');
    };

    return (
        <div className="site-wrapper">
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="custom-navbar-brand">
                        <div className="container">
                            <div className="text">
                                <p>Email Management System</p>
                            </div>
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto nav-links">
                            {isAuthenticated && (
                                <>
                                    
                                    
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" id="dropdown-user" className="nav-link nav-item user-dropdown">
                                            <FaUser className="me-1" /> {user?.fullName || user?.name || user?.email?.split('@')[0] || "Kullanıcı"}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>
                                                <FaSignOutAlt className="me-2" /> Çıkış Yap
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            )}
                            
                            {!isAuthenticated && (
                                <Nav.Link onClick={openAuthModal} className="nav-item">
                                  Giriş Yap/Kayıt Ol
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {location.pathname === '/' && !isAuthenticated && (
                <div className="arkaplan">
                    {/* Modernized Image Slider */}
                    <div className="slider-container">
                        <button 
                            className="slider-btn left" 
                            onClick={prevSlide}
                            disabled={isAnimating}
                            aria-label="Previous slide"
                        >&#10094;</button>
                        <div className="slider">
                            {images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img} 
                                    alt={`Resim ${index + 1}`}
                                    className={getImageClass(index)}
                                    loading="lazy"
                                />
                            ))}
                        </div>
                        <button 
                            className="slider-btn right" 
                            onClick={nextSlide}
                            disabled={isAnimating}
                            aria-label="Next slide"
                        >&#10095;</button>
                        
                        {/* Slider indicators for better UX */}
                        <div className="slider-indicators">
                            {images.map((_, index) => (
                                <span 
                                    key={index} 
                                    className={`indicator ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => {
                                        if (!isAnimating) {
                                            setIsAnimating(true);
                                            setActiveIndex(index);
                                            setTimeout(() => setIsAnimating(false), 500);
                                        }
                                    }}
                                ></span>
                            ))}
                        </div>
                    </div>

                    {/* Redesigned Create Button */}
                    <div className="auth-button-container">
  <button 
    onClick={openAuthModal}
    className="premium-create-button"
  >
    <span className="button-glow"></span>
    <span className="button-content">
      <span className="button-icon"><FaEnvelope /></span>
      <span className="button-text">CREATE</span>
    </span>
  </button>
</div>
                    <div className="container">
                        <div className="ok">
                            <img src={okkk} alt="ok" />
                        </div>
                    </div>

                    {/* Improved Responsive Flow Chart */}
                   {/* Improved Responsive Flow Chart */}
                  
<div class="flow-container">
    <div class="flow-row">
        <div class="flow-box">
            <div class="box-title">Giriş Yapın ya da Üye Olun</div>
            <div class="box-content">
                Siteyi kullanabilmek için hesabınıza giriş yapın veya yeni bir hesap oluşturun.
            </div>
            <div class="arrow"></div>
        </div>
        
        <div class="flow-box">
            <div class="box-title">Yeni Etkinlik Oluşturun</div>
            <div class="box-content">
                Ardından, "Create Event" butonuna tıklayarak yeni bir etkinlik oluşturun.
            </div>
            <div class="arrow"></div>
        </div>
        
        <div class="flow-box">
            <div class="box-title">Etkinliği Seçin</div>
            <div class="box-content">
                Oluşturduğunuz etkinliği seçmek için "Select Event" seçeneğini kullanın.
            </div>
            <div class="arrow"></div>
        </div>
    </div>
    
    <div class="flow-row last-row">
        <div class="flow-box">
            <div class="box-title">Gönderin</div>
            <div class="box-content">
                Son olarak, etkinlik bilgilerini içeren maili göndermek için "Send" butonuna tıklayın.
            </div>
        </div>
        
        <div class="flow-box">
            <div class="box-title">Gönderen ve Alıcılar Ekleyin</div>
            <div class="box-content">
                "Senders" ve "Receivers" kısmını ekleyin. Senders eklerken, Google Hesabınızdan Gmail App Şifrenizi oluşturmayı unutmayın.
            </div>
            <div class="arrow"></div>
        </div>
        
        <div class="flow-box">
            <div class="box-title">Mail Şablonları Oluşturun</div>
            <div class="box-content">
                Yeni sayfada, etkinliğiniz için özel mail şablonları oluşturun.
            </div>
            <div class="arrow"></div>
        </div>
    </div>
</div>
               </div>
            )}

            {isAuthenticated && location.pathname === '/' && (
                <div className="welcome-container">
                    <div className="welcome-message">
                        <h2>Hoş Geldiniz, {user?.fullName || user?.name || user?.email?.split('@')[0] || "Kullanıcı"}!</h2>
                        <p>Email Management System'de etkinliklerinizi yönetmeye başlayabilirsiniz.</p>
                        <div className="welcome-actions">
                            <Button 
                                as={Link} 
                                to="/create-event" 
                                variant="primary" 
                                className="action-button"
                            >
                                Etkinlik Oluştur
                            </Button>
                            <Button 
                                as={Link} 
                                to="/my-events" 
                                variant="outline-primary" 
                                className="action-button"
                            >
                                Etkinliklerimi Görüntüle
                            </Button>
                        </div>
                    </div>
                </div>
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
                <div>
                    <div className="long-line"></div>
                    
                    {/* Contact section with consistent yellow background */}
                    <div className="plan">
                        <div className="text3">
                            <p>BİZ KİMİZ</p>
                            <hr />
                        </div>
                       
                        <ul className="footer-links">
                            <li><Link to="/about" className="nav-item">Hakkımızda</Link></li>
                            <li><Link to="/iletisim" className="nav-item">İletişim</Link></li>
                            <li><Link to="/gizlilik" className="nav-item">Gizlilik</Link></li>
                            <li><Link to="/guvenlik" className="nav-item">Güvenlik</Link></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;