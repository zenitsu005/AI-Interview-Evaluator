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
  TbShieldCheck as ShieldCheck,
} from 'react-icons/tb';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureItems = [
    { id: 'dsa', label: 'DSA Live Studio', icon: Code2 },
    { id: 'bug-hunter', label: 'Bug Hunting Labs', icon: Bug },
    { id: 'negotiate', label: 'Salary Negotiation', icon: DollarSign },
  ];

  const prepToolItems = [
    { id: 'resume-builder', label: 'ATS Resume Scorer', icon: FileText },
    { id: 'blitz', label: '60-Second Rapid Blitz', icon: Zap },
    { id: 'anxiety-prep', label: 'Confidence & Pacing Lab', icon: HeartPulse },
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
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#0E131F]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.07)_inset,0_10px_30px_rgba(0,0,0,0.6)] px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto text-slate-100 transition-all">
        
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleSelectModule('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group text-left border-none bg-transparent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 via-emerald-500/15 to-cyan-500/20 border border-teal-500/40 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:scale-105 group-hover:border-teal-400/80 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.35)] transition-all duration-300">
            <LogoIcon className="w-5 h-5" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-sm sm:text-base flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">AI</span>
            <span>Interview Evaluator</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          <button
            onClick={() => handleSelectModule('setup')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentActive === 'setup'
                ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30'
                : 'hover:bg-white/[0.06] hover:text-white text-slate-300'
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

          <button
            onClick={() => handleSelectModule('analytics')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentActive === 'analytics'
                ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30'
                : 'hover:bg-white/[0.06] hover:text-white text-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Progress</span>
          </button>
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectModule('profile')}
                className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 py-1.5 rounded-xl transition-all duration-200 text-xs font-semibold text-slate-200 cursor-pointer shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-slate-950">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 border border-white/10 bg-white/[0.03] hover:bg-rose-950/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
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
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectModule('setup')}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_4px_16px_rgba(20,184,166,0.3)] hover:shadow-[0_1px_rgba(255,255,255,0.4)_inset,0_6px_24px_rgba(20,184,166,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-1.5"
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
