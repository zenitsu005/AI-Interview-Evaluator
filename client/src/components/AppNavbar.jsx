import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import DropdownMenu from './ui/DropdownMenu';
import Button from './ui/Button';

export default function AppNavbar({ currentActive = 'landing' }) {
  const { setPhase } = useInterview();
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureItems = [
    { id: 'dsa', label: 'DSA Live Studio', badge: 'Code' },
    { id: 'bug-hunter', label: 'Bug Hunting Labs', badge: 'Debug' },
    { id: 'negotiate', label: 'Salary Negotiation', badge: 'HR' },
  ];

  const prepToolItems = [
    { id: 'resume-builder', label: 'ATS Resume Scorer', badge: 'ATS' },
    { id: 'blitz', label: '60-Second Rapid Blitz', badge: 'Speed' },
    { id: 'anxiety-prep', label: 'Interview Confidence Lab', badge: 'Pacing' },
  ];

  const handleSelectModule = (id) => {
    setPhase(id);
    setMobileMenuOpen(false);
  };

  // Close mobile drawer on Escape key press
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all text-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleSelectModule('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group text-left border-none bg-transparent"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 font-extrabold text-white text-xs shadow-md group-hover:bg-teal-500 transition-colors">
            AI
          </div>
          <span className="font-semibold tracking-tight text-slate-900 text-sm sm:text-base">
            Interview Evaluator
          </span>
        </button>

        {/* Desktop SaaS Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          <button
            onClick={() => handleSelectModule('setup')}
            className={`transition hover:text-slate-900 font-medium cursor-pointer ${
              currentActive === 'setup' ? 'text-teal-600 font-bold' : 'text-slate-600'
            }`}
          >
            Mock Interview
          </button>

          <DropdownMenu
            label="Practice Modules"
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
            className={`transition hover:text-slate-900 font-medium cursor-pointer ${
              currentActive === 'analytics' ? 'text-teal-600 font-bold' : 'text-slate-600'
            }`}
          >
            Progress
          </button>
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectModule('profile')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-red-600 border border-slate-200 bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth('login')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectModule('setup')}
              >
                Start a mock interview
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
        >
          <span className="text-base font-bold">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-b border-slate-200 bg-white p-4 space-y-4 animate-fade-in text-left shadow-lg"
        >
          <button
            onClick={() => handleSelectModule('landing')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200"
          >
            🏠 Home Page
          </button>

          <button
            onClick={() => handleSelectModule('setup')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200"
          >
            🎯 Start a Mock Interview
          </button>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 font-mono">Practice Modules</p>
            {featureItems.map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelectModule(f.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 font-mono">Prep Tools</p>
            {prepToolItems.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectModule(p.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleSelectModule('analytics')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Progress & Analytics
            </button>

            {!isAuthenticated ? (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => { handleSelectModule('setup'); }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-teal-600 text-white text-center"
                >
                  Start Mock
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 text-center"
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
