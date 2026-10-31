import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import { supabase } from '../lib/supabaseClient';
import LoveBug from '../components/mascot/LoveBug';

/**
 * Lobby Component
 * Two-mascot waiting room for real-time synchronization.
 * The game ONLY starts when the database verifies both partners are ready.
 */
export default function Lobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('game') || 'this_or_that';

  const { user, profile, couple, isCoupled } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [starting, setStarting] = useState(false);

  const gameTitles = {
    this_or_that: 'This or That 💗',
    know_me: 'How Well Do You Know Me? 🥹',
    truth_or_dare: 'Truth or Dare 😈',
  };

  // Join or create the lobby session on mount
  const initLobby = useCallback(async () => {
    if (!isCoupled) {
      navigate('/couple');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const data = await sessionService.joinOrCreateLobby(gameType);
      setSession(data);

      // If already active, prepare to start
      if (data.status === 'active') {
        setStarting(true);
        setTimeout(() => {
          navigate(`/play?session=${data.session_id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to initialize lobby:', err);
      setErrorMsg(err.message || 'Could not connect to lobby.');
    } finally {
      setLoading(false);
    }
  }, [gameType, isCoupled, navigate]);

  useEffect(() => {
    initLobby();
  }, [initLobby]);

  // Real-time listener for the session
  useEffect(() => {
    if (!session?.session_id) return;

    const channel = supabase
      .channel(`session_${session.session_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${session.session_id}`,
        },
        (payload) => {
          const updated = payload.new;
          setSession((prev) => ({
            ...prev,
            status: updated.status,
            partner_1_ready: updated.partner_1_ready,
            partner_2_ready: updated.partner_2_ready,
            current_level: updated.current_level,
          }));

          // When server transitions to 'active'
          if (updated.status === 'active') {
            setStarting(true);
            setTimeout(() => {
              navigate(`/play?session=${updated.id}`);
            }, 1200);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.session_id, navigate]);

  const handleLeaveLobby = async () => {
    if (session?.session_id) {
      await sessionService.leaveLobby(session.session_id);
    }
    navigate('/');
  };

  // Determine readiness states
  const isP1 = session?.is_partner_1;
  const myReady = isP1 ? session?.partner_1_ready : session?.partner_2_ready;
  const partnerReady = isP1 ? session?.partner_2_ready : session?.partner_1_ready;

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="glass-card" style={{ textAlign: 'center' }}>
        {/* Game Title Header */}
        <div style={{ marginBottom: '20px' }}>
          <div className="badge-chip pink" style={{ marginBottom: '8px' }}>
            <span>{gameTitles[gameType] || 'Couple Game'}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            <span className="shimmer-text">Waiting Lobby</span>
          </h2>
          <p style={{ fontSize: '0.86rem' }}>
            {starting
              ? 'Both Love Bugs connected! Launching questions...'
              : 'Waiting for both of you to be ready before starting!'}
          </p>
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

        {/* Two Mascots Presentation Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            background: 'var(--color-glass-card-inner)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 12px',
            border: '1.5px solid var(--color-glass-border)',
            marginBottom: '24px',
          }}
        >
          {/* My Mascot */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div className={myReady ? 'animate-mascot-bob' : ''}>
              <LoveBug mood={myReady ? 'love' : 'happy'} size={88} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-warm-brown)' }}>
              {myPetName}
            </div>
            <span className="badge-chip sage" style={{ fontSize: '0.72rem' }}>
              ✓ Ready
            </span>
          </div>

          {/* Sweet Heart Connector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
            <span
              style={{
                fontSize: '1.8rem',
                animation: starting ? 'pulseHeartbeat 1s infinite' : 'none',
              }}
            >
              {starting ? '💖' : '✨'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 700, marginTop: '4px' }}>
              {starting ? 'MATCHED' : 'VS'}
            </span>
          </div>

          {/* Partner Mascot (Faded until ready) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              opacity: partnerReady ? 1 : 0.45,
              transition: 'opacity 0.5s ease',
            }}
          >
            <div className={partnerReady ? 'animate-mascot-bob' : ''}>
              <LoveBug mood={partnerReady ? 'love' : 'sleepy'} size={88} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-warm-brown)' }}>
              {partnerPetName}
            </div>
            <span className={`badge-chip ${partnerReady ? 'sage' : 'lavender'}`} style={{ fontSize: '0.72rem' }}>
              {partnerReady ? '✓ Ready' : '⏳ Waiting...'}
            </span>
          </div>
        </div>

        {/* Live Status Message */}
        <div style={{ marginBottom: '24px' }}>
          {starting ? (
            <div className="badge-chip pink" style={{ padding: '8px 18px', fontSize: '0.92rem' }}>
              <span>🚀 Starting Game Together!</span>
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--color-warm-brown-light)' }}>
              Ask <strong>{partnerPetName}</strong> to open their app and tap <em>Play Together</em>!
            </p>
          )}
        </div>

        {/* Leave Lobby Button */}
        <div>
          <button
            type="button"
            className="btn-pill-secondary"
            onClick={handleLeaveLobby}
            style={{ width: 'auto', padding: '8px 24px', fontSize: '0.85rem' }}
          >
            ← Leave Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
