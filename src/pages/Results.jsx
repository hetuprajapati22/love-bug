import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * Results & Sealed Romantic Love Letter Screen
 * Unlocks when couple finishes a game session or reviews past accomplishments.
 */
export default function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const gameKey = searchParams.get('game') || 'this_or_that';

  const { profile, couple } = useAuth();
  const [session, setSession] = useState(null);
  const [copied, setCopied] = useState(false);

  const myPetName = profile?.pet_name || 'My Love';
  const partnerPetName = couple?.partner_pet_name || 'Sweetheart';

  const gameTitles = {
    this_or_that: 'This or That 💗',
    know_me: 'How Well Do You Know Me? 🥹',
    truth_or_dare: 'Truth or Dare 😈',
  };

  useEffect(() => {
    soundEffects.playCelebrate();
    if (sessionId) {
      sessionService.getSession(sessionId).then((s) => {
        if (s) setSession(s);
      });
    }
  }, [sessionId]);

  const levelCompleted = session?.current_level || 60;
  const matchPercent = Math.min(100, Math.max(78, 85 + Math.floor(Math.random() * 14)));

  const letterText = `My dearest ${partnerPetName},

Through every question, every laugh, and every sweet confession, my heart finds its happiest home right next to you. Playing with you reminds me that love isn't just about agreeing on everything — it's about holding hands through every silly debate, every warm cuddle, and every quiet dream we share.

Thank you for choosing me, for understanding my quirks, and for making everyday moments feel like a romantic fairytale. I promise to keep laughing with you, teasing you, and loving you more and more each day.

Yours forever and always,
${myPetName} 💌✨`;

  const handleCopyLetter = () => {
    soundEffects.playPop();
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    soundEffects.playPop();
    const text = encodeURIComponent(
      `💌 Our Love Bug Game Result!\n\n${myPetName} & ${partnerPetName} scored ${matchPercent}% Romance Chemistry in ${gameTitles[gameKey]}! 🐛💗\n\n"${letterText.slice(0, 140)}..."\n\nPlay together on Love Bug!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Celebration Mascot */}
        <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
          <LoveBug mood="love" size={105} />
        </div>

        <div className="badge-chip pink" style={{ marginBottom: '8px' }}>
          <span>🎉 Game Complete!</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
          <span className="shimmer-text">Love Sealed Forever!</span>
        </h1>

        <p style={{ fontSize: '0.92rem', color: 'var(--color-warm-brown-light)', marginBottom: '18px' }}>
          {myPetName} & {partnerPetName} completed {levelCompleted} levels together!
        </p>

        {/* Compatibility Meter */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(248, 201, 216, 0.5) 0%, rgba(220, 212, 247, 0.5) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
            border: '1.5px solid var(--color-glass-border)',
            marginBottom: '22px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-deep-rose)', letterSpacing: '1px' }}>
            COUPLE CHEMISTRY SCORE
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-warm-brown)', margin: '4px 0' }}>
            {matchPercent}%
          </div>
          <p style={{ fontSize: '0.86rem', margin: 0, fontWeight: 700 }}>
            {matchPercent >= 90
              ? '✨ Pure Soulmates! You two are completely in sync!'
              : '💗 Beautiful Connection! Your love and understanding shine bright!'}
          </p>
        </div>

        {/* The Sealed Love Letter */}
        <div
          style={{
            background: 'linear-gradient(180deg, #FFFDF8 0%, #FFF5E5 100%)',
            border: '2px dashed #D985A3',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            textAlign: 'left',
            boxShadow: '0 8px 24px rgba(74, 47, 42, 0.08)',
            position: 'relative',
            marginBottom: '22px',
          }}
        >
          {/* Wax Stamp Visual */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              right: '20px',
              background: '#C26383',
              color: '#fff',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(194, 99, 131, 0.4)',
              fontSize: '1.1rem',
            }}
          >
            💌
          </div>

          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#C26383', marginBottom: '8px' }}>
            YOUR PERSONALIZED ROMANTIC LETTER
          </div>

          <div
            className="romantic-text"
            style={{
              fontSize: '1.28rem',
              lineHeight: 1.6,
              color: 'var(--color-warm-brown)',
              whiteSpace: 'pre-line',
            }}
          >
            {letterText}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn-pill-primary"
            onClick={handleCopyLetter}
            style={{ fontSize: '0.94rem' }}
          >
            {copied ? 'Copied to Clipboard! 💌' : 'Copy Love Letter 📋'}
          </button>

          <button
            type="button"
            className="btn-pill-secondary"
            onClick={handleShareWhatsApp}
            style={{
              fontSize: '0.94rem',
              borderColor: '#7FB88A',
              color: '#2D6A4F',
              background: 'rgba(127, 184, 138, 0.12)',
            }}
          >
            Share on WhatsApp 💬
          </button>

          <button
            type="button"
            className="btn-pill-secondary"
            onClick={() => {
              soundEffects.playPop();
              navigate('/');
            }}
            style={{ fontSize: '0.94rem' }}
          >
            🏠 Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
