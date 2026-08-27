import React from 'react';

export default function HeroBackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none"
      style={{
        maskImage: 'radial-gradient(ellipse 65% 55% at 50% 42%, black 25%, transparent 95%)',
        WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 42%, black 25%, transparent 95%)',
      }}
    >
      {/* ── SUBTLE RADIAL GRADIENT AURA DIRECTLY BEHIND HEADLINE ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-gradient-to-b from-[#14b8a6]/[0.08] via-[#0ea5e9]/[0.04] to-transparent rounded-full blur-[130px]" />

      {/* ── AMBIENT GEOMETRIC MESH & CONSTELLATION NETWORK ── */}
      <div className="absolute inset-0 flex items-center justify-center animate-hero-mesh-pulse">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full max-w-[1100px] object-cover drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Hairline link gradients */}
            <linearGradient id="meshLink1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="meshLink2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
            </linearGradient>

            {/* Particle Glow Filter */}
            <filter id="softNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── CONCENTRIC RADAR GUIDELINES ── */}
          <g opacity="0.12">
            <ellipse cx="500" cy="300" rx="380" ry="210" fill="none" stroke="#2dd4bf" strokeWidth="0.75" strokeDasharray="4 6" className="animate-radar-slow" style={{ transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="260" ry="145" fill="none" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="6 8" className="animate-radar-slow" style={{ animationDuration: '55s', animationDirection: 'reverse', transformOrigin: '500px 300px' }} />
            <ellipse cx="500" cy="300" rx="140" ry="80" fill="none" stroke="#2dd4bf" strokeWidth="0.75" opacity="0.6" />
          </g>

          {/* ── PRIMARY CONSTELLATION DRIFT LAYER 1 (28s loop) ── */}
          <g className="animate-hero-drift-1" style={{ transformOrigin: '500px 300px' }}>
            {/* Hairline Connections */}
            <line x1="220" y1="180" x2="360" y2="130" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="360" y1="130" x2="500" y2="110" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="500" y1="110" x2="640" y2="140" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="640" y1="140" x2="780" y2="200" stroke="url(#meshLink1)" strokeWidth="0.75" />
            
            <line x1="360" y1="130" x2="310" y2="250" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="500" y1="110" x2="470" y2="230" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="640" y1="140" x2="670" y2="260" stroke="url(#meshLink2)" strokeWidth="0.75" />

            <line x1="310" y1="250" x2="470" y2="230" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="470" y1="230" x2="670" y2="260" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="310" y1="250" x2="240" y2="360" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="470" y1="230" x2="520" y2="370" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="670" y1="260" x2="740" y2="380" stroke="url(#meshLink1)" strokeWidth="0.75" />

            {/* Geometric Nodes with subtle teal/cyan hues */}
            <circle cx="220" cy="180" r="2" fill="#2dd4bf" opacity="0.22" filter="url(#softNodeGlow)" />
            <circle cx="360" cy="130" r="2.5" fill="#38bdf8" opacity="0.25" filter="url(#softNodeGlow)" />
            <circle cx="500" cy="110" r="2" fill="#2dd4bf" opacity="0.2" filter="url(#softNodeGlow)" />
            <circle cx="640" cy="140" r="2.5" fill="#38bdf8" opacity="0.25" filter="url(#softNodeGlow)" />
            <circle cx="780" cy="200" r="2" fill="#2dd4bf" opacity="0.22" filter="url(#softNodeGlow)" />

            <circle cx="310" cy="250" r="2" fill="#38bdf8" opacity="0.2" filter="url(#softNodeGlow)" />
            <circle cx="470" cy="230" r="2.5" fill="#2dd4bf" opacity="0.25" filter="url(#softNodeGlow)" />
            <circle cx="670" cy="260" r="2" fill="#38bdf8" opacity="0.2" filter="url(#softNodeGlow)" />
          </g>

          {/* ── SECONDARY COUNTER-DRIFT LAYER 2 (34s loop) ── */}
          <g className="animate-hero-drift-2" style={{ transformOrigin: '500px 300px' }}>
            <line x1="180" y1="280" x2="280" y2="380" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="280" y1="380" x2="440" y2="420" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="440" y1="420" x2="580" y2="410" stroke="url(#meshLink2)" strokeWidth="0.75" />
            <line x1="580" y1="410" x2="720" y2="390" stroke="url(#meshLink1)" strokeWidth="0.75" />
            <line x1="720" y1="390" x2="820" y2="290" stroke="url(#meshLink2)" strokeWidth="0.75" />

            <circle cx="180" cy="280" r="1.75" fill="#2dd4bf" opacity="0.18" filter="url(#softNodeGlow)" />
            <circle cx="280" cy="380" r="2" fill="#38bdf8" opacity="0.2" filter="url(#softNodeGlow)" />
            <circle cx="440" cy="420" r="1.75" fill="#2dd4bf" opacity="0.18" filter="url(#softNodeGlow)" />
            <circle cx="580" cy="410" r="2" fill="#38bdf8" opacity="0.22" filter="url(#softNodeGlow)" />
            <circle cx="720" cy="390" r="1.75" fill="#2dd4bf" opacity="0.18" filter="url(#softNodeGlow)" />
            <circle cx="820" cy="290" r="2" fill="#38bdf8" opacity="0.2" filter="url(#softNodeGlow)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
