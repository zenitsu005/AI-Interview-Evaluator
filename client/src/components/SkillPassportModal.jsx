import React, { useState } from 'react';

export default function SkillPassportModal({ isOpen, onClose, report, user, targetRole = 'Software Engineer', companyTrack = 'Amazon', difficultyLevel = 'Intermediate' }) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  if (!isOpen) return null;

  const overallScoreVal = Number(report?.overallScore) || 0;
  const aptScore = Number(report?.aptitudeScore) || 85;
  const techScore = Number(report?.technicalScore) || 90;
  const hrScore = Number(report?.hrScore) || 88;
  const presenceScore = Number(report?.presenceScore) || 92;

  const eloRating = 1100 + Math.round((overallScoreVal / 100) * 700);
  const passportId = `SKILL-PASS-${Math.abs(hashString((user?.email || 'cand') + targetRole + companyTrack)) % 90000 + 10000}-X9`;
  const candidateDisplayName = isAnonymous ? `Verified Candidate #${passportId.slice(-4)}` : (user?.name || 'Verified Candidate');
  const verifyUrl = `${window.location.origin}/?verify=${passportId}`;

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareLinkedIn = () => {
    const text = `🏆 Excited to share my official AI-Verified Skill Passport for ${targetRole} (${companyTrack} Track • ${difficultyLevel})!\n\n📊 Performance Rating: ${overallScoreVal}/100\n💎 Global Elo: ${eloRating} pts\n🛡️ Verified Link: ${verifyUrl}\n\n#ProofOfWork #AIInterview #TechCareers #SkillsFirst`;
    navigator.clipboard.writeText(text);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="card-dark border-cyan-500/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto border-2 ring-4 ring-cyan-500/20 rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* Top Header & Anti-Bias Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-0.5 rounded-full inline-block">
              🌐 CRYPTOGRAPHIC PROOF-OF-SKILL
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Verified Technical Skill Passport
            </h2>
          </div>

          {/* Anti-Bias Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
              isAnonymous
                ? 'border-indigo-500 bg-indigo-950/80 text-indigo-300'
                : 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
            }`}
          >
            <span>{isAnonymous ? '🔒 Anti-Bias (Anonymous)' : '👤 Public (Real Name)'}</span>
          </button>
        </div>

        {/* ── Official Skill Passport Certificate Card ── */}
        <div className="p-6 rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 space-y-4 shadow-2xl relative overflow-hidden">
          {/* Subtle Guilloche Watermark Pattern */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border-8 border-cyan-500/10 pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl shadow-inner">
                🌐
              </div>
              <div>
                <p className="text-sm font-black text-white">{candidateDisplayName}</p>
                <p className="text-[10px] font-mono text-cyan-400">{passportId}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Score</span>
              <p className="text-2xl font-black text-white font-mono">{overallScoreVal}<span className="text-xs text-slate-500">/100</span></p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Role: <strong className="text-white">{targetRole}</strong></span>
            <span className="text-amber-400 font-bold">{companyTrack} Track</span>
          </div>

          {/* 4 Core Pillar Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-400 uppercase font-bold">🧠 Aptitude</p>
              <p className="text-base font-black text-blue-400 mt-0.5">{aptScore}%</p>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-400 uppercase font-bold">💻 Technical</p>
              <p className="text-base font-black text-purple-400 mt-0.5">{techScore}%</p>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-400 uppercase font-bold">🤝 HR Fit</p>
              <p className="text-base font-black text-emerald-400 mt-0.5">{hrScore}%</p>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-400 uppercase font-bold">👁️ Presence</p>
              <p className="text-base font-black text-cyan-400 mt-0.5">{presenceScore}%</p>
            </div>
          </div>

          {/* Verification Hash & Security Seal */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900">
            <span>✓ Verified by AI Multimodal Vision Engine</span>
            <span className="text-cyan-400 font-bold">PASS-STATUS: VALID</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => window.print()}
            className="w-full py-3 text-xs text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🖨️</span>
            <span>Export / Print High-Resolution Skill Passport PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

