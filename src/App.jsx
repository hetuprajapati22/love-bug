import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import CoupleRoom from './pages/CoupleRoom';
import Dashboard from './pages/Dashboard';
import Lobby from './pages/Lobby';
import GameScreen from './pages/GameScreen';
import DashboardDemo from './pages/DashboardDemo';
import FloatingHearts from './components/ui/FloatingHearts';
import LoveBug from './components/mascot/LoveBug';
import LoveBugChat from './components/chat/LoveBugChat';

/**
 * Route Guard Component
 * Redirects unauthenticated users to /login and handles setup flow.
 */
function ProtectedRoute({ children }) {
  const { user, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }} className="animate-fade-in">
        <div className="animate-mascot-bob" style={{ marginBottom: '14px' }}>
          <LoveBug mood="love" size={90} />
        </div>
        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Loading Love Bug... 🐛💗</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't set their cute pet name yet, send to /setup
  if (!isProfileComplete && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Background Floating Hearts */}
        <FloatingHearts count={20} />

        {/* Global Couple Chatbot Assistant */}
        <LoveBugChat />

        {/* Central App Viewport */}
        <div className="app-viewport">
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/couple"
              element={
                <ProtectedRoute>
                  <CoupleRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lobby"
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              }
            />
            <Route
              path="/play"
              element={
                <ProtectedRoute>
                  <GameScreen />
                </ProtectedRoute>
              }
            />

            {/* Visual Demo Route (Always Accessible) */}
            <Route path="/demo" element={<DashboardDemo />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
