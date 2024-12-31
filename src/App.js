import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/home/HomePage';
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
          <Route index element={<HomePage />} />
          <Route path="send-mail" element={<SendMail />} />
          <Route path="templates" element={<MailTemplates />} />
          <Route path="senders" element={<Senders />} />
          <Route path="receivers" element={<Receivers />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
