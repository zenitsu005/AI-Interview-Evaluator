import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

export default function LandingPage({ onNavigate }) {
  const { setPhase } = useInterview();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const nav = onNavigate || setPhase;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How realistic are the AI interviewer personas?",
      a: "Personas use structured role prompts and transparent interview rubrics to simulate common interview styles (e.g. System Architect, Algorithm Lead, Bar Raiser). They are practice tools rather than replacements for human interview loops."
    },
    {
      q: "Does the platform evaluate live audio and speaking pace?",
      a: "Yes, candidates may opt into audio analysis for live transcripts and coaching signals such as speaking pace and estimated filler-word frequency. Results may vary depending on microphone quality, background noise, and speech accents."
    },
    {
      q: "Is payment or a credit card required?",
      a: "No. All practice studios—including full mock sessions, DSA practice, system design whiteboards, and resume feedback—are 100% free with no credit card required."
    },
    {
      q: "Can I practice individual modules?",
      a: "Yes. You can practice DSA, system design whiteboarding, bug hunting, behavioral STAR prompts, or rapid 60s blitz questions independently."
    },
    {
      q: "Can I delete my recordings and interview data?",
      a: "Yes. You can clear your local browser storage instantly from the Privacy page or purge data anytime with one click."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090A0F] text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white select-none">
      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 flex-1 space-y-24 text-left">
        
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-7xl px-0 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5">
              <Badge variant="indigo" hasPulse>
                ✦ Structured practice for high-stakes technical interviews
              </Badge>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.15]">
              Practice the interview.{" "}
              <span className="text-indigo-400">Understand the signal.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed text-pretty font-normal">
              Run realistic mock interviews across coding, system design, debugging, and behavioral rounds. Get structured feedback you can use in your next attempt.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => nav('setup')}
                >
                  Start a mock interview →
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => nav('setup')}
                >
                  Explore practice modules
                </Button>
              </div>

              <p className="text-xs text-zinc-500 font-mono">
                🔒 No hiring decisions. Coaching feedback only.
              </p>
            </div>
          </div>

          {/* ── SAMPLE EVALUATION PREVIEW CARD ── */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-indigo-600/12 rounded-3xl blur-[120px] pointer-events-none" />

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Sample Evaluation Preview
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="rounded-xl bg-black/50 p-3.5 border border-zinc-800 space-y-1">
                  <p className="text-indigo-300 font-bold">Role: Senior Distributed Systems Engineer</p>
                  <p className="text-zinc-300 leading-relaxed">
                    "How would you ensure zero message loss during a 100x traffic surge on a Kafka ingestion pipeline?"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-0.5">
                    <span className="text-zinc-500 font-bold uppercase text-[10px]">Speaking Pace</span>
                    <p className="text-emerald-400 font-bold text-sm">138 WPM (Optimal)</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-0.5">
                    <span className="text-zinc-500 font-bold uppercase text-[10px]">Filler-Word Estimate</span>
                    <p className="text-indigo-300 font-bold text-sm">1.2% (Low)</p>
                  </div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl text-emerald-300 text-[11px] leading-relaxed">
                  ✓ Strong trade-off analysis between partition count and consumer group rebalancing overhead.
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 leading-normal font-sans">
                ⚠️ AI feedback is designed for practice and coaching. It is not an employment assessment or a predictor of hiring outcomes.
              </div>
            </div>
          </div>
        </section>

        {/* ── 3-STEP PRACTICE WORKFLOW SECTION ── */}
        <section className="space-y-8 border-t border-zinc-800/60 pt-16">
          <div className="space-y-2">
            <Badge variant="indigo">Structured Methodology</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How the Practice Engine Works
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Calibrated feedback loops designed to help candidate software engineers identify and fix interview weaknesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Step 01</span>
              <h3 className="text-lg font-bold text-white">Choose Role & Level</h3>
              <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                Select your target seniority (Mid-Level, Senior, Staff, or Principal Architect) and pick individual modules or full loops.
              </p>
              <span className="inline-block text-[11px] font-mono text-zinc-500 pt-2">Estimated: 1 min setup</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Step 02</span>
              <h3 className="text-lg font-bold text-white">Complete Guided Round</h3>
              <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                Answer technical prompts using live audio transcription, code sandboxes, or interactive architecture whiteboards.
              </p>
              <span className="inline-block text-[11px] font-mono text-zinc-500 pt-2">Estimated: 15 – 45 min</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Step 03</span>
              <h3 className="text-lg font-bold text-white">Review Rubric Signals</h3>
              <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                Inspect structured feedback across algorithm complexity, edge cases, system trade-offs, and STAR structure.
              </p>
              <span className="inline-block text-[11px] font-mono text-zinc-500 pt-2">Detailed Report</span>
            </div>
          </div>
        </section>

        {/* ── BENTO PRACTICE MODULE CARDS SECTION ── */}
        <section className="space-y-8 border-t border-zinc-800/60 pt-16">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Targeted Practice Studios
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Practice specific engineering skill domains independently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Full Mock Studio */}
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => nav('setup')}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 border-indigo-500/30 hover:border-indigo-500/60 p-6 sm:p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">FEATURED FULL LOOP</Badge>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <span>⏱️ 45–60 min</span>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white text-balance">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl text-pretty">
                    Simulate all core technical rounds: Aptitude & Logic, Technical Depth, System Architecture, and STAR Behavioral Fit.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400 pt-2">
                    <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg">Input: Voice / Text</span>
                    <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg">Output: Rubric Breakdown</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Button variant="primary" size="md" onClick={() => nav('setup')}>
                    Start mock interview →
                  </Button>
                </div>
              </Card>
            </div>

            {/* DSA Studio */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('dsa')} className="h-full flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-zinc-500 font-mono">15–30 min</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-balance">
                    DSA Practice Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Solve coding challenges with syntax highlighting, test execution, and complexity analysis.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" size="sm" onClick={() => nav('dsa')}>
                    Practice DSA →
                  </Button>
                </div>
              </Card>
            </div>

            {/* System Design Whiteboard */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('video')} className="h-full flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-zinc-500 font-mono">30–45 min</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-balance">
                    System Design Whiteboard
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Architect microservices, caches, and load balancers with interactive diagrams and exports.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" size="sm" onClick={() => nav('video')}>
                    Open whiteboard →
                  </Button>
                </div>
              </Card>
            </div>

            {/* Bug Hunter Studio */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('bug-hunter')} className="h-full flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-zinc-500 font-mono">15–20 min</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-balance">
                    Bug Hunter Studio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Audit real production code snippets for race conditions, memory leaks, and logic flaws.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" size="sm" onClick={() => nav('bug-hunter')}>
                    Try debugging challenge →
                  </Button>
                </div>
              </Card>
            </div>

            {/* 60s Rapid Blitz */}
            <div className="md:col-span-4">
              <Card variant="interactive" onClick={() => nav('blitz')} className="h-full flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-zinc-500 font-mono">5–10 min</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-balance">
                    60s Rapid Blitz
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
                    Answer fast-paced technical questions under 60-second timers with optional pause accommodations.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="secondary" size="sm" onClick={() => nav('blitz')}>
                    Start rapid blitz →
                  </Button>
                </div>
              </Card>
            </div>


          </div>
        </section>

        {/* ── FAQ ACCORDION SECTION ── */}
        <section className="max-w-3xl mx-auto space-y-6 text-left border-t border-zinc-800/60 pt-16">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400 text-pretty">Everything you need to know about evaluation rubrics and data policy.</p>
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
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full p-4 sm:p-5 text-left text-sm font-semibold text-zinc-100 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    <span className="text-balance">{faq.q}</span>
                    <span className="text-zinc-500 font-mono text-base">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3 text-pretty"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ── PRODUCTION-GRADE ACCESSIBLE FOOTER ── */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-4 sm:px-6 text-xs text-zinc-400 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white font-bold">
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
              <li><button onClick={() => nav('setup')} className="hover:text-white transition-colors">Mock Interview</button></li>
              <li><button onClick={() => nav('dsa')} className="hover:text-white transition-colors">DSA Practice</button></li>
              <li><button onClick={() => nav('video')} className="hover:text-white transition-colors">System Design</button></li>
              <li><button onClick={() => nav('bug-hunter')} className="hover:text-white transition-colors">Bug Hunter</button></li>
              <li><button onClick={() => nav('blitz')} className="hover:text-white transition-colors">Rapid Blitz</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Prep Tools</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => nav('resume-builder')} className="hover:text-white transition-colors">ATS Resume Scorer</button></li>
              <li><button onClick={() => nav('anxiety-prep')} className="hover:text-white transition-colors">Interview Confidence Lab</button></li>
              <li><button onClick={() => nav('salary')} className="hover:text-white transition-colors">Salary Practice</button></li>
              <li><button onClick={() => nav('analytics')} className="hover:text-white transition-colors">Progress & Analytics</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-zinc-200 mb-2">Company & Legal</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => nav('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
              <li><button onClick={() => nav('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => nav('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => nav('security')} className="hover:text-white transition-colors">Security Architecture</button></li>
              <li><button onClick={() => nav('accessibility')} className="hover:text-white transition-colors">Accessibility Statement</button></li>
              <li><button onClick={() => nav('support')} className="hover:text-white transition-colors">Support & Help Desk</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono gap-2">
          <p>© 2026 AI Interview Evaluator. Structured practice for technical candidates.</p>
          <p className="text-zinc-600">Built for software engineers.</p>
        </div>
      </footer>
    </div>
  );
}
