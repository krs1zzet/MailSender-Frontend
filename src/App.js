import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Events from './pages/event/Events';
import EventOperations from './pages/event/EventOperations';
import SendMail from './pages/mail/SendMail';
import MailTemplates from './pages/mail/MailTemplates';
import Senders from './pages/sender/Senders';
import Receivers from './pages/receiver/Receivers';
import ErrorPage from './pages/error/ErrorPage';
import AuthForm from './AuthForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token invalid');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Events />} />
          <Route path="events/:eventId" element={<EventOperations />} />
          <Route path="events/:eventId/templates" element={<MailTemplates />} />
          <Route path="events/:eventId/senders" element={<Senders />} />
          <Route path="events/:eventId/receivers" element={<Receivers />} />
          <Route path="events/:eventId/send-mail" element={<SendMail />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
