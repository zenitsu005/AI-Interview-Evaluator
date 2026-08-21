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
  const googleBtnContainerRef = useRef(null);

  // Initialize Google Identity Services (GIS)
  useEffect(() => {
    if (!authModalOpen) return;

    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initGoogle();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    };

    const initGoogle = () => {
      try {
        if (!window.google?.accounts?.id) return;
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1047582910384-sample.apps.googleusercontent.com';

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'rectangular',
            width: '100%',
            text: 'continue_with',
          });
        }
      } catch (err) {
        console.warn('Google One Tap notice:', err);
      }
    };

    loadGoogleScript();
  }, [authModalOpen]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setError('Google authentication failed to return valid credentials.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle({ credential: response.credential });
      setSuccessMessage('✅ Signed in with Google successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        closeAuth();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerGoogle = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Identity Services is loading. Please enter your email and password below.');
    }
  };

  if (!authModalOpen) return null;

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
          onClick={() => { closeAuth(); setError(null); }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

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

        {/* ── Real Google OAuth Button Container ── */}
        <div className="mb-4">
          <div ref={googleBtnContainerRef} className="w-full flex justify-center min-h-[44px]">
            <button
              type="button"
              onClick={handleTriggerGoogle}
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
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
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
      </div>
    </div>
  );
}
