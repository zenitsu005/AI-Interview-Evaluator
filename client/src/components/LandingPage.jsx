import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import AppNavbar from './AppNavbar';
import { checkServerHealth } from '../services/api';

export default function LandingPage() {
  const { setPhase } = useInterview();
  const { isAuthenticated, openAuth } = useAuth();
  const [serverState, setServerState] = useState('checking'); // 'checking' | 'ready' | 'warming'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const ping = async () => {
      const res = await checkServerHealth();
      if (isMounted) {
        if (res) {
          setServerState('ready');
        } else {
          setServerState('warming');
          setTimeout(async () => {
            const res2 = await checkServerHealth();
            if (isMounted && res2) setServerState('ready');
          }, 3000);
        }
      }
    };
    ping();
    return () => { isMounted = false; };
  }, []);

  const handleWakeUp = async () => {
    setServerState('warming');
    const res = await checkServerHealth();
    if (res) setServerState('ready');
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How realistic are the AI Bar Raiser personas?",
      a: "Our personas are modeled directly on published interview loops from Google L7, Amazon Bar Raisers, and YC founders. They evaluate your answers against explicit technical rubrics, STAR framework completeness, and system scalability metrics."
    },
    {
      q: "Does the platform evaluate live audio and speech pace?",
      a: "Yes. Using real-time audio analytics, the studio measures your Words Per Minute (WPM), filler word frequency (e.g. 'um', 'basically'), and vocal composure during live questioning."
    },
    {
      q: "Is any payment or credit card required?",
      a: "No. You can run full mock interview sessions, practice DSA coding, test system design architectures, and optimize your ATS resume for free."
    },
    {
      q: "Can I practice specific modules without taking a 15-question mock?",
      a: "Absolutely. Choose any of our 8 specialized studios—like 60s Blitz, DSA Code Sandbox, Bug Hunter, or Salary Sparring—directly from the studio selector."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#09090b] text-zinc-100 selection:bg-indigo-600 selection:text-white font-sans">
      {/* Universal Top Navbar */}
      <AppNavbar currentActive="landing" />

      {/* ── Main Container ── */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex-1">
        
        {/* ── SECTION 1: HERO (Asymmetric & Editorial) ── */}
        <section className="mb-20 sm:mb-28 text-center sm:text-left grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Ek Baar Aaoge, Job Paoge
              </span>

              <button
                type="button"
                onClick={handleWakeUp}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
                  serverState === 'ready'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300 animate-pulse'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${serverState === 'ready' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                <span>{serverState === 'ready' ? 'Server Active' : 'Warming AI Server...'}</span>
              </button>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Stop guessing how you perform in <span className="font-editorial italic font-normal text-indigo-300">high-stakes</span> tech interviews.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-normal">
              Simulate actual Google L7 and Amazon Bar Raiser rounds. Receive real-time deterministic feedback on code efficiency, system architecture, and verbal composure.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 justify-center sm:justify-start">
              <button
                onClick={() => setPhase('setup')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-950/60 flex items-center justify-center gap-2"
              >
                <span>Start Free Mock Interview</span>
                <span className="text-indigo-200">→</span>
              </button>

              <button
                onClick={() => setPhase('hype-lab')}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                <span>🧘 3-Min Hype Lab</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Concrete Visual Interactive Simulator Tile */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-xs">
                    👔
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Marcus Vance</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Amazon Bar Raiser · L7</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  LIVE INTERROGATION
                </span>
              </div>

              {/* Active Bar Raiser Question Preview */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Round 2 · System Architecture</p>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  "How would you guarantee zero message loss during a 100x traffic surge on your Kafka ingestion stream?"
                </p>
              </div>

              {/* Candidate Audio & Composure Gauges */}
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Candidate Composure</span>
                  <span className="font-mono text-emerald-400 font-bold">96% Steady</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[96%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                  <span>Pacing: 132 WPM</span>
                  <span>Fillers: 0 detected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: CONCRETE METRICS BAR ── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-zinc-950 p-6 text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100,000+</p>
              <p className="text-xs text-zinc-400 font-medium">Questions Evaluated</p>
            </div>
            <div className="bg-zinc-950 p-6 text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">98.4%</p>
              <p className="text-xs text-zinc-400 font-medium">Assessment Accuracy</p>
            </div>
            <div className="bg-zinc-950 p-6 text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">6 Personas</p>
              <p className="text-xs text-zinc-400 font-medium">Specialized Bar Raisers</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: ASYMMETRIC BENTO GRID (8 SPECIALIZED STUDIOS) ── */}
        <section className="mb-28 space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Specialized Interactive Studios
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Practice targeted skills independently or launch a complete multi-round evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Bento Tile 1: Full Mock Studio (Large Hero Bento - 8 cols) */}
            <div
              onClick={() => setPhase('setup')}
              className="md:col-span-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-500/60 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
                    FEATURED STUDIO
                  </span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-indigo-400 transition-colors">Launch Studio →</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-200 transition-colors">
                  🎯 Full Mock Interview Studio
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                  Simulate all 3 core rounds: Aptitude & Logic, Technical Depth, and STAR Behavioral Fit with AI Bar Raiser feedback.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <span>✓ Audio Analytics</span>
                <span>•</span>
                <span>✓ Socratic Hints</span>
                <span>•</span>
                <span>✓ Transcripts</span>
              </div>
            </div>

            {/* Bento Tile 2: DSA Code Sandbox (4 cols) */}
            <div
              onClick={() => setPhase('dsa')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💻</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  DSA Practice Studio
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Solve algorithms in Python, JS, or C++ with automated test runner and complexity analysis.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Time & Space Complexity</span>
            </div>

            {/* Bento Tile 3: System Design Whiteboard (4 cols) */}
            <div
              onClick={() => setPhase('video')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📐</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  System Design Whiteboard
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Architect distributed systems, load balancers, and caches with interactive node diagramming.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Distributed Systems</span>
            </div>

            {/* Bento Tile 4: Bug Hunter (4 cols) */}
            <div
              onClick={() => setPhase('bug-hunter')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🐛</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Bug Hunter Studio
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Identify race conditions, memory leaks, and logic flaws under time pressure.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Debugging & Auditing</span>
            </div>

            {/* Bento Tile 5: 60s Rapid Blitz (4 cols) */}
            <div
              onClick={() => setPhase('blitz')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  60s Rapid Blitz
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Answer quick technical questions under 60-second timers to sharpen recall speed.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Speed & Accuracy</span>
            </div>

            {/* Bento Tile 6: ATS Resume Optimizer (4 cols) */}
            <div
              onClick={() => setPhase('resume-builder')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📄</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  ATS Resume Optimizer
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Analyze your resume against target job descriptions and fix keyword gaps.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Resume Parsing</span>
            </div>

            {/* Bento Tile 7: Anxiety Hype Lab (4 cols) */}
            <div
              onClick={() => setPhase('hype-lab')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🧘</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  3-Min Anxiety Hype Lab
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Guided box breathing and vocal priming to settle nerves before your interview.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Vocal & Mental Readiness</span>
            </div>

            {/* Bento Tile 8: Salary Sparring (4 cols) */}
            <div
              onClick={() => setPhase('negotiate')}
              className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💼</span>
                  <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Salary Sparring Studio
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Roleplay compensation negotiations with tough HR leads to maximize your offer.
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono pt-4">Offer Negotiation</span>
            </div>

          </div>
        </section>

        {/* ── SECTION 4: INTERACTIVE ACCORDION FAQ ── */}
        <section className="mb-24 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400">Everything you need to know about the interview studio.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left text-sm font-semibold text-zinc-100 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <span>{faq.q}</span>
                    <span className="text-zinc-500 font-mono text-base">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ── SECTION 5: MINIMAL MULTI-COLUMN FOOTER ── */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 px-4 sm:px-6 text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white">
                🎯
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Production-grade mock interview evaluation platform for software engineers.
            </p>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Studios</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => setPhase('setup')} className="hover:text-white transition-colors">Mock Studio</button></li>
              <li><button onClick={() => setPhase('dsa')} className="hover:text-white transition-colors">DSA Sandbox</button></li>
              <li><button onClick={() => setPhase('video')} className="hover:text-white transition-colors">System Design</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Practice Tools</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => setPhase('blitz')} className="hover:text-white transition-colors">60s Blitz</button></li>
              <li><button onClick={() => setPhase('bug-hunter')} className="hover:text-white transition-colors">Bug Hunter</button></li>
              <li><button onClick={() => setPhase('resume-builder')} className="hover:text-white transition-colors">ATS Resume</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Readiness</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => setPhase('hype-lab')} className="hover:text-white transition-colors">Anxiety Hype Lab</button></li>
              <li><button onClick={() => setPhase('negotiate')} className="hover:text-white transition-colors">Salary Sparring</button></li>
              <li><button onClick={() => setPhase('profile')} className="hover:text-white transition-colors">Score Analytics</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} AI Interview Evaluator. Open-source mock studio platform.</p>
          <p className="font-mono">Built for engineers by engineers.</p>
        </div>
      </footer>
    </div>
  );
}
