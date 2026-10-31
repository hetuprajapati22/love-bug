import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import { supabase } from '../lib/supabaseClient';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

// ── Question sets ─────────────────────────────────────────────────────────────
import { thisOrThatQuestions } from '../games/thisOrThat/thisOrThatQuestions';
import { knowMeQuestions } from '../games/knowMe/knowMeQuestions';
import { truthOrDareQuestions } from '../games/truthOrDare/truthOrDareQuestions';

// ── Game config ───────────────────────────────────────────────────────────────
const GAME_CONFIG = {
  this_or_that: {
    label: 'This or That',
    icon: '💗',
    questions: thisOrThatQuestions,
    type: 'this_or_that',   // A / B choice
  },
  know_me: {
    label: 'How Well Do You Know Me?',
    icon: '🥹',
    questions: knowMeQuestions,
    type: 'know_me',        // A / B / C / D choice
  },
  truth_or_dare: {
    label: 'Truth or Dare',
    icon: '😈',
    questions: truthOrDareQuestions,
    type: 'truth_or_dare',  // Truth or Dare pick → then free text / action
  },
};

// Stage name map (same across all games)
const STAGE_NAMES = ['Playful', 'Cozy', 'Closer', 'Deep', 'Spicy'];

/**
 * GameScreen Component
 *
 * Handles 3 game types:
 *  - this_or_that   → A/B option cards, lock, simultaneous reveal
 *  - know_me        → A/B/C/D option cards, lock, simultaneous reveal
 *  - truth_or_dare  → Truth/Dare pick, "Done!" confirmation, simultaneous reveal
 */
