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
  Layers,
  ChevronRight,
  DollarSign,
  FileText,
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
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0F14] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      {/* Subtle Radial Gradient Glow behind Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(45,212,191,0.15),rgba(251,191,36,0.04),transparent)] pointer-events-none z-0" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 flex-1 space-y-20 text-left relative z-10">
        
        {/* ── HERO SECTION (Centered, High Impact) ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-7 pt-4">
          
          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.15]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 font-extrabold block sm:inline">
              Ace the actual loop.
            </span>
          </h1>

          {/* Subheadline / Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed text-pretty font-normal">
            Run realistic mock interviews with human-like AI voice debriefs across coding, debugging, and behavioral rounds. Get calibrated, objective feedback before your actual interview.
          </p>

          {/* Call to Action Buttons (Centered Flex Row) */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Primary Button */}
              <button
                type="button"
                onClick={() => nav('setup')}
                className="rounded-full px-8 py-4 bg-gradient-to-r from-[#2dd4bf] via-teal-300 to-[#34d399] hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview</span>
                <span className="text-base font-bold">→</span>
              </button>

              {/* Secondary Button */}
              <button
                type="button"
                onClick={handleExploreModules}
                className="rounded-full px-7 py-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Explore practice modules</span>
                <span className="text-slate-400 font-bold">&gt;</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── FEATURE SECTION ("Targeted Practice Studios") ── */}
        <section id="practice-modules" className="space-y-6 pt-4 scroll-mt-24">
          {/* Section Title with Layered/Cube Icon */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-teal-400" />
              <span>Targeted Practice Studios</span>
            </h2>
          </div>

          {/* Card Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1 (Left): AI / Brain Simulation */}
            <Card
              variant="interactive"
              onClick={() => nav('setup')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    Full AI Interview Simulator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Simulate all core rounds: Aptitude Logic, Technical Depth, System Architecture, and STAR Behavioral Fit with live audio debriefs.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Start Full Mock Interview</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 2 (Right): Code Syntax & Technical Coding */}
            <Card
              variant="interactive"
              onClick={() => nav('dsa')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    DSA & Technical Coding Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Solve coding challenges in C++, Python 3, C, or Java with instant test case verification and algorithmic Big-O analysis.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Practice Coding</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 3: Bug Hunter & Debugging */}
            <Card
              variant="interactive"
              onClick={() => nav('bug-hunter')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <Bug className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    Bug Hunting & Debugging Lab
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Audit production code snippets for concurrency deadlocks, memory leaks, and subtle logic bugs under realistic pressure.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Debug Code Snippets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 4: Salary & Offer Negotiation */}
            <Card
              variant="interactive"
              onClick={() => nav('salary')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    Salary & Offer Negotiation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Roleplay compensation counter-offers with real-time feedback on market salary bands, equity leverage, and tone.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Negotiate Compensation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 5: ATS Resume Scorer */}
            <Card
              variant="interactive"
              onClick={() => nav('resume-builder')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    ATS Resume Scorer & Optimizer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Scan and optimize your resume with metric-driven phrasing, STAR bullet refinement, and keyword alignment.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Audit & Scorer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 6: 60s Rapid Blitz */}
            <Card
              variant="interactive"
              onClick={() => nav('blitz')}
              className="flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    60-Second Rapid Blitz
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty">
                    Answer fast-paced technical and behavioral questions under strict 60-second timers to build spontaneous clarity.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Start Rapid Blitz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F14] py-12 px-4 sm:px-6 text-xs text-slate-400 select-none relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div className="space-y-2.5 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed text-pretty">
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
