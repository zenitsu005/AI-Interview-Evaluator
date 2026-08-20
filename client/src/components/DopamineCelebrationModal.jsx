import React, { useState, useEffect } from 'react';

// Web Audio API Victory Fanfare synthesizer (zero external mp3 dependency)
const playVictoryChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
};

const SURPRISE_PERKS = [
  { icon: '🚀', title: '2x XP Multiplier Activated!', desc: 'Next interview earns double preparation credits.' },
  { icon: '📄', title: '1-Page Secret Cheat Sheet Unlocked!', desc: 'Full STAR formula & company track cheat sheet ready to print.' },
  { icon: '💼', title: 'FAANG ₹45 LPA Compensation Unlocked!', desc: 'Market benchmark salary matrix accessible in Negotiator.' },
  { icon: '🛡️', title: 'Gold Tier Shield Activated!', desc: 'Protects streak from breaking on your next practice drill.' },
];

export default function DopamineCelebrationModal({ isOpen, onClose, overallScore = 0, targetRole = 'Software Engineer', eloRating = 0, eloTier = {} }) {
  const [isLootOpened, setIsLootOpened] = useState(false);
  const [lootReward, setLootReward] = useState(SURPRISE_PERKS[0]);

  useEffect(() => {
    if (isOpen) {
      playVictoryChime();
      const randomPerk = SURPRISE_PERKS[Math.floor(Math.random() * SURPRISE_PERKS.length)];
      setLootReward(randomPerk);
      setIsLootOpened(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const earnedXp = 100 + Math.round((overallScore || 0) * 1.8);
  const streakBonus = Math.max(15, Math.round((overallScore || 0) * 0.5));
  const levelNum = Math.max(1, Math.floor(earnedXp / 50));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Background Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="card-dark border-amber-500/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-center border-2 ring-4 ring-amber-500/20 max-h-[92vh] overflow-y-auto">
        {/* Top Trophy / Badge Burst */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 flex items-center justify-center text-4xl sm:text-5xl mx-auto shadow-2xl shadow-amber-500/40 animate-bounce">
            🎉
          </div>
          <span className="absolute -bottom-2 -right-2 bg-indigo-600 border-2 border-slate-950 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg">
            LVL {levelNum}
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full inline-block">
            ⚡ INTERVIEW COMPLETED • LEVEL UP!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sensational Effort!
          </h1>
          <p className="text-xs text-slate-400">
            You completed a full AI evaluation for <strong className="text-slate-200">{targetRole}</strong>.
          </p>
        </div>

        {/* ── Dopamine XP & Points Grid ── */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-0.5 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-500">XP Earned</span>
            <p className="text-xl font-black text-amber-400">+{earnedXp}</p>
            <span className="text-[9px] text-slate-400 font-mono">Credits</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-0.5 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-500">Streak Bonus</span>
            <p className="text-xl font-black text-orange-400">+{streakBonus} 🔥</p>
            <span className="text-[9px] text-slate-400 font-mono">Momentum</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-0.5 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-500">Elo Rating</span>
            <p className="text-xl font-black text-cyan-400">{eloRating}</p>
            <span className="text-[9px] text-slate-400 font-mono">{eloTier.label?.split('/')[0] || 'Pts'}</span>
          </div>
        </div>

        {/* ── Interactive Mystery Loot Box ── */}
        <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 p-4 rounded-2xl border border-indigo-500/40 text-left space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <span>🎁</span> Mystery Performance Loot Box
            </span>
            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {isLootOpened ? 'REVEALED' : 'UNCLAIMED'}
            </span>
          </div>

          {!isLootOpened ? (
            <button
              type="button"
              onClick={() => {
                setIsLootOpened(true);
                playVictoryChime();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <span>✨</span>
              <span>Tap to Open Secret Reward Box!</span>
              <span>✨</span>
            </button>
          ) : (
            <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/50 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">{lootReward.icon}</span>
              <div>
                <p className="text-xs font-bold text-amber-300">{lootReward.title}</p>
                <p className="text-[11px] text-slate-300">{lootReward.desc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Tier Progress Bar */}
        <div className="space-y-1.5 text-left bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Rank Progression</span>
            <span className="text-amber-400 font-bold font-mono">{(earnedXp % 200)} / 200 XP to Next Rank</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 shadow-md"
              style={{ width: `${Math.min(100, Math.max(15, (earnedXp % 200) / 2))}%` }}
            />
          </div>
        </div>

        {/* Claim Rewards Button */}
        <button
          onClick={onClose}
          className="btn-primary w-full py-3.5 px-6 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl btn-glow bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl flex items-center justify-center gap-2"
        >
          <span>🔥 Claim All Rewards & View Full Report →</span>
        </button>
      </div>
    </div>
  );
}
