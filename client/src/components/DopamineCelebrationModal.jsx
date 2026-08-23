import React, { useState, useEffect, useRef } from 'react';
import {
  TbTrophy as Trophy,
  TbStar as Star,
  TbCircleCheck as CheckCircle2,
  TbArrowRight as ArrowRight,
  TbSparkles as Sparkles,
} from 'react-icons/tb';

const playArcadeVictoryChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
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

    const colors = ['#2dd4bf', '#fbbf24', '#34d399', '#38bdf8', '#f59e0b'];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      <div className="relative z-20 max-w-md w-full bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl overflow-hidden text-white">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl bg-teal-950/80 border-2 border-teal-400 flex items-center justify-center text-teal-300 mx-auto shadow-xl shadow-teal-500/20 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            {badgeText || 'CHALLENGE COMPLETE'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {titleText || 'Solution Verified'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Test cases validated successfully for <span className="text-teal-300 font-bold">{displayRole}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Correctness</p>
            <p className="text-xs font-bold text-white mt-1">100% Passed ✓</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Runtime</p>
            <p className="text-xs font-bold text-teal-400 mt-1 font-mono">Optimal ✓</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Memory</p>
            <p className="text-xs font-bold text-amber-400 mt-1 font-mono">Efficient ✓</p>
          </div>
        </div>

        {/* Gold Star Badges */}
        <div className="p-4 rounded-2xl bg-[#0D111A] border border-white/5 flex items-center justify-center gap-4 shadow-inner">
          {starsVisible.map((visible, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-500 ${
                visible
                  ? 'scale-100 rotate-0 opacity-100'
                  : 'scale-50 -rotate-12 opacity-0'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAction}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{buttonText || 'Next Question →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
