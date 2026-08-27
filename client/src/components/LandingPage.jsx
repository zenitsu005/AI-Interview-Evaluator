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
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0D12] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      
      {/* Subtle Background Dot Texture */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex-1 space-y-16 text-left relative z-10">
        
        {/* ── HERO SECTION WITH SOFT AMBIENT BACKDROP ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
          
          {/* Headline with Distinctive Sans Typography & Tight Letter-Spacing */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] relative z-10 pt-4 tracking-[-0.035em] sm:tracking-[-0.04em]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 font-black block sm:inline drop-shadow-[0_0_16px_rgba(45,212,191,0.15)]">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 max-w-xl leading-relaxed text-pretty font-normal relative z-10 tracking-[-0.01em]">
            Practice realistic mock interviews for any role or background with instant AI voice feedback.
          </p>

          {/* Tactile CTAs */}
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
                className="py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.03em] flex items-center gap-3">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.12)]">
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
                className="h-full flex flex-col justify-between bg-[#101522]/80 hover:bg-[#131B2C]/90 backdrop-blur-lg border border-white/[0.08] hover:border-teal-500/30 p-6 sm:p-8 rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_rgba(0,0,0,0.35)] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.005]"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/[0.1] transition-all duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 shadow-sm group-hover:scale-105 transition-all duration-300">
                      <Brain className="w-7 h-7" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-[-0.025em]">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed max-w-xl text-pretty font-normal">
                    Simulate all 3 core rounds: Aptitude & Logic, Technical Depth, and HR Round with live audio dialogue.
                  </p>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => nav('setup')}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_8px_16px_-4px_rgba(13,148,136,0.35)] border border-teal-300/40 transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2"
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
                className="h-full flex flex-col justify-between p-6 bg-[#101522]/80 hover:bg-[#131B2C]/90 backdrop-blur-lg border border-white/[0.08] hover:border-teal-500/30 rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_rgba(0,0,0,0.35)] group cursor-pointer transition-all duration-300 hover:scale-[1.005]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md font-mono">
                      4 Languages
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-[-0.02em]">
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
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
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
                className="h-full flex flex-col justify-between p-6 bg-[#101522]/80 hover:bg-[#131B2C]/90 backdrop-blur-lg border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_rgba(0,0,0,0.35)] group cursor-pointer transition-all duration-300 hover:scale-[1.005]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                      <Bug className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono">
                      Logic & Concurrency
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-[-0.02em]">
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
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
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
                className="h-full flex flex-col justify-between p-6 bg-[#101522]/80 hover:bg-[#131B2C]/90 backdrop-blur-lg border border-white/[0.08] hover:border-amber-500/30 rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_rgba(0,0,0,0.35)] group cursor-pointer transition-all duration-300 hover:scale-[1.005]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm group-hover:scale-105 transition-all duration-300">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                      60-Second Timers
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-[-0.02em]">
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
                    className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 text-slate-200 font-semibold text-xs transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
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
