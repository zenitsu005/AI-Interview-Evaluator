import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import AppNavbar from './AppNavbar';
import { checkServerHealth } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';

export default function LandingPage() {
  const { setPhase } = useInterview();
  const { isAuthenticated, openAuth } = useAuth();
  const [serverState, setServerState] = useState('checking');
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
      a: "Personas are modeled directly on published interview loops from Google L7, Amazon Bar Raisers, and YC founders. They evaluate your answers against explicit technical rubrics, STAR framework completeness, and system scalability metrics."
    },
    {
      q: "Does the platform evaluate live audio and speech pace?",
      a: "Yes. Real-time audio analytics measure Words Per Minute (WPM), filler word frequency, and vocal composure during live questioning."
    },
    {
      q: "Is any payment or credit card required?",
      a: "No. Full mock interview sessions, DSA practice, system design whiteboards, and resume optimization are 100% free."
    },
    {
      q: "Can I practice specific modules without taking a 15-question mock?",
      a: "Yes. Choose any studio directly from the bento grid."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#09090b] text-zinc-100 font-sans">
      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 flex-1 space-y-24">
        
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-0 pt-4 pb-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              L7 & Bar-Raiser Simulation Engine
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight text-balance">
              Stop guessing your performance in <span className="text-indigo-400">high-stakes</span> interviews.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed text-pretty">
              Deterministic, real-time evaluation across system design, code architecture, and verbal composure—calibrated against top-tier tech benchmarks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setPhase('setup')}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                Start Mock Interview →
              </button>
              <button
                onClick={() => setPhase('setup')}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white active:scale-95"
              >
                Explore Practice Modules
              </button>
            </div>
          </div>

          {/* Realistic Terminal / Assessment Window */}
          <div className="mt-12 lg:mt-0 lg:col-span-5">
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-xl text-left">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-500">session: live-evaluation</span>
              </div>

              <div className="mt-4 space-y-4 font-mono text-xs">
                <div className="rounded-lg bg-black/40 p-3.5 border border-zinc-800/80 space-y-1.5">
                  <p className="text-indigo-300 font-medium">Interviewer: Marcus Vance (Principal Architect)</p>
                  <p className="text-zinc-300 leading-relaxed">
                    "How would you ensure zero message loss during a 100x traffic surge on your Kafka ingestion stream?"
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Candidate Composure</span>
                    <span className="text-emerald-400 font-semibold">96% Steady</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[96%] bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div className="flex justify-between text-zinc-500 pt-1">
                  <span>Pacing: 132 WPM</span>
                  <span>Fillers: 0 detected</span>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Metrics Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-layered">
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
        </section>

        {/* Asymmetric Bento Grid (8 Practice Studios) */}
        <section className="space-y-8 text-left">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
              Specialized Interactive Studios
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 text-pretty">
              Practice targeted skills independently or launch a complete multi-round evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Primary Hero Bento (Spans 8 Columns) */}
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => setPhase('setup')}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 border-indigo-500/30 hover:border-indigo-500/60"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">FEATURED STUDIO</Badge>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-indigo-300 transition-colors">Launch Studio →</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-200 transition-colors text-balance">
                    🎯 Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl text-pretty">
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
              </Card>
            </div>

            {/* Bento Tile 2: DSA Sandbox */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('dsa')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💻</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    DSA Practice Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Solve algorithms with automated test runner and complexity analysis.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Complexity Analysis</span>
              </Card>
            </div>

            {/* Bento Tile 3: System Design */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('video')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📐</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    System Design Whiteboard
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Architect distributed systems, load balancers, and caches.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Distributed Systems</span>
              </Card>
            </div>

            {/* Bento Tile 4: Bug Hunter */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('bug-hunter')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🐛</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    Bug Hunter Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Identify race conditions, memory leaks, and logic flaws under pressure.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Debugging & Auditing</span>
              </Card>
            </div>

            {/* Bento Tile 5: 60s Blitz */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('blitz')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚡</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    60s Rapid Blitz
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Answer rapid technical questions under 60-second timers.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Recall Speed</span>
              </Card>
            </div>

            {/* Bento Tile 6: ATS Resume */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('resume-builder')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📄</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    ATS Resume Optimizer
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Analyze your resume against target job descriptions and fix keyword gaps.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Resume Parsing</span>
              </Card>
            </div>

            {/* Bento Tile 7: Anxiety Hype Lab */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('hype-lab')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🧘</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    3-Min Anxiety Hype Lab
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Guided box breathing and vocal priming to settle nerves.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Vocal & Mental Readiness</span>
              </Card>
            </div>

            {/* Bento Tile 8: Salary Sparring */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('negotiate')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💼</span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-white transition-colors">Open →</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    Salary Sparring Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Roleplay compensation negotiations with tough HR leads.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono pt-4">Offer Negotiation</span>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Accordion FAQ */}
        <section className="max-w-3xl mx-auto space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400 text-pretty">Everything you need to know about the interview studio.</p>
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
                    <span className="text-balance">{faq.q}</span>
                    <span className="text-zinc-500 font-mono text-base">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3 text-pretty">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Sitemap Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-4 sm:px-6 text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white">
                🎯
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed text-pretty">
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

        <div className="max-w-6xl mx-auto border-t border-zinc-900 pt-6 text-center text-[11px] text-zinc-500 font-mono">
          <p>Built for engineers by engineers.</p>
        </div>

      </footer>
    </div>
  );
}
