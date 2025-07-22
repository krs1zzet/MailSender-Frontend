import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './pages/Navigation/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthContext, AuthProvider } from './components/AuthContext';
import Events from './pages/events/Events'; 

import EventOperations from './pages/event/EventOperations';
import SendMail from './pages/mail/SendMail';
import MailTemplates from './pages/mail/MailTemplates';
import Senders from './pages/sender/Senders';
import Receivers from './pages/receiver/Receivers';
import ErrorPage from './pages/error/ErrorPage';
import About from './pages/About/About';
import Iletisim from './pages/Iletisim/Iletisim';
import Gizlilik from './pages/Gizlilik/Gizlilik';
import Guvenlik from './pages/Guvenlik/Guvenlik';
import Header from './components/Header/Header';
import AuthForm from './components/AuthForm';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newIsDark = !prev;
      document.body.classList.toggle('dark-theme', newIsDark);
      document.body.classList.toggle('light-theme', !newIsDark);
      return newIsDark;
    });
  };

  const openAuthModal = () => setIsAuthFormOpen(true);
  const closeAuthModal = () => setIsAuthFormOpen(false);

  React.useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header toggleTheme={toggleTheme} isDark={isDark} openAuthModal={openAuthModal} />
        <Routes>
          <Route path="/" element={<Navigation />} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:eventId" element={<ProtectedRoute><EventOperations /></ProtectedRoute>} />
          <Route path="/events/:eventId/templates" element={<ProtectedRoute><MailTemplates /></ProtectedRoute>} />
          <Route path="/events/:eventId/senders" element={<ProtectedRoute><Senders /></ProtectedRoute>} />
          <Route path="/events/:eventId/receivers" element={<ProtectedRoute><Receivers /></ProtectedRoute>} />
          <Route path="/events/:eventId/send-mail" element={<ProtectedRoute><SendMail /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/iletisim" element={<Iletisim />} />
          <Route path="/gizlilik" element={<Gizlilik />} />
          <Route path="/guvenlik" element={<Guvenlik />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        {isAuthFormOpen && <AuthForm onSuccess={closeAuthModal} />}
      </Router>
    </AuthProvider>
  );
}

export default App;
