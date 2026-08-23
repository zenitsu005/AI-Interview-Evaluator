import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import {
  TbSparkles as Sparkles,
  TbArrowRight as ArrowRight,
  TbTerminal2 as Code2,
  TbBug as Bug,
  TbBolt as Zap,
  TbBrain as Brain,
  TbStack2 as Layers,
  TbChevronRight as ChevronRight,
  TbCheck as Check,
  TbMicrophone as Mic,
  TbChartRadar as Radar,
  TbCode as CodeIcon,
  TbShieldCheck as ShieldCheck,
  TbFlame as Flame,
  TbBuildingSkyscraper as Building,
  TbCpu as Cpu,
  TbPlayerPlay as Play,
  TbHeadphones as Headphones,
  TbCircleCheck as CheckCircle,
  TbHelpCircle as HelpCircle,
} from 'react-icons/tb';

export default function LandingPage({ onNavigate }) {
  const { setPhase } = useInterview();
  const nav = onNavigate || setPhase;

  // Interactive Live Preview Console Tab
  const [activeTab, setActiveTab] = useState('voice');
  const [openFaq, setOpenFaq] = useState(null);

  const handleExploreModules = () => {
    const el = document.getElementById('practice-modules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      nav('dsa');
    }
  };

  const COMPANY_TRACKS = [
    { name: 'Amazon', role: '16 LP Behavioral & Systems', icon: Building, color: 'text-amber-400' },
    { name: 'Google', role: 'Planet-Scale Distributed Systems', icon: Cpu, color: 'text-rose-400' },
    { name: 'Meta', role: 'Real-Time High-Throughput Arch', icon: Sparkles, color: 'text-blue-400' },
    { name: 'Microsoft', role: 'Enterprise Cloud & Zero-Trust', icon: ShieldCheck, color: 'text-cyan-400' },
    { name: 'Quant / HFT', role: 'Sub-Microsecond Determinism', icon: Zap, color: 'text-emerald-400' },
    { name: 'Startups', role: 'Pragmatic Velocity & Full-Stack', icon: Flame, color: 'text-orange-400' },
  ];

  const FAQS = [
    {
      q: 'How does the multimodal AI evaluation work?',
      a: 'The platform evaluates multiple distinct interview vectors: logic correctness, Big-O asymptotic efficiency, STAR behavioral depth, voice cadence pacing, and edge-case defensiveness using calibrated hiring rubrics.'
    },
    {
      q: 'What languages and interview tracks are supported?',
      a: 'The DSA & debugging studios support C++, Python 3, Java, and C with instant compilation and test execution. The interview simulator covers Amazon, Google, Meta, Microsoft, Quant/HFT, and High-Growth Startup tracks.'
    },
    {
      q: 'Is my resume and interview audio private?',
      a: 'Yes. All resume parsing and sandbox code evaluations are processed securely and locally within your session. Your voice audio streams through client Web Audio APIs without third-party audio recording retention.'
    },
    {
      q: 'What is the Bar-Raiser Diagnostic Report?',
      a: 'At the end of each session, the system computes an Elo-calibrated score (0-100), STAR quadrant breakdowns, personalized improvement vectors, and an automated 7-day calendar study roadmap.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0D13] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none relative overflow-hidden">
      
      {/* Background Dot Texture & Ambient Atmospheric Light */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 flex-1 space-y-24 text-left relative z-10">
        
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
          
          {/* Clerk-Style Micro-Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-xl shadow-inner group cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Multimodal AI Interview Simulation Suite</span>
            <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-teal-500/10 rounded border border-teal-500/20">Live</span>
          </div>

          {/* Headline with Professional Gradient */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.12]">
            Fail safely in simulation.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 font-extrabold block sm:inline">
              Ace the actual loop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed text-pretty font-normal">
            Practice high-stakes technical, coding, and behavioral interview loops with realistic AI voice debriefs. Get calibrated, objective feedback before your actual interview.
          </p>

          {/* CTAs */}
          <div className="pt-2">
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

        {/* ── CLERK-STYLE INTERACTIVE LIVE PREVIEW CONSOLE ── */}
        <section className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all">
            
            {/* Console Header Bar with Interactive Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 sm:px-6 py-3 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-semibold text-slate-400 hidden sm:inline-block">AI Interview Simulator Live Console</span>
              </div>

              {/* Interactive Demo Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'voice'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-teal-400" />
                  <span>Voice Simulation</span>
                </button>
                <button
                  onClick={() => setActiveTab('rubric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'rubric'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Bar-Raiser Report</span>
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CodeIcon className="w-3.5 h-3.5 text-teal-400" />
                  <span>Code Sandbox</span>
                </button>
              </div>
            </div>

            {/* Interactive Tab Body */}
            <div className="p-6 sm:p-8">
              {activeTab === 'voice' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
                        Round 2: Technical Depth
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Track: Amazon L5 SDE</span>
                    </div>
                    <p className="text-base font-semibold text-white leading-relaxed">
                      "In a distributed cache cluster with consistent hashing, what happens to hot keys when 2 nodes crash simultaneously?"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5 h-6">
                        {[40, 70, 90, 60, 100, 75, 45, 85, 95, 60, 40].map((h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-teal-400 rounded-full animate-pulse"
                            style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-teal-300 font-medium">AI Multimodal Audio Synthesis Active</span>
                    </div>
                  </div>
                  <div className="md:col-span-5 bg-[#090C12] border border-white/[0.08] rounded-2xl p-4 text-left space-y-2.5 shadow-inner">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Real-Time Voice Metrics</span>
                      <span className="text-emerald-400 text-[11px]">Calibrated</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Speech Pacing:</span> <span className="text-white font-mono">138 WPM (Optimal)</span></div>
                      <div className="flex justify-between"><span>Filler Word Ratio:</span> <span className="text-emerald-400 font-mono">0.8% (Minimal)</span></div>
                      <div className="flex justify-between"><span>STAR Architecture:</span> <span className="text-teal-300 font-mono">92% Precision</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rubric' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 rounded-2xl p-6 text-center space-y-2">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Candidate Score</span>
                    <div className="text-5xl font-black text-white">88<span className="text-2xl text-slate-400">/100</span></div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      Interview Ready (Top 8%)
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-3 text-left">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Technical Depth & Algorithmic Proof</span>
                        <span className="text-teal-400">92%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[92%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">System Scalability & Edge-Case Guardrails</span>
                        <span className="text-teal-400">86%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[86%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Amazon Leadership Principles (STAR Format)</span>
                        <span className="text-teal-400">88%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[88%]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="bg-[#090C12] rounded-2xl border border-white/[0.08] p-4 font-mono text-xs text-left space-y-3">
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.06] pb-2">
                    <span className="text-teal-400">solution.cpp (C++20 Sandbox)</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-sans"><CheckCircle className="w-3.5 h-3.5" /> All 4 Test Cases Passed</span>
                  </div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                    <code>
{`// Problem: Two Sum with Strict Asymptotic Guardrails
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> lookup;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (lookup.count(complement)) return {lookup[complement], i};
        lookup[nums[i]] = i;
    }
    return {};
}`}
                    </code>
                  </pre>
                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-[11px] text-slate-400 font-sans">
                    <span>Runtime: <strong className="text-emerald-400 font-mono">2ms</strong> (Beats 96.4%)</span>
                    <span>Memory: <strong className="text-teal-400 font-mono">10.8MB</strong> (O(N) Complexity Verified)</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── COMPANY TRACK CALIBRATION SOCIAL PROOF BAR ── */}
        <section className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Calibrated for the Hiring Rubrics & Interview Loops of
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {COMPANY_TRACKS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 transition-all duration-200 text-center flex flex-col items-center justify-center space-y-1.5 group cursor-default"
                >
                  <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-extrabold text-white text-xs tracking-tight">{item.name}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{item.role}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3-STEP CIRCUIT VISUALIZER (HOW IT WORKS) ── */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Architected for Mastery</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How the Simulation Loop Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-[#0E131F]/80 border border-white/[0.08] shadow-lg relative space-y-3 group hover:border-teal-500/40 transition-all">
              <span className="text-3xl font-black text-teal-500/30 group-hover:text-teal-400 transition-colors">01</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Upload Resume & Target Role</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our parser analyzes your skills against standard FAANG job descriptions to curate custom behavioral STAR questions and targeted DSA problems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E131F]/80 border border-white/[0.08] shadow-lg relative space-y-3 group hover:border-teal-500/40 transition-all">
              <span className="text-3xl font-black text-teal-500/30 group-hover:text-teal-400 transition-colors">02</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Run 4-Round Multimodal Loop</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interact with the AI evaluator through live voice. Solve coding problems in the sandbox while the AI analyzes your logic, trade-offs, and communication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E131F]/80 border border-white/[0.08] shadow-lg relative space-y-3 group hover:border-teal-500/40 transition-all">
              <span className="text-3xl font-black text-teal-500/30 group-hover:text-teal-400 transition-colors">03</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Bar-Raiser Diagnostic Debrief</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get an objective 0-100 score, STAR structure audit, code asymptotic breakdown, and an automated 7-day remedial study calendar.
              </p>
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
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">
                      Multimodal 4-Round Loop
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Full Mock Interview Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl text-pretty font-normal">
                    Simulate all core rounds: Aptitude Logic, Technical Depth, System Architecture, and HR Round with live audio dialogue.
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

        {/* ── FAQ ACCORDION SECTION ── */}
        <section className="max-w-3xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#0E131F]/80 backdrop-blur-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-teal-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-90 text-teal-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#0E121B] py-12 px-4 sm:px-6 text-xs text-slate-400 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div className="space-y-2.5 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">AI Interview Evaluator</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed text-pretty">
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

        <div className="max-w-6xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} AI Interview Evaluator. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => nav('privacy')} className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => nav('terms')} className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</button>
            <button onClick={() => nav('accessibility')} className="hover:text-slate-400 transition-colors cursor-pointer">Accessibility</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
