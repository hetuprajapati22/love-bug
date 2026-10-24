import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardDemo from './pages/DashboardDemo';
import FloatingHearts from './components/ui/FloatingHearts';

export default function App() {
  return (
    <BrowserRouter>
      {/* Background Floating Hearts Layer */}
      <FloatingHearts count={18} />

      {/* Main Viewport */}
      <div className="app-viewport">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/demo" element={<DashboardDemo />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