export default function GameScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const urlGameKey = searchParams.get('game');

  const { user, profile, couple } = useAuth();

  // ── Shared state ────────────────────────────────────────────────────────────
  const [session, setSession] = useState(null);
  const gameKey = session?.game_type || urlGameKey || 'this_or_that';
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);   // 'A'|'B'|'C'|'D' | 'truth'|'dare'
  const [lockedAnswer, setLockedAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [revealData, setRevealData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Truth-or-Dare specific state ─────────────────────────────────────────────
  // 'pick'    → player chooses Truth or Dare
  // 'doing'   → player reads the prompt and completes it
  const [todPhase, setTodPhase] = useState('pick'); // 'pick' | 'doing'

  // ── Derived values ───────────────────────────────────────────────────────────
  const config = GAME_CONFIG[gameKey] || GAME_CONFIG['this_or_that'];
  const currentLevel = session?.current_level || 1;
  const questionIndex = Math.min(Math.max(1, currentLevel), 60) - 1;
  const rawQuestion = config.questions[questionIndex] || config.questions[0];

  // Normalize knowMe questions: {options:[{key,text}]} → flat optionA/B/C/D
  const question = React.useMemo(() => {
    if (!rawQuestion) return rawQuestion;
    if (rawQuestion.options && Array.isArray(rawQuestion.options)) {
      const flat = { ...rawQuestion };
      rawQuestion.options.forEach(({ key, text }) => {
        flat[`option${key}`] = text;
      });
      return flat;
    }
    return rawQuestion;
  }, [rawQuestion]);

  const currentStage = question?.stage || 1;
  const stageName = STAGE_NAMES[currentStage - 1] || 'Playful';

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';

  // ── Load session + existing answer ──────────────────────────────────────────
  const loadSessionState = useCallback(async () => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    try {
      const sess = await sessionService.getSession(sessionId);
      if (!sess) { navigate('/'); return; }
      setSession(sess);

      const answers = await sessionService.getLevelAnswers(sessionId, sess.current_level);
      const myAns = answers.find((a) => a.user_id === user?.id);

      if (myAns) {
        setLockedAnswer(myAns.answer);
        // Restore ToD phase if already done
        if (gameKey === 'truth_or_dare') setTodPhase('doing');
      } else {
        setLockedAnswer(null);
        setSelectedOption(null);
        if (gameKey === 'truth_or_dare') setTodPhase('pick');
      }

      if (answers.length >= 2) {
        const p1Ans = answers.find((a) => a.user_id === sess.partner_1_id);
        const p2Ans = answers.find((a) => a.user_id === sess.partner_2_id);
        setRevealData({ partner_1_answer: p1Ans?.answer, partner_2_answer: p2Ans?.answer });
        setRevealed(true);
      } else {
        setRevealed(false);
        setRevealData(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error loading game session.');
    } finally {
      setLoading(false);
    }
  }, [sessionId, user?.id, gameKey, navigate]);

  useEffect(() => { loadSessionState(); }, [loadSessionState]);

  // ── Real-time listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;

    const answersChannel = supabase
      .channel(`answers_${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public',
        table: 'session_answers', filter: `session_id=eq.${sessionId}`,
      }, async () => { await loadSessionState(); })
      .subscribe();

    const sessionChannel = supabase
      .channel(`game_${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'game_sessions', filter: `id=eq.${sessionId}`,
      }, (payload) => {
        setSession(payload.new);
        setSelectedOption(null);
        setLockedAnswer(null);
        setRevealed(false);
        setRevealData(null);
        setTodPhase('pick');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(answersChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [sessionId, loadSessionState]);

  // ── Submit answer (This or That / Know Me) ───────────────────────────────────
  const handleLockAnswer = async () => {
    if (!selectedOption || lockedAnswer || submitting) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      // Build text label for the selected option
      let text = '';
      if (gameKey === 'this_or_that') {
        text = selectedOption === 'A' ? question.optionA : question.optionB;
      } else if (gameKey === 'know_me') {
        const map = { A: question.optionA, B: question.optionB, C: question.optionC, D: question.optionD };
        text = map[selectedOption] || selectedOption;
      }

      const res = await sessionService.submitAnswer(sessionId, currentLevel, {
        choice: selectedOption,
        text,
      });

      soundEffects.playLock();
      setLockedAnswer({ choice: selectedOption, text });

      if (res.both_answered) {
        setRevealData({ partner_1_answer: res.partner_1_answer, partner_2_answer: res.partner_2_answer });
        setRevealed(true);
        if (res.partner_1_answer?.choice === res.partner_2_answer?.choice) {
          soundEffects.playMatch();
        } else {
          soundEffects.playPop();
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit answer (Truth or Dare — after completing the dare/truth) ──────────
  const handleTodDone = async () => {
    if (lockedAnswer || submitting) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const chosenType = selectedOption; // 'truth' or 'dare'
      const chosenText = chosenType === 'truth' ? question.truth : question.dare;

      const res = await sessionService.submitAnswer(sessionId, currentLevel, {
        choice: chosenType,
        text: chosenText,
      });

      soundEffects.playLock();
      setLockedAnswer({ choice: chosenType, text: chosenText });

      if (res.both_answered) {
        setRevealData({ partner_1_answer: res.partner_1_answer, partner_2_answer: res.partner_2_answer });
        setRevealed(true);
        soundEffects.playMatch();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Advance to next question ─────────────────────────────────────────────────
  const handleNextQuestion = async () => {
    if (advancing) return;
    setAdvancing(true);
    setErrorMsg('');
    try {
      const res = await sessionService.advanceLevel(sessionId);
      if (res.status === 'completed' || currentLevel >= 60) {
        soundEffects.playCelebrate();
        navigate(`/results?session=${sessionId}&game=${gameKey}`);
      } else {
        soundEffects.playPop();
        setSelectedOption(null);
        setLockedAnswer(null);
        setRevealed(false);
        setRevealData(null);
        setTodPhase('pick');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not advance to next question.');
    } finally {
      setAdvancing(false);
    }
  };

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }} className="animate-fade-in">
        <div className="animate-mascot-bob">
          <LoveBug mood="love" size={80} />
        </div>
        <p style={{ marginTop: '12px', fontWeight: 700 }}>Connecting to your Love Bug... 🐛💗</p>
      </div>
    );
  }

  // ── Is this a match? (for This or That / Know Me) ───────────────────────────
  const isMatch =
    revealed &&
    revealData?.partner_1_answer?.choice === revealData?.partner_2_answer?.choice;

  // ── REVEAL PANEL (shared across all game types) ──────────────────────────────
  const renderReveal = () => {
    const p1Ans = revealData?.partner_1_answer;
    const p2Ans = revealData?.partner_2_answer;

    // For Truth or Dare: match = both picked the same (truth/truth or dare/dare)
    const todMatch = gameKey === 'truth_or_dare' && p1Ans?.choice === p2Ans?.choice;
    const showMatch = gameKey === 'truth_or_dare' ? todMatch : isMatch;

    // Labels for who is who
    const myLabel = session?.is_partner_1 ? myPetName : partnerPetName;
    const partnerLabel = session?.is_partner_1 ? partnerPetName : myPetName;

    return (
      <div className="animate-fade-in" style={{ textAlign: 'center' }}>
        {/* Match Banner */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            background: showMatch
              ? 'linear-gradient(135deg, rgba(248, 201, 216, 0.9) 0%, rgba(220, 212, 247, 0.9) 100%)'
              : 'rgba(255, 255, 255, 0.85)',
            border: '1.5px solid var(--color-muted-rose)',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '4px' }}>
            {showMatch ? '💖 Great Minds Think Alike!' : '✨ Sweet Choices!'}
          </span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>
            {showMatch
              ? gameKey === 'truth_or_dare'
                ? 'You both picked the same — truth or dare!'
                : 'You both feel exactly the same way!'
              : gameKey === 'truth_or_dare'
              ? 'One truth, one dare — interesting combo!'
              : 'Different choices make conversations even sweeter!'}
          </p>
        </div>

        {/* Revealed Answers */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {/* Partner 1 */}
          <div
            style={{
              flex: 1, padding: '14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1.5px solid var(--color-glass-border)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700, marginBottom: '4px' }}>
              {session?.is_partner_1 ? myLabel : partnerLabel}
            </div>
            {gameKey === 'truth_or_dare' && (
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-deep-rose)', marginBottom: '4px' }}>
                {p1Ans?.choice === 'truth' ? '🌸 Truth' : '🔥 Dare'}
              </div>
            )}
            <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4 }}>
              {p1Ans?.text}
            </div>
          </div>

          {/* Partner 2 */}
          <div
            style={{
              flex: 1, padding: '14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1.5px solid var(--color-glass-border)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', fontWeight: 700, marginBottom: '4px' }}>
              {session?.is_partner_1 ? partnerLabel : myLabel}
            </div>
            {gameKey === 'truth_or_dare' && (
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-deep-rose)', marginBottom: '4px' }}>
                {p2Ans?.choice === 'truth' ? '🌸 Truth' : '🔥 Dare'}
              </div>
            )}
            <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4 }}>
              {p2Ans?.text}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-pill-primary animate-pulse-subtle"
          onClick={handleNextQuestion}
          disabled={advancing}
        >
          {advancing ? 'Loading...' : 'Next Question ➔'}
        </button>
      </div>
    );
  };

  // ── THIS OR THAT — Option cards (A / B) ──────────────────────────────────────
  const renderThisOrThat = () => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {['A', 'B'].map((opt) => {
          const text = opt === 'A' ? question.optionA : question.optionB;
          const selected = selectedOption === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(lockedAnswer)}
              onClick={() => setSelectedOption(opt)}
              className={`glass-card ${!lockedAnswer ? 'interactive-card' : ''}`}
              style={{
                padding: '16px 20px', textAlign: 'left',
                border: selected ? '2px solid var(--color-deep-rose)' : '1.5px solid var(--color-glass-border)',
                background: selected ? 'rgba(248, 201, 216, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                cursor: lockedAnswer ? 'default' : 'pointer',
                fontSize: '0.97rem', fontWeight: 700, color: 'var(--color-warm-brown)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span>{text}</span>
              {selected && <span>💗</span>}
            </button>
          );
        })}
      </div>
      {renderLockOrWaiting()}
    </div>
  );

  // ── KNOW ME — Option cards (A / B / C / D) ───────────────────────────────────
  const renderKnowMe = () => {
    const options = [
      { key: 'A', text: question.optionA },
      { key: 'B', text: question.optionB },
      { key: 'C', text: question.optionC },
      { key: 'D', text: question.optionD },
    ].filter((o) => o.text); // skip undefined options

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {options.map(({ key, text }) => {
            const selected = selectedOption === key;
            return (
              <button
                key={key}
                type="button"
                disabled={Boolean(lockedAnswer)}
                onClick={() => setSelectedOption(key)}
                className={`glass-card ${!lockedAnswer ? 'interactive-card' : ''}`}
                style={{
                  padding: '14px 18px', textAlign: 'left',
                  border: selected ? '2px solid var(--color-deep-rose)' : '1.5px solid var(--color-glass-border)',
                  background: selected ? 'rgba(248, 201, 216, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                  cursor: lockedAnswer ? 'default' : 'pointer',
                  fontSize: '0.93rem', fontWeight: 700, color: 'var(--color-warm-brown)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}
              >
                <span
                  style={{
                    minWidth: '26px', height: '26px',
                    borderRadius: '50%',
                    background: selected ? 'var(--color-deep-rose)' : 'rgba(74,47,42,0.1)',
                    color: selected ? '#fff' : 'var(--color-warm-brown)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 800, flexShrink: 0,
                  }}
                >
                  {key}
                </span>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
        {renderLockOrWaiting()}
      </div>
    );
  };

  // ── TRUTH OR DARE — Two phases ────────────────────────────────────────────────
  const renderTruthOrDare = () => {
    // Phase 1: Pick Truth or Dare
    if (todPhase === 'pick' && !lockedAnswer) {
      return (
        <div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-warm-brown-light)', marginBottom: '16px' }}>
            Choose your path for this round:
          </p>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
            {/* Truth Card */}
            <button
              type="button"
              onClick={() => { setSelectedOption('truth'); setTodPhase('doing'); }}
              className="glass-card interactive-card"
              style={{
                flex: 1, padding: '20px 14px', textAlign: 'center',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255, 255, 255, 0.85)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌸</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-brown)', marginBottom: '4px' }}>
                Truth
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)' }}>
                Answer a sweet question honestly
              </div>
            </button>

            {/* Dare Card */}
            <button
              type="button"
              onClick={() => { setSelectedOption('dare'); setTodPhase('doing'); }}
              className="glass-card interactive-card"
              style={{
                flex: 1, padding: '20px 14px', textAlign: 'center',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255, 245, 229, 0.85)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-brown)', marginBottom: '4px' }}>
                Dare
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)' }}>
                Complete a fun romantic challenge
              </div>
            </button>
          </div>
        </div>
      );
    }

    // Phase 2: Show the prompt, let them complete it and tap Done
    const chosenType = selectedOption || lockedAnswer?.choice;
    const promptText = chosenType === 'truth' ? question.truth : question.dare;
    const isAlreadyLocked = Boolean(lockedAnswer);

    return (
      <div className="animate-fade-in">
        {/* Chosen type badge */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '5px 18px',
              borderRadius: 'var(--radius-pill)',
              background: chosenType === 'truth'
                ? 'rgba(248, 201, 216, 0.6)'
                : 'rgba(255, 200, 100, 0.35)',
              border: '1.5px solid var(--color-muted-rose)',
              fontWeight: 800, fontSize: '0.9rem',
            }}
          >
            {chosenType === 'truth' ? '🌸 Truth' : '🔥 Dare'}
          </span>
        </div>

        {/* Prompt card */}
        <div
          className="glass-card"
          style={{
            padding: '22px 18px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248, 201, 216, 0.25) 100%)',
            border: '1.5px solid var(--color-muted-rose)',
            marginBottom: '20px',
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.55,
            color: 'var(--color-warm-brown)',
          }}
        >
          {promptText}
        </div>

        {/* Change mind or Done */}
        {!isAlreadyLocked ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-pill-primary animate-pulse-subtle"
              onClick={handleTodDone}
              disabled={submitting}
            >
              {submitting ? 'Locking...' : 'I Did It! Done ✅'}
            </button>
            <button
              type="button"
              className="btn-pill-secondary"
              style={{ fontSize: '0.84rem' }}
              onClick={() => { setTodPhase('pick'); setSelectedOption(null); }}
            >
              ← Change my pick
            </button>
          </div>
        ) : (
          /* Waiting for partner */
          <div
            style={{
              textAlign: 'center', padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1.5px dashed var(--color-muted-rose)',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
              🔒 Done! Waiting for {partnerPetName}...
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-brown-light)', margin: 0 }}>
              Answers will reveal together when they finish too!
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── Lock / Waiting helper (shared for This or That + Know Me) ────────────────
  const renderLockOrWaiting = () => {
    if (lockedAnswer) {
      return (
        <div
          style={{
            textAlign: 'center', padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1.5px dashed var(--color-muted-rose)',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
            🔒 Your Answer is Locked!
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-brown-light)', margin: 0 }}>
            Waiting for <strong>{partnerPetName}</strong> to lock their answer... Answers will reveal together!
          </p>
        </div>
      );
    }
    return (
      <button
        type="button"
        disabled={!selectedOption || submitting}
        className="btn-pill-primary animate-pulse-subtle"
        onClick={handleLockAnswer}
      >
        {submitting ? 'Locking...' : 'Lock My Answer 🔒'}
      </button>
    );
  };

  // ── Question text to display ─────────────────────────────────────────────────
  const questionText = question?.text || '';

  // ── Confirm & go home mid-game ───────────────────────────────────────────────
  const handleGoHome = () => {
    const ok = window.confirm('Leave the game? Your progress on this question will not be saved.');
    if (ok) navigate('/');
  };

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="glass-card">

        {/* Top Bar — Home button + Stage + Level */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          {/* Home button (left) */}
          <button
            type="button"
            onClick={handleGoHome}
            title="Go to Home"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid var(--color-glass-border)',
              borderRadius: 'var(--radius-pill)',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-warm-brown)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🏠 Home
          </button>

          {/* Stage chip (center) */}
          <span className="badge-chip pink" style={{ fontSize: '0.75rem' }}>
            {question?.stageEmoji || '🌸'} Stage {currentStage}: {stageName}
          </span>

          {/* Level chip (right) */}
          <span className="badge-chip lavender" style={{ fontWeight: 800, fontSize: '0.75rem' }}>
            {config.icon} {currentLevel}/60
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '7px', width: '100%',
            background: 'rgba(74, 47, 42, 0.08)',
            borderRadius: 'var(--radius-pill)', overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(currentLevel / 60) * 100}%`,
              background: 'linear-gradient(90deg, #F8C9D8, #D985A3)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(235, 87, 87, 0.12)',
              border: '1px solid rgba(235, 87, 87, 0.3)',
              color: '#9E2A2B', fontSize: '0.84rem', marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Mascot + Question text */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
            <LoveBug
              mood={revealed ? (isMatch ? 'love' : 'happy') : lockedAnswer ? 'sleepy' : 'happy'}
              size={80}
            />
          </div>

          {/* Show question text for This or That & Know Me always.
              For Truth or Dare: show a round header during pick phase only. */}
          {gameKey === 'truth_or_dare' ? (
            todPhase === 'pick' && !lockedAnswer ? (
              <h2 style={{ fontSize: '1.15rem', lineHeight: 1.4, color: 'var(--color-warm-brown)' }}>
                Round {currentLevel} — Choose your path! 🎭
              </h2>
            ) : null
          ) : (
            <h2 style={{ fontSize: '1.2rem', lineHeight: 1.4, color: 'var(--color-warm-brown)' }}>
              {questionText}
            </h2>
          )}
        </div>

        {/* ── GAME BODY ── */}
        {revealed ? renderReveal() : (
          <>
            {gameKey === 'this_or_that' && renderThisOrThat()}
            {gameKey === 'know_me' && renderKnowMe()}
            {gameKey === 'truth_or_dare' && renderTruthOrDare()}
          </>
        )}

      </div>
    </div>
  );
}
