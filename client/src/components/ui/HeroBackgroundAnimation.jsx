import React from 'react';

export default function HeroBackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[580px] pointer-events-none -z-10 overflow-visible select-none"
    >
      {/* ── 1. LUMINOUS RADIAL AURORA GLOW DIRECTLY BEHIND HERO ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[350px] bg-gradient-to-tr from-teal-500/25 via-cyan-400/20 via-emerald-500/15 to-transparent rounded-full blur-[100px] animate-aurora" />

      {/* ── 2. VISIBLE GEOMETRIC MESH & CONSTELLATION NETWORK ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-contain overflow-visible drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Hairline link gradients */}
            <linearGradient id="meshLink1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="meshLink2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>

            {/* Particle Glow Filter */}
            <filter id="softNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── CONCENTRIC RADAR GUIDELINES ── */}
          <g>
            <ellipse cx="500" cy="300" rx="390" ry="210" fill="none" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="6 6" strokeOpacity="0.35" className="animate-radar-slow" style={{ transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="270" ry="145" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="8 8" strokeOpacity="0.3" className="animate-radar-slow" style={{ animationDuration: '50s', animationDirection: 'reverse', transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="150" ry="80" fill="none" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.4" />
            {/* Center crosshair */}
            <line x1="120" y1="300" x2="880" y2="300" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
            <line x1="500" y1="100" x2="500" y2="500" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
          </g>

          {/* ── PRIMARY CONSTELLATION DRIFT LAYER 1 (25s loop) ── */}
          <g className="animate-hero-drift-1" style={{ transformOrigin: '500px 300px' }}>
            {/* Hairline Connections */}
            <line x1="200" y1="180" x2="350" y2="130" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="350" y1="130" x2="500" y2="105" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="500" y1="105" x2="650" y2="135" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="650" y1="135" x2="800" y2="195" stroke="url(#meshLink1)" strokeWidth="1.2" />
            
            <line x1="350" y1="130" x2="300" y2="255" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="500" y1="105" x2="470" y2="230" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="650" y1="135" x2="700" y2="260" stroke="url(#meshLink2)" strokeWidth="1.2" />

            <line x1="300" y1="255" x2="470" y2="230" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="470" y1="230" x2="700" y2="260" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="300" y1="255" x2="220" y2="370" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="470" y1="230" x2="530" y2="385" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="700" y1="260" x2="780" y2="390" stroke="url(#meshLink1)" strokeWidth="1.2" />

            {/* Glowing Geometric Nodes */}
            <circle cx="200" cy="180" r="4" fill="#2dd4bf" opacity="0.9" filter="url(#softNodeGlow)" />
            <circle cx="350" cy="130" r="5" fill="#38bdf8" opacity="0.95" filter="url(#softNodeGlow)" />
            <circle cx="500" cy="105" r="4" fill="#2dd4bf" opacity="0.9" filter="url(#softNodeGlow)" />
            <circle cx="650" cy="135" r="5" fill="#38bdf8" opacity="0.95" filter="url(#softNodeGlow)" />
            <circle cx="800" cy="195" r="4" fill="#2dd4bf" opacity="0.9" filter="url(#softNodeGlow)" />

            <circle cx="300" cy="255" r="4.5" fill="#38bdf8" opacity="0.9" filter="url(#softNodeGlow)" />
            <circle cx="470" cy="230" r="5" fill="#2dd4bf" opacity="0.95" filter="url(#softNodeGlow)" />
            <circle cx="700" cy="260" r="4.5" fill="#38bdf8" opacity="0.9" filter="url(#softNodeGlow)" />
          </g>

          {/* ── SECONDARY COUNTER-DRIFT LAYER 2 (30s loop) ── */}
          <g className="animate-hero-drift-2" style={{ transformOrigin: '500px 300px' }}>
            <line x1="160" y1="290" x2="270" y2="390" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="270" y1="390" x2="430" y2="430" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="430" y1="430" x2="570" y2="420" stroke="url(#meshLink2)" strokeWidth="1.2" />
            <line x1="570" y1="420" x2="730" y2="395" stroke="url(#meshLink1)" strokeWidth="1.2" />
            <line x1="730" y1="395" x2="840" y2="295" stroke="url(#meshLink2)" strokeWidth="1.2" />

            <circle cx="160" cy="290" r="3.5" fill="#2dd4bf" opacity="0.85" filter="url(#softNodeGlow)" />
            <circle cx="270" cy="390" r="4.5" fill="#38bdf8" opacity="0.9" filter="url(#softNodeGlow)" />
            <circle cx="430" cy="430" r="3.5" fill="#2dd4bf" opacity="0.85" filter="url(#softNodeGlow)" />
            <circle cx="570" cy="420" r="4.5" fill="#38bdf8" opacity="0.9" filter="url(#softNodeGlow)" />
            <circle cx="730" cy="395" r="3.5" fill="#2dd4bf" opacity="0.85" filter="url(#softNodeGlow)" />
            <circle cx="840" cy="295" r="4.5" fill="#38bdf8" opacity="0.9" filter="url(#softNodeGlow)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
