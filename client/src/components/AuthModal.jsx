import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AuthModal() {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isAddingOtherAccount, setIsAddingOtherAccount] = useState(false);

  const googleAccounts = [
    {
      name: 'Agitu',
      email: 'agitu555@gmail.com',
      avatarColor: 'bg-rose-600',
      initial: 'A',
    },
    {
      name: 'Akshay Garg',
      email: 'garg22723@gmail.com',
      avatarColor: 'bg-teal-600',
      initial: 'G',
    },
  ];

  if (!authModalOpen) return null;

  const handleSelectGoogleAccount = async (account) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle({
        email: account.email,
        name: account.name || account.email.split('@')[0],
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(account.email)}`,
      });
      setSuccessMessage(`✅ Signed in as ${account.email}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        setIsGooglePickerOpen(false);
        closeAuth();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    const clean = customGoogleEmail.trim().toLowerCase();
    if (!clean || !EMAIL_REGEX.test(clean)) {
      setError('Please enter a valid Google email address.');
      return;
    }
    await handleSelectGoogleAccount({
      name: clean.split('@')[0],
      email: clean,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldError(false);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (authMode === 'signup' && (!name.trim() || name.trim().length < 2)) {
      setError('Please enter your full name (minimum 2 characters).');
      setFieldError(true);
      return;
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      setFieldError(true);
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setFieldError(true);
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(cleanEmail, password);
      } else {
        await signup(name.trim(), cleanEmail, password);
      }
      setSuccessMessage('✅ Authenticated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setName('');
        setEmail('');
        setPassword('');
        closeAuth();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed. Please verify credentials.');
      setFieldError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0E]/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#121217] border border-white/10 max-w-md w-full p-6 sm:p-8 shadow-2xl rounded-3xl relative text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            closeAuth();
            setError(null);
            setIsGooglePickerOpen(false);
            setIsAddingOtherAccount(false);
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {isGooglePickerOpen ? (
          /* ── Google Account Selector View ── */
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                <p className="text-[11px] text-zinc-400">Choose an account to continue to AI Evaluator</p>
              </div>
            </div>

            {/* List of Available Google Accounts */}
            <div className="space-y-2">
              {googleAccounts.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-teal-500/40 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${acc.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                      {acc.initial}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono">{acc.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-teal-400 font-bold transition-colors">
                    Login →
                  </span>
                </button>
              ))}

              {/* Add Custom / Other Google Account */}
              {!isAddingOtherAccount ? (
                <button
                  type="button"
                  onClick={() => setIsAddingOtherAccount(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-700 hover:border-teal-500/50 text-zinc-400 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer bg-zinc-950/40"
                >
                  <span>➕ Use another Google account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">
                    Enter Google / Gmail Address:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      required
                      autoFocus
                      className="flex-1 bg-[#0B0B0E] border border-zinc-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-teal-950/60 border border-teal-700/80 rounded-xl p-3 text-teal-300 text-xs flex items-center gap-2 font-bold">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setIsGooglePickerOpen(false); setError(null); }}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to standard login
              </button>
            </div>
          </div>
        ) : (
          /* ── Standard Email / Password Form ── */
          <>
            {/* Brand Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-500/40 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-teal-950/40 mb-3">
                🎯
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                {authMode === 'login' ? 'Welcome Back' : 'Create Candidate Account'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {authMode === 'login'
                  ? 'Log in to track your scores and review past mock interviews.'
                  : 'Sign up to unlock verified skill scorecards and interview history.'}
              </p>
            </div>

            {/* Google Fast Login Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => { setIsGooglePickerOpen(true); setError(null); }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
                Or with verified email
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#0B0B0E] p-1 rounded-xl border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); }}
                className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(null); }}
                className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldError(false); }}
                    placeholder="e.g. Alex Johnson"
                    required
                    className="w-full bg-[#0B0B0E] border border-zinc-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(false); }}
                  placeholder="alex@domain.com"
                  required
                  className="w-full bg-[#0B0B0E] border border-zinc-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                  Password (min. 6 characters) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldError(false); }}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#0B0B0E] border border-zinc-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-teal-950/60 border border-teal-700/80 rounded-xl p-3 text-teal-300 text-xs flex items-center gap-2 animate-fade-in font-bold">
                  <span>✅</span>
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </span>
                ) : authMode === 'login' ? (
                  'Log In to Dashboard →'
                ) : (
                  'Create Account & Start →'
                )}
              </button>
            </form>

            {/* Guest fallback button */}
            <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
              <button
                type="button"
                onClick={closeAuth}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Or continue as Guest (No Account Required) →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
