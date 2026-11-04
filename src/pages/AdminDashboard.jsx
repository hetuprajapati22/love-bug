import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { useAuth } from '../hooks/useAuth';
import { soundEffects } from '../utils/soundEffects';
import { supabase } from '../lib/supabaseClient';

/**
 * CoupleDashboard Component
 * Intimate relationship hub for couples:
 * View love stats, streak, milestones, quick game launcher,
 * love letter shortcut, and session controls. Zero question spoilers!
 */
export default function CoupleDashboard() {
  const navigate = useNavigate();
  const { profile, couple, isCoupled } = useAuth();

  const [resetting, setResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';

  // Games summary list (without revealing questions!)
  const games = [
    {
      id: 'this_or_that',
      title: 'This or That',
      icon: '💗',
      tagline: 'Discover how your choices align',
      totalLevels: 60,
      badge: 'pink',
    },
    {
      id: 'know_me',
      title: 'How Well Do You Know Me?',
      icon: '🥹',
      tagline: 'Guess each other’s inner thoughts',
      totalLevels: 60,
      badge: 'lavender',
    },
    {
      id: 'truth_or_dare',
      title: 'Truth or Dare',
      icon: '😈',
      tagline: 'Playful confessions & sweet challenges',
      totalLevels: 60,
      badge: 'sage',
    },
  ];

  // Reset active test sessions back to Level 1
  const handleResetSessions = async () => {
    const ok = window.confirm(
      'Restart all games from Level 1 for both of you? You can play from the very beginning!'
    );
    if (!ok) return;

    setResetting(true);
    setStatusMsg('');
    try {
      if (supabase && couple?.couple_id) {
        await supabase
          .from('game_sessions')
          .update({
            status: 'waiting',
            partner_1_ready: false,
            partner_2_ready: false,
            current_level: 1,
            current_stage: 1,
          })
          .eq('couple_id', couple.couple_id);
      }
      soundEffects.playPop();
      setStatusMsg('✓ All games reset to Level 1 Waiting State! Ready for a fresh round!');
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Notice: ${err.message || 'Game session reset.'}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/');
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 16px', fontSize: '0.84rem' }}
        >
          ← Home
        </button>
        <span className="badge-chip pink" style={{ fontWeight: 800 }}>
          💑 Couple Dashboard
        </span>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/settings');
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 14px', fontSize: '0.84rem' }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* About Section Card (Placed above Couple Details) */}
      <div
        className="glass-card interactive-card"
        onClick={() => {
          soundEffects.playPop();
          navigate('/about');
        }}
        style={{
          marginBottom: '14px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(248, 201, 216, 0.6) 0%, rgba(255, 245, 229, 0.7) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌸</span>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
              About Love Bug & Creator
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)' }}>
              Read the story behind the game & meet Hetu Prajapati
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.88rem' }}>➔</span>
      </div>

      {/* Hero Couple Presentation Card */}
      <div className="glass-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
          <LoveBug mood="love" size={82} />
        </div>

        <h2 style={{ fontSize: '1.45rem', marginBottom: '4px', color: 'var(--color-warm-brown)' }}>
          {isCoupled ? `${myPetName} & ${partnerPetName}` : myPetName}
        </h2>
        <span className="badge-chip lavender" style={{ fontSize: '0.78rem', marginBottom: '18px' }}>
          👑 The Inseparable Couple
        </span>

        {/* 4 Relationship Milestones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '12px' }}>
          <div
            style={{
              padding: '14px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(248, 201, 216, 0.45)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🔥</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>1 Day</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Love Streak
            </div>
          </div>

          <div
            style={{
              padding: '14px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(220, 212, 247, 0.45)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🎮</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>3 Modes</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Available Games
            </div>
          </div>

          <div
            style={{
              padding: '14px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(201, 220, 203, 0.45)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>💖</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>100%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Chemistry Score
            </div>
          </div>

          <div
            style={{
              padding: '14px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 245, 229, 0.85)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>✨</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              {isCoupled ? 'Paired' : 'Solo'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Status
            </div>
          </div>
        </div>
      </div>

      {/* Sealed Love Letter Quick Access */}
      <div
        className="glass-card interactive-card"
        onClick={() => {
          soundEffects.playPop();
          navigate('/results');
        }}
        style={{
          marginBottom: '16px',
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(255, 245, 229, 0.95) 0%, rgba(248, 201, 216, 0.75) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>💌</span>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-warm-brown)' }}>
              View Sealed Love Letter
            </h4>
            <p style={{ fontSize: '0.76rem', margin: '2px 0 0', color: 'var(--color-warm-brown-light)' }}>
              Open your personalized cursive letter & share on WhatsApp
            </p>
          </div>
        </div>
        <span style={{ fontSize: '1.1rem' }}>➔</span>
      </div>

      {/* Quick Game Launch Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '10px', paddingLeft: '4px', color: 'var(--color-warm-brown)' }}>
          Play Together 🎮
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {games.map((g) => (
            <div
              key={g.id}
              className="glass-card interactive-card"
              onClick={() => {
                soundEffects.playPop();
                navigate(`/lobby?game=${g.id}`);
              }}
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{g.icon}</span>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>{g.title}</h4>
                  <p style={{ fontSize: '0.76rem', margin: '2px 0 0', color: 'var(--color-warm-brown-light)' }}>
                    {g.tagline}
                  </p>
                </div>
              </div>
              <span className={`badge-chip ${g.badge}`} style={{ fontSize: '0.72rem' }}>
                Play ➔
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Session Management / Restart Option */}
      <div className="glass-card" style={{ padding: '16px 18px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', color: 'var(--color-warm-brown)' }}>
          Game Progress Control 🔄
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-brown-light)', marginBottom: '12px' }}>
          Want to play your games again from the very start? You can restart all progress back to Level 1.
        </p>

        <button
          type="button"
          onClick={handleResetSessions}
          disabled={resetting}
          className="btn-pill-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '8px 20px',
            color: '#9E2A2B',
            borderColor: 'rgba(235, 87, 87, 0.35)',
            background: 'rgba(235, 87, 87, 0.05)',
          }}
        >
          {resetting ? 'Resetting...' : '🔄 Restart All Games from Level 1'}
        </button>

        {statusMsg && (
          <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#2D6A4F', fontWeight: 700 }}>
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
