import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { phase, setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth, openHistory } = useAuth();
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const primaryLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'setup', label: 'Mock Studio', highlight: true },
    { id: 'dsa', label: 'DSA Studio' },
  ];

  const toolLinks = [
    { id: 'bug-hunter', label: 'Bug Hunter' },
    { id: 'blitz', label: '60s Rapid Blitz' },
    { id: 'resume-builder', label: 'ATS Resume' },
    { id: 'negotiate', label: 'Salary Sparring' },
    { id: 'hype-lab', label: 'Anxiety Hype Lab' },
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => setPhase('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white font-bold shadow-md group-hover:bg-indigo-500 transition-colors">
            🎯
          </div>
          <span className="font-extrabold text-white text-sm sm:text-base tracking-tight group-hover:text-indigo-300 transition-colors">
            AI Interview<span className="text-indigo-400"> Evaluator</span>
          </span>
        </div>

        {/* Clean Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
          {primaryLinks.map((item) => {
            const isActive = phase === item.id || currentActive === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPhase(item.id); setToolsDropdownOpen(false); }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : item.highlight
                    ? 'text-indigo-300 hover:text-white hover:bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="px-3.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all flex items-center gap-1 font-semibold"
            >
              <span>Tools</span>
              <span className="text-[10px] opacity-60">▾</span>
            </button>

            {toolsDropdownOpen && (
              <div
                onMouseLeave={() => setToolsDropdownOpen(false)}
                className="absolute top-full left-0 mt-1.5 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-0.5 text-left"
              >
                {toolLinks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setPhase(t.id); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors block"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openHistory}
            className="py-1.5 px-3 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all shadow-xs"
            title="View Past Transcripts"
          >
            Past Mocks
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhase('profile')}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold text-zinc-200"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-red-400 border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth('login')}
                className="text-xs text-zinc-300 hover:text-white font-semibold px-3 py-1.5 rounded-xl transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
