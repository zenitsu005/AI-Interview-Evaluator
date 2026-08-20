import React from 'react';
import { useInterview } from '../context/InterviewContext';

const SkillPill = ({ label }) => (
  <span className="bg-slate-800/80 border border-slate-700 text-indigo-300 text-xs px-3 py-1 rounded-lg font-medium shadow-xs">
    {label}
  </span>
);

export default function AnalysisCard() {
  const {
    resumeAnalysis,
    targetRole,
    startInterview,
    isLoading,
    error,
    setPhase,
    interviewMode,
    setInterviewMode,
    difficultyLevel,
  } = useInterview();

  if (!resumeAnalysis) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* ── Top Bar ── */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setPhase('setup')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          ← Edit Resume
        </button>
        <span className="font-bold text-slate-200 text-sm">Step 2 of 3: Review & Select Mode</span>
        <div className="w-16" />
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto w-full px-6 py-10 flex-1 space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            <span>✓</span> Resume Analyzed Successfully
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Interview Profile Overview
          </h1>
        </div>

        {/* Profile Card */}
        <div className="card-dark space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Target Position</p>
              <h2 className="text-lg font-bold text-white mt-0.5">{targetRole}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-300">
                {resumeAnalysis.domain}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
                {difficultyLevel} Level
              </span>
            </div>
          </div>

          {/* AI Summary */}
          {resumeAnalysis.summary && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Executive Profile Summary
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {resumeAnalysis.summary}
              </p>
            </div>
          )}

          {/* Skills & Technologies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {resumeAnalysis.coreSkills?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Core Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resumeAnalysis.coreSkills.map((s, i) => (
                    <SkillPill key={i} label={s} />
                  ))}
                </div>
              </div>
            )}

            {resumeAnalysis.keyTechnologies?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Technologies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resumeAnalysis.keyTechnologies.map((t, i) => (
                    <SkillPill key={i} label={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 3-Round Progressive Curriculum (15 Questions Total) ── */}
        <div className="card-dark border-indigo-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span>🎯</span> Interview Structure (15 Adaptive Questions • 5 Per Round)
            </h2>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold">
              ⚡ Progressive Level Escalation (L1 ➔ L5)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-400 text-xs">🧠 Round 1: Aptitude</span>
                <span className="text-[10px] text-slate-400 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Logic puzzles ➔ quantitative math ➔ advanced analytical deduction.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400 text-xs">💻 Round 2: Technical</span>
                <span className="text-[10px] text-slate-400 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Fundamentals ➔ live coding/SQL ➔ system design whiteboard & resilience.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-green-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-400 text-xs">🤝 Round 3: HR & Fit</span>
                <span className="text-[10px] text-slate-400 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                STAR situations ➔ conflict resolution ➔ failure ownership & leadership.
              </p>
            </div>
          </div>
        </div>

        {/* ── Mode Selector ── */}
        <div className="card-dark">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span>🎬</span> Choose Your Interview Mode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Video Mode */}
            <button
              type="button"
              onClick={() => setInterviewMode('video')}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                interviewMode === 'video'
                  ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎥</span>
                {interviewMode === 'video' && (
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="font-bold text-white text-sm">Video Interview Room</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Webcam posture, facial expression, and voice audio analysis for an executive report.
              </p>
            </button>

            {/* Text Mode */}
            <button
              type="button"
              onClick={() => setInterviewMode('text')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                interviewMode === 'text'
                  ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl mb-2">📝</div>
              <p className="font-bold text-white text-sm">Text Chat Mode</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Chat interface with timed answers for quick technical and aptitude practice.
              </p>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-4 text-red-300 text-xs flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={startInterview}
          disabled={isLoading}
          className="btn-primary w-full py-4 text-sm font-bold shadow-xl btn-glow"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Preparing Adaptive Questions...
            </span>
          ) : (
            `🚀 Begin ${interviewMode === 'video' ? 'Video' : 'Text'} Interview →`
          )}
        </button>
      </main>
    </div>
  );
}
