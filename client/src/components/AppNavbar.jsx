import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import DropdownMenu from './ui/DropdownMenu';
import Button from './ui/Button';
import {
  TbBrain as LogoIcon,
  TbCode as Code2,
  TbBug as Bug,
  TbCurrencyDollar as DollarSign,
  TbFileText as FileText,
  TbBolt as Zap,
  TbHeartbeat as HeartPulse,
  TbChartBar as BarChart3,
  TbUser as User,
  TbLogout as LogOut,
  TbLogin as LogIn,
  TbMenu2 as Menu,
  TbX as X,
  TbChevronRight as ChevronRight,
  TbChevronDown as ChevronDown,
  TbShieldCheck as ShieldCheck,
} from 'react-icons/tb';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatName = (name) => {
    if (!name) return 'Akshay';
    const first = name.trim().split(' ')[0];
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  };
  const displayName = formatName(user?.name);

  const featureItems = [
    {
      id: 'dsa',
      label: 'DSA Live Studio',
      desc: 'Multi-language sandbox & test runner',
      icon: Code2,
    },
    {
      id: 'bug-hunter',
      label: 'Bug Hunting Labs',
      desc: 'Debug logic & concurrency issues',
      icon: Bug,
    },
    {
      id: 'blitz',
      label: '60-Second Rapid Blitz',
      desc: 'Fast-paced spontaneous response drills',
      icon: Zap,
    },
  ];

  const prepToolItems = [
    {
      id: 'resume-builder',
      label: 'ATS Resume Scorer',
      desc: 'Live A4 preview & keyword ATS audit',
      icon: FileText,
    },
    {
      id: 'negotiate',
      label: 'Salary Negotiation',
      desc: 'AI counter-offer coaching & market parity',
      icon: DollarSign,
    },
    {
      id: 'anxiety-prep',
      label: 'Confidence & Pacing Lab',
      desc: 'Box breathing & vocal grounding drills',
      icon: HeartPulse,
    },
  ];

  const handleSelectModule = (id) => {
    setMobileMenuOpen(false);
    setPhase(id);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 pointer-events-none transition-all">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#080d1a]/80 backdrop-blur-md border border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_12px_28px_rgba(0,0,0,0.4)] px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto text-slate-100 transition-all">
        
        {/* Brand Wordmark & Bespoke Lettermark */}
        <button
          type="button"
          onClick={() => handleSelectModule('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group text-left border-none bg-transparent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 via-slate-900 to-[#0c1322] border border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:scale-105 group-hover:border-teal-400/60 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="url(#brandGrad1)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="url(#brandGrad2)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#2dd4bf"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.45"
              />
              <defs>
                <linearGradient id="brandGrad1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2dd4bf" />
                  <stop offset="1" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="brandGrad2" x1="2" y1="17" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#14b8a6" />
                  <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-bold text-white tracking-[-0.03em] text-sm sm:text-base flex items-center gap-1.5">
            <span className="font-extrabold text-white">Interview</span>
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent font-black tracking-[-0.01em]">AI</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          <button
            onClick={() => handleSelectModule('setup')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentActive === 'setup'
                ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]'
                : 'hover:bg-white/[0.05] hover:text-white text-slate-300'
            }`}
          >
            Mock Interview
          </button>

          <DropdownMenu
            label="Practice Studios"
            items={featureItems}
            onItemSelect={handleSelectModule}
          />

          <DropdownMenu
            label="Prep Tools"
            items={prepToolItems}
            onItemSelect={handleSelectModule}
          />
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectModule('profile')}
                className="group flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-teal-500/30 px-3.5 py-1.5 rounded-xl transition-all duration-200 text-xs font-semibold text-slate-200 cursor-pointer shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 border border-teal-500/40 flex items-center justify-center text-[10px] font-bold text-slate-950 shadow-xs">
                  {displayName ? displayName[0].toUpperCase() : 'U'}
                </div>
                <span>{displayName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 border border-white/[0.08] bg-white/[0.02] hover:bg-rose-950/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openAuth('login')}
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectModule('setup')}
                className="py-2 px-4 rounded-xl bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_6px_16px_-2px_rgba(13,148,136,0.35)] border border-teal-300/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <span>Start Interview</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 focus:outline-none cursor-pointer"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto mt-2 rounded-2xl border border-white/10 bg-[#0E131F]/95 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-2xl animate-fade-in text-left">
          <div className="space-y-1">
            <button
              onClick={() => handleSelectModule('setup')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span>Mock Interview</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => handleSelectModule('dsa')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-teal-400" /> DSA Live Studio
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => handleSelectModule('bug-hunter')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-cyan-400" /> Bug Hunting Labs
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => handleSelectModule('negotiate')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" /> Salary Negotiation
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => handleSelectModule('resume-builder')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> ATS Resume Scorer
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-300 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectModule('setup')}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl shadow-md"
                >
                  Start Interview
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                className="w-full py-2.5 text-xs font-bold text-rose-400 bg-rose-950/30 rounded-xl border border-rose-500/20 hover:bg-rose-950/50"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
