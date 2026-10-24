import React, { useMemo } from 'react';

/**
 * FloatingHearts Component
 * Renders dreamy, natural floating pastel hearts, blossoms, and twinkling stars.
 * Includes soft ambient pastel glow orbs that drift gently in the background.
 */
export default function FloatingHearts({ count = 22 }) {
  const items = useMemo(() => {
    const symbols = ['💗', '✨', '🌸', '💖', '✦', '🤍', '✧', '💕'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 100) / count + (Math.random() * 5 - 2.5)}%`,
      size: `${14 + (i % 5) * 5}px`,
      duration: `${12 + (i % 7) * 3}s`,
      delay: `${(i * 0.8).toFixed(1)}s`,
      opacity: 0.35 + (i % 4) * 0.15,
      blur: i % 4 === 0 ? '1px' : '0px',
    }));
  }, [count]);

  return (
    <div className="floating-hearts-layer" aria-hidden="true">
      {/* Dreamy Ambient Glowing Background Orbs */}
      <div
        className="ambient-glow-orb"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248, 201, 216, 0.45) 0%, rgba(255, 245, 229, 0) 70%)',
          filter: 'blur(40px)',
          animation: 'ambientDrift1 16s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        className="ambient-glow-orb"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 212, 247, 0.45) 0%, rgba(248, 201, 216, 0) 70%)',
          filter: 'blur(50px)',
          animation: 'ambientDrift2 18s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Swaying Hearts & Sparkles */}
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-heart-item"
          style={{
            left: item.left,
            fontSize: item.size,
            animationName: 'floatAndSway',
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            opacity: item.opacity,
            filter: item.blur !== '0px' ? `blur(${item.blur})` : undefined,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
