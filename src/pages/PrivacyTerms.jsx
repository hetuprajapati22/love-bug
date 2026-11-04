import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * PrivacyTerms Component
 * Transparent privacy policy, terms of service, and 18+ adult couple notice.
 */
export default function PrivacyTerms() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' | 'terms'

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate(-1);
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 16px', fontSize: '0.84rem' }}
        >
          ← Back
        </button>
        <span className="badge-chip pink" style={{ fontWeight: 800 }}>
          📜 Legal & Privacy
        </span>
      </div>

      {/* 18+ Notice Card */}
      <div
        className="glass-card"
        style={{
          marginBottom: '16px',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, rgba(248, 201, 216, 0.4) 0%, rgba(220, 212, 247, 0.4) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
          textAlign: 'center',
        }}
      >
        <span className="badge-chip sage" style={{ fontSize: '0.74rem', marginBottom: '6px' }}>
          🔞 18+ Age Requirement
        </span>
        <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--color-warm-brown)', lineHeight: 1.45 }}>
          Love Bug is designed exclusively for dating, engaged, or married couples aged 18 and older.
          All content is for fun, closeness, and entertainment.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => {
            setActiveTab('privacy');
            soundEffects.playPop();
          }}
          className={`badge-chip ${activeTab === 'privacy' ? 'pink' : ''}`}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
            border: activeTab === 'privacy' ? '1.5px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
          }}
        >
          🛡️ Privacy Policy
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('terms');
            soundEffects.playPop();
          }}
          className={`badge-chip ${activeTab === 'terms' ? 'lavender' : ''}`}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
            border: activeTab === 'terms' ? '1.5px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
          }}
        >
          ⚖️ Terms of Service
        </button>
      </div>

      {/* Content Card */}
      <div
        className="glass-card"
        style={{
          padding: '22px 20px',
          background: 'rgba(255, 255, 255, 0.95)',
          fontSize: '0.86rem',
          lineHeight: 1.6,
          color: 'var(--color-warm-brown)',
        }}
      >
        {activeTab === 'privacy' ? (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Privacy Policy</h3>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              1. What Information We Collect
            </h4>
            <p style={{ marginBottom: '12px' }}>
              We collect your Google profile information (name, email) solely for secure authentication.
              You provide a cute pet name and heart color preference to personalize your experience.
            </p>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              2. Private Couple Room & Game Answers
            </h4>
            <p style={{ marginBottom: '12px' }}>
              Your game answers and private chat messages are accessible ONLY to you and your paired partner.
              Our database uses strict Row Level Security (RLS) to enforce this boundary. Answers cannot be
              viewed by any other user.
            </p>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              3. Ephemeral Couple Chat
            </h4>
            <p style={{ marginBottom: '12px' }}>
              Couple chat exists for instant, real-time communication during games.
              Chat messages are not permanent and are automatically deleted after sessions.
            </p>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              4. Zero Data Selling
            </h4>
            <p style={{ margin: 0 }}>
              We never sell, rent, or monetize your private couple interactions with advertisers.
              Your love is your own.
            </p>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Terms of Service</h3>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              1. For Fun & Entertainment Only
            </h4>
            <p style={{ marginBottom: '12px' }}>
              Love Bug is a playful game designed to inspire laughter, honest conversations, and fun bonding.
              Any compatibility scores or ratings are purely playful and NOT a psychological, clinical, or
              scientific evaluation of relationship quality.
            </p>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              2. Mutual Respect
            </h4>
            <p style={{ marginBottom: '12px' }}>
              Partners should participate willingly. In Truth or Dare, every prompt has a Skip option without
              any penalty. Never pressure, shame, or coerce your partner into uncomfortable actions.
            </p>

            <h4 style={{ fontSize: '0.94rem', marginBottom: '4px', color: 'var(--color-deep-rose)' }}>
              3. Unlinking & Account Deletion
            </h4>
            <p style={{ margin: 0 }}>
              Either partner can leave the couple connection at any time in Settings.
              You also have the right to permanently delete your account and associated profile data.
            </p>
          </div>
        )}
      </div>

      {/* Footer Return Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-pill-primary"
          style={{ width: 'auto', padding: '10px 28px', fontSize: '0.88rem' }}
        >
          Return to Dashboard ➔
        </button>
      </div>
    </div>
  );
}
