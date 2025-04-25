import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthContext, AuthProvider } from './components/AuthContext';

// Import pages
import Events from './pages/event/Events';
import EventOperations from './pages/event/EventOperations';
import SendMail from './pages/mail/SendMail';
import MailTemplates from './pages/mail/MailTemplates';
import Senders from './pages/sender/Senders';
import Receivers from './pages/receiver/Receivers';
import ErrorPage from './pages/error/ErrorPage';
import About from './components/About';
import Iletisim from './components/iletisim';
import Gizlilik from './components/gizlilik';
import Guvenlik from './components/guvenlik';

// ScrollToTop component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Define ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> {/* Bu satırı ekledik - route değişikliğinde scroll'u sıfırlar */}
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={
              <AuthContext.Consumer>
                {({ isAuthenticated }) =>
                  isAuthenticated ? <Navigate to="/events" /> : <div className="landing-page"></div>
                }
              </AuthContext.Consumer>
            } />
            
            {/* Protected routes */}
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId" element={
              <ProtectedRoute>
                <EventOperations />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/templates" element={
              <ProtectedRoute>
                <MailTemplates />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/senders" element={
              <ProtectedRoute>
                <Senders />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/receivers" element={
              <ProtectedRoute>
                <Receivers />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/send-mail" element={
              <ProtectedRoute>
                <SendMail />
              </ProtectedRoute>
            } />
            
            {/* Public routes */}
            <Route path="/about" element={<About />} />
            <Route path="/iletisim" element={<Iletisim />} />
            <Route path="/gizlilik" element={<Gizlilik />} />
            <Route path="/guvenlik" element={<Guvenlik />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;