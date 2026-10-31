import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoveBug from '../components/mascot/LoveBug';

/**
 * ProfileSetup Page
 * Allows new or existing users to customize their real name, romantic pet name, and heart color.
 */
export default function ProfileSetup() {
  const { user, profile, updateProfile, isCoupled } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [petName, setPetName] = useState('');
  const [heartColor, setHeartColor] = useState('#F8C9D8');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Heart color presets
  const colorOptions = [
    { label: 'Blush Pink', value: '#F8C9D8' },
    { label: 'Soft Lavender', value: '#DCD4F7' },
    { label: 'Muted Rose', value: '#D985A3' },
    { label: 'Soft Sage', value: '#C9DCCB' },
  ];

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      // Only pre-fill pet name if it's already a custom name (not identical to real full name or default fallback)
      const isDefaultPetName =
        !profile.pet_name ||
        profile.pet_name === profile.full_name ||
        profile.pet_name === 'Love Bug' ||
        profile.pet_name === 'Sweetheart';

      setPetName(isDefaultPetName ? '' : profile.pet_name);
      setHeartColor(profile.heart_color || '#F8C9D8');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!petName.trim()) {
      setErrorMsg('Please enter a cute pet name (e.g. Bunny, Honey, Sweetheart)!');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName,
        petName,
        heartColor,
        setupCompleted: true,
      });

      // If user is already coupled, go to dashboard, else go to couple room to connect
      if (isCoupled) {
        navigate('/');
      } else {
        navigate('/couple');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in">
      <div className="glass-card">
        {/* Mascot */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }} className="animate-mascot-bob">
          <LoveBug mood="love" size={96} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '6px' }}>
            <span className="shimmer-text">Your Love Profile</span>
          </h2>
          <p style={{ fontSize: '0.88rem' }}>
            Choose a sweet pet name your partner will see during your games & letters!
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-warm-brown)' }}
            >
              Your Real Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--color-warm-brown)',
                outline: 'none',
              }}
            />
          </div>

          {/* Cute Pet Name */}
          <div>
            <label
              htmlFor="petName"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-warm-brown)' }}
            >
              Cute Pet Name 🐛💗
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Bunny 🐰, Bear 🐻, Honey, Sweetheart"
              required
              maxLength={24}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--color-warm-brown)',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)', marginTop: '4px', display: 'block' }}>
              This name will appear on answer reveals and score cards.
            </span>
          </div>

          {/* Heart Color Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-warm-brown)' }}>
              Favorite Heart Color
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHeartColor(opt.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: heartColor === opt.value ? '2px solid var(--color-warm-brown)' : '1.5px solid var(--color-glass-border)',
                    background: opt.value,
                    color: 'var(--color-warm-brown)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transform: heartColor === opt.value ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  💗 {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-pill-primary animate-pulse-subtle"
            >
              {saving ? 'Saving...' : 'Save & Continue ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
