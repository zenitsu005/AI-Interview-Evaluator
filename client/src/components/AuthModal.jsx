import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AuthModal() {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!authModalOpen) return null;

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(cleanName, cleanEmail, password);
      setSuccessMessage('✅ Account created and logged in successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setName('');
        setEmail('');
        setPassword('');
        closeAuth();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(cleanEmail, password);
      setSuccessMessage('✅ Logged in successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setName('');
        setEmail('');
        setPassword('');
        closeAuth();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Incorrect email or password.');
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
            setSuccessMessage(null);
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Emblem */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-500/40 mx-auto flex items-center justify-center text-2xl shadow-lg mb-3">
            🎯
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
            {authMode === 'login' ? 'Candidate Login' : 'Create Candidate Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {authMode === 'login'
              ? 'Enter your registered email and password to access your dashboard.'
              : 'Sign up to track interview analytics and performance passports.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0B0B0E] p-1 rounded-xl border border-white/5 mb-5">
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

        {/* Main Form */}
        <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Akshay Garg"
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
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
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : authMode === 'login' ? (
              'Log In to Dashboard →'
            ) : (
              'Create Account & Start →'
            )}
          </button>
        </form>

        {/* Guest Option */}
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
