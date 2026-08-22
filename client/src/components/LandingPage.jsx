import React, { useState } from 'react';
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
  Volume2,
  CheckCircle2,
  Terminal,
  Activity,
  ShieldCheck,
  Cpu,
  BarChart3,
  Timer,
  Check,
  Flame,
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const { setPhase } = useInterview();
  const nav = onNavigate || setPhase;

  // Interactive Hero Preview Console Tab
  const [activePreviewTab, setActivePreviewTab] = useState('code'); // 'code' | 'voice' | 'rubric'

  const handleExploreModules = () => {
    const el = document.getElementById('practice-modules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      nav('dsa');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#080C10] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      {/* Subtle Radial Gradient Glow behind Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(45,212,191,0.14),rgba(251,191,36,0.04),transparent)] pointer-events-none z-0" />

      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 flex-1 space-y-24 text-left relative z-10">
        
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-5xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
          
          {/* Engineering Metadata Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
              v2.4 Engine • Calibrated for Junior to Lead Rounds
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.12] max-w-4xl">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 font-extrabold block sm:inline">
              Ace the actual loop.
            </span>
          </h1>

          {/* Subheadline / Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed text-pretty font-normal">
            Run realistic mock interviews with human-like AI voice debriefs across coding, debugging, and HR rounds. Get calibrated, objective feedback before your actual interview.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => nav('setup')}
                className="rounded-full px-8 py-4 bg-gradient-to-r from-[#2dd4bf] via-teal-300 to-[#34d399] hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Start a mock interview</span>
                <span className="text-base font-bold">→</span>
              </button>

              <button
                type="button"
                onClick={handleExploreModules}
                className="rounded-full px-7 py-4 bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Explore practice modules</span>
                <span className="text-slate-400 font-bold">&gt;</span>
              </button>
            </div>
          </div>

          {/* ── BESPOKE PRODUCT ARTIFACT: INTERACTIVE SIMULATION CONSOLE ── */}
          <div className="w-full pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800/90 bg-[#0E141E]/95 shadow-2xl backdrop-blur-xl overflow-hidden text-left">
              
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-[#0A0F16] border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-500 ml-2 font-medium">simulation_session_live.tsx</span>
                </div>

                {/* Interactive Console Mode Switcher */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActivePreviewTab('code')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewTab === 'code'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Live Code Sandbox</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewTab('voice')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewTab === 'voice'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voice & Debrief</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewTab('rubric')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreviewTab === 'rubric'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Live Calibration</span>
                  </button>
                </div>
              </div>

              {/* Console Body Tab 1: Live Code Execution */}
              {activePreviewTab === 'code' && (
                <div className="p-5 sm:p-6 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400 font-bold"># Technical Depth Round</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">Two Sum (Sorted Array)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                      Python 3.11 (Native Sandbox)
                    </span>
                  </div>

                  <div className="bg-[#080C10] p-4 rounded-xl border border-slate-800/90 text-slate-300 leading-relaxed font-mono overflow-x-auto">
                    <p className="text-slate-500"># Optimal two-pointer approach with O(1) space complexity</p>
                    <p><span className="text-purple-400">def</span> <span className="text-teal-300 font-bold">twoSum</span>(numbers: <span className="text-cyan-400">list</span>[<span className="text-cyan-400">int</span>], target: <span className="text-cyan-400">int</span>) -&gt; <span className="text-cyan-400">list</span>[<span className="text-cyan-400">int</span>]:</p>
                    <p className="pl-4">left, right = <span className="text-amber-400">0</span>, <span className="text-cyan-400">len</span>(numbers) - <span className="text-amber-400">1</span></p>
                    <p className="pl-4"><span className="text-purple-400">while</span> left &lt; right:</p>
                    <p className="pl-8">curr = numbers[left] + numbers[right]</p>
                    <p className="pl-8"><span className="text-purple-400">if</span> curr == target: <span className="text-purple-400">return</span> [left + <span className="text-amber-400">1</span>, right + <span className="text-amber-400">1</span>]</p>
                    <p className="pl-8"><span className="text-purple-400">elif</span> curr &lt; target: left += <span className="text-amber-400">1</span></p>
                    <p className="pl-8"><span className="text-purple-400">else</span>: right -= <span className="text-amber-400">1</span></p>
                  </div>

                  {/* Execution Output */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Test 1: [2, 7, 11, 15]</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Passed</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Test 2: [2, 3, 4]</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Passed</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-400">
                      <span>Big-O Verified:</span>
                      <span className="text-teal-300 font-bold font-mono">O(N) Time • O(1) Space</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Console Body Tab 2: Voice & Debrief */}
              {activePreviewTab === 'voice' && (
                <div className="p-5 sm:p-6 space-y-4 text-xs font-sans">
                  {/* Evaluator Voice Dialogue */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-teal-400 text-slate-950 flex items-center justify-center font-bold font-mono text-[10px]">
                          AI
                        </div>
                        <span className="font-bold text-white">AI Evaluator</span>
                        <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                          Neural Voice Stream
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">Latency: 118ms</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      "In your distributed order processing system, what trade-offs did you consider when choosing between optimistic locking and pessimistic row locks under high write concurrency?"
                    </p>
                  </div>

                  {/* Candidate Audio Waveform Stream */}
                  <div className="p-4 rounded-xl bg-[#080C10] border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Candidate Spoken Response</p>
                        <p className="text-[11px] text-slate-400">STAR Method • Architectural Trade-off Analysis</p>
                      </div>
                    </div>

                    {/* Animated Audio Equalizer Bars */}
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse" />
                      <span className="w-1 h-6 bg-teal-400 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-4 bg-teal-400 rounded-full animate-pulse delay-150" />
                      <span className="w-1 h-7 bg-emerald-400 rounded-full animate-pulse delay-100" />
                      <span className="w-1 h-5 bg-teal-400 rounded-full animate-pulse delay-200" />
                      <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Console Body Tab 3: Live Calibration */}
              {activePreviewTab === 'rubric' && (
                <div className="p-5 sm:p-6 space-y-4 text-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">System Calibration Rubric</h4>
                      <p className="text-slate-400 text-[11px]">Benchmarked against Senior & Lead Engineer standard</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[11px]">
                      Hiring Recommendation: Strong Yes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-300 font-bold">
                        <span>Aptitude & Logic</span>
                        <span className="text-teal-400">92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 w-[92%]" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-300 font-bold">
                        <span>Technical Depth</span>
                        <span className="text-teal-400">89%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 w-[89%]" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-300 font-bold">
                        <span>HR Round & Teamwork</span>
                        <span className="text-amber-400">91%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-[91%]" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-300 font-bold">
                        <span>Presence & Delivery</span>
                        <span className="text-emerald-400">88%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[88%]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>

        {/* ── ASYMMETRIC BENTO GRID: TARGETED PRACTICE STUDIOS ── */}
        <section id="practice-modules" className="space-y-6 pt-6 scroll-mt-24">
          
          {/* Section Heading */}
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-teal-400" />
              <span>Targeted Practice Studios</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Specialized sandbox environments built to test every engineering dimension with live feedback.
            </p>
          </div>

          {/* Asymmetric Bento Layout (Not a repetitive 3x2 grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* ── BENTO CARD 1: Full AI Simulator (Featured Wide 8-Column Card) ── */}
            <div className="md:col-span-8">
              <Card
                variant="interactive"
                onClick={() => nav('setup')}
                className="h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-[#0e141e]/90 to-[#080c10]/95 border-slate-800/90 hover:border-teal-500/40 shadow-2xl group transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <Brain className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 font-mono text-[10px] font-bold">
                      Flagship Simulation
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      Full AI Interview Simulator
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 text-pretty max-w-xl">
                      Simulate all core rounds: Aptitude Logic, Technical Depth, System Architecture, and HR Round with live audio debriefs and objective scorecard verdicts.
                    </p>
                  </div>

                  {/* Multi-Round Visual Timeline */}
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <p className="text-teal-400 font-bold">01. Aptitude</p>
                      <p className="text-[10px] text-slate-500">Logic & Math</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <p className="text-teal-400 font-bold">02. Technical</p>
                      <p className="text-[10px] text-slate-500">DSA & Systems</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <p className="text-amber-400 font-bold">03. HR Round</p>
                      <p className="text-[10px] text-slate-500">Culture & Team</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline font-semibold">Start Full Mock Interview</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ── BENTO CARD 2: DSA & Technical Coding Studio (4-Column Card) ── */}
            <div className="md:col-span-4">
              <Card
                variant="interactive"
                onClick={() => nav('dsa')}
                className="h-full flex flex-col justify-between p-6 sm:p-7 bg-slate-900/70 border-slate-800/90 hover:border-teal-500/40 shadow-xl group transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">4 Languages</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      DSA & Coding Studio
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5 text-pretty">
                      Solve coding challenges in C++, Python 3, C, or Java with instant test case verification and Big-O efficiency analysis.
                    </p>
                  </div>

                  {/* Language Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]">Python 3</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]">C++20</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]">Java 17</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]">C99</span>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline">Practice Coding</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ── BENTO CARD 3: Bug Hunter & Debugging Lab (6-Column Card) ── */}
            <div className="md:col-span-6">
              <Card
                variant="interactive"
                onClick={() => nav('bug-hunter')}
                className="h-full flex flex-col justify-between p-6 sm:p-7 bg-slate-900/70 border-slate-800/90 hover:border-teal-500/40 shadow-xl group transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <Bug className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                      Live Code Audits
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      Bug Hunting & Debugging Lab
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5 text-pretty">
                      Audit production code snippets for concurrency deadlocks, memory leaks, and subtle logic bugs under realistic pressure.
                    </p>
                  </div>

                  {/* Visual Diff Snippet */}
                  <div className="p-2.5 rounded-lg bg-[#080C10] border border-slate-800/80 font-mono text-[10px] space-y-1 text-slate-400">
                    <p className="text-rose-400">- mutex.unlock() # potential deadlock on throw</p>
                    <p className="text-emerald-400">+ std::lock_guard&lt;std::mutex&gt; lock(mtx);</p>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline">Debug Code Snippets</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ── BENTO CARD 4: Salary & Offer Negotiation (6-Column Card) ── */}
            <div className="md:col-span-6">
              <Card
                variant="interactive"
                onClick={() => nav('salary')}
                className="h-full flex flex-col justify-between p-6 sm:p-7 bg-slate-900/70 border-slate-800/90 hover:border-teal-500/40 shadow-xl group transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-teal-400 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-500/30">
                      Offer Strategy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      Salary & Offer Negotiation
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5 text-pretty">
                      Roleplay compensation counter-offers with real-time feedback on market salary bands, equity leverage, and persuasive tone.
                    </p>
                  </div>

                  {/* Compensation Leverage Band Visual */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080C10] border border-slate-800/80 font-mono text-[11px]">
                    <span className="text-slate-400">Offer Leverage Score:</span>
                    <span className="text-emerald-400 font-bold">Top 15% Band (+18% Upside)</span>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline">Negotiate Compensation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ── BENTO CARD 5: ATS Resume Scorer & Optimizer (6-Column Card) ── */}
            <div className="md:col-span-6">
              <Card
                variant="interactive"
                onClick={() => nav('resume-builder')}
                className="h-full flex flex-col justify-between p-6 sm:p-7 bg-slate-900/70 border-slate-800/90 hover:border-teal-500/40 shadow-xl group transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                      STAR Bullet Rewriter
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      ATS Resume Scorer & Optimizer
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5 text-pretty">
                      Scan and optimize your resume with metric-driven phrasing, STAR bullet refinement, and keyword alignment for target roles.
                    </p>
                  </div>

                  {/* Resume Transformation Visual */}
                  <div className="p-2.5 rounded-lg bg-[#080C10] border border-slate-800/80 font-mono text-[10px] space-y-1 text-slate-400">
                    <p className="text-slate-500 truncate">Before: "Worked on distributed backend services"</p>
                    <p className="text-teal-300 truncate">After: "Scaled 40-node Kubernetes cluster to 99.99% uptime"</p>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline">Audit & Scorer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ── BENTO CARD 6: 60-Second Rapid Blitz (6-Column Card) ── */}
            <div className="md:col-span-6">
              <Card
                variant="interactive"
                onClick={() => nav('blitz')}
                className="h-full flex flex-col justify-between p-6 sm:p-7 bg-slate-900/70 border-slate-800/90 hover:border-teal-500/40 shadow-xl group transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                      Spontaneous Clarity
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                      60-Second Rapid Blitz
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5 text-pretty">
                      Answer fast-paced technical and architectural questions under strict 60-second timers to build spontaneous clarity and poise.
                    </p>
                  </div>

                  {/* Timer Dial Visual */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080C10] border border-slate-800/80 font-mono text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Speed Drill Timer</span>
                    </span>
                    <span className="text-amber-400 font-bold">60.0s Pacing</span>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span className="group-hover:underline">Start Rapid Blitz</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/80 bg-[#080C10] py-12 px-4 sm:px-6 text-xs text-slate-400 select-none relative z-10">
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
