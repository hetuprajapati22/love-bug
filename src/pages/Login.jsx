import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';

/**
 * Login Page Component
 * Clean, romantic login screen with Google OAuth button and feature highlights.
 */
export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // In Step 1, OAuth is not wired to Supabase yet.
    // We direct the user to explore the Demo Dashboard.
    alert('Google Login will be connected in Step 2 with Supabase! Redirecting to visual Demo Dashboard...');
    navigate('/demo');
  };

  return (
    <div className="screen-container animate-fade-in">
      <div className="glass-card" style={{ textAlign: 'center' }}>
        {/* Bobbing Mascot */}
        <div className="animate-mascot-bob" style={{ marginBottom: '16px' }}>
          <LoveBug mood="love" size={120} />
        </div>

        {/* Title & Tagline */}
        <div style={{ marginBottom: '24px' }}>
          <div className="badge-chip pink" style={{ marginBottom: '10px' }}>
            <span>Made with love for couples 🐛💗</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '8px' }}>
            <span className="shimmer-text">Love Bug</span>
          </h1>
          <p style={{ fontSize: '0.98rem', maxWidth: '300px', margin: '0 auto' }}>
            Play together in real-time, unlock sweet conversations, and fall in love all over again.
          </p>
        </div>

        {/* Action Button: Continue with Google */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <button
            type="button"
            className="btn-pill-primary animate-pulse-subtle"
            onClick={handleGoogleLogin}
            aria-label="Continue with Google"
          >
            {/* Google "G" Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Direct Demo Button */}
          <button
            type="button"
            className="btn-pill-secondary"
            onClick={() => navigate('/demo')}
          >
            <span>Preview Demo Dashboard ✨</span>
          </button>
        </div>

        {/* Cute Feature Cards List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'left',
            padding: '16px',
            background: 'var(--color-glass-card-inner)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🎮</span>
            <span><strong>3 intimate games:</strong> This or That, Know Me, Truth or Dare</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <span><strong>Simultaneous reveal:</strong> Answers unlock only when both are submitted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💌</span>
            <span><strong>Romantic letter:</strong> Personalised reward after all games</span>
          </div>
        </div>

        {/* Small Trust Note */}
        <p style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--color-warm-brown-light)' }}>
          18+ couples only • Private sessions • No permanent chat stored
        </p>
      </div>
    </div>
  );
}
