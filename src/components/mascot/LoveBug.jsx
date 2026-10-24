import React from 'react';

/**
 * LoveBug Mascot Component
 * Pure SVG Mascot with heart antennae, little wings, blush cheeks, and mood expressions.
 * Moods: 'happy' (default), 'sleepy' (waiting), 'sad' (errors), 'love' (excited)
 */
export default function LoveBug({ mood = 'happy', size = 110, className = '' }) {
  return (
    <div
      className={`mascot-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
      aria-label={`Love Bug mascot feeling ${mood}`}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Body Radial Gradient */}
          <radialGradient id="bugBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFD3E1" />
            <stop offset="60%" stopColor="#F5A3BD" />
            <stop offset="100%" stopColor="#E27E9F" />
          </radialGradient>

          {/* Belly Gradient */}
          <radialGradient id="bugBellyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF9F5" />
            <stop offset="100%" stopColor="#FFE6EF" />
          </radialGradient>

          {/* Heart Antenna Gradient */}
          <linearGradient id="antennaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF85A2" />
            <stop offset="100%" stopColor="#D95079" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="softBugShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#D985A3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Cute Tiny Translucent Wings */}
        <g opacity="0.65">
          <ellipse
            cx="32"
            cy="52"
            rx="16"
            ry="9"
            transform="rotate(-30 32 52)"
            fill="#FFFFFF"
            stroke="#F8C9D8"
            strokeWidth="1.5"
          />
          <ellipse
            cx="88"
            cy="52"
            rx="16"
            ry="9"
            transform="rotate(30 88 52)"
            fill="#FFFFFF"
            stroke="#F8C9D8"
            strokeWidth="1.5"
          />
        </g>

        {/* Left Antenna with Heart */}
        <path
          d="M48 42 C 44 26, 32 20, 28 22"
          stroke="#C26383"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Heart Tip */}
        <path
          d="M 28 22 C 26 18, 20 18, 19 23 C 18 28, 25 32, 28 34 C 31 32, 38 28, 37 23 C 36 18, 30 18, 28 22 Z"
          fill="url(#antennaGrad)"
          transform="translate(-6, -8) scale(0.7) rotate(-15 28 22)"
        />

        {/* Right Antenna with Heart */}
        <path
          d="M72 42 C 76 26, 88 20, 92 22"
          stroke="#C26383"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Heart Tip */}
        <path
          d="M 92 22 C 90 18, 84 18, 83 23 C 82 28, 89 32, 92 34 C 95 32, 102 28, 101 23 C 100 18, 94 18, 92 22 Z"
          fill="url(#antennaGrad)"
          transform="translate(6, -8) scale(0.7) rotate(15 92 22)"
        />

        {/* Main Chubby Bug Body */}
        <circle
          cx="60"
          cy="68"
          r="42"
          fill="url(#bugBodyGrad)"
          filter="url(#softBugShadow)"
        />

        {/* Soft Cream Belly */}
        <ellipse cx="60" cy="78" rx="26" ry="22" fill="url(#bugBellyGrad)" opacity="0.85" />

        {/* Rosy Blush Cheeks */}
        <ellipse cx="36" cy="74" rx="7" ry="4.5" fill="#FA8FA7" opacity="0.65" />
        <ellipse cx="84" cy="74" rx="7" ry="4.5" fill="#FA8FA7" opacity="0.65" />

        {/* --- MOOD EXPRESSIONS --- */}
        {mood === 'sleepy' && (
          <g>
            {/* Droopy/Peaceful sleeping eyes */}
            <path d="M 40 66 Q 47 71 54 66" stroke="#4A2F2A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 66 66 Q 73 71 80 66" stroke="#4A2F2A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Tiny cute peaceful mouth */}
            <path d="M 57 78 Q 60 80 63 78" stroke="#4A2F2A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Gentle 'z z' bubbles */}
            <text x="88" y="44" fill="#C26383" fontSize="13" fontWeight="bold" fontFamily="Caveat, sans-serif">z</text>
            <text x="96" y="34" fill="#C26383" fontSize="16" fontWeight="bold" fontFamily="Caveat, sans-serif">Z</text>
          </g>
        )}

        {mood === 'sad' && (
          <g>
            {/* Concerned puppy eyes */}
            <circle cx="47" cy="65" r="4.5" fill="#4A2F2A" />
            <circle cx="73" cy="65" r="4.5" fill="#4A2F2A" />
            <circle cx="45" cy="63" r="1.5" fill="#FFFFFF" />
            <circle cx="71" cy="63" r="1.5" fill="#FFFFFF" />
            {/* Droopy little mouth */}
            <path d="M 54 79 Q 60 74 66 79" stroke="#4A2F2A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'love' && (
          <g>
            {/* Heart eyes */}
            <path
              d="M 47 62 C 45 58, 39 58, 38 63 C 37 68, 44 72, 47 74 C 50 72, 57 68, 56 63 C 55 58, 49 58, 47 62 Z"
              fill="#D93864"
              transform="translate(-6, -4) scale(0.65)"
            />
            <path
              d="M 73 62 C 71 58, 65 58, 64 63 C 63 68, 70 72, 73 74 C 76 72, 83 68, 82 63 C 81 58, 75 58, 73 62 Z"
              fill="#D93864"
              transform="translate(14, -4) scale(0.65)"
            />
            {/* Happy open smile */}
            <path d="M 53 76 Q 60 84 67 76" stroke="#4A2F2A" strokeWidth="2.8" strokeLinecap="round" fill="#FA8FA7" />
          </g>
        )}

        {mood === 'happy' && (
          <g>
            {/* Sparkly big cute eyes */}
            <ellipse cx="46" cy="65" rx="5.5" ry="6.5" fill="#4A2F2A" />
            <ellipse cx="74" cy="65" rx="5.5" ry="6.5" fill="#4A2F2A" />
            {/* Big eye glints */}
            <circle cx="44" cy="63" r="2.4" fill="#FFFFFF" />
            <circle cx="48" cy="67" r="1.2" fill="#FFFFFF" />
            <circle cx="72" cy="63" r="2.4" fill="#FFFFFF" />
            <circle cx="76" cy="67" r="1.2" fill="#FFFFFF" />
            {/* Sweet happy smile */}
            <path d="M 53 76 Q 60 83 67 76" stroke="#4A2F2A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Tiny Sparkles beside mascot */}
        <g opacity="0.8">
          <path d="M 16 48 L 18 52 L 22 54 L 18 56 L 16 60 L 14 56 L 10 54 L 14 52 Z" fill="#FFE5A3" />
          <path d="M 102 78 L 103.5 81 L 107 82.5 L 103.5 84 L 102 87 L 100.5 84 L 97 82.5 L 100.5 81 Z" fill="#FFE5A3" />
        </g>
      </svg>
    </div>
  );
}
