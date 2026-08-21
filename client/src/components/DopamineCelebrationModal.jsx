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
  targetRole = 'Software Engineer',
}) {
  const canvasRef = useRef(null);
  const [starsVisible, setStarsVisible] = useState([false, false, false]);

  // Canvas Confetti Burst Logic
  useEffect(() => {
    if (!isOpen) return;

    playArcadeVictoryChime();

    // Sequential Star Pop Timers
    setStarsVisible([false, false, false]);
    const starTimers = [
      setTimeout(() => { setStarsVisible([true, false, false]); playStarChime(0); }, 300),
      setTimeout(() => { setStarsVisible([true, true, false]); playStarChime(1); }, 600),
      setTimeout(() => { setStarsVisible([true, true, true]); playStarChime(2); }, 900),
    ];

    // Canvas Confetti Particle System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#fbbf24'];
    let particles = [];

    // Left and Right Cannons
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width * 0.1,
        y: canvas.height * 0.9,
        vx: Math.random() * 12 + 4,
        vy: -Math.random() * 16 - 8,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 10 - 5,
        opacity: 1,
      });
      particles.push({
        x: canvas.width * 0.9,
        y: canvas.height * 0.9,
        vx: -Math.random() * 12 - 4,
        vy: -Math.random() * 16 - 8,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 10 - 5,
        opacity: 1,
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.rotation += p.vr;
        p.opacity -= 0.008;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070e]/90 backdrop-blur-xl overflow-hidden animate-fade-in select-none">
      
      {/* Background Radial Starburst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
        <div className="w-[1200px] h-[1200px] rounded-full bg-[conic-gradient(from_0deg,#f59e0b_0deg,transparent_20deg,#6366f1_40deg,transparent_60deg,#10b981_80deg,transparent_100deg,#ec4899_120deg,transparent_140deg)] animate-[spin_30s_linear_infinite]" />
      </div>

      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Main Celebration Modal Window */}
      <div className="relative z-20 max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-7 shadow-2xl relative overflow-hidden">
        
        {/* Animated Party Popper Icon */}
        <div className="relative inline-block">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-3xl sm:text-4xl mx-auto shadow-2xl shadow-amber-500/40 border-2 border-amber-200 animate-bounce">
            🎉
          </div>
        </div>

        {/* Banner */}
        <div className="space-y-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] font-mono">
            CONGRATULATIONS!
          </span>
          <p className="text-xs text-zinc-400 font-medium">
            Interview round completed for <strong className="text-white font-bold">{targetRole}</strong>
          </p>
        </div>


        {/* High-Contrast Stars Container */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center gap-5 shadow-inner">
          {starsVisible.map((visible, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-300 ${
                visible
                  ? 'scale-100 rotate-0 opacity-100'
                  : 'scale-0 -rotate-45 opacity-0'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/50 border-2 border-amber-200">
                ⭐
              </div>
            </div>
          ))}
        </div>

        {/* View Report Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>View Report →</span>
        </button>

      </div>
    </div>
  );
}
