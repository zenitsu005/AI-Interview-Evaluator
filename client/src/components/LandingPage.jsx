import React from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
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
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0D13] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      
      {/* Background Dot Texture & Ambient Atmospheric Light */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex-1 space-y-16 text-left relative z-10">
        
        {/* ── HERO SECTION WITH ANIMATED BACKDROP ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
          
          {/* ── ANIMATED GEOMETRIC RADAR & ORBITAL GRID ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] pointer-events-none -z-10 flex items-center justify-center opacity-60">
            {/* Concentric Rotating Ring 1 */}
            <div className="absolute w-[680px] h-[360px] rounded-[100%] border border-teal-500/15 animate-radar-slow [border-dasharray:6_6]" />
            {/* Concentric Rotating Ring 2 */}
            <div className="absolute w-[500px] h-[260px] rounded-[100%] border border-cyan-500/15 animate-radar-slow [animation-duration:60s] [animation-direction:reverse]" />
            {/* Inner Focal Orbit */}
            <div className="absolute w-[320px] h-[160px] rounded-[100%] border border-amber-500/15 animate-pulse-slow" />
            {/* Crosshair Accent Lines */}
            <div className="absolute w-[780px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <div className="absolute h-[380px] w-[1px] bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
          </div>

          {/* ── ROTATING MULTI-COLOR AURORA LIGHT MESH ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-tr from-teal-500/25 via-cyan-400/20 via-amber-500/15 to-transparent rounded-full blur-[100px] animate-aurora pointer-events-none -z-10" />

          {/* ── FLOATING AI CONSTELLATION NODES ── */}
          <div className="absolute -top-6 left-12 w-2.5 h-2.5 rounded-full bg-teal-400/80 shadow-[0_0_12px_rgba(45,212,191,0.8)] animate-float-1 pointer-events-none hidden sm:block" />
          <div className="absolute top-10 -right-8 w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-float-2 pointer-events-none hidden sm:block" />
          <div className="absolute -bottom-4 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-float-1 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-12 right-1/4 w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-float-2 pointer-events-none hidden sm:block" />

          {/* Headline with Professional Gradient */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.12] relative z-10 pt-4">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-extrabold block sm:inline drop-shadow-[0_0_24px_rgba(45,212,191,0.25)]">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed text-pretty font-normal relative z-10">
            Practice high-stakes domain, technical, and behavioral interview loops across Commerce, Computer Applications, Management, Engineering, and Finance with realistic AI voice debriefs.
          </p>

          {/* CTAs */}
          <div className="pt-2 relative z-10">
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
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl text-pretty font-normal">
                    Simulate all 3 core rounds: Aptitude & Logic, Technical Depth, and HR Round with live audio dialogue.
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

    </div>
  );
}
