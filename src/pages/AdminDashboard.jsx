import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';
import { thisOrThatQuestions } from '../games/thisOrThat/thisOrThatQuestions';
import { knowMeQuestions } from '../games/knowMe/knowMeQuestions';
import { truthOrDareQuestions } from '../games/truthOrDare/truthOrDareQuestions';
import { soundEffects } from '../utils/soundEffects';
import { supabase } from '../lib/supabaseClient';

/**
 * AdminDashboard Component
 * Control center for managing all 180 questions, filtering by stages,
 * inspecting couple sessions, and resetting test data.
 */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeGame, setActiveGame] = useState('all'); // 'all' | 'this_or_that' | 'know_me' | 'truth_or_dare'
  const [selectedStage, setSelectedStage] = useState(0); // 0 = all, 1-5 = stages
  const [searchQuery, setSearchQuery] = useState('');
  const [resetting, setResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Normalize all questions for unified viewing
  const allQuestions = useMemo(() => {
    const tot = thisOrThatQuestions.map((q) => ({
      ...q,
      gameType: 'this_or_that',
      gameName: 'This or That 💗',
      displayTitle: q.text,
      details: `A: ${q.optionA} | B: ${q.optionB}`,
    }));

    const km = knowMeQuestions.map((q) => {
      let details = '';
      if (q.options) {
        details = q.options.map((o) => `${o.key}: ${o.text}`).join(' | ');
      } else {
        details = `A: ${q.optionA || ''} | B: ${q.optionB || ''} | C: ${q.optionC || ''} | D: ${q.optionD || ''}`;
      }
      return {
        ...q,
        gameType: 'know_me',
        gameName: 'Know Me 🥹',
        displayTitle: q.text,
        details,
      };
    });

    const tod = truthOrDareQuestions.map((q) => ({
      ...q,
      gameType: 'truth_or_dare',
      gameName: 'Truth or Dare 😈',
      displayTitle: `Truth: ${q.truth}`,
      details: `Dare: ${q.dare}`,
    }));

    return [...tot, ...km, ...tod];
  }, []);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchGame = activeGame === 'all' || q.gameType === activeGame;
      const matchStage = selectedStage === 0 || q.stage === selectedStage;
      const qText = `${q.displayTitle} ${q.details}`.toLowerCase();
      const matchSearch = !searchQuery.trim() || qText.includes(searchQuery.toLowerCase());
      return matchGame && matchStage && matchSearch;
    });
  }, [allQuestions, activeGame, selectedStage, searchQuery]);

  // Clean / reset all active test sessions
  const handleResetAllSessions = async () => {
    const ok = window.confirm(
      'Reset all active test game sessions? This will let both partners start completely fresh from lobby level 1.'
    );
    if (!ok) return;

    setResetting(true);
    setStatusMsg('');
    try {
      if (supabase) {
        await supabase
          .from('game_sessions')
          .update({
            status: 'waiting',
            partner_1_ready: false,
            partner_2_ready: false,
            current_level: 1,
            current_stage: 1,
          })
          .neq('id', '00000000-0000-0000-0000-000000000000');
      }
      soundEffects.playPop();
      setStatusMsg('✓ All active game sessions reset to Level 1 Waiting State!');
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Notice: ${err.message || 'Session reset attempted.'}`);
    } finally {
      setResetting(false);
    }
  };

  const stageLabels = ['All Stages', 'Stage 1: Playful', 'Stage 2: Cozy', 'Stage 3: Closer', 'Stage 4: Deep', 'Stage 5: Spicy'];

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
          ← Exit to Dashboard
        </button>
        <span className="badge-chip lavender" style={{ fontWeight: 800 }}>
          🛡️ Admin Panel
        </span>
      </div>

      {/* Hero Card */}
      <div className="glass-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '8px' }}>
          <LoveBug mood="love" size={70} />
        </div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
          Love Bug Game Manager
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--color-warm-brown-light)', marginBottom: '16px' }}>
          View, audit & manage all 180 questions across 5 romantic stages.
        </p>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(248, 201, 216, 0.45)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>60</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>This or That 💗</div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(220, 212, 247, 0.45)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>60</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Know Me 🥹</div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(201, 220, 203, 0.45)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>60</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Truth or Dare 😈</div>
          </div>
        </div>

        {/* Session Reset Tool */}
        <div style={{ marginTop: '16px', borderTop: '1px dashed var(--color-glass-border)', paddingTop: '12px' }}>
          <button
            type="button"
            onClick={handleResetAllSessions}
            disabled={resetting}
            className="btn-pill-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 18px', color: '#9E2A2B', borderColor: 'rgba(235,87,87,0.3)' }}
          >
            {resetting ? 'Resetting...' : '🔄 Reset All Test Game Sessions'}
          </button>
          {statusMsg && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#2D6A4F', fontWeight: 700 }}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs: Game Type */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '4px' }}>
        {[
          { key: 'all', label: 'All 180' },
          { key: 'this_or_that', label: 'This or That (60)' },
          { key: 'know_me', label: 'Know Me (60)' },
          { key: 'truth_or_dare', label: 'Truth or Dare (60)' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveGame(tab.key);
              soundEffects.playPop();
            }}
            className={`badge-chip ${activeGame === tab.key ? 'pink' : ''}`}
            style={{
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.78rem',
              fontWeight: 800,
              border: activeGame === tab.key ? '1.5px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Stage Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '14px 16px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search in questions or options..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--color-glass-border)',
            outline: 'none',
            fontSize: '0.85rem',
            marginBottom: '10px',
            color: 'var(--color-warm-brown)',
          }}
        />

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {stageLabels.map((lbl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedStage(idx);
                soundEffects.playPop();
              }}
              className={`badge-chip ${selectedStage === idx ? 'lavender' : ''}`}
              style={{
                fontSize: '0.72rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '4px 10px',
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Showing count indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 4px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-warm-brown-light)' }}>
          Showing {filteredQuestions.length} Questions
        </span>
      </div>

      {/* Question Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredQuestions.map((q, idx) => (
          <div
            key={`${q.gameType}_${q.id || q.level || idx}`}
            className="glass-card"
            style={{
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge-chip pink" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  {q.gameName}
                </span>
                <span className="badge-chip sage" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  Stage {q.stage}: {q.stageLabel || q.stageName || 'Romantic'}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-warm-brown-light)' }}>
                #{q.id || q.level || idx + 1}
              </span>
            </div>

            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-warm-brown)', marginBottom: '6px' }}>
              {q.displayTitle}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-brown-light)', lineHeight: 1.4 }}>
              {q.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
