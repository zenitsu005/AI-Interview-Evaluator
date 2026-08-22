import React from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import Card from './ui/Card';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Bug,
  Zap,
  Brain,
  ShieldCheck,
  Layers,
  Activity,
  ChevronRight,
  DollarSign,
  FileText,
  HeartPulse,
} from 'lucide-react';

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
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-44 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Headline with Professional Gradient */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.14]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 font-extrabold block sm:inline">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed text-pretty font-normal">
            Run realistic mock interviews with human-like AI voice debriefs across coding, debugging, and behavioral rounds. Get calibrated Bar Raiser feedback before your actual interview.
          </p>

          {/* CTAs */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => nav('setup')}
                className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/25 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreModules}
                className="py-3.5 px-6 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all active:scale-98 cursor-pointer flex items-center gap-2 shadow-sm"
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-teal-400" />
              <span>Targeted Practice Studios</span>
            </h2>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Production Simulator V3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Full Mock Studio */}
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => nav('setup')}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-[#131823] via-[#171E2D] to-[#10141D] border-white/10 hover:border-teal-400/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all" />

                <div className="space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl text-pretty">
                    Simulate all core rounds: Aptitude Logic, Technical Depth, System Architecture, and STAR Behavioral Fit with live audio dialogue.
                  </p>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => nav('setup')}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
                  >
                    <span>Start Full Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            </div>

            {/* DSA Studio */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('dsa')} className="h-full flex flex-col justify-between p-6 bg-[#131823] border-white/10 hover:border-teal-400/40 shadow-xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
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
                    className="py-2 px-4 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Practice DSA</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>
              </Card>
            </div>

            {/* Bug Hunter Studio */}
            <div className="md:col-span-6">
              <Card variant="interactive" onClick={() => nav('bug-hunter')} className="h-full flex flex-col justify-between p-6 bg-[#131823] border-white/10 hover:border-cyan-400/40 shadow-xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bug className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
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
                    className="py-2 px-4 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Debug Code</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </Card>
            </div>

            {/* 60s Rapid Blitz */}
            <div className="md:col-span-6">
              <Card variant="interactive" onClick={() => nav('blitz')} className="h-full flex flex-col justify-between p-6 bg-[#131823] border-white/10 hover:border-amber-400/40 shadow-xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
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
                    className="py-2 px-4 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Start Rapid Blitz</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </Card>
            </div>

          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#0E121B] py-12 px-4 sm:px-6 text-xs text-slate-400 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div className="space-y-2.5 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed text-pretty">
              High-fidelity AI interview simulation suite engineered for modern software engineers.
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-200 mb-2.5">Product Studios</p>
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
