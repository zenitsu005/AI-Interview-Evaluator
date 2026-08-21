import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { phase, setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth, openHistory } = useAuth();
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  const featureLinks = [
    { id: 'setup', label: 'Mock Interview Studio' },
    { id: 'dsa', label: 'DSA Studio' },
    { id: 'bug-hunter', label: 'Bug Hunter' },
    { id: 'blitz', label: '60s Rapid Blitz' },
    { id: 'negotiate', label: 'Salary Sparring' },
    { id: 'resume-builder', label: 'ATS Resume Optimizer' },
    { id: 'hype-lab', label: 'Anxiety Hype Lab' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#090A0F]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <div
          onClick={() => setPhase('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs shadow-inner shadow-indigo-400/30 group-hover:bg-indigo-500 transition-colors">
            AI
          </div>
          <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
            Interview Evaluator
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-zinc-400">
          {/* Features Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              className="flex items-center gap-1 transition hover:text-white text-zinc-300 font-semibold"
            >
              <span>Features</span>
              <span className="text-[10px] opacity-60">▾</span>
            </button>

            {featuresDropdownOpen && (
              <div
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-0.5 text-left"
              >
                {featureLinks.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setPhase(f.id); setFeaturesDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors block"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setPhase('setup')} className="transition hover:text-white">
            Prep Modules
          </button>
          
          <button onClick={() => setPhase('landing')} className="transition hover:text-white">
            Pricing
          </button>

          <button onClick={openHistory} className="transition hover:text-white">
            Past Mocks
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhase('profile')}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold text-zinc-200"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-red-400 border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="text-xs sm:text-sm font-medium text-zinc-300 transition hover:text-white px-3 py-1.5"
              >
                Log In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95 shadow-sm shadow-indigo-500/20"
              >
                Start Free Trial
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
