import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';

const ROLES = [
  { id: 'swe', title: 'Software Engineer', level: 'L4 / Mid-Level' },
  { id: 'senior', title: 'Senior Software Engineer', level: 'L5 / Senior' },
  { id: 'staff', title: 'Staff Engineer', level: 'L6 / Staff' },
  { id: 'principal', title: 'Principal Engineer', level: 'L7+ / Principal' },
  { id: 'em', title: 'Engineering Manager', level: 'M1 / Manager' },
];

const TYPES = [
  { id: 'video', title: 'Full Mock Interview', desc: 'Simulate technical depth, system design, and STAR behavioral.' },
  { id: 'dsa', title: 'Coding / DSA Studio', desc: 'Algorithm challenges, automated test runner, complexity analysis.' },
  { id: 'bug-hunter', title: 'Debugging / Code Review', desc: 'Audit race conditions, memory leaks, and logic flaws.' },
  { id: 'blitz', title: '60s Rapid Blitz', desc: 'Fast-paced technical recall questions under 60s timers.' },
];

const FORMATS = [
  { id: 'voice-transcript', title: 'Voice + Live Transcript', desc: 'Real-time speech transcription with voice analytics.' },
  { id: 'text-only', title: 'Text-Only Mode', desc: 'Type your responses directly without microphone access.' },
  { id: 'voice-notes', title: 'Voice with Live Notes', desc: 'Speak your answers while writing scratchpad notes.' },
];

