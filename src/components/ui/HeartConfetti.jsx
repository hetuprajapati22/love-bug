import React, { useEffect, useState } from 'react';

/**
 * HeartConfetti Component
 * Creates an explosion of floating, tumbling hearts and sparkles
 * when couples achieve a match! Zero heavy dependencies.
 */
export default function HeartConfetti({ duration = 2500, count = 28 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const emojis = ['💖', '💕', '✨', '🌸', '🥰', '💗', '⭐'];
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: (Math.random() - 0.5) * 260, // horizontal spread
      y: -(Math.random() * 200 + 60), // upward velocity
      scale: Math.random() * 0.7 + 0.7,
      rotation: (Math.random() - 0.5) * 360,
      duration: Math.random() * 1 + 1.2,
      delay: Math.random() * 0.2,
    }));
    setParticles(generated);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, count]);

  if (particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 999,
        width: 0,
        height: 0,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            fontSize: `${p.scale * 1.5}rem`,
            animation: `confettiBurst ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`,
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes confettiBurst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.4) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(${particles[0]?.x || 50}px, -180px) scale(1.1) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
