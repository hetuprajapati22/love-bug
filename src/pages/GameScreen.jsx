import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import { supabase } from '../lib/supabaseClient';
import LoveBug from '../components/mascot/LoveBug';
import { thisOrThatQuestions } from '../games/thisOrThat/thisOrThatQuestions';

/**
 * GameScreen Component
 * The synchronized real-time question screen for couples.
 * Locks answer independently, reveals ONLY when both submitted.
 */
export default function GameScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const { user, profile, couple } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lockedAnswer, setLockedAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [revealData, setRevealData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentLevel = session?.current_level || 1;
  const questionIndex = Math.min(Math.max(1, currentLevel), 60) - 1;
  const question = thisOrThatQuestions[questionIndex] || thisOrThatQuestions[0];
  const currentStage = question.stage;
  const stageNames = ['Playful', 'Cozy', 'Closer', 'Deep', 'Heart-to-heart'];

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';

  // Load session & check existing answer on mount or level change
  const loadSessionState = useCallback(async () => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    try {
      const sess = await sessionService.getSession(sessionId);
      if (!sess) {
        navigate('/');
        return;
      }
      setSession(sess);

      // Check if already answered current level
      const answers = await sessionService.getLevelAnswers(sessionId, sess.current_level);
      const myAns = answers.find((a) => a.user_id === user.id);
      if (myAns) {
        setLockedAnswer(myAns.answer);
      } else {
        setLockedAnswer(null);
        setSelectedOption(null);
      }

      // If both answered, reveal!
      if (answers.length >= 2) {
        const p1Ans = answers.find((a) => a.user_id === sess.partner_1_id);
        const p2Ans = answers.find((a) => a.user_id === sess.partner_2_id);
        setRevealData({
          partner_1_answer: p1Ans?.answer,
          partner_2_answer: p2Ans?.answer,
        });
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
  }, [sessionId, user?.id, navigate]);

  useEffect(() => {
    loadSessionState();
  }, [loadSessionState]);

  // Real-time listener for answer inserts and level advances
  useEffect(() => {
    if (!sessionId) return;

    // Listen for level answers
    const answersChannel = supabase
      .channel(`answers_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_answers',
          filter: `session_id=eq.${sessionId}`,
        },
        async () => {
          await loadSessionState();
        }
      )
      .subscribe();

    // Listen for session level changes
    const sessionChannel = supabase
      .channel(`game_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new;
          setSession(updated);
          setSelectedOption(null);
          setLockedAnswer(null);
          setRevealed(false);
          setRevealData(null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(answersChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [sessionId, loadSessionState]);

  // Lock answer
  const handleLockAnswer = async () => {
    if (!selectedOption || lockedAnswer || submitting) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await sessionService.submitAnswer(sessionId, currentLevel, {
        choice: selectedOption,
        text: selectedOption === 'A' ? question.optionA : question.optionB,
      });

      setLockedAnswer({
        choice: selectedOption,
        text: selectedOption === 'A' ? question.optionA : question.optionB,
      });

      if (res.both_answered) {
        setRevealData({
          partner_1_answer: res.partner_1_answer,
          partner_2_answer: res.partner_2_answer,
        });
        setRevealed(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Advance level
  const handleNextQuestion = async () => {
    if (advancing) return;
    setAdvancing(true);
    setErrorMsg('');
    try {
      const res = await sessionService.advanceLevel(sessionId);
      if (res.status === 'completed') {
        alert('Congratulations! You completed all questions! Result screen unlocks in Step 8 💌');
        navigate('/');
      } else {
        setSelectedOption(null);
        setLockedAnswer(null);
        setRevealed(false);
        setRevealData(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not advance to next question.');
    } finally {
      setAdvancing(false);
    }
  };

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

  // Check match if revealed
  const isMatch =
    revealed &&
    revealData?.partner_1_answer?.choice === revealData?.partner_2_answer?.choice;

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="glass-card">
        {/* Top Bar: Progress and Level indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span className="badge-chip pink">
            Stage {currentStage}: {stageNames[currentStage - 1] || 'Playful'}
          </span>
          <span className="badge-chip lavender" style={{ fontWeight: 800 }}>
            Level {currentLevel} of 60
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '7px',
            width: '100%',
            background: 'rgba(74, 47, 42, 0.08)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
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

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(235, 87, 87, 0.12)',
              border: '1px solid rgba(235, 87, 87, 0.3)',
              color: '#9E2A2B',
              fontSize: '0.84rem',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Question Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
            <LoveBug mood={revealed ? (isMatch ? 'love' : 'happy') : lockedAnswer ? 'sleepy' : 'happy'} size={80} />
          </div>
          <h2 style={{ fontSize: '1.25rem', lineHeight: 1.35, color: 'var(--color-warm-brown)' }}>
            {question.text}
          </h2>
        </div>

        {/* REVEAL STATE (Both submitted) */}
        {revealed ? (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            {/* Match Banner */}
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg)',
                background: isMatch
                  ? 'linear-gradient(135deg, rgba(248, 201, 216, 0.9) 0%, rgba(220, 212, 247, 0.9) 100%)'
                  : 'rgba(255, 255, 255, 0.85)',
                border: '1.5px solid var(--color-muted-rose)',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '4px' }}>
                {isMatch ? '💖 It\'s a Match!' : '✨ Sweet Choices!'}
              </span>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>
                {isMatch ? 'You both feel exactly the same way!' : 'Different choices make conversations even sweeter!'}
              </p>
            </div>

            {/* Revealed Answers Comparison */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1.5px solid var(--color-glass-border)',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
                  {session.is_partner_1 ? myPetName : partnerPetName}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, marginTop: '6px' }}>
                  {revealData?.partner_1_answer?.text}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1.5px solid var(--color-glass-border)',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
                  {session.is_partner_1 ? partnerPetName : myPetName}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, marginTop: '6px' }}>
                  {revealData?.partner_2_answer?.text}
                </div>
              </div>
            </div>

            {/* Next Question CTA */}
            <button
              type="button"
              className="btn-pill-primary animate-pulse-subtle"
              onClick={handleNextQuestion}
              disabled={advancing}
            >
              {advancing ? 'Loading Next...' : 'Next Question ➔'}
            </button>
          </div>
        ) : (
          /* PLAYING / LOCKING STATE */
          <div>
            {/* Option Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                disabled={Boolean(lockedAnswer)}
                onClick={() => setSelectedOption('A')}
                className={`glass-card ${!lockedAnswer ? 'interactive-card' : ''}`}
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  border: selectedOption === 'A' ? '2px solid var(--color-deep-rose)' : '1.5px solid var(--color-glass-border)',
                  background: selectedOption === 'A' ? 'rgba(248, 201, 216, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                  cursor: lockedAnswer ? 'default' : 'pointer',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--color-warm-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{question.optionA}</span>
                {selectedOption === 'A' && <span>💗</span>}
              </button>

              <button
                type="button"
                disabled={Boolean(lockedAnswer)}
                onClick={() => setSelectedOption('B')}
                className={`glass-card ${!lockedAnswer ? 'interactive-card' : ''}`}
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  border: selectedOption === 'B' ? '2px solid var(--color-deep-rose)' : '1.5px solid var(--color-glass-border)',
                  background: selectedOption === 'B' ? 'rgba(248, 201, 216, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                  cursor: lockedAnswer ? 'default' : 'pointer',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--color-warm-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{question.optionB}</span>
                {selectedOption === 'B' && <span>💗</span>}
              </button>
            </div>

            {/* Lock / Waiting Status */}
            {lockedAnswer ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
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
            ) : (
              <button
                type="button"
                disabled={!selectedOption || submitting}
                className="btn-pill-primary animate-pulse-subtle"
                onClick={handleLockAnswer}
              >
                {submitting ? 'Locking...' : 'Lock My Answer 🔒'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
