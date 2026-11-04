import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * About Component
 * Tells the heartwarming story behind Love Bug and introduces the creator (Hetu Prajapati).
 * Purely aesthetic, no external GitHub links.
 */
export default function About() {
  const navigate = useNavigate();

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
          🌸 About Love Bug
        </span>
      </div>

      {/* Hero Welcome Card */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '18px', padding: '24px 20px' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
          <LoveBug mood="love" size={82} />
        </div>
        <h2 style={{ fontSize: '1.45rem', marginBottom: '4px', color: 'var(--color-warm-brown)' }}>
          Made For Two Hearts 🐛💗
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--color-warm-brown-light)', margin: '0 auto', maxWidth: '300px' }}>
          A cozy, playful space designed exclusively for couples to laugh, connect, and fall deeper in love.
        </p>
      </div>

      {/* The Story Behind Love Bug */}
      <div
        className="glass-card"
        style={{
          marginBottom: '16px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1.5px solid var(--color-glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.3rem' }}>💌</span>
          <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-warm-brown)' }}>
            Why Love Bug Was Born
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'var(--color-warm-brown)', margin: 0 }}>
          In a world full of fast notifications and busy schedules, couples often message all day without really talking.
          <strong> Love Bug</strong> was created to slow things down — giving two partners a sweet, private space to
          rediscover each other through lighthearted debates, funny quirks, and heartfelt confessions.
        </p>
      </div>

      {/* The Three Journeys */}
      <div
        className="glass-card"
        style={{
          marginBottom: '16px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1.5px solid var(--color-glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.3rem' }}>🎮</span>
          <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-warm-brown)' }}>
            The Three Intimate Games
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>💗</span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>This or That</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)', lineHeight: 1.4 }}>
                Find pure joy in simple debates and celebrate how much your preferences match.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>🥹</span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>How Well Do You Know Me?</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)', lineHeight: 1.4 }}>
                Test how well you pay attention to each other’s little habits and inner thoughts.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>😈</span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Truth or Dare</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)', lineHeight: 1.4 }}>
                Spark romantic butterflies with playful truths and sweet couple challenges.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Creator Card (Hetu Prajapati) */}
      <div
        className="glass-card"
        style={{
          marginBottom: '16px',
          padding: '22px 20px',
          background: 'linear-gradient(135deg, rgba(248, 201, 216, 0.5) 0%, rgba(220, 212, 247, 0.5) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👩‍💻✨</div>
        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-deep-rose)', letterSpacing: '0.5px' }}>
          MEET THE CREATOR
        </div>
        <h3 style={{ fontSize: '1.25rem', margin: '4px 0 8px', color: 'var(--color-warm-brown)' }}>
          Hetu Prajapati
        </h3>
        <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'var(--color-warm-brown)', margin: 0 }}>
          Designed and crafted with immense care, creativity, and love. From the gentle pastel aesthetics
          and fluttering mascot to the synchronized real-time engine, every single feature was thoughtfully
          built from zero to bring warmth and happiness to relationships everywhere.
        </p>
      </div>

      {/* Romantic Note to Couples */}
      <div
        className="glass-card"
        style={{
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(180deg, #FFFDF8 0%, #FFF5E5 100%)',
          border: '1.5px dashed var(--color-muted-rose)',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>💌</span>
        <div
          className="romantic-text"
          style={{
            fontSize: '1.28rem',
            lineHeight: 1.6,
            color: 'var(--color-warm-brown)',
          }}
        >
          "May your conversations always be honest, your hugs always be warm, and your love always be playful."
        </div>
      </div>

      {/* Return Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/');
          }}
          className="btn-pill-primary"
          style={{ width: 'auto', padding: '10px 28px', fontSize: '0.88rem' }}
        >
          Return to Dashboard ➔
        </button>
      </div>
    </div>
  );
}
