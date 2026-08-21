import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import DropdownMenu from './ui/DropdownMenu';
import Button from './ui/Button';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth, openHistory } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureItems = [
    { id: 'video', label: 'System Architecture Simulation', badge: 'L7' },
    { id: 'dsa', label: 'DSA Live Studio', badge: 'Code' },
    { id: 'bug-hunter', label: 'Bug Hunting Labs', badge: 'Debug' },
    { id: 'negotiate', label: 'Salary Negotiation', badge: 'HR' },
  ];

  const prepToolItems = [
    { id: 'resume-builder', label: 'ATS Resume Scorer', badge: 'ATS' },
    { id: 'blitz', label: '60-Second Rapid Blitz', badge: 'Speed' },
    { id: 'hype-lab', label: 'Anxiety Hype Lab', badge: 'Vocal' },
  ];

  const handleSelectModule = (id) => {
    setPhase(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#090A0F]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleSelectModule('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white text-xs shadow-inner shadow-indigo-400/30 group-hover:bg-indigo-500 transition-colors">
            AI
          </div>
          <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
            Interview Evaluator
          </span>
        </div>

        {/* Desktop SaaS Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <DropdownMenu
            label="Features"
            items={featureItems}
            onItemSelect={handleSelectModule}
          />
          <DropdownMenu
            label="Prep Tools"
            items={prepToolItems}
            onItemSelect={handleSelectModule}
          />
          <button
            onClick={openHistory}
            className="transition hover:text-white text-zinc-300 font-medium"
          >
            Past Mocks
          </button>
        </nav>


        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectModule('profile')}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold text-zinc-200"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-red-400 border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth('login')}
                className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Log In
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectModule('setup')}
              >
                Start Free Mock
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span className="text-base">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-zinc-950 p-4 space-y-4 animate-fade-in text-left">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Features</p>
            {featureItems.map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelectModule(f.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Prep Tools</p>
            {prepToolItems.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectModule(p.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <button
              onClick={openHistory}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Past Mocks & Transcripts
            </button>
            {!isAuthenticated ? (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => { handleSelectModule('setup'); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white text-center"
                >
                  Start Free Mock
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-red-950/40 text-red-400 border border-red-900/40 text-center"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
