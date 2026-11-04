import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coupleService } from '../services/coupleService';
import { authService } from '../services/authService';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * Settings Component
 * Complete settings dashboard for Love Bug:
 * Profile customization, Sound, Couple management, and Admin access.
 */
export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, couple, isCoupled, handleUpdateProfile, signOut, refreshUserData } = useAuth();

  const [petName, setPetName] = useState(profile?.pet_name || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [heartColor, setHeartColor] = useState(profile?.heart_color || '#F8C9D8');
  const [muted, setMuted] = useState(soundEffects.isMuted());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unlinking, setUnlinking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm(
      'WARNING: Are you sure you want to permanently delete your Love Bug account? All your game answers and profile will be deleted.'
    );
    if (!confirm1) return;

    const confirm2 = window.prompt('To confirm deletion, please type "DELETE" below:');
    if (confirm2 !== 'DELETE') {
      alert('Account deletion canceled.');
      return;
    }

    setDeleting(true);
    try {
      await authService.deleteAccount();
      alert('Your account has been deleted. We hope to see you again!');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Could not delete account.');
    } finally {
      setDeleting(false);
    }
  };

  const colorPresets = [
    { name: 'Blush Pink', hex: '#F8C9D8' },
    { name: 'Warm Cream', hex: '#FFF5E5' },
    { name: 'Soft Lavender', hex: '#DCD4F7' },
    { name: 'Soft Sage', hex: '#C9DCCB' },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!petName.trim()) {
      setErrorMsg('Please enter a cute pet name!');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      await handleUpdateProfile({
        pet_name: petName.trim(),
        full_name: fullName.trim() || profile?.full_name,
        heart_color: heartColor,
      });
      soundEffects.playPop();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSound = () => {
    const isNowMuted = soundEffects.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundEffects.playPop();
  };

  const handleLeaveCouple = async () => {
    const ok = window.confirm(
      'Are you sure you want to unlink from your partner? You can reconnect anytime with a new invite code.'
    );
    if (!ok) return;

    setUnlinking(true);
    try {
      await coupleService.leaveCouple();
      await refreshUserData();
      navigate('/couple');
    } catch (err) {
      alert(err.message || 'Could not unlink');
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '50px' }}>
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
          ← Back to Home
        </button>
        <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-warm-brown)' }}>
          Settings ⚙️
        </h2>
        <div style={{ width: '80px' }} />
      </div>

      {/* Main Settings Card */}
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <LoveBug mood="happy" size={60} />
          <h3 style={{ fontSize: '1.15rem', marginTop: '6px', marginBottom: '2px' }}>
            Profile & Love Customizer
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-brown-light)' }}>
            Personalize how your partner sees you in games and chat
          </p>
        </div>

        {saveSuccess && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(127, 184, 138, 0.2)',
              border: '1px solid #7FB88A',
              color: '#2D6A4F',
              fontSize: '0.84rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '14px',
            }}
          >
            ✓ Settings saved beautifully! 💗
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(235, 87, 87, 0.12)',
              border: '1px solid rgba(235, 87, 87, 0.3)',
              color: '#9E2A2B',
              fontSize: '0.84rem',
              marginBottom: '14px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
              Your Cute Pet Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Honey, Love Bug, Sweetie"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '0.94rem',
                color: 'var(--color-warm-brown)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
              Your Real / Display Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-glass-border)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '0.94rem',
                color: 'var(--color-warm-brown)',
                outline: 'none',
              }}
            />
          </div>

          {/* Heart Color Themes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
              Aesthetic Theme Color
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {colorPresets.map((preset) => {
                const selected = heartColor === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setHeartColor(preset.hex);
                      soundEffects.playPop();
                    }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 'var(--radius-md)',
                      background: preset.hex,
                      border: selected ? '2.5px solid var(--color-warm-brown)' : '1px solid rgba(74,47,42,0.15)',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: 'var(--color-warm-brown)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{selected ? '💗' : '✨'}</span>
                    <span>{preset.name.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-pill-primary"
            style={{ marginTop: '8px' }}
          >
            {saving ? 'Saving...' : 'Save Profile Changes 💾'}
          </button>
        </form>
      </div>

      {/* Audio & Sound Preferences */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '18px 20px' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: 'var(--color-warm-brown)' }}>
          Audio & Sounds 🎵
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Game Sound Effects</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-warm-brown-light)' }}>
              Romantic chimes on match, lock ticks & messages
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className="badge-chip pink"
            style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.86rem' }}
          >
            {muted ? '🔇 Muted (Tap to unmute)' : '🔊 Sound ON'}
          </button>
        </div>
      </div>

      {/* Couple Pairing Status */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '18px 20px' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: 'var(--color-warm-brown)' }}>
          Couple Relationship 💑
        </h4>
        {isCoupled ? (
          <div>
            <p style={{ fontSize: '0.86rem', marginBottom: '12px' }}>
              Connected with <strong>{couple?.partner_pet_name || 'your partner'}</strong> 💗
            </p>
            <button
              type="button"
              className="btn-pill-secondary"
              onClick={handleLeaveCouple}
              disabled={unlinking}
              style={{ fontSize: '0.82rem', color: '#9E2A2B', borderColor: 'rgba(235,87,87,0.3)' }}
            >
              {unlinking ? 'Unlinking...' : 'Unlink / Leave Couple'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.86rem', marginBottom: '12px' }}>
              You haven't paired up with your partner yet.
            </p>
            <button
              type="button"
              className="btn-pill-primary"
              onClick={() => navigate('/couple')}
              style={{ fontSize: '0.86rem', padding: '10px 20px' }}
            >
              🔗 Connect with Partner
            </button>
          </div>
        )}
      </div>

      {/* Couple Dashboard Access Card */}
      <div
        className="glass-card interactive-card"
        onClick={() => {
          soundEffects.playPop();
          navigate('/couple-dashboard');
        }}
        style={{
          marginBottom: '16px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(220, 212, 247, 0.6) 0%, rgba(248, 201, 216, 0.6) 100%)',
          border: '1.5px solid var(--color-muted-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>💑</span>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
              Couple Dashboard
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)' }}>
              View milestones, love streak & game controls
            </div>
          </div>
        </div>
        <span>➔</span>
      </div>

      {/* History, Legal & About Navigation Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/history');
          }}
          className="glass-card interactive-card"
          style={{ padding: '12px 6px', textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>📜</div>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
            History
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/privacy');
          }}
          className="glass-card interactive-card"
          style={{ padding: '12px 6px', textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>⚖️</div>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
            Privacy
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/about');
          }}
          className="glass-card interactive-card"
          style={{ padding: '12px 6px', textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>🌸</div>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
            About
          </div>
        </button>
      </div>

      {/* Account Actions: Logout & Delete */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <button
          type="button"
          className="btn-pill-secondary"
          onClick={signOut}
          style={{ width: '100%', maxWidth: '280px', padding: '10px 24px', fontSize: '0.86rem' }}
        >
          Log Out of Love Bug
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          style={{
            background: 'none',
            border: 'none',
            color: '#B91C1C',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '6px 12px',
            textDecoration: 'underline',
            marginTop: '8px',
          }}
        >
          {deleting ? 'Deleting Account...' : '🗑️ Delete My Account Permanently'}
        </button>

        {/* Private Owner Access Link */}
        <div style={{ marginTop: '16px', opacity: 0.5 }}>
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              navigate('/admin');
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.72rem',
              color: 'var(--color-warm-brown-light)',
              cursor: 'pointer',
            }}
          >
            🔒 Owner Space
          </button>
        </div>
      </div>
    </div>
  );
}
