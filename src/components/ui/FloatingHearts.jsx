import React, { useMemo, useState, useEffect } from 'react';

/**
 * FloatingHearts Component
 * Optimized, silky-smooth romantic floating pastel hearts, blossoms, and sparkles.
 * Uses GPU-accelerated transforms and lightweight particle counts for zero lag on mobile.
 */
export default function FloatingHearts({ count: propCount }) {
  // Mobile detection for silky-smooth 60fps rendering without CPU/GPU throttle
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const count = propCount || (isMobile ? 8 : 14);

  const items = useMemo(() => {
    const symbols = ['💗', '✨', '🌸', '💖', '🤍', '💕'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 100) / count + (i % 2 === 0 ? 2 : -2)}%`,
      size: `${14 + (i % 4) * 4}px`,
      duration: `${14 + (i % 5) * 3}s`,
      delay: `${(i * 1.1).toFixed(1)}s`,
      opacity: 0.35 + (i % 3) * 0.15,
    }));
  }, [count]);

  return (
    <div className="floating-hearts-layer" aria-hidden="true">
      {/* Dreamy Ambient Glowing Background Orbs (Static & Hardware Accelerated for Max Smoothness) */}
      <div
        className="ambient-glow-orb"
        style={{
          position: 'absolute',
          top: '10%',
          left: '8%',
          width: isMobile ? '220px' : '320px',
          height: isMobile ? '220px' : '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248, 201, 216, 0.45) 0%, rgba(255, 245, 229, 0) 70%)',
          pointerEvents: 'none',
          transform: 'translateZ(0)',
        }}
      />
      <div
        className="ambient-glow-orb"
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: isMobile ? '240px' : '360px',
          height: isMobile ? '240px' : '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 212, 247, 0.4) 0%, rgba(248, 201, 216, 0) 70%)',
          pointerEvents: 'none',
          transform: 'translateZ(0)',
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
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
