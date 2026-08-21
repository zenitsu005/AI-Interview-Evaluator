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
    setTargetRole,
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
  const [audioConsent, setAudioConsent] = useState(true);
  const [micState, setMicState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [launchError, setLaunchError] = useState(null);

  // Auto-check mic permissions on step 3
  useEffect(() => {
    if (step === 3 || step === 4) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'microphone' })
          .then((permissionStatus) => {
            setMicState(permissionStatus.state);
            permissionStatus.onchange = () => setMicState(permissionStatus.state);
          })
          .catch(() => setMicState('prompt'));
      }
    }
  }, [step]);

  const handleLaunchSession = async (fallbackToText = false) => {
    setLaunchError(null);
    const chosenFormat = fallbackToText ? 'text-only' : selectedFormat.id;
    const effectiveMode = chosenFormat === 'text-only' ? 'text' : 'video';

    if (chosenFormat === 'voice-transcript' && !audioConsent) {
      setLaunchError('Please confirm the audio consent checkbox before proceeding to the live audio session.');
      return;
    }

    try {
      const finalRoleTitle = customRoleText.trim() || selectedRole.title;
      if (typeof setTargetRole === 'function') setTargetRole(finalRoleTitle);
      if (typeof setDifficultyLevel === 'function') setDifficultyLevel(difficulty);
      if (typeof setInterviewMode === 'function') setInterviewMode(effectiveMode);

      if (selectedPersona) {
        if (typeof setInterviewerPersona === 'function') setInterviewerPersona(selectedPersona);
        if (typeof setCompanyTrack === 'function') setCompanyTrack(selectedPersona.company || 'General');
      }

      if (typeof startInterview === 'function') {
        await startInterview({
          targetRole: finalRoleTitle,
          difficultyLevel: difficulty,
          interviewerPersona: selectedPersona || BAR_RAISER_PERSONAS?.[0],
          companyTrack: selectedPersona?.company || 'General',
          interviewMode: effectiveMode,
          duration: duration || '15',
        });
      }
    } catch (err) {
      setLaunchError(err?.message || 'Failed to initialize the mock interview session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white select-none">
      <AppNavbar currentActive="setup" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-left">
        
        {/* Breadcrumb Steps Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-2 text-xs font-sans">
          <div className="flex items-center gap-2 text-slate-500">
            <span className={step >= 1 ? 'text-teal-700 font-bold' : ''}>1. Target Role</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-teal-700 font-bold' : ''}>2. Level & Bar Raiser</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-teal-700 font-bold' : ''}>3. Input Format</span>
            <span>→</span>
            <span className={step >= 4 ? 'text-teal-700 font-bold' : ''}>4. Review & Consent</span>
          </div>
          <span className="text-slate-500 font-medium">Step {step} of 4</span>
        </div>

        {/* ── STEP 1: TARGET ROLE CONFIGURATION ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Select or Type Target Engineering Role
              </h1>
              <p className="text-sm text-slate-500">
                Type your specific specialization or click a suggestion below.
              </p>
            </div>

            {/* Custom Role Input Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider">
                ✏️ Target Role / Tech Stack (Type Freely):
              </label>
              <input
                type="text"
                value={customRoleText}
                onChange={(e) => {
                  setCustomRoleText(e.target.value);
                  setSelectedRole({ id: 'custom', title: e.target.value || 'Custom Role', level: 'Custom Role' });
                }}
                placeholder="e.g. Backend Engineer (Go/Rust), Full Stack Developer, ML Engineer..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 rounded-xl p-3.5 text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-sans shadow-sm"
              />

              {/* Popular Role Chips */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setCustomRoleText(chip);
                        setSelectedRole({ id: 'custom', title: chip, level: chip });
                      }}
                      className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        customRoleText === chip
                          ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Or pick standard track
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
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
                  className={`p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    customRoleText === role.title
                      ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold text-sm sm:text-base text-slate-900">{role.title}</p>
                    {customRoleText === role.title && (
                      <span className="text-teal-700 font-bold text-xs">✓ Selected</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">{role.level}</p>
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
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Select Difficulty Level</h1>
                <p className="text-sm text-slate-500">Calibrates technical depth, rubric rigor, and follow-up probes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      difficulty === lvl.id
                        ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20 text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="font-bold text-sm sm:text-base text-slate-900">{lvl.label}</p>
                      {difficulty === lvl.id && (
                        <span className="text-teal-700 font-bold text-xs">✓</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Raiser Persona Track */}
            {BAR_RAISER_PERSONAS && BAR_RAISER_PERSONAS.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Select Interviewer Persona & Track</h2>
                  <p className="text-sm text-slate-500">Simulates real interview styles from top-tier tech firms.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BAR_RAISER_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p)}
                      className={`p-4 sm:p-5 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        selectedPersona?.id === p.id
                          ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
                      }`}
                    >
                      <span className="text-3xl flex-shrink-0 mt-0.5">{p.avatar}</span>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm sm:text-base text-slate-900 truncate">{p.name}</p>
                          <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{p.company}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-snug">{p.title}</p>
                        <p className="text-xs sm:text-sm text-teal-800 font-sans leading-relaxed mt-1.5 font-normal">{p.focus}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Select Input Format & Timing</h1>
              <p className="text-sm text-slate-500">Choose between live audio analysis or quiet text-only mode.</p>
            </div>

            <div className="space-y-3">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedFormat.id === fmt.id
                      ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm sm:text-base text-slate-900">{fmt.title}</p>
                    <p className="text-xs sm:text-sm text-slate-600">{fmt.desc}</p>
                  </div>
                  {selectedFormat.id === fmt.id && <span className="text-teal-700 font-bold text-sm">✓ Selected</span>}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs sm:text-sm font-bold text-slate-700">Target Duration</label>
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
                    className={`p-3.5 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      duration === d.id
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold ring-1 ring-teal-500/50 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{d.label}</p>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{d.count}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Review & Launch Mock Interview</h1>
              <p className="text-sm text-slate-500">Confirm your session parameters and audio consent prior to launch.</p>
            </div>

            {/* Error Banner */}
            {launchError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                ⚠️ {launchError}
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6 rounded-2xl space-y-3 text-xs sm:text-sm font-sans">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Target Role:</span>
                <span className="text-slate-900 font-bold">{customRoleText || selectedRole.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Difficulty Level:</span>
                <span className="text-amber-700 font-bold">{difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Interviewer Persona:</span>
                <span className="text-teal-700 font-bold">{selectedPersona?.name} ({selectedPersona?.company})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Format:</span>
                <span className="text-teal-700 font-bold">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Session Length:</span>
                <span className="text-slate-900 font-bold">
                  {duration === '15' ? '15 Min (3 Qs / Round • 9 Total)' : duration === '45' ? '45 Min (7 Qs / Round • 21 Total)' : '30 Min (5 Qs / Round • 15 Total)'}
                </span>
              </div>
            </div>

            {/* Microphone Permission Status Banner */}
            {selectedFormat.id !== 'text-only' && (
              <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
                micState === 'granted'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div>
                  <p className="font-bold">Microphone Access Status:</p>
                  <p className="text-xs opacity-90">
                    {micState === 'granted'
                      ? '✓ Browser microphone permission granted.'
                      : '⚠️ Microphone not detected or permission pending.'}
                  </p>
                </div>
                {micState !== 'granted' && (
                  <button
                    onClick={() => handleLaunchSession(true)}
                    className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-sm cursor-pointer"
                  >
                    Switch to Text-Only Mode
                  </button>
                )}
              </div>
            )}

            {/* Explicit Audio Privacy Consent Checkbox */}
            {selectedFormat.id !== 'text-only' && (
              <label className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioConsent}
                  onChange={(e) => setAudioConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  <span className="font-bold text-slate-900">Explicit Audio Consent: </span>
                  I understand that my audio may be processed to generate a live transcript and practice feedback. You can stop anytime. Read our{' '}
                  <button type="button" onClick={() => onNavigate('privacy')} className="text-teal-700 underline font-semibold">Privacy Policy</button>{' '}
                  or learn about <button type="button" onClick={() => onNavigate('privacy')} className="text-teal-700 underline font-semibold">Data Deletion</button>.
                </div>
              </label>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
              >
                ← Back
              </button>

              <button
                onClick={() => handleLaunchSession(false)}
                className="py-3.5 px-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
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
