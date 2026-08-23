import React from 'react';
import { useInterview } from '../context/InterviewContext';
import {
  IconBrain,
  IconCode,
  IconUsers,
  IconVideo,
  IconFileText,
  IconAlertCircle,
  IconLoader2,
  IconArrowRight,
  IconSparkles,
  IconAdjustments,
} from '@tabler/icons-react';

const SkillPill = ({ label }) => (
  <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium shadow-xs">
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
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-900 select-none">
      {/* ── Top Bar ── */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setPhase('setup')}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          ← Edit Resume
        </button>
        <span className="font-bold text-slate-800 text-sm">Step 2 of 3: Review & Select Mode</span>
        <div className="w-16" />
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto w-full px-6 py-10 flex-1 space-y-6 text-left">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 shadow-sm">
            <span>✓</span> Resume Analyzed Successfully
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Interview Profile Overview
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Target Position</p>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{targetRole}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                {resumeAnalysis.domain}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {difficultyLevel} Level
              </span>
            </div>
          </div>

          {/* AI Summary */}
          {resumeAnalysis.summary && (
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Executive Profile Summary
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {resumeAnalysis.summary}
              </p>
            </div>
          )}

          {/* Skills & Technologies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {resumeAnalysis.coreSkills?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span>🎯</span> Interview Structure (15 Adaptive Questions • 5 Per Round)
            </h2>
            <span className="text-[11px] text-teal-700 font-mono font-semibold">
              ⚡ Progressive Level Escalation (L1 ➔ L5)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 text-xs flex items-center gap-1.5">
                  <IconBrain className="w-4 h-4 text-blue-600" />
                  <span>Round 1: Aptitude</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Logic puzzles ➔ quantitative math ➔ advanced analytical deduction.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-700 text-xs flex items-center gap-1.5">
                  <IconCode className="w-4 h-4 text-purple-600" />
                  <span>Round 2: Technical</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Fundamentals ➔ live coding/SQL ➔ system design whiteboard & resilience.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1.5">
                  <IconUsers className="w-4 h-4 text-emerald-600" />
                  <span>Round 3: HR Round</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">5 Questions</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                STAR situations ➔ conflict resolution ➔ failure ownership & leadership.
              </p>
            </div>
          </div>
        </div>

        {/* ── Mode Selector ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <IconAdjustments className="w-4 h-4 text-teal-600" />
            <span>Choose Your Interview Mode</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Video Mode */}
            <button
              type="button"
              onClick={() => setInterviewMode('video')}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${
                interviewMode === 'video'
                  ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <IconVideo className="w-5 h-5" />
                </div>
                {interviewMode === 'video' && (
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="font-bold text-slate-900 text-sm">Video Interview Room</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Webcam posture, facial expression, and voice audio analysis for an executive report.
              </p>
            </button>

            {/* Text Mode */}
            <button
              type="button"
              onClick={() => setInterviewMode('text')}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                interviewMode === 'text'
                  ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-2">
                <IconFileText className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900 text-sm">Text Chat Mode</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Chat interface with timed answers for quick technical and aptitude practice.
              </p>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-xs flex items-center gap-2">
            <IconAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={startInterview}
          disabled={isLoading}
          className="w-full py-4 text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-all active:scale-98"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <IconLoader2 className="animate-spin h-4 w-4 text-white" />
              Preparing Adaptive Questions...
            </span>
          ) : (
            `Begin ${interviewMode === 'video' ? 'Video' : 'Text'} Interview →`
          )}
        </button>
      </main>

      <footer className="py-4 border-t border-slate-200 bg-white text-center" />
    </div>
  );
}
