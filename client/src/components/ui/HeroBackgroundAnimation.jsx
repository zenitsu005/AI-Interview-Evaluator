import React from 'react';

export default function HeroBackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] pointer-events-none -z-10 select-none opacity-15"
      style={{
        maskImage: 'radial-gradient(ellipse 65% 50% at 50% 36%, transparent 30%, black 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 65% 50% at 50% 36%, transparent 30%, black 85%)',
      }}
    >
      {/* ── 1. SOFT AMBIENT RADIAL AURA ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-teal-500/20 via-cyan-400/15 via-emerald-500/10 to-transparent rounded-full blur-[120px] animate-aurora" />

      {/* ── 2. AMBIENT BACKGROUND WATERMARK CONSTELLATION NETWORK ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-contain overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Hairline link gradients with 20% subtle opacity */}
            <linearGradient id="meshLink1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="meshLink2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>

            {/* Soft Gaussian Blur Filter for ambient nodes */}
            <filter id="softNodeBlur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>

          {/* ── CONCENTRIC RADAR WATERMARK GUIDELINES (0.6px hairline, 20% opacity) ── */}
          <g>
            <ellipse cx="500" cy="300" rx="390" ry="210" fill="none" stroke="#2dd4bf" strokeWidth="0.6" strokeDasharray="5 5" strokeOpacity="0.20" className="animate-radar-slow" style={{ transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="270" ry="145" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="6 7" strokeOpacity="0.18" className="animate-radar-slow" style={{ animationDuration: '55s', animationDirection: 'reverse', transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="150" ry="80" fill="none" stroke="#2dd4bf" strokeWidth="0.6" strokeOpacity="0.20" />
            {/* Center crosshair */}
            <line x1="120" y1="300" x2="880" y2="300" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.6" />
            <line x1="500" y1="100" x2="500" y2="500" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.6" />
          </g>

          {/* ── PRIMARY CONSTELLATION DRIFT LAYER 1 (25s loop, 0.65px stroke) ── */}
          <g className="animate-hero-drift-1" style={{ transformOrigin: '500px 300px' }}>
            {/* Hairline Connections */}
            <line x1="200" y1="180" x2="350" y2="130" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="350" y1="130" x2="500" y2="105" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="500" y1="105" x2="650" y2="135" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="650" y1="135" x2="800" y2="195" stroke="url(#meshLink1)" strokeWidth="0.65" />
            
            <line x1="350" y1="130" x2="300" y2="255" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="500" y1="105" x2="470" y2="230" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="650" y1="135" x2="700" y2="260" stroke="url(#meshLink2)" strokeWidth="0.65" />

            <line x1="300" y1="255" x2="470" y2="230" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="470" y1="230" x2="700" y2="260" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="300" y1="255" x2="220" y2="370" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="470" y1="230" x2="530" y2="385" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="700" y1="260" x2="780" y2="390" stroke="url(#meshLink1)" strokeWidth="0.65" />

            {/* Softened, 50% Smaller Glowing Nodes */}
            <circle cx="200" cy="180" r="1.75" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="350" cy="130" r="2.25" fill="#38bdf8" filter="url(#softNodeBlur)" />
            <circle cx="500" cy="105" r="1.75" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="650" cy="135" r="2.25" fill="#38bdf8" filter="url(#softNodeBlur)" />
            <circle cx="800" cy="195" r="1.75" fill="#2dd4bf" filter="url(#softNodeBlur)" />

            <circle cx="300" cy="255" r="2" fill="#38bdf8" filter="url(#softNodeBlur)" />
            <circle cx="470" cy="230" r="2.25" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="700" cy="260" r="2" fill="#38bdf8" filter="url(#softNodeBlur)" />
          </g>

          {/* ── SECONDARY COUNTER-DRIFT LAYER 2 (30s loop, 0.65px stroke) ── */}
          <g className="animate-hero-drift-2" style={{ transformOrigin: '500px 300px' }}>
            <line x1="160" y1="290" x2="270" y2="390" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="270" y1="390" x2="430" y2="430" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="430" y1="430" x2="570" y2="420" stroke="url(#meshLink2)" strokeWidth="0.65" />
            <line x1="570" y1="420" x2="730" y2="395" stroke="url(#meshLink1)" strokeWidth="0.65" />
            <line x1="730" y1="395" x2="840" y2="295" stroke="url(#meshLink2)" strokeWidth="0.65" />

            <circle cx="160" cy="290" r="1.5" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="270" cy="390" r="2" fill="#38bdf8" filter="url(#softNodeBlur)" />
            <circle cx="430" cy="430" r="1.5" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="570" cy="420" r="2" fill="#38bdf8" filter="url(#softNodeBlur)" />
            <circle cx="730" cy="395" r="1.5" fill="#2dd4bf" filter="url(#softNodeBlur)" />
            <circle cx="840" cy="295" r="2" fill="#38bdf8" filter="url(#softNodeBlur)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
