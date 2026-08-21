import React, { useState, useEffect, useRef } from 'react';

// Web Audio API Victory Chimes
const playArcadeVictoryChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.4);
    });
  } catch (e) {}
};

const playStarChime = (pitchIndex = 0) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [659.25, 783.99, 1046.50];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqs[pitchIndex] || 800, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
};

export default function DopamineCelebrationModal({
  isOpen,
  onClose,
  onNext,
  targetRole = 'Algorithm Problem',
  buttonText = 'Next Question →',
  badgeText = 'CHALLENGE COMPLETE',
  titleText = 'Solution Verified',
}) {
  const canvasRef = useRef(null);
  const [starsVisible, setStarsVisible] = useState([false, false, false]);

  const displayRole = targetRole && targetRole.trim() ? targetRole : 'Algorithm Problem';

  // Canvas Confetti Burst Logic
  useEffect(() => {
    if (!isOpen) return;

    playArcadeVictoryChime();

    // Sequential Star Pop Timers
    setStarsVisible([false, false, false]);
    const starTimers = [
      setTimeout(() => { setStarsVisible([true, false, false]); playStarChime(0); }, 250),
      setTimeout(() => { setStarsVisible([true, true, false]); playStarChime(1); }, 500),
      setTimeout(() => { setStarsVisible([true, true, true]); playStarChime(2); }, 750),
    ];

    // Canvas Confetti Particle System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#14b8a6', '#f59e0b', '#10b981', '#38bdf8', '#fbbf24'];
    let particles = [];

    // Left and Right subtle celebratory burst
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width * 0.15,
        y: canvas.height * 0.85,
        vx: Math.random() * 10 + 3,
        vy: -Math.random() * 14 - 6,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 8 - 4,
        opacity: 1,
      });
      particles.push({
        x: canvas.width * 0.85,
        y: canvas.height * 0.85,
        vx: -Math.random() * 10 - 3,
        vy: -Math.random() * 14 - 6,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 8 - 4,
        opacity: 1,
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.vr;
        p.opacity -= 0.01;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      particles = particles.filter((p) => p.opacity > 0);
      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      starTimers.forEach(clearTimeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (onNext) {
      onNext();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0E]/90 backdrop-blur-xl overflow-hidden animate-fade-in select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Main Executive Celebration Modal */}
      <div className="relative z-20 max-w-md w-full bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-black/80 overflow-hidden">
        
        {/* Glow Halo & Trophy Emblem */}
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-950 to-[#181820] border border-teal-500/40 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-teal-950/60 ring-4 ring-teal-500/10 animate-bounce">
            🏆
          </div>
        </div>

        {/* Title & Role Info */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            {badgeText || 'CHALLENGE COMPLETE'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {titleText || 'Solution Verified'}
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Test cases validated successfully for <span className="text-teal-300 font-semibold">{displayRole}</span>
          </p>
        </div>

        {/* Executive Metric Pillars */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-[#0B0B0E] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Correctness</p>
            <p className="text-xs font-bold text-white mt-0.5">100% Passed ✓</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0B0E] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Runtime</p>
            <p className="text-xs font-bold text-teal-400 mt-0.5">Optimal ✓</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0B0E] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Memory</p>
            <p className="text-xs font-bold text-amber-400 mt-0.5">Efficient ✓</p>
          </div>
        </div>

        {/* Refined Gold Star Badges */}
        <div className="p-4 rounded-2xl bg-[#0B0B0E] border border-white/5 flex items-center justify-center gap-4 shadow-inner">
          {starsVisible.map((visible, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-500 ${
                visible
                  ? 'scale-100 rotate-0 opacity-100'
                  : 'scale-50 -rotate-12 opacity-0'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                ⭐
              </div>
            </div>
          ))}
        </div>

        {/* Primary Next Button Action */}
        <button
          type="button"
          onClick={handleAction}
          className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{buttonText || 'Next Question →'}</span>
        </button>

      </div>
    </div>
  );
}
