import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Events from './pages/event/Events';
import EventOperations from './pages/event/EventOperations';
import SendMail from './pages/mail/SendMail';
import MailTemplates from './pages/mail/MailTemplates';
import Senders from './pages/sender/Senders';
import Receivers from './pages/receiver/Receivers';
import ErrorPage from './pages/error/ErrorPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
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
