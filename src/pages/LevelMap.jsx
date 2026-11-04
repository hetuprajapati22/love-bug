import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * LevelMap Component
 * Visual zigzag stepping-stone map of levels across 5 progressive stages.
 * Shows done, current (pulsing), and locked levels.
 */
export default function LevelMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameKey = searchParams.get('game') || 'this_or_that';

  const [selectedStage, setSelectedStage] = useState(1);
  const currentOverallLevel = 1; // Default starting level

  const stages = [
    { num: 1, name: 'Playful', emoji: '🌸', desc: 'Cute habits, funny quirks and light romance' },
    { num: 2, name: 'Cozy', emoji: '🧸', desc: 'Comfort, lazy mornings and sweet routines' },
    { num: 3, name: 'Closer', emoji: '💕', desc: 'Butterflies, attraction and romantic sparks' },
    { num: 4, name: 'Deep', emoji: '❤️', desc: 'Trust, emotional support and honest feelings' },
    { num: 5, name: 'Spicy', emoji: '🔥', desc: 'Playful secrets, confessions and romantic dares' },
  ];

  const currentStageInfo = stages[selectedStage - 1] || stages[0];
  const startLevel = (selectedStage - 1) * 12 + 1;
  const stageLevels = Array.from({ length: 12 }, (_, i) => startLevel + i);

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '50px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/');
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 14px', fontSize: '0.84rem' }}
        >
          ← Home
        </button>
        <span className="badge-chip pink" style={{ fontWeight: 800 }}>
          🗺️ Level Journey
        </span>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate(`/lobby?game=${gameKey}`);
          }}
          className="btn-pill-primary"
          style={{ width: 'auto', padding: '6px 16px', fontSize: '0.84rem' }}
        >
          Play ➔
        </button>
      </div>

      {/* Stage Selector Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px',
          scrollbarWidth: 'none',
        }}
      >
        {stages.map((st) => (
          <button
            key={st.num}
            type="button"
            onClick={() => {
              setSelectedStage(st.num);
              soundEffects.playPop();
            }}
            className={`badge-chip ${selectedStage === st.num ? 'pink' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: selectedStage === st.num ? '1.5px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
            }}
          >
            {st.emoji} Stage {st.num}: {st.name}
          </button>
        ))}
      </div>

      {/* Stage Info Card */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '20px', padding: '16px' }}>
        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{currentStageInfo.emoji}</div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--color-warm-brown)' }}>
          Stage {currentStageInfo.num}: {currentStageInfo.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-brown-light)', margin: 0 }}>
          {currentStageInfo.desc}
        </p>
        <div style={{ marginTop: '8px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-deep-rose)' }}>
          "Questions get deeper as you go 💌"
        </div>
      </div>

      {/* Zigzag Stepping Stones Path */}
      <div
        className="glass-card"
        style={{
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.88)',
          position: 'relative',
        }}
      >
        {stageLevels.map((lvl, index) => {
          const isDone = lvl < currentOverallLevel;
          const isCurrent = lvl === currentOverallLevel;
          const isLocked = lvl > currentOverallLevel;

          // Zigzag horizontal offset: alternates left (-50px), center (0px), right (50px)
          const offsets = [-48, 0, 48, 0];
          const xOffset = offsets[index % 4];

          return (
            <div
              key={lvl}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateX(${xOffset}px)`,
                transition: 'transform 0.3s ease',
              }}
            >
              <div
                onClick={() => {
                  soundEffects.playPop();
                  navigate(`/lobby?game=${gameKey}`);
                }}
                className={`interactive-card ${isCurrent ? 'animate-pulse-subtle' : ''}`}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: isCurrent
                    ? '0 0 16px rgba(217, 133, 163, 0.6)'
                    : '0 4px 10px rgba(74, 47, 42, 0.08)',
                  background: isDone
                    ? 'linear-gradient(135deg, #C9DCCB, #7FB88A)'
                    : isCurrent
                    ? 'linear-gradient(135deg, #F8C9D8, #D985A3)'
                    : 'rgba(74, 47, 42, 0.08)',
                  color: isCurrent || isDone ? '#4A2F2A' : 'rgba(74, 47, 42, 0.4)',
                  border: isCurrent
                    ? '2.5px solid var(--color-deep-rose)'
                    : '1.5px solid var(--color-glass-border)',
                }}
              >
                {isDone ? '✓' : isLocked ? '🔒' : lvl}
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isCurrent ? 'var(--color-deep-rose)' : 'var(--color-warm-brown-light)',
                  marginTop: '4px',
                }}
              >
                Level {lvl}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Play CTA */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate(`/lobby?game=${gameKey}`);
          }}
          className="btn-pill-primary animate-pulse-subtle"
          style={{ fontSize: '1rem', padding: '14px 32px' }}
        >
          Continue Playing Level {currentOverallLevel} ➔
        </button>
      </div>
    </div>
  );
}
