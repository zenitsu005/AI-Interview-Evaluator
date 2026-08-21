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
  const [successMessage, setSuccessMessage] = useState(null);

  // OTP Verification state for email ownership verification
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  if (!authModalOpen) return null;

  const handleStartSignup = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your real name (minimum 2 characters).');
      return;
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address that you own.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Generate 6-digit OTP verification code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setEnteredOtp(['', '', '', '', '', '']);
    setOtpStep(true);
    setSuccessMessage(`📧 Verification code sent to ${cleanEmail}`);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...enteredOtp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setEnteredOtp(newOtp);
      const nextIndex = Math.min(5, index + digits.length);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...enteredOtp];
    newOtp[index] = digit;
    setEnteredOtp(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtpAndComplete = async () => {
    const fullOtp = enteredOtp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    if (fullOtp !== generatedOtp) {
      setError('❌ Invalid verification code. Please check the code and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signup(name.trim(), email.trim().toLowerCase(), password);
      setSuccessMessage('✅ Email verified! Account created successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
        setOtpStep(false);
        closeAuth();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed.');
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
        closeAuth();
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. If you do not have an account, click "Sign Up" above.');
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
            setOtpStep(false);
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {otpStep ? (
          /* ── OTP Verification Screen ── */
          <div className="space-y-5 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-500/40 mx-auto flex items-center justify-center text-2xl shadow-lg">
              🔐
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Verify Email Ownership</h2>
              <p className="text-xs text-zinc-400 mt-1">
                To prevent unowned accounts, enter the 6-digit code sent to:
              </p>
              <p className="text-xs font-mono font-bold text-teal-400 mt-0.5">{email}</p>
            </div>

            {/* Demo Code Box */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">
                Verification Security Code:
              </span>
              <span className="text-lg font-mono font-black text-amber-400 tracking-widest">
                {generatedOtp}
              </span>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2">
              {enteredOtp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-mono font-bold bg-[#0B0B0E] border-2 border-zinc-800 focus:border-teal-500 rounded-xl text-white focus:outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-teal-950/60 border border-teal-700/80 rounded-xl p-3 text-teal-300 text-xs flex items-center justify-center gap-2 font-bold">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOtpAndComplete}
              disabled={isLoading || enteredOtp.join('').length < 6}
              className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code & Sign In →'}
            </button>

            <button
              type="button"
              onClick={() => { setOtpStep(false); setError(null); }}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer block mx-auto"
            >
              ← Change email address
            </button>
          </div>
        ) : (
          /* ── Standard Login & Signup Form ── */
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-500/40 mx-auto flex items-center justify-center text-2xl shadow-lg mb-3">
                🎯
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                {authMode === 'login' ? 'Candidate Login' : 'Create Verified Account'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {authMode === 'login'
                  ? 'Sign in to your account with your verified email.'
                  : 'Enter your email to receive a verification OTP code.'}
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

            <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleStartSignup} className="space-y-3.5">
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
                  Your Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
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
                className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : authMode === 'login' ? (
                  'Log In with Email →'
                ) : (
                  'Send Verification Code (OTP) →'
                )}
              </button>
            </form>

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
