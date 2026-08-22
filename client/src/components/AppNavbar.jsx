import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import DropdownMenu from './ui/DropdownMenu';
import Button from './ui/Button';
import {
  Sparkles,
  Code2,
  Bug,
  DollarSign,
  FileText,
  Zap,
  HeartPulse,
  BarChart3,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureItems = [
    { id: 'dsa', label: 'DSA Live Studio', badge: 'Code', icon: Code2 },
    { id: 'bug-hunter', label: 'Bug Hunting Labs', badge: 'Debug', icon: Bug },
    { id: 'negotiate', label: 'Salary Negotiation', badge: 'HR', icon: DollarSign },
  ];

  const prepToolItems = [
    { id: 'resume-builder', label: 'ATS Resume Scorer', badge: 'ATS', icon: FileText },
    { id: 'blitz', label: '60-Second Rapid Blitz', badge: 'Speed', icon: Zap },
    { id: 'anxiety-prep', label: 'Confidence & Pacing Lab', badge: 'Pacing', icon: HeartPulse },
  ];

  const handleSelectModule = (id) => {
    setPhase(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D13]/85 backdrop-blur-2xl transition-all text-slate-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleSelectModule('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group text-left border-none bg-transparent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 font-extrabold text-slate-950 text-xs shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white text-sm sm:text-base leading-none">
              AI Interview Evaluator
            </span>
            <span className="text-[10px] text-teal-400/90 font-mono font-medium tracking-wide mt-0.5">
              Production Suite
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          <button
            onClick={() => handleSelectModule('setup')}
            className={`transition hover:text-white font-medium cursor-pointer ${
              currentActive === 'setup' ? 'text-teal-400 font-bold' : 'text-slate-300'
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
            className={`transition hover:text-white font-medium cursor-pointer flex items-center gap-1.5 ${
              currentActive === 'analytics' ? 'text-teal-400 font-bold' : 'text-slate-300'
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
                className="flex items-center gap-2 bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 px-3.5 py-1.5 rounded-xl transition-all text-xs font-semibold text-slate-200 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-slate-950">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 border border-white/10 bg-[#131823] hover:bg-rose-950/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth('login')}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>Log In</span>
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectModule('setup')}
                className="shadow-lg shadow-teal-500/20"
              >
                Start Simulator →
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#171E2D] border border-white/10 focus:outline-none cursor-pointer"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0E121B] px-4 py-5 space-y-4 animate-fade-in text-left">
          <div className="space-y-1">
            <button
              onClick={() => handleSelectModule('setup')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span>Mock Interview Simulator</span>
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
                  className="flex-1 py-2.5 text-xs font-bold text-slate-300 bg-white/5 rounded-xl border border-white/10"
                >
                  Log In
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSelectModule('setup')}
                  className="flex-1"
                >
                  Start Simulator
                </Button>
              </>
            ) : (
              <button
                onClick={logout}
                className="w-full py-2.5 text-xs font-bold text-rose-400 bg-rose-950/30 rounded-xl border border-rose-500/20"
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
