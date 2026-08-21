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

  useEffect(() => {
    if (!isOpen) return;

    playArcadeVictoryChime();

    setStarsVisible([false, false, false]);
    const starTimers = [
      setTimeout(() => { setStarsVisible([true, false, false]); playStarChime(0); }, 250),
      setTimeout(() => { setStarsVisible([true, true, false]); playStarChime(1); }, 500),
      setTimeout(() => { setStarsVisible([true, true, true]); playStarChime(2); }, 750),
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#0d9488', '#d97706', '#059669', '#0284c7', '#f59e0b'];
    let particles = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width * 0.3 + (Math.random() * canvas.width * 0.4),
        y: canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 10,
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
        p.rotation += p.vRotation;
        p.opacity -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-hidden animate-fade-in select-none">
      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Main Celebration Modal */}
      <div className="relative z-20 max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl overflow-hidden text-slate-900">
        {/* Trophy Emblem */}
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-500/40 flex items-center justify-center text-3xl mx-auto shadow-md animate-bounce">
            🏆
          </div>
        </div>

        {/* Title & Role Info */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
            {badgeText || 'CHALLENGE COMPLETE'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {titleText || 'Solution Verified'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Test cases validated successfully for <span className="text-teal-700 font-bold">{displayRole}</span>
          </p>
        </div>

        {/* Metric Pillars */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Correctness</p>
            <p className="text-xs font-bold text-slate-900 mt-0.5">100% Passed ✓</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Runtime</p>
            <p className="text-xs font-bold text-teal-700 mt-0.5">Optimal ✓</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Memory</p>
            <p className="text-xs font-bold text-amber-700 mt-0.5">Efficient ✓</p>
          </div>
        </div>

        {/* Gold Star Badges */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-4 shadow-inner">
          {starsVisible.map((visible, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-500 ${
                visible
                  ? 'scale-100 rotate-0 opacity-100'
                  : 'scale-50 -rotate-12 opacity-0'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-2xl shadow-sm">
                ⭐
              </div>
            </div>
          ))}
        </div>

        {/* Primary Next Button Action */}
        <button
          type="button"
          onClick={handleAction}
          className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{buttonText || 'Next Question →'}</span>
        </button>
      </div>
    </div>
  );
}
