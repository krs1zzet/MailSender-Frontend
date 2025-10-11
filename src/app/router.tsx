// src/app/router.tsx
import { BrowserRouter, createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import RegisterPage from "./routes/RegisterPage";
import HeroPage from "./routes/HomePage";
import HomePage from "./routes/HomePage";
import Layout from "../components/layout/Layout";
import EventPage from "./routes/EventPage";
import EventDetailPage from "./routes/EventDetailPage";
import MailTemplatePage from "./routes/MailTemplatePage";
import ReceiverPage from "./routes/ReceiverPage";
import SenderPage from "./routes/SenderPage";
import SendMailPage from "./routes/SendMailPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/templates" element={<MailTemplatePage />} />
          <Route path="/events/:id/receivers" element={<ReceiverPage/>} />
          <Route path="/events/:id/senders" element={<SenderPage />} />
          <Route path="events/:id/send-mail" element={<SendMailPage />} />

          <Route path="/" element={<Navigate to="/HeroPage" replace />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* Bilinmeyen path -> dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}