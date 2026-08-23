import React, { useState } from 'react';
import {
  IconShieldCheck as ShieldCheck,
  IconLock as Lock,
  IconUser as User,
  IconCircleCheck as CheckCircle2,
  IconSparkles as Sparkles,
  IconBrain as Brain,
  IconCode as Code2,
  IconUsers as Users,
  IconActivity as Activity,
  IconCopy as Copy,
  IconCheck as Check,
} from '@tabler/icons-react';

export default function SkillPassportModal({ isOpen, onClose, report, user, targetRole = 'Software Engineer', companyTrack = 'Amazon', difficultyLevel = 'Intermediate' }) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const overallScoreVal = Number(report?.overallScore) || 0;
  const aptScore = Number(report?.aptitudeScore) || 85;
  const techScore = Number(report?.technicalScore) || 90;
  const hrScore = Number(report?.hrScore) || 88;
  const presenceScore = Number(report?.presenceScore) || 92;

  const passportId = `SKILL-PASS-${Math.abs(hashString((user?.email || 'cand') + targetRole + companyTrack)) % 90000 + 10000}-X9`;
  const candidateDisplayName = isAnonymous ? `Candidate #${passportId.slice(-4)}` : (user?.name || 'Candidate');

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://ai-interview-evaluator.app/passport/${passportId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-[#131823] border border-white/10 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Top Header & Anti-Bias Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> PROOF-OF-SKILL PASSPORT
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
              Performance Skill Passport
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`text-xs px-3.5 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isAnonymous
                ? 'border-teal-500/40 bg-teal-950/80 text-teal-300'
                : 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
            }`}
          >
            {isAnonymous ? <Lock className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{isAnonymous ? 'Anti-Bias (Anonymous)' : 'Public (Real Name)'}</span>
          </button>
        </div>

        {/* Certificate Card */}
        <div className="p-6 rounded-2xl border-2 border-teal-500/40 bg-gradient-to-b from-[#171E2D] via-[#131823] to-[#0D111A] space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">{candidateDisplayName}</p>
                <p className="text-[11px] font-mono text-teal-400 font-bold">{passportId}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Overall Score</span>
              <p className="text-2xl font-black text-white font-mono">{overallScoreVal}<span className="text-xs text-slate-500 font-normal">/100</span></p>
            </div>
          </div>

          <div className="p-3 bg-[#0D111A] rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Target Role: <strong className="text-white">{targetRole}</strong></span>
            <span className="text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">{companyTrack} Track</span>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 bg-[#0D111A] rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                <Brain className="w-3 h-3 text-blue-400" /> Aptitude
              </p>
              <p className="text-base font-black text-blue-400 mt-1 font-mono">{aptScore}%</p>
            </div>
            <div className="p-3 bg-[#0D111A] rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                <Code2 className="w-3 h-3 text-teal-400" /> Technical
              </p>
              <p className="text-base font-black text-teal-400 mt-1 font-mono">{techScore}%</p>
            </div>
            <div className="p-3 bg-[#0D111A] rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-amber-400" /> STAR Fit
              </p>
              <p className="text-base font-black text-amber-400 mt-1 font-mono">{hrScore}%</p>
            </div>
            <div className="p-3 bg-[#0D111A] rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" /> Presence
              </p>
              <p className="text-base font-black text-emerald-400 mt-1 font-mono">{presenceScore}%</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-white/5">
            <span>Performance Evaluation Record</span>
            <span className="text-teal-400 font-bold">STATUS: EVALUATED</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Passport Link Copied!' : 'Copy Shareable Passport Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
