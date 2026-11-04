import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LoveBug from '../mascot/LoveBug';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { soundEffects } from '../../utils/soundEffects';

/**
 * CoupleChat Component
 * Dual-tab Realtime Couple Hub:
 * 1. Live Partner Chat (Instant Supabase Broadcast sync between both partners)
 * 2. Love Bug AI Assistant (Romantic advice, date ideas & prompts)
 */
export default function CoupleChat() {
  const { user, profile, couple, isCoupled } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('partner'); // 'partner' | 'lovebug'
  const [unreadCount, setUnreadCount] = useState(0);

  // Partner chat messages
  const [partnerMessages, setPartnerMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`couple_chat_${couple?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LoveBug AI messages
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'lovebug',
      text: `Hi ${profile?.pet_name || 'sweetheart'}! 🐛💗 I'm your Love Bug helper. Ask me for date ideas, love notes, or conversation tips!`,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';
  // Note: get_my_couple_data returns 'couple_id'
  const coupleId = couple?.couple_id || couple?.id || (user ? `couple_${user.id}` : 'demo_chat');

  const channelRef = useRef(null);

  // Persist partner messages locally
  useEffect(() => {
    if (coupleId && partnerMessages.length > 0) {
      localStorage.setItem(`couple_chat_${coupleId}`, JSON.stringify(partnerMessages.slice(-50)));
    }
  }, [partnerMessages, coupleId]);

  // Real-time Supabase Broadcast channel for Instant Partner Chat
  useEffect(() => {
    if (!coupleId || !supabase) return;

    const channel = supabase.channel(`couple_chat_${coupleId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        setPartnerMessages((prev) => [...prev, payload]);
        soundEffects.playMessage();
        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
        }
      });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [coupleId, isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [partnerMessages, aiMessages, isOpen, activeTab]);

  // Send message to partner
  const sendPartnerMessage = async (customText) => {
    const text = customText || inputText.trim();
    if (!text) return;

    soundEffects.playPop();

    const newMsg = {
      id: `${Date.now()}_${user?.id || 'me'}`,
      senderId: user?.id,
      senderName: myPetName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPartnerMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Broadcast live to partner device
    try {
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMsg,
        });
      } else if (supabase && coupleId) {
        await supabase.channel(`couple_chat_${coupleId}`).send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMsg,
        });
      }
    } catch (err) {
      console.warn('Realtime chat broadcast error:', err);
    }
  };

  // Love Bug AI Responses
  const sendAiMessage = (customText) => {
    const text = customText || inputText.trim();
    if (!text) return;

    soundEffects.playPop();
    const userMsg = { id: Date.now(), sender: 'user', text };
    setAiMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAiTyping(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      let reply = `Always remember: you and ${partnerPetName} make the sweetest team! Keep loving and laughing together 🐛💗`;

      if (q.includes('date') || q.includes('plan')) {
        const ideas = [
          `Blanket Fort & Chai Date: Dim the lights, make hot chai, and share your favorite childhood memories! ☕🛋️`,
          `Starlight Walk: Take a slow stroll outside with no phones, just holding hands and looking at the moon! 🌙✨`,
          `Dessert Date: Make sweet mug cakes or chocolate fondue together in the kitchen! 🍓🍫`,
        ];
        reply = ideas[Math.floor(Math.random() * ideas.length)];
      } else if (q.includes('joke') || q.includes('cheesy')) {
        reply = `Are you two a camera? Because whenever you look at each other, everyone else smiles! 📸🥰`;
      } else if (q.includes('note') || q.includes('text')) {
        reply = `Send this to ${partnerPetName}: "Out of 8 billion people, you're my favorite notification." 💌`;
      } else if (q.includes('argue') || q.includes('sorry')) {
        reply = `It's never ${myPetName} vs ${partnerPetName} — it's both of you vs the issue! Give a 20-second hug, it melts any tension 🫂❤️`;
      }

      setAiMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'lovebug', text: reply }]);
      setIsAiTyping(false);
      soundEffects.playPop();
    }, 600);
  };

  const handleSend = () => {
    if (activeTab === 'partner') {
      sendPartnerMessage();
    } else {
      sendAiMessage();
    }
  };

  const quickStickers = [
    '😘 Sending you kisses!',
    '❤️ Thinking about you',
    '👀 Your turn in game!',
    '☕ Chai date together?',
    '🥰 You are so cute',
  ];

  const location = useLocation();

  // Only show chat AFTER partner is connected (isCoupled) and hide on pairing/setup screens
  const hiddenPaths = ['/login', '/setup', '/couple'];
  if (!isCoupled || !user || hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
            soundEffects.playPop();
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #F8C9D8, #DCD4F7)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 8px 24px rgba(74, 47, 42, 0.18)',
            padding: '8px 16px 8px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
          className="interactive-card animate-pulse-subtle"
          title="Open Couple Chat"
        >
          <LoveBug mood="love" size={32} />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
            {isCoupled ? `Chat with ${partnerPetName}` : 'Love Bug Chat'} 💬
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                background: '#E63946',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.72rem',
                fontWeight: 900,
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: 'calc(100vw - 40px)',
            maxWidth: '380px',
            height: '520px',
            maxHeight: 'calc(100vh - 40px)',
            zIndex: 10000,
            background: 'rgba(255, 250, 245, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid var(--color-muted-rose)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 16px 40px rgba(74, 47, 42, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          className="animate-fade-in"
        >
          {/* Top Bar with Tab Switcher */}
          <div
            style={{
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #F8C9D8 0%, #DCD4F7 100%)',
              borderBottom: '1px solid rgba(74, 47, 42, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('partner');
                  soundEffects.playPop();
                }}
                className={`badge-chip ${activeTab === 'partner' ? 'pink' : ''}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  border: activeTab === 'partner' ? '1.5px solid var(--color-deep-rose)' : 'none',
                }}
              >
                💬 {partnerPetName}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('lovebug');
                  soundEffects.playPop();
                }}
                className={`badge-chip ${activeTab === 'lovebug' ? 'lavender' : ''}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  border: activeTab === 'lovebug' ? '1.5px solid var(--color-deep-rose)' : 'none',
                }}
              >
                🐛 Love Bug
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                soundEffects.playPop();
              }}
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontWeight: 700,
                color: 'var(--color-warm-brown)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Quick Love Stickers (for partner chat) */}
          {activeTab === 'partner' && (
            <div
              style={{
                display: 'flex',
                gap: '6px',
                padding: '8px 12px',
                overflowX: 'auto',
                borderBottom: '1px dashed rgba(74, 47, 42, 0.08)',
                background: 'rgba(255, 255, 255, 0.65)',
                scrollbarWidth: 'none',
              }}
            >
              {quickStickers.map((sticker, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendPartnerMessage(sticker)}
                  className="badge-chip pink"
                  style={{
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    padding: '3px 10px',
                  }}
                >
                  {sticker}
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {activeTab === 'partner' ? (
              partnerMessages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.7 }}>
                  <LoveBug mood="love" size={60} />
                  <p style={{ fontSize: '0.86rem', marginTop: '8px', fontWeight: 700 }}>
                    Start your private couple chat!
                  </p>
                  <p style={{ fontSize: '0.76rem' }}>
                    Messages are delivered live to {partnerPetName} in real time 💗
                  </p>
                </div>
              ) : (
                partnerMessages.map((m) => {
                  const isMe = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '82%',
                        padding: '10px 14px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe
                          ? 'linear-gradient(135deg, #F8C9D8 0%, #D985A3 100%)'
                          : 'rgba(255, 255, 255, 0.95)',
                        color: '#4A2F2A',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        lineHeight: 1.45,
                        boxShadow: '0 2px 8px rgba(74, 47, 42, 0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: isMe ? 'rgba(74,47,42,0.7)' : 'var(--color-warm-brown-light)',
                          marginBottom: '2px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <strong>{isMe ? 'You' : partnerPetName}</strong>
                        <span>{m.timestamp}</span>
                      </div>
                      <div>{m.text}</div>
                    </div>
                  );
                })
              )
            ) : (
              aiMessages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background:
                      m.sender === 'user'
                        ? 'linear-gradient(135deg, #F8C9D8 0%, #D985A3 100%)'
                        : 'rgba(255, 255, 255, 0.95)',
                    color: '#4A2F2A',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    lineHeight: 1.45,
                    boxShadow: '0 2px 8px rgba(74, 47, 42, 0.06)',
                  }}
                >
                  {m.text}
                </div>
              ))
            )}

            {isAiTyping && activeTab === 'lovebug' && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                }}
              >
                Love Bug is thinking... 💭
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(74, 47, 42, 0.1)',
              background: '#fff',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'partner'
                  ? `Message ${partnerPetName}...`
                  : 'Ask Love Bug anything...'
              }
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-glass-border)',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--color-warm-brown)',
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                background: 'linear-gradient(135deg, #F8C9D8, #D985A3)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '0 16px',
                cursor: inputText.trim() ? 'pointer' : 'default',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#4A2F2A',
                opacity: inputText.trim() ? 1 : 0.5,
              }}
            >
              Send 💌
            </button>
          </form>
        </div>
      )}
    </>
  );
}
