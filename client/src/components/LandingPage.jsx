import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

export default function LandingPage() {
  const { setPhase } = useInterview();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
    <div className="min-h-screen flex flex-col justify-between bg-[#090A0F] text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 flex-1 space-y-28">
        
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-0 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-2.5">
              <Badge variant="indigo" hasPulse>
                ✦ Calibrated for Staff & Principal Tech Rounds
              </Badge>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.15]">
              Stop guessing your performance in{" "}
              <span className="text-indigo-400 whitespace-nowrap">high-stakes</span>{" "}
              interviews.
            </h1>


            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed text-pretty font-normal">
              Deterministic, real-time evaluation across system design, code architecture, and verbal composure—calibrated against top-tier tech benchmarks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setPhase('setup')}
              >
                Start Mock Interview →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPhase('setup')}
              >
                Explore Practice Modules
              </Button>
            </div>
          </div>

          {/* Hero Mock Card Polish */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-indigo-600/12 rounded-3xl blur-[120px] pointer-events-none" />

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
                  <p className="text-zinc-300 leading-relaxed text-pretty">
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

        {/* Real-Time Metrics & Trust Bar */}
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

        {/* Bento Grid Features */}
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
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => setPhase('setup')}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 border-indigo-500/30 hover:border-indigo-500/60"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">FEATURED STUDIO</Badge>
                    <span className="text-xs text-zinc-400 font-mono group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                      <span>Launch Studio</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-200 transition-colors text-balance">
                    Full Mock Interview Studio
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

            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('dsa')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono font-semibold">Complexity Analysis</span>
                    <span className="text-xs text-zinc-400 font-mono group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Open</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    DSA Practice Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Solve algorithms with automated test runner and complexity analysis.
                  </p>
                </div>
              </Card>
            </div>

            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('video')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono font-semibold">Distributed Systems</span>
                    <span className="text-xs text-zinc-400 font-mono group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Open</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    System Design Whiteboard
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Architect distributed systems, load balancers, and caches.
                  </p>
                </div>
              </Card>
            </div>

            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('bug-hunter')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono font-semibold">Debugging & Auditing</span>
                    <span className="text-xs text-zinc-400 font-mono group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Open</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    Bug Hunter Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Identify race conditions, memory leaks, and logic flaws under pressure.
                  </p>
                </div>
              </Card>
            </div>

            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => setPhase('blitz')} className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono font-semibold">Recall Speed</span>
                    <span className="text-xs text-zinc-400 font-mono group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Open</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors text-balance">
                    60s Rapid Blitz
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Answer rapid technical questions under 60-second timers.
                  </p>
                </div>
              </Card>
            </div>
          </div>


        </section>

        {/* FAQ Accordion */}
        <section className="max-w-3xl mx-auto space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400 text-pretty">Everything you need to know about the evaluation engine.</p>
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

      {/* Footer */}
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
            <p className="font-bold text-zinc-200 mb-2">Prep Tools</p>
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
