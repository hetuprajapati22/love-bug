import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coupleService } from '../services/coupleService';
import { supabase } from '../lib/supabaseClient';
import LoveBug from '../components/mascot/LoveBug';

/**
 * CoupleRoom Page
 * Create and share an invitation code (with WhatsApp link) or join using partner's code.
 */
export default function CoupleRoom() {
  const { user, profile, refreshUserData, isCoupled } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('invite'); // 'invite' or 'join'
  const [inviteCode, setInviteCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Join state
  const [inputCode, setInputCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already coupled, navigate directly to dashboard
  useEffect(() => {
    if (isCoupled) {
      navigate('/');
    }
  }, [isCoupled, navigate]);

  // Generate invite code on mount if in invite tab
  const generateCode = useCallback(async () => {
    setLoadingCode(true);
    setErrorMsg('');
    try {
      const code = await coupleService.createInviteCode();
      setInviteCode(code);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not generate invite code.');
    } finally {
      setLoadingCode(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'invite' && !inviteCode && !loadingCode) {
      generateCode();
    }
  }, [activeTab, inviteCode, loadingCode, generateCode]);

  // Realtime listener for inviter: detect when partner accepts the invite!
  useEffect(() => {
    if (!user || activeTab !== 'invite') return;

    // Listen for inserts on couples table for this user
    const channel = supabase
      .channel('couple_joined_listener')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'couples',
          filter: `partner_1_id=eq.${user.id}`,
        },
        async () => {
          await refreshUserData();
          navigate('/');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeTab, refreshUserData, navigate]);

  // Handle Copy Link / Code
  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Share on WhatsApp
  const handleWhatsAppShare = () => {
    if (!inviteCode) return;
    const text = `Hey sweetie! 🐛💗 I've set up our Love Bug room. Open ${window.location.origin} and enter our secret room code: ${inviteCode}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle Join with code
  const handleJoin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!inputCode.trim()) {
      setErrorMsg('Please enter your partner’s invite code.');
      return;
    }

    setJoining(true);
    try {
      const result = await coupleService.joinWithInviteCode(inputCode);
      setSuccessMsg(`Matched with ${result.partner_pet_name || 'your partner'}! Redirecting... 💗`);
      await refreshUserData();
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Invalid or expired invite code.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="glass-card">
        {/* Bobbing Mascot */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }} className="animate-mascot-bob">
          <LoveBug mood={activeTab === 'invite' ? 'sleepy' : 'love'} size={100} />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.55rem', marginBottom: '6px' }}>
            <span className="shimmer-text">Connect With Partner</span>
          </h2>
          <p style={{ fontSize: '0.88rem', marginBottom: '8px' }}>
            Hello, <strong>{profile?.pet_name || 'Love Bug'}</strong>! Invite your partner or enter their code to play together.
          </p>
          <button
            type="button"
            className="badge-chip"
            onClick={() => navigate('/setup')}
            style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '0.76rem' }}
          >
            ✏️ Edit Pet Name & Heart Color
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(74, 47, 42, 0.08)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px',
            marginBottom: '22px',
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveTab('invite'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'invite' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'invite' ? 'var(--color-warm-brown)' : 'var(--color-warm-brown-light)',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: activeTab === 'invite' ? '0 4px 12px rgba(217, 133, 163, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            💌 Invite Partner
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('join'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'join' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'join' ? 'var(--color-warm-brown)' : 'var(--color-warm-brown-light)',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: activeTab === 'join' ? '0 4px 12px rgba(217, 133, 163, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🔗 Join Partner
          </button>
        </div>

        {/* Error / Success Feedback */}
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
        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(127, 184, 138, 0.2)',
              border: '1px solid rgba(127, 184, 138, 0.5)',
              color: '#275231',
              fontSize: '0.84rem',
              marginBottom: '16px',
            }}
          >
            {successMsg}
          </div>
        )}

        {/* TAB 1: INVITE PARTNER */}
        {activeTab === 'invite' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', marginBottom: '14px' }}>
              Share this exclusive room code with your partner:
            </p>

            {/* Code Box */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '14px 28px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px dashed var(--color-muted-rose)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: 'var(--color-warm-brown)',
                marginBottom: '16px',
                userSelect: 'all',
              }}
            >
              {loadingCode ? 'GENERATING...' : inviteCode || 'LB-....'}
            </div>

            {/* Copy Button */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                className="btn-pill-secondary"
                onClick={handleCopy}
                disabled={loadingCode || !inviteCode}
                style={{ flex: 1 }}
              >
                <span>{copied ? '✓ Code Copied!' : '📋 Copy Code'}</span>
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              className="btn-pill-primary"
              onClick={handleWhatsAppShare}
              disabled={loadingCode || !inviteCode}
              style={{
                background: 'linear-gradient(135deg, #7FB88A 0%, #5E9B6A 100%)',
                boxShadow: '0 8px 24px -4px rgba(94, 155, 106, 0.35)',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <span>Share on WhatsApp</span>
            </button>

            {/* Waiting Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: 'var(--color-warm-brown-light)',
                marginTop: '10px',
              }}
            >
              <span style={{ animation: 'mascotBob 2s infinite ease-in-out', display: 'inline-block' }}>⏳</span>
              <span>Waiting for your partner to join...</span>
            </div>
          </div>
        )}

        {/* TAB 2: JOIN PARTNER */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.88rem', textAlign: 'center' }}>
              Ask your partner for their 6-letter room code (e.g. <code>LB-7K3Q</code>):
            </p>

            <div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="LB-XXXX"
                maxLength={8}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-glass-border)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '0.12em',
                  color: 'var(--color-warm-brown)',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={joining || !inputCode.trim()}
              className="btn-pill-primary animate-pulse-subtle"
            >
              {joining ? 'Connecting...' : 'Join Couple 🐛💗'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
