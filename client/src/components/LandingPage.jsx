import React from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import HeroBackgroundAnimation from './ui/HeroBackgroundAnimation';
import {
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
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0D12] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      
      {/* Subtle Background Dot Texture */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex-1 space-y-16 text-left relative z-10">
        
        {/* ── HERO SECTION WITH SOFT AMBIENT BACKDROP ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
          
          {/* Subtle, Premium Dark-Mode Ambient Network & Radial Aura Animation */}
          <HeroBackgroundAnimation />

          {/* Headline with Tight Modern SaaS Letter-Spacing */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.06] relative z-10 pt-4 tracking-[-0.035em] sm:tracking-[-0.045em]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 font-black block sm:inline drop-shadow-[0_0_16px_rgba(45,212,191,0.15)] tracking-[-0.035em] sm:tracking-[-0.045em]">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 max-w-xl leading-relaxed text-pretty font-normal relative z-10 tracking-[-0.01em]">
            Practice realistic mock interviews for any role or background with instant AI voice feedback.
          </p>

          {/* Tactile CTAs with Clear Primary Focal Point */}
          <div className="pt-2 relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => nav('setup')}
                className="py-3.5 px-7 rounded-xl bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_24px_-4px_rgba(13,148,136,0.4)] border border-teal-300/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreModules}
                className="py-3.5 px-6 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Explore practice modules</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </section>

        {/* ── BENTO PRACTICE MODULE CARDS SECTION (2x2 Balanced Grid) ── */}
        <section id="practice-modules" className="space-y-6 pt-4 mt-16 sm:mt-20 scroll-mt-24 w-full max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.12)]">
                <Layers className="w-6 h-6" />
              </span>
              <span>Targeted Practice Studios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* Full Mock Studio */}
            <div
              onClick={() => nav('setup')}
              className="flex flex-col justify-between p-6 sm:p-8 bg-[#0f172a]/50 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                    3 Core Rounds
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Full Mock Interview Studio
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  Simulate all 3 core rounds: Aptitude & Logic, Technical Depth, and HR Round with live audio dialogue.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => nav('setup')}
                  className="w-fit text-sm font-medium px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Full Mock Interview</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            </div>

            {/* DSA Studio */}
            <div
              onClick={() => nav('dsa')}
              className="flex flex-col justify-between p-6 sm:p-8 bg-[#0f172a]/50 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                    4 Languages
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  DSA Practice Studio
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  Solve coding challenges in C++, Python 3, C, or Java with instant test case verification.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => nav('dsa')}
                  className="w-fit text-sm font-medium px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Practice DSA</span>
                  <ChevronRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>

            {/* Bug Hunter Studio */}
            <div
              onClick={() => nav('bug-hunter')}
              className="flex flex-col justify-between p-6 sm:p-8 bg-[#0f172a]/50 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Bug className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                    Logic & Concurrency
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Bug Hunter Studio
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  Audit production code snippets for concurrency deadlocks, memory leaks, and subtle logic bugs.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => nav('bug-hunter')}
                  className="w-fit text-sm font-medium px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Debug Code</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* 60s Rapid Blitz */}
            <div
              onClick={() => nav('blitz')}
              className="flex flex-col justify-between p-6 sm:p-8 bg-[#0f172a]/50 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    60-Second Timers
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  60s Rapid Blitz
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  Answer fast-paced technical questions under strict 60-second timers to build spontaneous clarity.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => nav('blitz')}
                  className="w-fit text-sm font-medium px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Rapid Blitz</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
