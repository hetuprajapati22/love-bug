import React, { useMemo } from 'react';

/**
 * FloatingHearts Component
 * Renders gently rising pastel hearts and sparkles in the background.
 * Lightweight, pure CSS animations, non-blocking.
 */
export default function FloatingHearts({ count = 16 }) {
  const items = useMemo(() => {
    const symbols = ['💗', '✨', '🌸', '💖', '⭐', '🤍'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 100) / count + (Math.random() * 4 - 2)}%`,
      size: `${14 + (i % 4) * 5}px`,
      duration: `${14 + (i % 6) * 3}s`,
      delay: `${(i * 1.2).toFixed(1)}s`,
      opacity: 0.35 + (i % 3) * 0.15,
    }));
  }, [count]);

  return (
    <div className="floating-hearts-layer" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-heart-item"
          style={{
            left: item.left,
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
            opacity: item.opacity,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
