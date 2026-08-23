import React from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import Card from './ui/Card';
import {
  TbSparkles as Sparkles,
  TbArrowRight as ArrowRight,
  TbTerminal2 as Code2,
  TbBug as Bug,
  TbBolt as Zap,
  TbBrain as Brain,
  TbStack2 as Layers,
  TbChevronRight as ChevronRight,
} from 'react-icons/tb';

export default function LandingPage({ onNavigate }) {
  const { setPhase } = useInterview();
  const nav = onNavigate || setPhase;

  const handleExploreModules = () => {
    const el = document.getElementById('practice-modules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      nav('dsa');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0D13] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none">
      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 flex-1 space-y-20 text-left">
        
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-7 pt-4">
          
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Micro-Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-xl shadow-inner group cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-slate-300">Multimodal AI Interview Simulation Suite</span>
            <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-teal-500/10 rounded border border-teal-500/20">Live</span>
          </div>

          {/* Headline with Professional Gradient */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.14]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 font-extrabold block sm:inline">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed text-pretty font-normal">
            Run realistic mock interviews with human-like AI voice debriefs across coding, debugging, and HR rounds. Get calibrated, objective feedback before your actual interview.
          </p>

          {/* CTAs */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => nav('setup')}
                className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_8px_24px_rgba(20,184,166,0.35)] hover:shadow-[0_1px_rgba(255,255,255,0.45)_inset,0_12px_32px_rgba(20,184,166,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreModules}
                className="py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Explore practice modules</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </section>

        {/* ── BENTO PRACTICE MODULE CARDS SECTION ── */}
        <section id="practice-modules" className="space-y-6 pt-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.15)]">
                <Layers className="w-6 h-6" />
              </span>
              <span>Targeted Practice Studios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Full Mock Studio */}
            <div className="md:col-span-8">
              <div
                onClick={() => nav('setup')}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-[#121724] via-[#161D2B] to-[#0E131E] border border-white/[0.08] hover:border-teal-400/50 p-6 sm:p-8 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)] group-hover:scale-105 group-hover:bg-teal-500/20 group-hover:border-teal-400/40 transition-all duration-300">
                      <Brain className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">
                      Multimodal 4-Round Loop
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl text-pretty font-normal">
                    Simulate all core rounds: Aptitude Logic, Technical Depth, System Architecture, and HR Round with live audio dialogue.
                  </p>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => nav('setup')}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_4px_16px_rgba(20,184,166,0.3)] hover:shadow-[0_1px_rgba(255,255,255,0.4)_inset,0_6px_24px_rgba(20,184,166,0.45)] transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2"
                  >
                    <span>Start Full Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* DSA Studio */}
            <div className="md:col-span-4">
              <div
                onClick={() => nav('dsa')}
                className="h-full flex flex-col justify-between p-6 bg-[#121724] border border-white/[0.08] hover:border-teal-400/40 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_8px_24px_rgba(0,0,0,0.4)] group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)] group-hover:scale-105 group-hover:bg-teal-500/20 group-hover:border-teal-400/40 transition-all duration-300">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2 py-0.5 rounded-md">
                      4 Languages
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    DSA Practice Studio
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                    Solve coding challenges in C++, Python 3, C, or Java with instant test case verification.
                  </p>
                </div>
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => nav('dsa')}
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Practice DSA</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bug Hunter Studio */}
            <div className="md:col-span-6">
              <div
                onClick={() => nav('bug-hunter')}
                className="h-full flex flex-col justify-between p-6 bg-[#121724] border border-white/[0.08] hover:border-cyan-400/40 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_8px_24px_rgba(0,0,0,0.4)] group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:scale-105 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-all duration-300">
                      <Bug className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-md">
                      Logic & Concurrency
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Bug Hunter Studio
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                    Audit production code snippets for concurrency deadlocks, memory leaks, and subtle logic bugs.
                  </p>
                </div>
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => nav('bug-hunter')}
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Debug Code</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* 60s Rapid Blitz */}
            <div className="md:col-span-6">
              <div
                onClick={() => nav('blitz')}
                className="h-full flex flex-col justify-between p-6 bg-[#121724] border border-white/[0.08] hover:border-amber-400/40 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_8px_24px_rgba(0,0,0,0.4)] group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] group-hover:scale-105 group-hover:bg-amber-500/20 group-hover:border-amber-400/40 transition-all duration-300">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md">
                      60-Second Timers
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    60s Rapid Blitz
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                    Answer fast-paced technical questions under strict 60-second timers to build spontaneous clarity.
                  </p>
                </div>
                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => nav('blitz')}
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Start Rapid Blitz</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#0E121B] py-12 px-4 sm:px-6 text-xs text-slate-400 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div className="space-y-2.5 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed text-pretty">
              Practice technical, coding, and behavioral interviews with real-time AI feedback.
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-200 mb-2.5">Practice Studios</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => nav('setup')} className="hover:text-teal-400 transition-colors cursor-pointer">Mock Interview</button></li>
              <li><button onClick={() => nav('dsa')} className="hover:text-teal-400 transition-colors cursor-pointer">DSA Practice</button></li>
              <li><button onClick={() => nav('bug-hunter')} className="hover:text-teal-400 transition-colors cursor-pointer">Bug Hunter</button></li>
              <li><button onClick={() => nav('blitz')} className="hover:text-teal-400 transition-colors cursor-pointer">Rapid Blitz</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-200 mb-2.5">Prep Tools</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => nav('resume-builder')} className="hover:text-teal-400 transition-colors cursor-pointer">ATS Resume Scorer</button></li>
              <li><button onClick={() => nav('anxiety-prep')} className="hover:text-teal-400 transition-colors cursor-pointer">Confidence Lab</button></li>
              <li><button onClick={() => nav('salary')} className="hover:text-teal-400 transition-colors cursor-pointer">Salary Negotiation</button></li>
              <li><button onClick={() => nav('analytics')} className="hover:text-teal-400 transition-colors cursor-pointer">Progress & Elo</button></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
