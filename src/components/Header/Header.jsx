import React, { useContext } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthContext';
import './Header.css';
import { FaUser, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

const Header = ({ isDark, toggleTheme, openAuthModal }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const cikisYap = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  return (
    <nav className={`ozel-navbarr ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <div className="navbar-brand">
        <Link to="/" className="brand-text">
          EMAIL MANAGEMENT SYSTEM
        </Link>
      </div>

      <div className="navbar-menu">
        <ul className="menu-list">
          <li>
            <Link to="/" className="menu-link">
              ANASAYFA
            </Link>
          </li>
          <li>
            <Link to="/about" className="menu-link">
              HAKKIMIZDA
            </Link>
          </li>
          <li>
            <Link to="/iletisim" className="menu-link">
              İLETİŞİM
            </Link>
          </li>
          <li>
            <Link to="/gizlilik" className="menu-link">
              GİZLİLİK
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-actions">
        <button className="theme-btn" onClick={toggleTheme}>
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
        
        {isAuthenticated ? (
          <Dropdown>
            <Dropdown.Toggle variant="none" className="user-btn">
              <FaUser /> {user?.fullName || user?.email?.split('@')[0] || "Kullanıcı"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={cikisYap}>
                <FaSignOutAlt /> Çıkış Yap
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <button  onClick={openAuthModal}>
            
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;