import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { phase, setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth, openHistory } = useAuth();

  const navLinks = [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'setup', label: 'Mock Interview', icon: '🎯', highlight: true },
    { id: 'hype-lab', label: 'Hype Lab', icon: '🧘' },
    { id: 'dsa', label: 'DSA Studio', icon: '💻' },
    { id: 'bug-hunter', label: 'Bug Hunter', icon: '🐛' },
    { id: 'blitz', label: '60s Blitz', icon: '⚡' },
    { id: 'resume-builder', label: 'ATS Resume', icon: '📄' },
    { id: 'negotiate', label: 'Salary Sparring', icon: '💼' },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => setPhase('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-base shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            🎯
          </div>
          <div>
            <span className="font-extrabold text-white text-sm sm:text-base tracking-tight group-hover:text-indigo-300 transition-colors">
              AI Interview<span className="text-indigo-400"> Evaluator</span>
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs">
          {navLinks.map((item) => {
            const isActive = phase === item.id || currentActive === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPhase(item.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : item.highlight
                    ? 'text-indigo-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openHistory}
            className="btn-secondary py-1.5 px-3 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-xs"
            title="View Past Interview Transcripts & Scores"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Past Mocks</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhase('profile')}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-red-400 border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 rounded-xl transition-colors"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth('login')}
                className="text-xs text-slate-300 hover:text-white font-semibold px-2.5 py-1.5 rounded-xl transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="text-xs text-indigo-300 hover:text-white bg-indigo-950/80 border border-indigo-500/40 hover:border-indigo-400 font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {phase !== 'setup' && (
            <button
              onClick={() => setPhase('setup')}
              className="btn-primary py-1.5 px-3.5 text-xs font-bold btn-glow shadow-md shadow-indigo-600/20"
            >
              <span>🚀 Start</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
