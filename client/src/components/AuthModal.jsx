import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Google inline quick-sign state
  const [googleMode, setGoogleMode] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  const [fieldError, setFieldError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldError(false);
    setSuccessMessage(null);

    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      setFieldError(true);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setFieldError(true);
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      setFieldError(true);
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      setSuccessMessage('✅ Signed in successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setName('');
        setEmail('');
        setPassword('');
        closeAuth();
      }, 900);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed.');
      setFieldError(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const userEmail = googleEmail.trim();
      const rawName = userEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = googleName.trim() || (rawName.charAt(0).toUpperCase() + rawName.slice(1));
      await loginWithGoogle({
        email: userEmail,
        name: formattedName,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
      });
      setGoogleMode(false);
      setGoogleName('');
      setGoogleEmail('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card-dark border-indigo-900/60 max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => { closeAuth(); setGoogleMode(false); setError(null); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>

        {/* Brand Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 mb-3">
            🎯
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {googleMode ? 'Quick Google Sign-In' : authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {googleMode
              ? 'Enter your name and email to sign in instantly.'
              : authMode === 'login'
              ? 'Log in to track your scores and review past mock interviews.'
              : 'Sign up to unlock personalized evaluation and interview history.'}
          </p>
        </div>

        {/* ── Google Quick Sign-In Form ── */}
        {googleMode ? (
          <form onSubmit={handleGoogleSignIn} className="space-y-4">
            {/* Google branding header */}
            <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-700 rounded-xl p-3 mb-2">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span className="text-xs text-slate-300 font-medium">Signing in with Google</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="e.g. Akshay Garg"
                className="input-field-dark text-xs"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Gmail Address *
              </label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="your.name@gmail.com"
                required
                className="input-field-dark text-xs"
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-xs font-bold shadow-lg btn-glow"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In with Google →'}
            </button>

            <button
              type="button"
              onClick={() => { setGoogleMode(false); setError(null); }}
              className="w-full text-xs text-slate-400 hover:text-slate-200 transition-colors text-center pt-1"
            >
              ← Back to login options
            </button>
          </form>
        ) : (
          <>
            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={() => { setGoogleMode(true); setError(null); }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] mb-5 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Or with email
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); }}
                className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all ${
                  authMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(null); }}
                className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldError(false); }}
                    placeholder="e.g. Alex Johnson"
                    required
                    className={fieldError && !name ? 'input-field-dark text-xs input-error' : 'input-field-dark text-xs'}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(false); }}
                  placeholder="alex@example.com"
                  required
                  className={fieldError && !email ? 'input-field-dark text-xs input-error' : 'input-field-dark text-xs'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldError(false); }}
                  placeholder="••••••••"
                  required
                  className={fieldError && !password ? 'input-field-dark text-xs input-error' : 'input-field-dark text-xs'}
                />
              </div>

              {error && (
                <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-950/70 border border-emerald-700/80 rounded-xl p-3 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-bold">
                  <span>✅</span>
                  <span>{successMessage}</span>
                </div>
              )}


              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 text-xs font-bold shadow-lg btn-glow mt-2"
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
                  'Log In →'
                ) : (
                  'Create Account & Start →'
                )}
              </button>
            </form>

            {/* Guest fallback button */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={closeAuth}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Or continue as Guest (No Login Required) →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
