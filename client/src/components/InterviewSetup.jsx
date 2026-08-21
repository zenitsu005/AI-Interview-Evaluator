import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';

const ROLES = [
  {
    id: 'backend',
    title: 'Backend & Systems Engineer',
    level: 'Go / Python / Java • Microservices, Concurrency & SQL',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Software Engineer',
    level: 'React / Next.js, Node.js / Python, REST/GraphQL APIs',
  },
  {
    id: 'frontend',
    title: 'Frontend & UI Architecture Engineer',
    level: 'React, TypeScript, Web Vitals, State Management',
  },
  {
    id: 'ai-ml',
    title: 'Machine Learning & AI Engineer',
    level: 'PyTorch, LLM Orchestration, RAG, Vector Search & Python',
  },
  {
    id: 'devops',
    title: 'DevOps & SRE Cloud Engineer',
    level: 'Kubernetes, Docker, Terraform, AWS / GCP, CI/CD Pipelines',
  },
  {
    id: 'mobile',
    title: 'Mobile Applications Engineer',
    level: 'iOS (Swift) / Android (Kotlin) / React Native',
  },
  {
    id: 'staff',
    title: 'Staff / Principal Architect (L6+)',
    level: 'High-Scale Distributed Design, Scalability & Cross-Team Strategy',
  },
  {
    id: 'em',
    title: 'Engineering Manager / Tech Lead',
    level: 'Architecture Vision, Team Delivery, People Leadership',
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

const LEVELS = [
  {
    id: 'Beginner',
    label: '🟢 Easy (Foundation)',
    desc: 'Core fundamentals, gentle guidance, and foundational concepts.',
  },
  {
    id: 'Intermediate',
    label: '🟡 Medium (Standard Tech)',
    desc: 'Realistic production scenarios, edge case handling, and optimal patterns.',
  },
  {
    id: 'Experienced',
    label: '🔴 Hard (Staff / Bar Raiser)',
    desc: 'High concurrency, distributed scalability trade-offs, and intense deep dives.',
  },
];

const FORMATS = [
  { id: 'voice-transcript', title: 'Voice + Live Transcript', desc: 'Real-time speech transcription with vocal telemetry.' },
  { id: 'text-only', title: 'Text-Only Mode', desc: 'Type your responses directly without microphone access.' },
];

export default function InterviewSetup({ onNavigate }) {
  const {
    setRole,
    setDifficultyLevel,
    setCompanyTrack,
    setInterviewerPersona,
    setInterviewMode,
    BAR_RAISER_PERSONAS,
    startInterview,
    isLoading: contextLoading,
  } = useInterview();

  const [step, setStep] = useState(1);
  const [customRoleText, setCustomRoleText] = useState(ROLES[0].title);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [selectedPersona, setSelectedPersona] = useState(BAR_RAISER_PERSONAS?.[0] || null);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [duration, setDuration] = useState('15');
  const [audioConsent, setAudioConsent] = useState(false);
  const [micState, setMicState] = useState('checking');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState(null);

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

    try {
      const targetRoleTitle = customRoleText.trim() || selectedRole.title;
      const selectedCompany = selectedPersona?.company || 'General';
      const selectedMode = forceTextMode || selectedFormat.id === 'text-only' ? 'text' : 'video';

      // Synchronous instant launch (<10ms) with explicit duration calibration
      startInterview({
        duration: duration || '15',
        targetRole: targetRoleTitle,
        difficultyLevel: difficulty,
        companyTrack: selectedCompany,
        interviewerPersona: selectedPersona,
        interviewMode: selectedMode,
      });
    } catch (err) {
      console.error('Launch interview error:', err);
      setLaunchError(err.message || 'Failed to start interview session. Please try again.');
    }
  };



  return (
    <div className="min-h-screen bg-[#0B0B0E] text-zinc-100 flex flex-col justify-between select-none">
      <AppNavbar currentActive="setup" />

      <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-8 text-left flex-1">
        {/* Step Indicator Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className={step >= 1 ? 'text-teal-400 font-bold' : ''}>1. Target Role</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-teal-400 font-bold' : ''}>2. Level & Bar Raiser</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-teal-400 font-bold' : ''}>3. Input Format</span>
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
              <p className="text-xs text-zinc-400">Type your specific specialization or click a suggestion below.</p>
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
                Continue to Level & Persona →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: DIFFICULTY LEVEL & BAR RAISER PERSONA ── */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Difficulty Level Picker */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select Difficulty Level</h1>
                <p className="text-xs text-zinc-400">Calibrates the technical depth, rubric rigor, and follow-up probes.</p>
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

            {/* Bar Raiser Persona Track */}
            {BAR_RAISER_PERSONAS && BAR_RAISER_PERSONAS.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Select Interviewer Persona & Track</h2>
                  <p className="text-xs text-zinc-400">Simulates real interview styles from top-tier tech firms.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BAR_RAISER_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        selectedPersona?.id === p.id
                          ? 'bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/30 text-white'
                          : 'bg-[#131318] border-white/5 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span className="text-2xl">{p.avatar}</span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs sm:text-sm text-white">{p.name}</p>
                          <span className="text-[10px] font-mono text-zinc-400">{p.company}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{p.title}</p>
                        <p className="text-[10px] text-teal-300/80 font-mono mt-1">{p.focus}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  { id: '15', label: '15 Min', desc: '3 Qs / Round', count: '9 Questions Total' },
                  { id: '30', label: '30 Min', desc: '5 Qs / Round', count: '15 Questions Total' },
                  { id: '45', label: '45 Min', desc: '7 Qs / Round', count: '21 Questions Total' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      duration === d.id
                        ? 'bg-teal-950 border-teal-500 text-white font-bold ring-1 ring-teal-500/50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{d.label}</p>
                    <p className="text-[11px] font-mono text-teal-400 font-semibold mt-0.5">{d.count}</p>
                    <p className="text-[10px] text-zinc-400 opacity-80 mt-0.5">{d.desc}</p>
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Review & Launch Mock Interview</h1>
              <p className="text-xs text-zinc-400">Confirm your session parameters and audio consent prior to launch.</p>
            </div>

            {/* Error Banner */}
            {launchError && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                ⚠️ {launchError}
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-[#131318] border border-white/5 p-5 rounded-2xl space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Target Role:</span>
                <span className="text-white font-bold">{customRoleText || selectedRole.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Difficulty Level:</span>
                <span className="text-amber-400 font-bold">{difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Interviewer Persona:</span>
                <span className="text-teal-400 font-bold">{selectedPersona?.name} ({selectedPersona?.company})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Format:</span>
                <span className="text-emerald-400 font-bold">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Session Length:</span>
                <span className="text-zinc-200 font-bold">
                  {duration === '15' ? '15 Min (3 Qs / Round • 9 Total)' : duration === '45' ? '45 Min (7 Qs / Round • 21 Total)' : '30 Min (5 Qs / Round • 15 Total)'}
                </span>
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
