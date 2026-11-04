import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { adminService } from '../services/adminService';
import { soundEffects } from '../utils/soundEffects';

/**
 * History Component
 * Shows list of past gameplay sessions for this couple with dates,
 * completion status, levels reached, and shortcuts to results.
 */
export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    adminService
      .getMyHistory()
      .then((sessions) => {
        setHistory(sessions || []);
      })
      .catch((err) => console.warn('Could not load history:', err))
      .finally(() => setLoading(false));
  }, []);

  const gameNames = {
    this_or_that: 'This or That 💗',
    know_me: 'How Well Do You Know Me? 🥹',
    truth_or_dare: 'Truth or Dare 😈',
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '50px' }}>
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
          📜 Game History
        </span>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/results');
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 14px', fontSize: '0.84rem' }}
        >
          💌 Letter
        </button>
      </div>

      {/* Hero Card */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '16px', padding: '18px' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '6px' }}>
          <LoveBug mood="happy" size={54} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--color-warm-brown)' }}>
          Our Shared Memories 💖
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-brown-light)', margin: 0 }}>
          Every level you play together is saved here forever.
        </p>
      </div>

      {/* History List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Loading couple history... 🐛💗</p>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '32px 20px', opacity: 0.8 }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🎮</span>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>No games played yet!</h4>
          <p style={{ fontSize: '0.84rem', marginBottom: '16px' }}>
            Jump into a game with your partner and create your first romantic memory.
          </p>
          <button
            type="button"
            onClick={() => navigate('/lobby?game=this_or_that')}
            className="btn-pill-primary"
            style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
          >
            Play First Game ➔
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isActive = item.status === 'active';
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent';

            return (
              <div
                key={item.id || idx}
                className="glass-card interactive-card"
                onClick={() => {
                  soundEffects.playPop();
                  if (isCompleted) {
                    navigate(`/results?session=${item.id}&game=${item.game_type}`);
                  } else {
                    navigate(`/play?session=${item.id}&game=${item.game_type}`);
                  }
                }}
                style={{
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: '1.5px solid var(--color-glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge-chip pink" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      {gameNames[item.game_type] || item.game_type}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: isCompleted ? '#2D6A4F' : isActive ? '#C26383' : '#888',
                      }}
                    >
                      {isCompleted ? '🏆 Completed' : isActive ? '🟢 In Progress' : '⏳ Paused'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
                    Level {item.current_level || 1} of 60
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', marginTop: '2px' }}>
                    Started on {dateStr}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge-chip lavender" style={{ fontSize: '0.74rem' }}>
                    {isCompleted ? 'View Letter ➔' : 'Resume ➔'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
