import React, { useState, useEffect, useRef } from 'react';
import LoveBug from '../mascot/LoveBug';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoveBugChat Component
 * A romantic, playful floating mascot chatbot for couples.
 * Provides cute relationship advice, conversation starters, date ideas, and playful teasing!
 */
export default function LoveBugChat() {
  const { profile, couple, isCoupled } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'lovebug',
      text: `Hi ${profile?.pet_name || 'sweetheart'}! 🐛💗 I'm your Love Bug assistant. How can I add a little more love or fun to your day today?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const myPetName = profile?.pet_name || 'You';
  const partnerPetName = couple?.partner_pet_name || 'Partner';

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: '🌹 Date idea', prompt: 'Give us a super cute and simple date idea for tonight!' },
    { label: '💬 Deep question', prompt: 'Suggest a deep, romantic question we can ask each other.' },
    { label: '🤭 Cute joke', prompt: 'Tell us a funny, cheesy couple joke!' },
    { label: '💌 Love note', prompt: 'Write a tiny, sweet 2-line love note I can send to my partner.' },
    { label: '🫂 Make up advice', prompt: 'What should we do if we have a silly small argument?' },
  ];

  const getSmartReply = (query) => {
    const q = query.toLowerCase();

    if (q.includes('date') || q.includes('plan')) {
      const dateIdeas = [
        `How about a "Blanket Fort & Chai Date"? Grab two blankets, make hot chai, dim the lights and play your favorite childhood songs together! ☕✨`,
        `Try an "Ice Cream Walk": Put your phones on silent, walk to the nearest ice cream place holding hands, and talk about your favorite memory of each other! 🍦🌙`,
        `Mini Chef Night: Both of you enter the kitchen and make one simple dessert together, like chocolate strawberries or warm mug cakes! 🍓🍫`,
      ];
      return dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    }

    if (q.includes('deep') || q.includes('question') || q.includes('talk')) {
      const deepQuestions = [
        `Here is a heart-to-heart question: "${partnerPetName}, what is one tiny moment with me that made you realize you truly care about me?" 🥺❤️`,
        `Ask this tonight: "If we could pause time for just one hour and be anywhere in the world together, where would you want us to be?" 🌌`,
        `Try this: "What is one dream you have for your future that you really want us to experience together?" ✨`,
      ];
      return deepQuestions[Math.floor(Math.random() * deepQuestions.length)];
    }

    if (q.includes('joke') || q.includes('cheesy') || q.includes('funny')) {
      const jokes = [
        `Are you a magician? Because whenever you look at ${partnerPetName}, everyone else disappears! 🎩🪄✨`,
        `Are you two Wi-Fi? Because I'm feeling a 100% strong connection between you two! 📶💗`,
        `Do you have a map? Because I just got completely lost in your eyes... and Google Maps is no help! 😂🗺️`,
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (q.includes('note') || q.includes('text') || q.includes('message')) {
      const notes = [
        `Send this to ${partnerPetName}: "Just wanted to remind you that thinking about your smile is my favorite distraction of the day. 🌸 Love you!"`,
        `Send this: "No matter how busy today is, my heart is always quietly resting right next to yours. 🧸💗"`,
        `Send this: "You're my favorite human notification. Always. 🥰"`,
      ];
      return notes[Math.floor(Math.random() * notes.length)];
    }

    if (q.includes('argument') || q.includes('fight') || q.includes('upset') || q.includes('sorry')) {
      return `Remember: It is never "${myPetName} vs ${partnerPetName}". It is always "${myPetName} & ${partnerPetName} vs the problem"! 🤝 Put your pride aside, give each other a warm 20-second hug first, and say: "I love you more than this argument." Hugging instantly melts anger! 🫂❤️`;
    }

    // Default warm romantic reply
    return `Aww, that's sweet! Always remember that the best relationships aren't perfect — they are simply two people who never give up on laughing, loving, and playing together! Have you played today's game with ${partnerPetName} yet? 🐛💗`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate cute response after short delay
    setTimeout(() => {
      const replyText = getSmartReply(text);
      const botMsg = { id: Date.now() + 1, sender: 'lovebug', text: replyText };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Mascot Chat Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
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
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          className="interactive-card animate-pulse-subtle"
          title="Chat with Love Bug Assistant"
        >
          <LoveBug mood="love" size={32} />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
            Ask Love Bug 🐛💭
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: 'calc(100vw - 40px)',
            maxWidth: '360px',
            height: '490px',
            maxHeight: 'calc(100vh - 40px)',
            zIndex: 10000,
            background: 'rgba(255, 250, 245, 0.96)',
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
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #F8C9D8 0%, #DCD4F7 100%)',
              borderBottom: '1px solid rgba(74, 47, 42, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LoveBug mood="happy" size={34} />
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-warm-brown)' }}>
                  Love Bug 🐛
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-warm-brown-light)', fontWeight: 600 }}>
                  Romantic Couple Assistant
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '0.9rem',
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

          {/* Quick prompt pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 12px',
              overflowX: 'auto',
              borderBottom: '1px dashed rgba(74, 47, 42, 0.08)',
              background: 'rgba(255, 255, 255, 0.6)',
              scrollbarWidth: 'none',
            }}
          >
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                className="badge-chip lavender"
                style={{
                  fontSize: '0.72rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  padding: '4px 10px',
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages list */}
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
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius:
                    m.sender === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                  background:
                    m.sender === 'user'
                      ? 'linear-gradient(135deg, #F8C9D8 0%, #D985A3 100%)'
                      : 'rgba(255, 255, 255, 0.95)',
                  color: m.sender === 'user' ? '#4A2F2A' : '#4A2F2A',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(74, 47, 42, 0.06)',
                  border:
                    m.sender === 'user'
                      ? 'none'
                      : '1px solid rgba(74, 47, 42, 0.08)',
                }}
              >
                {m.text}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.78rem',
                  color: 'var(--color-warm-brown-light)',
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
              handleSendMessage();
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
              placeholder="Ask anything cute..."
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
