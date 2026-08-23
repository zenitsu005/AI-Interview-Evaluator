import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  IconLock as Lock,
  IconUser as User,
  IconMail as Mail,
  IconX as X,
  IconSparkles as Sparkles,
  IconArrowRight as ArrowRight,
  IconAlertTriangle as AlertTriangle,
  IconCircleCheck as CheckCircle2,
} from '@tabler/icons-react';

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
      setSuccessMessage('Account created and logged in successfully!');
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
      setSuccessMessage('Logged in successfully!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-sans">
      <div className="bg-[#131823] border border-white/10 max-w-md w-full p-6 sm:p-8 shadow-2xl rounded-3xl relative text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            closeAuth();
            setError(null);
            setSuccessMessage(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-[#171E2D] hover:bg-[#1E273A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Emblem */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 mx-auto flex items-center justify-center text-teal-400 shadow-md mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
            {authMode === 'login' ? 'Candidate Login' : 'Create Candidate Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login'
              ? 'Enter your registered email and password to access your dashboard.'
              : 'Sign up to track interview analytics and performance passports.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0D111A] p-1 rounded-xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(null); }}
            className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(null); }}
            className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Akshay Garg"
                  required
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {error && (
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : authMode === 'login' ? (
              <>
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account & Start</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guest Option */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={closeAuth}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Or continue as Guest (No Account Required) →
          </button>
        </div>
      </div>
    </div>
  );
}
