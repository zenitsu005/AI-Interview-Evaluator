import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import AppNavbar from './AppNavbar';

export default function LandingPage() {
  const { setPhase } = useInterview();
  const { isAuthenticated, openAuth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070a12] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Navbar */}
      <AppNavbar currentActive="landing" />

      {/* ── Hero Section ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-inner animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>⚡ The #1 AI Mock Interview & Bar Raiser Simulator</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Meet the Interview Before You Meet the Recruiter
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Face realistic <strong className="text-slate-200 font-semibold">Amazon, Google & YC Bar Raisers</strong> in a full Google Meet video studio. Get instant deterministic scores on your code, system design, and STAR behavioral answers.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-14 w-full sm:w-auto justify-center">
          <button
            onClick={() => setPhase('setup')}
            className="btn-primary text-sm px-8 py-3.5 w-full sm:w-auto btn-glow shadow-xl shadow-indigo-600/30 font-extrabold"
          >
            <span>🚀 Start Full Mock Interview</span>
            <span className="text-xs opacity-75 font-normal ml-1.5">(Instant & Free)</span>
          </button>

          <button
            onClick={() => setPhase('hype-lab')}
            className="btn-secondary text-sm px-6 py-3.5 w-full sm:w-auto text-emerald-300 border-emerald-800/80 hover:border-emerald-500 font-bold flex items-center justify-center gap-2"
          >
            <span>🧘</span>
            <span>3-Min Anxiety Hype Lab</span>
          </button>
        </div>

        {/* ── Real-Time Metrics & Trust Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl mb-14 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md text-center">
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white font-mono">100,000+</p>
            <p className="text-[11px] text-slate-400 font-medium">Questions Evaluated</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">98.4%</p>
            <p className="text-[11px] text-slate-400 font-medium">Confidence Boost</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">6 Personas</p>
            <p className="text-[11px] text-slate-400 font-medium">Top Bar Raisers</p>
          </div>

        </div>

        {/* ── All 8 Specialized Practice Studios Grid ── */}
        <div className="w-full text-left space-y-4 mb-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <span>⚡</span> Specialized Interactive Studios
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Pick any module to practice specific skills without doing a full 15-question interview.</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">100% Free & Interactive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
            {/* Studio 1: Mock Studio */}
            <div
              onClick={() => setPhase('setup')}
              className="card-dark border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-indigo-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">👥</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                    FLAGSHIP
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition-colors">
                  Dual Meet Studio
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Real-time video call with spoken lip-sync Bar Raiser avatars, audio waveforms, code sandbox, and deterministic grading.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Mock Studio →
              </span>
            </div>

            {/* Studio 2: Hype Lab */}
            <div
              onClick={() => setPhase('hype-lab')}
              className="card-dark border-emerald-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-emerald-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🧘</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    NERVOUS RESET
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                  3-Min Hype Lab
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Vagus nerve box-breathing, microphone vocal grounding, webcam posture mirror, and 1-min dopamine quick-win puzzle.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Start Hype Routine →
              </span>
            </div>

            {/* Studio 3: DSA Studio */}
            <div
              onClick={() => setPhase('dsa')}
              className="card-dark border-cyan-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-cyan-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💻</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    SANDBOX
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  DSA & Algorithms
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Practice Easy to Hard algorithmic problems with live test runners, hints, and Big-O asymptotic analysis.
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Solve Problems →
              </span>
            </div>

            {/* Studio 4: Salary Negotiator */}
            <div
              onClick={() => setPhase('negotiate')}
              className="card-dark border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-amber-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💼</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    CTC BOOST
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                  Salary Sparring
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Practice countering lowball offers, down-level pushes, and negotiating joining bonuses & RSUs with realistic AI recruiters.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Negotiate Package →
              </span>
            </div>

            {/* Studio 5: ATS Resume Optimizer */}
            <div
              onClick={() => setPhase('resume-builder')}
              className="card-dark border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-indigo-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">📄</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                    ATS PROOF
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition-colors">
                  ATS Resume Optimizer
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  100-point ATS benchmark score, missing keyword analyzer, power action verbs, and instant clean resume export.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Optimize Resume →
              </span>
            </div>

            {/* Studio 6: Bug Hunter */}
            <div
              onClick={() => setPhase('bug-hunter')}
              className="card-dark border-red-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-red-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🐛</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-300">
                    CODE REVIEW
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-red-300 transition-colors">
                  Bug Hunter Drills
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Catch SQL injections, race conditions, memory leaks, and authentication bypasses in timed production code snippets.
                </p>
              </div>
              <span className="text-xs font-bold text-red-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Hunt Bugs →
              </span>
            </div>

            {/* Studio 7: 60s Blitz */}
            <div
              onClick={() => setPhase('blitz')}
              className="card-dark border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-amber-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    RAPID FIRE
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                  60-Second Blitz
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  High-speed trivia drills on core CS fundamentals, SQL clauses, HTTP status codes, and data structures.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Start Blitz Timer →
              </span>
            </div>

            {/* Studio 8: Bar Raiser Matcher */}
            <div
              onClick={() => setPhase('setup')}
              className="card-dark border-purple-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl hover:border-purple-400 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🏢</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                    CULTURE MATCH
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Bar Raiser Matcher
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Target specific hiring bars at Amazon, Google, YC, Wall Street, Microsoft, or Meta with tailored evaluation rubrics.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Pick Persona →
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Clean Human Footer ── */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} InterviewPro AI. Designed for high-impact engineering careers.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setPhase('setup')} className="hover:text-white transition-colors">Mock Studio</button>
            <button onClick={() => setPhase('hype-lab')} className="hover:text-white transition-colors">Hype Lab</button>
            <button onClick={() => setPhase('dsa')} className="hover:text-white transition-colors">DSA</button>
            <button onClick={() => setPhase('negotiate')} className="hover:text-white transition-colors">Salary Sparring</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
