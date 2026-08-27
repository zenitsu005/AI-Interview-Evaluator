import React from 'react';

export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Background Dot Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />

      {/* Top Soft Ambient Lighting (Subtle diffused glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-teal-500/[0.06] via-emerald-500/[0.02] to-transparent rounded-full blur-[150px]" />

      {/* Rotating Aurora Light Mesh (Subtle atmospheric layer) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-teal-500/[0.08] via-cyan-400/[0.05] via-emerald-500/[0.04] to-transparent rounded-full blur-[130px] animate-aurora" />

      {/* Animated Geometric Radar & Orbital Grid */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[880px] h-[500px] flex items-center justify-center opacity-25">
        {/* Concentric Rotating Ring 1 */}
        <div className="absolute w-[720px] h-[380px] rounded-[100%] border border-teal-500/10 animate-radar-slow [border-dasharray:6_6]" />
        {/* Concentric Rotating Ring 2 */}
        <div className="absolute w-[520px] h-[280px] rounded-[100%] border border-cyan-500/10 animate-radar-slow [animation-duration:60s] [animation-direction:reverse]" />
        {/* Inner Focal Orbit */}
        <div className="absolute w-[340px] h-[180px] rounded-[100%] border border-emerald-500/10 animate-pulse-slow" />
        {/* Crosshair Accent Lines */}
        <div className="absolute w-[820px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="absolute h-[420px] w-[1px] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      </div>

      {/* Floating Constellation Star Nodes (Soft luminous accents) */}
      <div className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-teal-400/40 shadow-[0_0_8px_rgba(45,212,191,0.4)] animate-float-1 hidden md:block" />
      <div className="absolute top-1/3 right-[15%] w-1.5 h-1.5 rounded-full bg-emerald-400/40 shadow-[0_0_6px_rgba(52,211,153,0.4)] animate-float-2 hidden md:block" />
      <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-cyan-400/40 shadow-[0_0_6px_rgba(34,211,238,0.4)] animate-float-1 hidden md:block" />
      <div className="absolute bottom-1/4 right-[22%] w-1.5 h-1.5 rounded-full bg-teal-300/40 shadow-[0_0_6px_rgba(94,234,212,0.4)] animate-float-2 hidden md:block" />
    </div>
  );
}
