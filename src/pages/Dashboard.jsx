import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coupleService } from '../services/coupleService';
import LoveBug from '../components/mascot/LoveBug';

/**
 * Dashboard Component
 * Real live dashboard connected to Supabase auth, couple pairing, and game launcher.
 */
export default function Dashboard() {
  const { profile, couple, isCoupled, signOut, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [mascotMood, setMascotMood] = useState('happy');
  const [unlinking, setUnlinking] = useState(false);

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

        {/* Streak or Connect Badge */}
        {isCoupled ? (
          <div className="badge-chip pink" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
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
            <span>🔗 Connect Partner</span>
          </button>
        )}
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
          onClick={() => alert('Realtime Play Together lobby launches in Step 5!')}
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
                  alert(`${game.title} question screens start in Step 7!`);
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

      {/* Combined Result Teaser */}
      <div
        className="glass-card"
        style={{
          marginTop: '16px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 245, 229, 0.8) 0%, rgba(248, 201, 216, 0.6) 100%)',
        }}
      >
        <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '4px' }}>💌</span>
        <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Combined Love Letter</h4>
        <p className="romantic-text" style={{ fontSize: '1.15rem', margin: '4px 0 10px' }}>
          "Complete all 3 games together to seal your special love letter..."
        </p>
        <span className="badge-chip lavender" style={{ fontSize: '0.74rem' }}>
          🔒 Unlocks when all 3 games reach 60 levels
        </span>
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
    </div>
  );
}
