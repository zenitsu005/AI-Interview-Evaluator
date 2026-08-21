import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import Button from './ui/Button';
import Card from './ui/Card';

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

    <div className="min-h-screen flex flex-col justify-between bg-[#0B0B0E] text-zinc-100 font-sans antialiased selection:bg-teal-500 selection:text-white select-none">
      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 flex-1 space-y-28 text-left">
        
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-7 pt-4">
          
          {/* 1. Refined Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
            <span>✦</span> Ek bar aaoge, job leke jaoge
          </div>

          {/* Headline with Gold Highlight */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.14]">
            Practice the interview.{" "}
            <span className="text-amber-500 font-extrabold">Understand the signal.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed text-pretty font-normal">
            Run realistic mock interviews across coding, debugging, and behavioral rounds. Get structured feedback you can use in your next attempt.
          </p>

          {/* CTAs */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => nav('setup')}
                className="py-3.5 px-7 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-950/50 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview →</span>
              </button>

              <button
                type="button"
                onClick={handleExploreModules}
                className="py-3.5 px-6 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore practice modules</span>
                <span className="text-zinc-500">↓</span>
              </button>
            </div>
          </div>
        </section>


        {/* ── BENTO PRACTICE MODULE CARDS SECTION ── */}
        <section id="practice-modules" className="space-y-6 pt-4 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Practice Studios
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Full Mock Studio */}
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => nav('setup')}
                className="h-full flex flex-col justify-between bg-[#131318] border-white/10 hover:border-teal-500/50 p-6 sm:p-7"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl text-pretty">
                    Simulate all core rounds: Aptitude, Technical Depth, System Architecture, and STAR Behavioral Fit.
                  </p>
                </div>

                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => nav('setup')}
                    className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    Start Full Mock Interview →
                  </button>
                </div>
              </Card>
            </div>

            {/* DSA Studio */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('dsa')} className="h-full flex flex-col justify-between p-6 bg-[#131318] border-white/5 hover:border-teal-500/50">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    DSA Practice Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Solve coding challenges in C++, Python 3, C, or Java with live execution.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => nav('dsa')}
                    className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer"
                  >
                    Practice DSA →
                  </button>
                </div>
              </Card>
            </div>

            {/* Bug Hunter Studio */}
            <div className="md:col-span-6">
              <Card variant="interactive" onClick={() => nav('bug-hunter')} className="h-full flex flex-col justify-between p-6 bg-[#131318] border-white/5 hover:border-teal-500/50">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    Bug Hunter Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Audit real code snippets for concurrency bugs, memory leaks, and logic flaws.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => nav('bug-hunter')}
                    className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer"
                  >
                    Debug Code →
                  </button>
                </div>
              </Card>
            </div>

            {/* 60s Rapid Blitz */}
            <div className="md:col-span-6">
              <Card variant="interactive" onClick={() => nav('blitz')} className="h-full flex flex-col justify-between p-6 bg-[#131318] border-white/5 hover:border-teal-500/50">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    60s Rapid Blitz
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Answer fast-paced technical questions under 60-second timers.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => nav('blitz')}
                    className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs transition-all active:scale-98 cursor-pointer"
                  >
                    Start Rapid Blitz →
                  </button>
                </div>
              </Card>
            </div>

          </div>
        </section>


      </main>


      {/* ── PRODUCTION-GRADE ACCESSIBLE FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#0B0B0E] py-12 px-4 sm:px-6 text-xs text-zinc-400 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div className="space-y-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-xs text-white font-bold">
                AI
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed text-pretty">
              Structured mock interview evaluation platform for software engineers.
            </p>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Product Studios</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => nav('setup')} className="hover:text-white transition-colors font-medium cursor-pointer">Mock Interview</button></li>
              <li><button onClick={() => nav('dsa')} className="hover:text-white transition-colors cursor-pointer">DSA Practice</button></li>
              <li><button onClick={() => nav('bug-hunter')} className="hover:text-white transition-colors cursor-pointer">Bug Hunter</button></li>
              <li><button onClick={() => nav('blitz')} className="hover:text-white transition-colors cursor-pointer">Rapid Blitz</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Prep Tools</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => nav('resume-builder')} className="hover:text-white transition-colors cursor-pointer">ATS Resume Scorer</button></li>
              <li><button onClick={() => nav('anxiety-prep')} className="hover:text-white transition-colors cursor-pointer">Interview Confidence Lab</button></li>
              <li><button onClick={() => nav('salary')} className="hover:text-white transition-colors cursor-pointer">Salary Practice</button></li>
              <li><button onClick={() => nav('analytics')} className="hover:text-white transition-colors cursor-pointer">Progress & Analytics</button></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}

