import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';

const ROLES = [
  {
    id: 'backend',
    title: 'Backend & Systems Engineer',
    level: 'Go / Python / Java • Microservices, Concurrency & SQL',
    tag: 'Backend',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Software Engineer',
    level: 'React / Next.js, Node.js / Python, REST/GraphQL APIs',
    tag: 'Full Stack',
  },
  {
    id: 'frontend',
    title: 'Frontend & UI Architecture Engineer',
    level: 'React, TypeScript, Web Vitals, State Management',
    tag: 'Frontend',
  },
  {
    id: 'ai-ml',
    title: 'Machine Learning & AI Engineer',
    level: 'PyTorch, LLM Orchestration, RAG, Vector Search & Python',
    tag: 'AI / ML',
  },
  {
    id: 'devops',
    title: 'DevOps & SRE Cloud Engineer',
    level: 'Kubernetes, Docker, Terraform, AWS / GCP, CI/CD Pipelines',
    tag: 'DevOps / SRE',
  },
  {
    id: 'mobile',
    title: 'Mobile Applications Engineer',
    level: 'iOS (Swift) / Android (Kotlin) / React Native',
    tag: 'Mobile',
  },
  {
    id: 'staff',
    title: 'Staff / Principal Architect (L6+)',
    level: 'High-Scale Distributed Design, Scalability & Cross-Team Strategy',
    tag: 'Staff / L6+',
  },
  {
    id: 'em',
    title: 'Engineering Manager / Tech Lead',
    level: 'Architecture Vision, Team Delivery, People Leadership',
    tag: 'Management',
  },
];

const POPULAR_CHIPS = [
  'Full Stack (React/Node)',
  'Backend Engineer (Go/Python)',
  'Frontend (Next.js)',
  'AI / ML Engineer',
  'DevOps / SRE',
  'iOS / Android Lead',
  'Staff Architect',
  'Data Engineer',
];

const TYPES = [
  { id: 'video', title: 'Full Mock Interview', desc: 'Simulate technical depth, system design, and STAR behavioral.' },
  { id: 'dsa', title: 'Coding / DSA Studio', desc: 'Algorithm challenges, automated test runner, complexity analysis.' },
  { id: 'bug-hunter', title: 'Debugging / Code Review', desc: 'Audit race conditions, memory leaks, and logic flaws.' },
  { id: 'blitz', title: '60s Rapid Blitz', desc: 'Fast-paced technical recall questions under 60s timers.' },
];

const LEVELS = [
  {
    id: 'Easy',
    label: '🟢 Easy (Foundation)',
    desc: 'Core fundamentals, gentle guidance, and foundational concepts.',
  },
  {
    id: 'Medium',
    label: '🟡 Medium (Standard Tech)',
    desc: 'Realistic production scenarios, edge case handling, and optimal patterns.',
  },
  {
    id: 'Hard',
    label: '🔴 Hard (Staff / Bar Raiser)',
    desc: 'High concurrency, distributed scalability trade-offs, and intense deep dives.',
  },
];

const FORMATS = [
  { id: 'voice-transcript', title: 'Voice + Live Transcript', desc: 'Real-time speech transcription with voice analytics.' },
  { id: 'text-only', title: 'Text-Only Mode', desc: 'Type your responses directly without microphone access.' },
  { id: 'voice-notes', title: 'Voice with Live Notes', desc: 'Speak your answers while writing scratchpad notes.' },
];

