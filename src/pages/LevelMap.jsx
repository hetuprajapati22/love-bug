import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

// Question pools
import { thisOrThatQuestions } from '../games/thisOrThat/thisOrThatQuestions';
import { knowMeQuestions } from '../games/knowMe/knowMeQuestions';
import { truthOrDareQuestions } from '../games/truthOrDare/truthOrDareQuestions';

/**
 * LevelMap Component
 * Interactive Level Journey with direct game selector, level question preview,
 * and live level progress tracking from the database.
 */
export default function LevelMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialGame = searchParams.get('game') || 'this_or_that';

  const { couple, isCoupled } = useAuth();

  const [selectedGame, setSelectedGame] = useState(initialGame);
  const [selectedStage, setSelectedStage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedLevelModal, setSelectedLevelModal] = useState(null);

  const gameOptions = [
    { key: 'this_or_that', title: 'This or That', icon: '💗', color: 'pink' },
    { key: 'know_me', title: 'Know Me', icon: '🥹', color: 'lavender' },
    { key: 'truth_or_dare', title: 'Truth or Dare', icon: '😈', color: 'sage' },
  ];

  const stages = [
    { num: 1, name: 'Playful', emoji: '🌸', desc: 'Cute habits, funny quirks and light romance' },
    { num: 2, name: 'Cozy', emoji: '🧸', desc: 'Comfort, lazy mornings and sweet routines' },
    { num: 3, name: 'Closer', emoji: '💕', desc: 'Butterflies, attraction and romantic sparks' },
    { num: 4, name: 'Deep', emoji: '❤️', desc: 'Trust, emotional support and honest feelings' },
    { num: 5, name: 'Spicy', emoji: '🔥', desc: 'Playful secrets, confessions and romantic dares' },
  ];

  // Fetch real current level for the selected game from Supabase
  useEffect(() => {
    if (!couple?.couple_id || !supabase) return;

    supabase
      .from('game_sessions')
      .select('current_level, current_stage')
      .eq('couple_id', couple.couple_id)
      .eq('game_type', selectedGame)
      .in('status', ['waiting', 'active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.current_level) {
          setCurrentLevel(data.current_level);
          if (data.current_stage) {
            setSelectedStage(data.current_stage);
          }
        } else {
          setCurrentLevel(1);
        }
      })
      .catch((err) => console.warn('Could not fetch session level:', err));
  }, [couple?.couple_id, selectedGame]);

  // Questions for the active game
  const activeQuestions =
    selectedGame === 'this_or_that'
      ? thisOrThatQuestions
      : selectedGame === 'know_me'
      ? knowMeQuestions
      : truthOrDareQuestions;

  const currentStageInfo = stages[selectedStage - 1] || stages[0];
  const startLevel = (selectedStage - 1) * 12 + 1;
  const stageLevels = Array.from({ length: 12 }, (_, i) => startLevel + i);

  const handleLaunchGame = (levelToPlay) => {
    soundEffects.playPop();
    if (!isCoupled) {
      navigate('/couple');
      return;
    }
    navigate(`/lobby?game=${selectedGame}`);
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Top Header Bar */}
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
          onClick={() => handleLaunchGame(currentLevel)}
          className="btn-pill-primary"
          style={{ width: 'auto', padding: '6px 16px', fontSize: '0.84rem' }}
        >
          Play ➔
        </button>
      </div>

      {/* 1. GAME SWITCHER TABS (Choose Game on Map) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {gameOptions.map((g) => {
          const isSelected = selectedGame === g.key;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => {
                setSelectedGame(g.key);
                soundEffects.playPop();
              }}
              className={`badge-chip ${isSelected ? g.color : ''}`}
              style={{
                flex: 1,
                padding: '10px 6px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center',
                border: isSelected ? '2px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
                background: isSelected ? undefined : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <span>{g.icon}</span> {g.title}
            </button>
          );
        })}
      </div>

      {/* 2. STAGE SELECTOR PILLS */}
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
              fontSize: '0.76rem',
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

      {/* 3. STAGE BANNER */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '20px', padding: '16px' }}>
        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{currentStageInfo.emoji}</div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--color-warm-brown)' }}>
          Stage {currentStageInfo.num}: {currentStageInfo.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-brown-light)', margin: 0 }}>
          {currentStageInfo.desc}
        </p>
        <div style={{ marginTop: '8px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-deep-rose)' }}>
          Progress: Level {currentLevel} of 60 🎯
        </div>
      </div>

      {/* 4. ZIGZAG LEVEL PATH WITH QUESTION PREVIEWS */}
      <div
        className="glass-card"
        style={{
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          background: 'rgba(255, 255, 255, 0.92)',
          position: 'relative',
        }}
      >
        {stageLevels.map((lvl, index) => {
          const isDone = lvl < currentLevel;
          const isCurrent = lvl === currentLevel;
          const isLocked = lvl > currentLevel;

          const qObj = activeQuestions[lvl - 1];
          const qText = qObj?.text || (qObj?.truth ? `Truth: ${qObj.truth}` : `Level ${lvl} Question`);

          // Zigzag horizontal offset
          const offsets = [-44, 0, 44, 0];
          const xOffset = offsets[index % 4];

          return (
            <div
              key={lvl}
              onClick={() => {
                soundEffects.playPop();
                setSelectedLevelModal({ level: lvl, question: qObj });
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateX(${xOffset}px)`,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                width: '100%',
                maxWidth: '260px',
              }}
              className="interactive-card"
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  boxShadow: isCurrent
                    ? '0 0 18px rgba(217, 133, 163, 0.65)'
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
                className={isCurrent ? 'animate-pulse-subtle' : ''}
              >
                {isDone ? '✓' : isLocked ? '🔒' : lvl}
              </div>

              <div
                style={{
                  marginTop: '4px',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isCurrent ? 'var(--color-deep-rose)' : 'var(--color-warm-brown)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-glass-border)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '180px',
                }}
              >
                Level {lvl}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. BOTTOM PLAY BUTTON */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => handleLaunchGame(currentLevel)}
          className="btn-pill-primary animate-pulse-subtle"
          style={{ fontSize: '1.02rem', padding: '14px 32px' }}
        >
          Play {gameOptions.find((g) => g.key === selectedGame)?.title} (Level {currentLevel}) ➔
        </button>
      </div>

      {/* 6. POPUP MODAL ON TAPPING A LEVEL */}
      {selectedLevelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(74, 47, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          className="animate-fade-in"
          onClick={() => setSelectedLevelModal(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#fff',
              border: '2px solid var(--color-muted-rose)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px 20px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-mascot-bob" style={{ marginBottom: '8px' }}>
              <LoveBug mood="love" size={64} />
            </div>

            <span className="badge-chip pink" style={{ fontSize: '0.74rem', marginBottom: '8px' }}>
              Level {selectedLevelModal.level} of 60
            </span>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-warm-brown)', margin: '8px 0 14px' }}>
              {selectedLevelModal.question?.text ||
                (selectedLevelModal.question?.truth
                  ? `Truth: ${selectedLevelModal.question.truth}`
                  : `Level ${selectedLevelModal.level}`)}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedLevelModal(null);
                  handleLaunchGame(selectedLevelModal.level);
                }}
                className="btn-pill-primary"
                style={{ fontSize: '0.92rem' }}
              >
                Play This Game with Partner ➔
              </button>

              <button
                type="button"
                onClick={() => setSelectedLevelModal(null)}
                className="btn-pill-secondary"
                style={{ fontSize: '0.84rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
