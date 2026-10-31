import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coupleService } from '../services/coupleService';
import LoveBug from '../components/mascot/LoveBug';
import StatsModal from '../components/ui/StatsModal';
import { soundEffects } from '../utils/soundEffects';

/**
 * Dashboard Component
 * Real live dashboard connected to Supabase auth, couple pairing, and game launcher.
 */
export default function Dashboard() {
  const { profile, couple, isCoupled, signOut, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [mascotMood, setMascotMood] = useState('happy');
  const [unlinking, setUnlinking] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [muted, setMuted] = useState(soundEffects.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = soundEffects.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundEffects.playPop();
  };

  const games = [
    {
      id: 'this-or-that',
      title: 'This or That',
      icon: '💗',
      tagline: 'See how well your choices align',
      stage: 'Stage 1: Playful',
      progress: 0,
      scoreText: '0 / 60 levels',
      badgeClass: 'pink',
    },
    {
      id: 'know-me',
      title: 'How Well Do You Know Me?',
      icon: '🥹',
      tagline: 'Guess each other’s inner thoughts',
      stage: 'Stage 1: Playful',
      progress: 0,
      scoreText: '0 / 60 levels',
      badgeClass: 'lavender',
    },
    {
      id: 'truth-or-dare',
      title: 'Truth or Dare',
      icon: '😈',
      tagline: 'Sweet, funny & romantic prompts',
      stage: 'Stage 1: Playful',
      progress: 0,
      scoreText: '0 / 60 levels',
      badgeClass: 'sage',
    },
  ];

  // Handle Leave Couple with confirmation
  const handleLeaveCouple = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to unlink from your partner? You can reconnect anytime with a new invite code.'
    );
    if (!confirmed) return;

    setUnlinking(true);
    try {
      await coupleService.leaveCouple();
      await refreshUserData();
      navigate('/couple');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to unlink.');
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Top Header Card: Couple Pet Names & Status */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LoveBug mood={mascotMood} size={48} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-warm-brown-light)', fontWeight: 600 }}>
              {isCoupled ? 'TOGETHER WITH' : 'WELCOME'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
                {isCoupled ? (
                  <>
                    {profile?.pet_name || 'You'} & {couple?.partner_pet_name || 'Partner'}
                  </>
                ) : (
                  profile?.pet_name || 'Love Bug'
                )}
              </div>
              <button
                type="button"
                onClick={() => navigate('/setup')}
                title="Edit My Pet Name & Profile"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  opacity: 0.65,
                  padding: '2px',
                }}
              >
                ✏️
              </button>
            </div>
          </div>
        </div>

        {/* Header Controls: Sound & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleToggleSound}
            title={muted ? 'Unmute Sounds' : 'Mute Sounds'}
            style={{
              background: 'none',
              border: '1.5px solid var(--color-glass-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              navigate('/settings');
            }}
            title="Open Settings"
            style={{
              background: 'none',
              border: '1.5px solid var(--color-glass-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
            }}
          >
            ⚙️
          </button>

          {isCoupled ? (
            <div
              className="badge-chip pink interactive-card"
              onClick={() => {
                soundEffects.playPop();
                setShowStats(true);
              }}
              style={{ padding: '6px 12px', fontSize: '0.82rem', cursor: 'pointer' }}
              title="View Couple Milestones & Stats"
            >
              <span>🔥</span>
              <strong>1 Day</strong>
            </div>
          ) : (
            <button
              type="button"
              className="badge-chip pink"
              onClick={() => navigate('/couple')}
              style={{ cursor: 'pointer', padding: '6px 12px' }}
            >
              <span>🔗 Connect</span>
            </button>
          )}
        </div>
      </div>

      {/* Unpaired Banner (If not coupled yet) */}
      {!isCoupled && (
        <div
          className="glass-card interactive-card"
          onClick={() => navigate('/couple')}
          style={{
            marginBottom: '18px',
            background: 'linear-gradient(135deg, rgba(248, 201, 216, 0.75) 0%, rgba(220, 212, 247, 0.75) 100%)',
            border: '1.5px solid var(--color-muted-rose)',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>💌</span>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>You haven't paired up yet!</h3>
          <p style={{ fontSize: '0.86rem', marginBottom: '12px' }}>
            Invite your partner or enter their invite code to start playing in real time.
          </p>
          <button type="button" className="btn-pill-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Invite / Join Partner ➔
          </button>
        </div>
      )}

      {/* Hero CTA Card: Play Together */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '12px' }}>
          <LoveBug mood={mascotMood} size={95} />
        </div>

        <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>
          Ready to play together?
        </h2>
        <p style={{ fontSize: '0.88rem', marginBottom: '18px', padding: '0 8px' }}>
          {isCoupled
            ? `Both you and ${couple?.partner_pet_name || 'your partner'} join to reveal questions simultaneously!`
            : 'Pair with your partner first to play together in real-time.'}
        </p>

        <button
          type="button"
          disabled={!isCoupled}
          className="btn-pill-primary animate-pulse-subtle"
          onClick={() => navigate('/lobby?game=this_or_that')}
          style={{ fontSize: '1.08rem', padding: '15px 32px', marginBottom: '12px' }}
        >
          <span>Play Together 🐛💗</span>
        </button>

        {/* Mascot Mood Switcher for fun */}
        <div style={{ marginTop: '14px', borderTop: '1px dashed var(--color-glass-border)', paddingTop: '10px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', display: 'block', marginBottom: '6px' }}>
            MASCOT MOOD:
          </span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {['happy', 'sleepy', 'sad', 'love'].map((m) => (
              <button
                key={m}
                type="button"
                className={`badge-chip ${mascotMood === m ? 'pink' : ''}`}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                onClick={() => setMascotMood(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Games Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', paddingLeft: '4px' }}>
          Our Games 🎮
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {games.map((game) => (
            <div
              key={game.id}
              className="glass-card interactive-card"
              style={{ padding: '16px 18px' }}
              onClick={() => {
                if (!isCoupled) {
                  navigate('/couple');
                } else {
                  const gType =
                    game.id === 'this-or-that'
                      ? 'this_or_that'
                      : game.id === 'know-me'
                      ? 'know_me'
                      : 'truth_or_dare';
                  navigate(`/lobby?game=${gType}`);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{game.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{game.title}</h4>
                    <p style={{ fontSize: '0.78rem', margin: 0 }}>{game.tagline}</p>
                  </div>
                </div>
                <span className={`badge-chip ${game.badgeClass}`}>
                  {game.stage}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '10px' }}>
                <div
                  style={{
                    height: '7px',
                    width: '100%',
                    background: 'rgba(74, 47, 42, 0.08)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${game.progress}%`,
                      background: 'linear-gradient(90deg, #F8C9D8, #D985A3)',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '5px',
                    fontSize: '0.74rem',
                    color: 'var(--color-warm-brown-light)',
                  }}
                >
                  <span>{game.scoreText}</span>
                  <span>{game.progress}% completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Result Card (Click to preview Love Letter!) */}
      <div
        className="glass-card interactive-card"
        onClick={() => {
          soundEffects.playPop();
          navigate('/results');
        }}
        style={{
          marginTop: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(255, 245, 229, 0.9) 0%, rgba(248, 201, 216, 0.7) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
        }}
      >
        <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '4px' }}>💌</span>
        <h4 style={{ fontSize: '1.08rem', marginBottom: '4px' }}>Our Sealed Love Letter</h4>
        <p className="romantic-text" style={{ fontSize: '1.2rem', margin: '4px 0 10px' }}>
          "Through every question, my heart finds its happiest home next to you..."
        </p>
        <button
          type="button"
          className="btn-pill-primary"
          style={{ width: 'auto', padding: '6px 18px', fontSize: '0.82rem' }}
        >
          View Love Letter & Chemistry ➔
        </button>
      </div>

      {/* Account & Unlink Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
        {isCoupled && (
          <button
            type="button"
            className="btn-pill-secondary"
            disabled={unlinking}
            onClick={handleLeaveCouple}
            style={{ fontSize: '0.85rem', color: '#9E2A2B', borderColor: 'rgba(235, 87, 87, 0.3)' }}
          >
            {unlinking ? 'Unlinking...' : 'Leave / Unlink Couple'}
          </button>
        )}

        <button
          type="button"
          className="btn-pill-secondary"
          onClick={signOut}
          style={{ fontSize: '0.85rem' }}
        >
          Log Out
        </button>
      </div>

      {/* Couple Milestones & Achievements Modal */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        myPetName={profile?.pet_name || 'You'}
        partnerPetName={couple?.partner_pet_name || 'Partner'}
        onEditProfile={() => navigate('/setup')}
      />
    </div>
  );
}
