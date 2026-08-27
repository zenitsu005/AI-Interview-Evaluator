import React from 'react';
import {
  Brain,
  Terminal,
  Bug,
  Zap,
  Layers,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import HeroBackgroundAnimation from './ui/HeroBackgroundAnimation';

/**
 * @typedef {Object} StudioItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} badge
 * @property {React.ComponentType<{ className?: string }>} icon
 * @property {string} actionText
 * @property {'teal' | 'sky' | 'indigo' | 'amber'} accentColor
 */

const PRACTICE_STUDIOS = [
  {
    id: 'setup',
    title: 'Full Mock Interview Studio',
    description: 'Simulate all 3 core rounds: Aptitude & Logic, Technical Depth, and HR Round with live audio dialogue.',
    badge: '3 Core Rounds',
    icon: Brain,
    actionText: 'Start Full Mock Interview',
    accentColor: 'teal',
  },
  {
    id: 'dsa',
    title: 'DSA Practice Studio',
    description: 'Solve coding challenges in C++, Python 3, C, or Java with instant test case verification.',
    badge: '4 Languages',
    icon: Terminal,
    actionText: 'Practice DSA',
    accentColor: 'sky',
  },
  {
    id: 'bug-hunter',
    title: 'Bug Hunter Studio',
    description: 'Audit production code snippets for concurrency deadlocks, memory leaks, and subtle logic bugs.',
    badge: 'Logic & Concurrency',
    icon: Bug,
    actionText: 'Debug Code',
    accentColor: 'indigo',
  },
  {
    id: 'blitz',
    title: '60s Rapid Blitz',
    description: 'Answer fast-paced technical questions under strict 60-second timers to build spontaneous clarity.',
    badge: '60-Second Timers',
    icon: Zap,
    actionText: 'Start Rapid Blitz',
    accentColor: 'amber',
  },
];

const ACCENT_STYLES = {
  teal: {
    iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    hoverBorder: 'hover:border-teal-500/30',
    hoverShadow: 'hover:shadow-teal-500/5',
    actionIcon: 'text-teal-400',
  },
  sky: {
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    hoverBorder: 'hover:border-sky-500/30',
    hoverShadow: 'hover:shadow-sky-500/5',
    actionIcon: 'text-sky-400',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/30',
    hoverShadow: 'hover:shadow-indigo-500/5',
    actionIcon: 'text-indigo-400',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/30',
    hoverShadow: 'hover:shadow-amber-500/5',
    actionIcon: 'text-amber-400',
  },
};

function StudioCard({ studio, onNavigate }) {
  const styles = ACCENT_STYLES[studio.accentColor] || ACCENT_STYLES.teal;
  const Icon = studio.icon;

  return (
    <div
      onClick={() => onNavigate(studio.id)}
      className={`flex flex-col justify-between p-6 sm:p-8 bg-[#0f172a]/50 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.hoverBorder} ${styles.hoverShadow} group cursor-pointer`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`inline-flex p-3 rounded-xl border shadow-sm group-hover:scale-105 transition-all duration-300 ${styles.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles.badge}`}>
            {studio.badge}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white tracking-tight">
          {studio.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#cbd5e1] font-normal">
          {studio.description}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => onNavigate(studio.id)}
          className="w-fit text-sm font-medium px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{studio.actionText}</span>
          {studio.id === 'setup' ? (
            <ArrowRight className={`w-4 h-4 ${styles.actionIcon}`} />
          ) : (
            <ChevronRight className={`w-4 h-4 ${styles.actionIcon}`} />
          )}
        </button>
      </div>
    </div>
  );
}

function StudioGrid({ studios, onNavigate }) {
  return (
    <section id="practice-modules" className="space-y-6 pt-4 mt-16 sm:mt-20 scroll-mt-24 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.12)]">
            <Layers className="w-6 h-6" />
          </span>
          <span>Targeted Practice Studios</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

function HeroSection({ onNavigate, onExplore }) {
  return (
    <section className="relative mx-auto max-w-4xl px-0 text-center flex flex-col items-center space-y-6 pt-2">
      <HeroBackgroundAnimation />

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.06] relative z-10 pt-4 tracking-[-0.035em] sm:tracking-[-0.045em]">
        Fail safely in simulation.{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 font-black block sm:inline drop-shadow-[0_0_16px_rgba(45,212,191,0.15)] tracking-[-0.035em] sm:tracking-[-0.045em]">
          Ace the actual loop.
        </span>
      </h1>

      <p className="text-base sm:text-lg text-slate-300/90 max-w-xl leading-relaxed text-pretty font-normal relative z-10 tracking-[-0.01em]">
        Practice realistic mock interviews for any role or background with instant AI voice feedback.
      </p>

      <div className="pt-2 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('setup')}
            className="py-3.5 px-7 rounded-xl bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_24px_-4px_rgba(13,148,136,0.4)] border border-teal-300/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>Start a mock interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExplore}
            className="py-3.5 px-6 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <span>Explore practice modules</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </section>
  );
}

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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <AppNavbar currentActive="landing" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex-1 space-y-16 text-left relative z-10">
        <HeroSection onNavigate={nav} onExplore={handleExploreModules} />
        <StudioGrid studios={PRACTICE_STUDIOS} onNavigate={nav} />
      </main>
    </div>
  );
}
