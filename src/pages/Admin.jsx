import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import LoveBug from '../components/mascot/LoveBug';
import { soundEffects } from '../utils/soundEffects';

/**
 * Secret Admin Dashboard (Hetu's Eyes Only 🔒)
 * Displays all registered users, all couples, and game sessions activity.
 * Regular users cannot view this screen.
 */
export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [data, setData] = useState({
    total_users: 0,
    total_couples: 0,
    total_sessions: 0,
    couples: [],
    sessions: [],
  });
  const [activeTab, setActiveTab] = useState('couples'); // 'couples' | 'sessions'
  const [searchFilter, setSearchFilter] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [resetting, setResetting] = useState(false);
  const [showUnlinkedSide, setShowUnlinkedSide] = useState(true);

  // Authorized emails list
  const ADMIN_EMAILS = ['hetu2286@gmail.com', 'hetuprajapati22@gmail.com'];
  const SECRET_ADMIN_PASSKEY = 'lovebug2026';

  useEffect(() => {
    // Check if logged in user is Hetu
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      setAuthorized(true);
      fetchAdminData();
    } else {
      // Check if temporary PIN was already validated this session
      const savedAuth = sessionStorage.getItem('lb_admin_authorized');
      if (savedAuth === 'true') {
        setAuthorized(true);
        fetchAdminData();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const overview = await adminService.getOverview();
      setData(overview);
    } catch (err) {
      console.warn('Could not fetch admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (adminPin.trim() === SECRET_ADMIN_PASSKEY) {
      soundEffects.playPop();
      sessionStorage.setItem('lb_admin_authorized', 'true');
      setAuthorized(true);
      fetchAdminData();
    } else {
      alert('Incorrect Secret Admin Key! Access denied.');
      setAdminPin('');
    }
  };

  const handleResetSessions = async () => {
    const ok = window.confirm(
      'Reset all test sessions across the app to Level 1 Waiting state? This helps clean up test games.'
    );
    if (!ok) return;

    setResetting(true);
    setStatusMsg('');
    try {
      await adminService.resetAllSessions();
      soundEffects.playPop();
      setStatusMsg('✓ All game sessions reset to Level 1 successfully!');
      fetchAdminData();
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      setStatusMsg(`Notice: ${err.message || 'Reset performed'}`);
    } finally {
      setResetting(false);
    }
  };

  // Split couples into Active and Unlinked
  const activeCouples = (data.couples || []).filter((c) => c.status === 'active');
  const unlinkedCouples = (data.couples || []).filter((c) => c.status !== 'active');

  // Filter Active Couples
  const filteredActiveCouples = activeCouples.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      (c.partner_1_pet && c.partner_1_pet.toLowerCase().includes(q)) ||
      (c.partner_2_pet && c.partner_2_pet.toLowerCase().includes(q)) ||
      (c.partner_1_name && c.partner_1_name.toLowerCase().includes(q)) ||
      (c.partner_2_name && c.partner_2_name.toLowerCase().includes(q))
    );
  });

  // Filter Unlinked Couples
  const filteredUnlinkedCouples = unlinkedCouples.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      (c.partner_1_pet && c.partner_1_pet.toLowerCase().includes(q)) ||
      (c.partner_2_pet && c.partner_2_pet.toLowerCase().includes(q)) ||
      (c.partner_1_name && c.partner_1_name.toLowerCase().includes(q)) ||
      (c.partner_2_name && c.partner_2_name.toLowerCase().includes(q))
    );
  });

  // Filter sessions
  const filteredSessions = (data.sessions || []).filter((s) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      (s.p1_pet && s.p1_pet.toLowerCase().includes(q)) ||
      (s.p2_pet && s.p2_pet.toLowerCase().includes(q)) ||
      (s.game_type && s.game_type.toLowerCase().includes(q)) ||
      (s.status && s.status.toLowerCase().includes(q))
    );
  });

  // Access denied screen
  if (!authorized && !loading) {
    return (
      <div className="screen-container animate-fade-in" style={{ paddingBottom: '40px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div className="animate-mascot-bob" style={{ marginBottom: '14px' }}>
            <LoveBug mood="sleepy" size={80} />
          </div>
          <span className="badge-chip lavender" style={{ fontWeight: 800, marginBottom: '8px' }}>
            🔒 Private Owner Space
          </span>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
            Owner Admin Panel
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-warm-brown-light)', marginBottom: '20px' }}>
            This panel is reserved for Hetu (hetu2286@gmail.com). Enter your secret owner passkey to unlock.
          </p>

          <form onSubmit={handlePinSubmit} style={{ maxWidth: '280px', margin: '0 auto' }}>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Enter Owner Passkey..."
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-glass-border)',
                background: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                textAlign: 'center',
                marginBottom: '12px',
              }}
            />
            <button type="submit" className="btn-pill-primary" style={{ width: '100%', fontSize: '0.88rem' }}>
              Unlock Admin Panel ➔
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-pill-secondary"
            style={{ width: 'auto', padding: '6px 18px', fontSize: '0.82rem', marginTop: '16px' }}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container animate-fade-in" style={{ maxWidth: '820px', width: '100%', paddingBottom: '60px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            navigate('/');
          }}
          className="btn-pill-secondary"
          style={{ width: 'auto', padding: '6px 16px', fontSize: '0.82rem' }}
        >
          ← Exit to App
        </button>
        <span className="badge-chip pink" style={{ fontWeight: 800 }}>
          🛡️ Hetu's Admin Panel
        </span>
      </div>

      {/* Main Stats Card */}
      <div className="glass-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
          <LoveBug mood="love" size={44} />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Love Bug App Overview</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-brown-light)', marginBottom: '16px' }}>
          Live metrics for users, coupled pairs, and gameplay progress
        </p>

        {/* 3 Metric Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div
            style={{
              padding: '12px 6px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(248, 201, 216, 0.45)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>👥</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              {data.total_users}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-warm-brown-light)' }}>
              Total Users
            </div>
          </div>

          <div
            style={{
              padding: '12px 6px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(201, 220, 203, 0.55)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>💑</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              {activeCouples.length}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-warm-brown-light)' }}>
              Active Couples ({unlinkedCouples.length} unlinked)
            </div>
          </div>

          <div
            style={{
              padding: '12px 6px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(220, 212, 247, 0.45)',
              border: '1px solid var(--color-glass-border)',
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🎮</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
              {data.total_sessions}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-warm-brown-light)' }}>
              Sessions Played
            </div>
          </div>
        </div>

        {/* System Reset Button */}
        <div style={{ marginTop: '14px', borderTop: '1px dashed var(--color-glass-border)', paddingTop: '10px' }}>
          <button
            type="button"
            onClick={handleResetSessions}
            disabled={resetting}
            className="btn-pill-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 16px', color: '#9E2A2B', borderColor: 'rgba(235,87,87,0.3)' }}
          >
            {resetting ? 'Resetting...' : '🔄 Reset All Test Game Sessions'}
          </button>
          {statusMsg && (
            <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#2D6A4F', fontWeight: 700 }}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => {
            setActiveTab('couples');
            soundEffects.playPop();
          }}
          className={`badge-chip ${activeTab === 'couples' ? 'sage' : ''}`}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
            border: activeTab === 'couples' ? '1.5px solid #2D6A4F' : '1px solid var(--color-glass-border)',
          }}
        >
          💑 Active Couples ({activeCouples.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sessions');
            soundEffects.playPop();
          }}
          className={`badge-chip ${activeTab === 'sessions' ? 'lavender' : ''}`}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
            border: activeTab === 'sessions' ? '1.5px solid var(--color-deep-rose)' : '1px solid var(--color-glass-border)',
          }}
        >
          🎮 Game Activity ({data.sessions?.length || 0})
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '14px' }}>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`🔍 Search ${activeTab === 'couples' ? 'couples by pet name or full name...' : 'game sessions by player...'}`}
          style={{
            width: '100%',
            padding: '9px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--color-glass-border)',
            background: 'rgba(255,255,255,0.95)',
            fontSize: '0.84rem',
            outline: 'none',
          }}
        />
      </div>

      {/* TAB 1: ACTIVE COUPLES MAIN + UNLINKED COUPLES SIDE */}
      {activeTab === 'couples' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {/* MAIN SECTION: ONLY ACTIVE COUPLES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 6px',
              }}
            >
              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: 'var(--color-warm-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🟢 Active Couples</span>
                <span
                  style={{
                    background: '#2D6A4F',
                    color: '#fff',
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                  }}
                >
                  {filteredActiveCouples.length}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)' }}>
                Currently Paired
              </span>
            </div>

            {filteredActiveCouples.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
                <p style={{ margin: 0, fontSize: '0.86rem' }}>No active couples found matching your search.</p>
              </div>
            ) : (
              filteredActiveCouples.map((c, i) => (
                <div
                  key={c.id || i}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    border: '1.5px solid rgba(45, 106, 79, 0.28)',
                    boxShadow: '0 4px 14px rgba(45, 106, 79, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge-chip sage" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                      ✓ Active Couple
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)' }}>
                      Paired: {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.96rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
                        {c.partner_1_pet || c.partner_1_name || 'Partner 1'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)' }}>
                        {c.partner_1_name}
                      </div>
                    </div>

                    <span style={{ fontSize: '1.25rem' }}>💖</span>

                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.96rem', fontWeight: 900, color: 'var(--color-warm-brown)' }}>
                        {c.partner_2_pet || c.partner_2_name || 'Partner 2'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-warm-brown-light)' }}>
                        {c.partner_2_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SIDE SECTION: UNLINKED COUPLES */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(255, 245, 245, 0.75)',
              border: '1.5px dashed rgba(200, 150, 160, 0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  color: '#8A5D65',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>💔 Unlinked Couples (Side)</span>
                <span
                  style={{
                    background: '#9E2A2B',
                    color: '#fff',
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  {filteredUnlinkedCouples.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowUnlinkedSide((prev) => !prev)}
                className="btn-pill-secondary"
                style={{ fontSize: '0.72rem', padding: '3px 10px', width: 'auto' }}
              >
                {showUnlinkedSide ? 'Hide' : 'Show'}
              </button>
            </div>

            {showUnlinkedSide && (
              filteredUnlinkedCouples.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', opacity: 0.6 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>No unlinked couples.</p>
                </div>
              ) : (
                filteredUnlinkedCouples.map((c, i) => (
                  <div
                    key={c.id || i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(217, 133, 163, 0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: '#8A5D65',
                          background: 'rgba(217, 133, 163, 0.15)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        Unlinked
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#999' }}>
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <div>
                        <strong style={{ color: 'var(--color-warm-brown)' }}>{c.partner_1_pet || c.partner_1_name}</strong>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-warm-brown-light)' }}>{c.partner_1_name}</div>
                      </div>
                      <span style={{ color: '#bbb', margin: '0 6px' }}>✕</span>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--color-warm-brown)' }}>{c.partner_2_pet || c.partner_2_name}</strong>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-warm-brown-light)' }}>{c.partner_2_name}</div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GAME SESSIONS ACTIVITY (Kisne kaisi game kheli hai) */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredSessions.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>No game activity recorded yet.</p>
            </div>
          ) : (
            filteredSessions.map((s, i) => {
              const gameLabels = {
                this_or_that: 'This or That 💗',
                know_me: 'Know Me 🥹',
                truth_or_dare: 'Truth or Dare 😈',
              };

              return (
                <div
                  key={s.id || i}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid var(--color-glass-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge-chip lavender" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                      {gameLabels[s.game_type] || s.game_type}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: s.status === 'completed' ? '#2D6A4F' : s.status === 'active' ? '#C26383' : '#888',
                      }}
                    >
                      {s.status === 'completed' ? '🏆 Completed' : s.status === 'active' ? '🟢 In Progress' : '⏳ Waiting'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-warm-brown)', marginBottom: '4px' }}>
                    {s.p1_pet || 'P1'} & {s.p2_pet || 'P2'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-warm-brown-light)' }}>
                      Progress: <strong>Level {s.current_level || 1} / 60</strong> (Stage {s.current_stage || 1})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)' }}>
                      {s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