export default function InterviewSetup({ onStartModule, onNavigate }) {
  const { setPhase, setRole } = useInterview();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(ROLES[1]); // Senior
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleText, setCustomRoleText] = useState('');

  const [selectedType, setSelectedType] = useState(TYPES[0]); // Full Mock
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]); // Voice + Transcript
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('45');
  const [audioConsent, setAudioConsent] = useState(false);
  const [micState, setMicState] = useState('checking'); // 'checking' | 'granted' | 'denied'

  // Check microphone permissions safely
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setMicState('granted'))
        .catch(() => setMicState('denied'));
    } else {
      setMicState('denied');
    }
  }, []);

  const handleLaunchSession = (forceTextMode = false) => {
    if (selectedFormat.id !== 'text-only' && !audioConsent && !forceTextMode) {
      alert('Please check the audio processing consent box before launching voice mode, or choose Text-Only mode.');
      return;
    }

    if (setRole) {
      setRole(selectedRole.title);
    }

    const targetPhase = selectedType.id === 'system-design' ? 'video' : selectedType.id;
    setPhase(targetPhase);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-zinc-100 flex flex-col justify-between select-none">
      <AppNavbar currentActive="setup" />

      <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-8 text-left flex-1">
        {/* Step Indicator Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className={step >= 1 ? 'text-teal-400 font-bold' : ''}>1. Role</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-teal-400 font-bold' : ''}>2. Interview Type</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-teal-400 font-bold' : ''}>3. Format</span>
            <span>→</span>
            <span className={step >= 4 ? 'text-teal-400 font-bold' : ''}>4. Review & Consent</span>
          </div>
          <span className="text-zinc-500 font-bold">Step {step} of 4</span>
        </div>

        {/* ── STEP 1: ROLE SELECTION ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select Target Engineering Role</h1>
              <p className="text-xs text-zinc-400">Choose a standard seniority level or type in your custom role.</p>
            </div>

            <div className="space-y-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setIsCustomRole(false);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    !isCustomRole && selectedRole.id === role.id
                      ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 text-white'
                      : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">{role.title}</p>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{role.level}</p>
                  </div>
                  {!isCustomRole && selectedRole.id === role.id && <span className="text-teal-400 font-bold">✓ Selected</span>}
                </button>
              ))}

              {/* Custom Type-In Role Card */}
              <div
                onClick={() => {
                  setIsCustomRole(true);
                  if (customRoleText) {
                    setSelectedRole({ id: 'custom', title: customRoleText, level: 'User Specified' });
                  }
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-3 ${
                  isCustomRole
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 text-white'
                    : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">✏️ Custom Role (Type your own title...)</p>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">Specify exact stack, domain, or role title</p>
                  </div>
                  {isCustomRole && <span className="text-teal-400 font-bold">✓ Selected</span>}
                </div>

                {isCustomRole && (
                  <div className="pt-2 animate-fade-in space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs font-bold text-teal-400 font-mono">Type Your Specific Target Role:</label>
                    <input
                      type="text"
                      value={customRoleText}
                      onChange={(e) => {
                        setCustomRoleText(e.target.value);
                        setSelectedRole({ id: 'custom', title: e.target.value || 'Custom Role', level: 'User Specified' });
                      }}
                      placeholder="e.g. Full Stack Developer (Node/React), iOS Lead, DevOps Architect..."
                      className="w-full bg-[#0B0B0E] border border-teal-500/60 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-sans shadow-inner"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (isCustomRole && !customRoleText.trim()) {
                    alert('Please type in your custom role title before continuing.');
                    return;
                  }
                  setStep(2);
                }}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Continue to Interview Type →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: INTERVIEW TYPE ── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Interview Module</h1>
              <p className="text-xs text-zinc-400">Focus on an individual practice domain or run a full multi-round simulation.</p>
            </div>

            <div className="space-y-3">
              {TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedType.id === type.id
                      ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 text-white'
                      : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white">{type.title}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{type.desc}</p>
                  </div>
                  {selectedType.id === type.id && <span className="text-teal-400 font-bold">✓ Selected</span>}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Continue to Format →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: FORMAT & TIMING ── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select Input Format & Timing</h1>
              <p className="text-xs text-zinc-400">Choose between live audio analysis or quiet text-only mode.</p>
            </div>

            <div className="space-y-3">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedFormat.id === fmt.id
                      ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 text-white'
                      : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white">{fmt.title}</p>
                    <p className="text-xs text-zinc-400">{fmt.desc}</p>
                  </div>
                  {selectedFormat.id === fmt.id && <span className="text-teal-400 font-bold">✓ Selected</span>}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="Easy">Easy (Foundation)</option>
                  <option value="Medium">Medium (Standard Tech)</option>
                  <option value="Hard">Hard (Staff / Bar Raiser)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Target Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="15">15 Minutes (Rapid)</option>
                  <option value="30">30 Minutes (Standard)</option>
                  <option value="45">45 Minutes (Full Deep Dive)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Review & Launch →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: REVIEW & PRIVACY CONSENT ── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Review & Privacy Disclosure</h1>
              <p className="text-xs text-zinc-400">Confirm your session parameters and audio consent prior to launch.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-[#131318] border border-white/5 p-5 rounded-2xl space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Target Role:</span>
                <span className="text-white font-bold">{selectedRole.title} ({selectedRole.level})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Module:</span>
                <span className="text-teal-400 font-bold">{selectedType.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Format:</span>
                <span className="text-emerald-400 font-bold">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Difficulty / Duration:</span>
                <span className="text-amber-400 font-bold">{difficulty} • {duration} Minutes</span>
              </div>
            </div>

            {/* Microphone Permission Status Banner */}
            {selectedFormat.id !== 'text-only' && (
              <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                micState === 'granted'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}>
                <div>
                  <p className="font-bold">Microphone Access Status:</p>
                  <p className="text-[11px] opacity-90">
                    {micState === 'granted'
                      ? '✓ Browser microphone permission granted.'
                      : '⚠️ Microphone not detected or permission pending.'}
                  </p>
                </div>
                {micState !== 'granted' && (
                  <button
                    onClick={() => handleLaunchSession(true)}
                    className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-[11px]"
                  >
                    Switch to Text-Only Mode
                  </button>
                )}
              </div>
            )}

            {/* Explicit Audio Privacy Consent Checkbox */}
            {selectedFormat.id !== 'text-only' && (
              <label className="flex items-start gap-3 bg-[#0B0B0E] p-4 rounded-2xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioConsent}
                  onChange={(e) => setAudioConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs text-zinc-300 leading-relaxed text-pretty">
                  <span className="font-bold text-white">Explicit Audio Consent: </span>
                  I understand that my audio may be processed to generate a live transcript and practice feedback. You can stop anytime. Read our{' '}
                  <button type="button" onClick={() => onNavigate('privacy')} className="text-teal-400 underline">Privacy Policy</button>{' '}
                  or learn about <button type="button" onClick={() => onNavigate('privacy')} className="text-teal-400 underline font-mono">Data Deletion</button>.
                </div>
              </label>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                ← Back
              </button>

              <button
                onClick={() => handleLaunchSession(false)}
                className="py-3.5 px-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xl shadow-teal-950/50 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Launch Mock Session →</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
