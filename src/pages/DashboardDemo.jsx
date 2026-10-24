import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoveBug from '../components/mascot/LoveBug';

/**
 * DashboardDemo Component
 * Interactive visual demonstration of the couple's Dashboard with sample data.
 * Showcases: pet names, streak, play together CTA, 3 game cards, mascot moods, and aesthetics.
 */
export default function DashboardDemo() {
  const navigate = useNavigate();
  const [mascotMood, setMascotMood] = useState('happy');

  // Sample couple data for visual demo
  const sampleCouple = {
    myPetName: 'Bunny 🐰',
    partnerPetName: 'Bear 🐻',
    streakDays: 7,
    lastActive: 'Just now',
  };

  const games = [
    {
      id: 'this-or-that',
      title: 'This or That',
      icon: '💗',
      tagline: 'See how well your choices align',
      stage: 'Stage 2: Cozy',
      progress: 35,
      scoreText: '18 matches so far',
      badgeClass: 'pink',
    },
    {
      id: 'know-me',
      title: 'How Well Do You Know Me?',
      icon: '🥹',
      tagline: 'Guess each other’s inner thoughts',
      stage: 'Stage 1: Playful',
      progress: 20,
      scoreText: '10 matches so far',
      badgeClass: 'lavender',
    },
    {
      id: 'truth-or-dare',
      title: 'Truth or Dare',
      icon: '😈',
      tagline: 'Sweet, funny & romantic prompts',
      stage: 'Stage 3: Closer',
      progress: 52,
      scoreText: '28 completed',
      badgeClass: 'sage',
    },
  ];

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Top Bar: Couple Greeting & Streak */}
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
              TOGETHER WITH
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
              {sampleCouple.myPetName} & {sampleCouple.partnerPetName}
            </div>
          </div>
        </div>

        {/* Love Streak Badge */}
        <div
          className="badge-chip pink"
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          title="7-day daily connection streak"
        >
          <span>🔥</span>
          <strong>{sampleCouple.streakDays} Days</strong>
        </div>
      </div>

      {/* Hero Card: Play Together CTA */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="animate-mascot-bob" style={{ marginBottom: '12px' }}>
          <LoveBug mood={mascotMood} size={95} />
        </div>

        <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>
          Ready for today's connection?
        </h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px', padding: '0 10px' }}>
          Both of you join the same room to unlock and reveal answers together!
        </p>

        {/* Big Pulsing Play Together Button */}
        <button
          type="button"
          className="btn-pill-primary animate-pulse-subtle"
          onClick={() => alert('Play Together game engine connects in Step 5!')}
          style={{ fontSize: '1.08rem', padding: '16px 32px', marginBottom: '12px' }}
        >
          <span>Play Together 🐛💗</span>
        </button>

        {/* Mascot Mood Switcher (For testing animations) */}
        <div style={{ marginTop: '14px', borderTop: '1px dashed var(--color-glass-border)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--color-warm-brown-light)', display: 'block', marginBottom: '6px' }}>
            TEST MASCOT MOODS:
          </span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {['happy', 'sleepy', 'sad', 'love'].map((mood) => (
              <button
                key={mood}
                type="button"
                className={`badge-chip ${mascotMood === mood ? 'pink' : ''}`}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                onClick={() => setMascotMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Invite Card (for partner) */}
      <div
        className="glass-card interactive-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(235, 247, 237, 0.75)',
          borderColor: 'rgba(127, 184, 138, 0.4)',
        }}
        onClick={() => alert('WhatsApp invite link generator will be active in Step 4!')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>💬</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#275231' }}>
              Invite Partner on WhatsApp
            </div>
            <div style={{ fontSize: '0.78rem', color: '#476E4F' }}>
              Room Code: <strong>LB-7K3Q</strong> (Tap to share)
            </div>
          </div>
        </div>
        <span style={{ fontSize: '1.2rem', color: '#275231' }}>➔</span>
      </div>

      {/* 3 Games Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', paddingLeft: '4px' }}>
          Our Games 🎮
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {games.map((game) => (
            <div
              key={game.id}
              className="glass-card interactive-card"
              style={{ padding: '18px 20px' }}
              onClick={() => alert(`Starting ${game.title} will be configured in Step 7!`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{game.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{game.title}</h4>
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>{game.tagline}</p>
                  </div>
                </div>
                <span className={`badge-chip ${game.badgeClass}`}>
                  {game.stage}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    height: '8px',
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
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    fontSize: '0.75rem',
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

      {/* Combined Result & Romantic Letter Teaser */}
      <div
        className="glass-card"
        style={{
          marginTop: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 245, 229, 0.8) 0%, rgba(248, 201, 216, 0.6) 100%)',
        }}
      >
        <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>💌</span>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Combined Love Letter</h4>
        <p className="romantic-text" style={{ fontSize: '1.18rem', margin: '6px 0 14px' }}>
          "Complete all 3 games together to seal your special love letter..."
        </p>
        <span className="badge-chip lavender" style={{ fontSize: '0.76rem' }}>
          🔒 Unlocks when all 3 games reach 60 levels
        </span>
      </div>

      {/* Return to Login */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          type="button"
          className="btn-pill-secondary"
          onClick={() => navigate('/')}
          style={{ width: 'auto', padding: '8px 24px', fontSize: '0.85rem' }}
        >
          ← Back to Login Screen
        </button>
      </div>
    </div>
  );
}
