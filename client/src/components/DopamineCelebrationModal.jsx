import React, { useState, useEffect, useRef } from 'react';

// Web Audio API Arcade Victory Fanfare
const playArcadeVictoryChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
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

const SURPRISE_PERKS = [
  { icon: '🚀', title: '2x XP Multiplier Unlocked!', desc: 'Double preparation credits awarded for next session.' },
  { icon: '📄', title: 'STAR Framework Cheat Sheet!', desc: 'Full behavioral response rubric unlocked.' },
  { icon: '💼', title: 'Staff Architect Salary Matrix!', desc: 'FAANG level benchmark data accessible.' },
  { icon: '🛡️', title: 'Streak Shield Active!', desc: 'Protects momentum from missed days.' },
];

export default function DopamineCelebrationModal({
  isOpen,
  onClose,
  overallScore = 88,
  targetRole = 'Software Engineer',
  eloRating = 1450,
  eloTier = { label: 'Gold / L6' },
}) {
  const canvasRef = useRef(null);
  const [starsVisible, setStarsVisible] = useState([false, false, false]);
  const [isLootOpened, setIsLootOpened] = useState(false);
  const [lootReward, setLootReward] = useState(SURPRISE_PERKS[0]);

  // Animated Ticking Counters
  const [displayedXp, setDisplayedXp] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [displayedStreak, setDisplayedStreak] = useState(0);

  const targetXp = 100 + Math.round((overallScore || 80) * 1.8);
  const targetScore = Math.round(overallScore || 88);
  const targetStreak = Math.max(15, Math.round((overallScore || 80) * 0.4));

  // Canvas Confetti Burst Logic
  useEffect(() => {
    if (!isOpen) return;

    playArcadeVictoryChime();
    const randomPerk = SURPRISE_PERKS[Math.floor(Math.random() * SURPRISE_PERKS.length)];
    setLootReward(randomPerk);
    setIsLootOpened(false);

    // Sequential Star Pop Timers
    setStarsVisible([false, false, false]);
    const starTimers = [
      setTimeout(() => { setStarsVisible([true, false, false]); playStarChime(0); }, 300),
      setTimeout(() => { setStarsVisible([true, true, false]); playStarChime(1); }, 600),
      setTimeout(() => { setStarsVisible([true, true, true]); playStarChime(2); }, 900),
    ];

    // Counter Ticking Interval
    const duration = 1000;
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const countInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      setDisplayedXp(Math.round(targetXp * progress));
      setDisplayedScore(Math.round(targetScore * progress));
      setDisplayedStreak(Math.round(targetStreak * progress));

      if (step >= steps) {
        clearInterval(countInterval);
      }
    }, intervalTime);

    // Canvas Confetti Particle System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#fbbf24'];
    let particles = [];

    // Left and Right Cannons
    for (let i = 0; i < 70; i++) {
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
        p.vy += 0.4; // gravity
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
      clearInterval(countInterval);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isOpen, targetXp, targetScore, targetStreak]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070e]/90 backdrop-blur-xl overflow-hidden animate-fade-in select-none">
      
      {/* ── Rotating Starburst Background ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-25">
        <div className="w-[1200px] h-[1200px] rounded-full bg-[conic-gradient(from_0deg,#f59e0b_0deg,transparent_20deg,#6366f1_40deg,transparent_60deg,#10b981_80deg,transparent_100deg,#ec4899_120deg,transparent_140deg)] animate-[spin_25s_linear_infinite]" />
      </div>

      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* ── Main Arcade Celebration Card ── */}
      <div className="relative z-20 max-w-lg w-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.3)] ring-4 ring-amber-500/20 max-h-[92vh] overflow-y-auto">
        
        {/* 3D Level Completed Banner */}
        <div className="space-y-2">
          <div className="inline-block transform -rotate-1 hover:rotate-0 transition-transform">
            <span className="text-3xl sm:text-5xl font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] font-mono">
              LEVEL CLEAR!
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Evaluation complete for <strong className="text-white font-bold">{targetRole}</strong>
          </p>
        </div>

        {/* ── 3 Sequential Pop Stars ── */}
        <div className="flex items-center justify-center gap-4 py-2">
          {starsVisible.map((visible, idx) => (
            <div
              key={idx}
              className={`transform transition-all duration-300 ${
                visible
                  ? 'scale-100 rotate-0 opacity-100'
                  : 'scale-0 -rotate-45 opacity-0'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-500/40 border border-amber-300/60">
                ⭐
              </div>
            </div>
          ))}
        </div>

        {/* ── Dynamic Ticking Stats Breakdown ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-950/90 p-3.5 rounded-2xl border border-amber-500/30 space-y-1 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Score</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono">{displayedScore}%</p>
            <span className="text-[9px] text-zinc-500 font-mono">Accuracy</span>
          </div>

          <div className="bg-zinc-950/90 p-3.5 rounded-2xl border border-amber-500/30 space-y-1 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">XP Earned</span>
            <p className="text-2xl font-extrabold text-amber-400 font-mono">+{displayedXp}</p>
            <span className="text-[9px] text-zinc-500 font-mono">Credits</span>
          </div>

          <div className="bg-zinc-950/90 p-3.5 rounded-2xl border border-amber-500/30 space-y-1 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Streak</span>
            <p className="text-2xl font-extrabold text-orange-400 font-mono">+{displayedStreak} 🔥</p>
            <span className="text-[9px] text-zinc-500 font-mono">Days</span>
          </div>
        </div>

        {/* Mystery Loot Reward Box */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-amber-500/40 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎁</span> Performance Loot Box
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              {isLootOpened ? 'REVEALED' : 'UNCLAIMED'}
            </span>
          </div>

          {!isLootOpened ? (
            <button
              type="button"
              onClick={() => {
                setIsLootOpened(true);
                playArcadeVictoryChime();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <span>✨ Tap to Claim Mystery Perk! ✨</span>
            </button>
          ) : (
            <div className="p-3 bg-zinc-900 rounded-xl border border-amber-500/50 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">{lootReward.icon}</span>
              <div>
                <p className="text-xs font-bold text-amber-300">{lootReward.title}</p>
                <p className="text-[11px] text-zinc-300">{lootReward.desc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Glowing Shimmer Claim Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>CLAIM REWARDS & CONTINUE</span>
            <span>→</span>
          </span>
          <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

      </div>
    </div>
  );
}