export default function InterviewSetup({ onStartModule, onNavigate }) {
  const { setPhase, setRole, setDifficultyLevel } = useInterview();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [customRoleText, setCustomRoleText] = useState(ROLES[0].title);

  const [selectedType, setSelectedType] = useState(TYPES[0]); // Full Mock
  const [difficulty, setDifficulty] = useState('Medium'); // 'Easy' | 'Medium' | 'Hard'
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]); // Voice + Transcript
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
      setRole(customRoleText || selectedRole.title);
    }
    if (setDifficultyLevel) {
      setDifficultyLevel(difficulty);
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
            <span className={step >= 2 ? 'text-teal-400 font-bold' : ''}>2. Module & Level</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-teal-400 font-bold' : ''}>3. Format</span>
            <span>→</span>
            <span className={step >= 4 ? 'text-teal-400 font-bold' : ''}>4. Review & Consent</span>
          </div>
          <span className="text-zinc-500 font-bold">Step {step} of 4</span>
        </div>

        {/* ── STEP 1: DIVERSE DOMAIN ROLE SELECTION OR CUSTOM INPUT ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select or Type Target Engineering Role</h1>
              <p className="text-xs text-zinc-400">Type any specific specialization or click a suggestion below.</p>
            </div>

            {/* Direct Input Field Always Visible */}
            <div className="bg-[#131318] border border-teal-500/60 p-4 rounded-2xl space-y-3 shadow-xl">
              <label className="block text-xs font-bold text-teal-400 font-mono uppercase tracking-wider">
                ✏️ Target Role / Tech Stack (Type freely):
              </label>
              <input
                type="text"
                value={customRoleText}
                onChange={(e) => {
                  setCustomRoleText(e.target.value);
                  setSelectedRole({ id: 'custom', title: e.target.value || 'Custom Role', level: 'Custom Role' });
                }}
                placeholder="e.g. Backend Engineer (Go/Rust), Full Stack Developer, ML Engineer..."
                className="w-full bg-[#0B0B0E] border border-zinc-700 focus:border-teal-500 rounded-xl p-3.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-sans shadow-inner"
              />

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-zinc-500 mr-1">Quick Suggestions:</span>
                {POPULAR_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomRoleText(chip);
                      setSelectedRole({ id: `chip-${idx}`, title: chip, level: 'Suggested Role' });
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                      customRoleText === chip
                        ? 'bg-teal-950 text-teal-300 border-teal-500/80 font-bold'
                        : 'bg-[#0B0B0E] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Or Select Domain Specialization</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Diverse Role Domain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setCustomRoleText(role.title);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    customRoleText === role.title
                      ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 text-white'
                      : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold text-sm text-white">{role.title}</p>
                    {customRoleText === role.title && (
                      <span className="text-teal-400 font-bold text-xs">✓ Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">{role.level}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!customRoleText.trim()) {
                    alert('Please type in or select your target role before continuing.');
                    return;
                  }
                  setStep(2);
                }}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Continue to Module & Level →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: INTERVIEW MODULE & DIFFICULTY LEVEL ── */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Module Picker */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Interview Module</h1>
                <p className="text-xs text-zinc-400">Focus on an individual practice studio or run a full multi-round simulation.</p>
              </div>

              <div className="space-y-2.5">
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
            </div>

            {/* Difficulty Level Picker */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Select Difficulty Level</h2>
                <p className="text-xs text-zinc-400">Calibrates the depth, complexity, and Bar Raiser expectations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      difficulty === lvl.id
                        ? 'bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/30 text-white'
                        : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="font-bold text-sm text-white">{lvl.label}</p>
                      {difficulty === lvl.id && (
                        <span className="text-teal-400 font-bold text-xs">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
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

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-zinc-300">Target Duration</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '15', label: '15 Min', desc: 'Rapid Blitz' },
                  { id: '30', label: '30 Min', desc: 'Standard' },
                  { id: '45', label: '45 Min', desc: 'Deep Dive' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      duration === d.id
                        ? 'bg-teal-950 border-teal-500 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">{d.label}</p>
                    <p className="text-[10px] opacity-75">{d.desc}</p>
                  </button>
                ))}
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
                <span className="text-white font-bold">{customRoleText || selectedRole.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Module:</span>
                <span className="text-teal-400 font-bold">{selectedType.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Difficulty Level:</span>
                <span className="text-amber-400 font-bold">{difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Format:</span>
                <span className="text-emerald-400 font-bold">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Target Duration:</span>
                <span className="text-zinc-300 font-bold">{duration} Minutes</span>
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
