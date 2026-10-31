import React from 'react';
import LoveBug from '../mascot/LoveBug';
import { soundEffects } from '../../utils/soundEffects';

/**
 * StatsModal Component
 * Shows sweet couple milestones, streak, and love achievements.
 */
export default function StatsModal({ isOpen, onClose, myPetName, partnerPetName, onEditProfile }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(74, 47, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(255, 252, 248, 0.98)',
          border: '2px solid var(--color-muted-rose)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 20px',
          textAlign: 'center',
          boxShadow: '0 20px 48px rgba(74, 47, 42, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mascot */}
        <div className="animate-mascot-bob" style={{ marginBottom: '10px' }}>
          <LoveBug mood="love" size={72} />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
          {myPetName} & {partnerPetName}
        </h3>
        <span className="badge-chip pink" style={{ fontSize: '0.76rem', marginBottom: '16px' }}>
          👑 The Inseparable Sweethearts
        </span>

        {/* Milestone Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(248, 201, 216, 0.4)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🔥</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              1 Day
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Current Streak
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(220, 212, 247, 0.4)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>💌</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              180
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Questions Available
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(201, 220, 203, 0.4)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🎮</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              3 Games
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Play Modes
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 245, 229, 0.8)',
              border: '1.5px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>💖</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              100%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 700 }}>
              Love Rating
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="btn-pill-primary"
            onClick={() => {
              soundEffects.playPop();
              onClose();
              onEditProfile();
            }}
            style={{ fontSize: '0.86rem', padding: '10px 20px' }}
          >
            ✏️ Edit My Pet Name & Profile
          </button>

          <button
            type="button"
            className="btn-pill-secondary"
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            style={{ fontSize: '0.86rem', padding: '8px 20px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
