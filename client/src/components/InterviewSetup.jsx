import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Mic,
  FileText,
  Sliders,
  Cpu,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  UserCheck,
  Shield,
  Brain,
} from 'lucide-react';

const ROLES = [
  {
    id: 'backend',
    title: 'Backend & Systems Engineer',
    level: 'Go / Python / Java • Microservices, Concurrency & SQL',
    icon: Cpu,
  },
  {
    id: 'fullstack',
    title: 'Full Stack Software Engineer',
    level: 'React / Next.js, Node.js / Python, REST/GraphQL APIs',
    icon: Layers,
  },
  {
    id: 'frontend',
    title: 'Frontend & UI Architecture Engineer',
    level: 'React, TypeScript, Web Vitals, State Management',
    icon: Sparkles,
  },
  {
    id: 'ai-ml',
    title: 'Machine Learning & AI Engineer',
    level: 'PyTorch, LLM Orchestration, RAG, Vector Search & Python',
    icon: Sparkles,
  },
  {
    id: 'devops',
    title: 'DevOps & SRE Cloud Engineer',
    level: 'Kubernetes, Docker, Terraform, AWS / GCP, CI/CD Pipelines',
    icon: Sliders,
  },
  {
    id: 'mobile',
    title: 'Mobile Applications Engineer',
    level: 'iOS (Swift) / Android (Kotlin) / React Native',
    icon: Layers,
  },
  {
    id: 'staff',
    title: 'Staff / Principal Architect (L6+)',
    level: 'High-Scale Distributed Design, Scalability & Cross-Team Strategy',
    icon: Shield,
  },
  {
    id: 'em',
    title: 'Engineering Manager / Tech Lead',
    level: 'Architecture Vision, Team Delivery, People Leadership',
    icon: UserCheck,
  },
];

const POPULAR_CHIPS = [
  'Full Stack (React/Node)',
  'Backend Engineer (Go/Python)',
  'Frontend (Next.js)',
  'AI / ML Engineer',
  'DevOps / SRE',
  'Staff Architect',
];

const LEVELS = [
  {
    id: 'Beginner',
    label: 'Junior / Entry Level',
    color: 'border-teal-500/40 text-teal-400 bg-teal-950/40',
    desc: 'Core data structures, fundamental concepts, and standard problem solving.',
  },
  {
    id: 'Intermediate',
    label: 'Mid-Level Engineer',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
    desc: 'Real-world scenarios, edge-case handling, and optimal time complexity.',
  },
  {
    id: 'Experienced',
    label: 'Senior / Lead Engineer',
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    desc: 'System architecture trade-offs, scalability, and deep technical probing.',
  },
];

const FORMATS = [
  { id: 'voice-transcript', title: 'Live AI Voice + Visual Transcript', desc: 'Real-time neural speech conversation with speech analysis.', icon: Mic },
  { id: 'text-only', title: 'Quiet Text-Only Mode', desc: 'Type your responses directly without microphone access.', icon: FileText },
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
  const [micState, setMicState] = useState('prompt');
  const [launchError, setLaunchError] = useState(null);

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
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-black select-none">
      <AppNavbar currentActive="setup" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-left">
        
        {/* Breadcrumb Steps Header */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className={step >= 1 ? 'text-teal-400 font-bold' : ''}>1. Target Role</span>
            <span>➔</span>
            <span className={step >= 2 ? 'text-teal-400 font-bold' : ''}>2. Level & Persona</span>
            <span>➔</span>
            <span className={step >= 3 ? 'text-teal-400 font-bold' : ''}>3. Input Format</span>
            <span>➔</span>
            <span className={step >= 4 ? 'text-teal-400 font-bold' : ''}>4. Review & Consent</span>
          </div>
          <span className="text-slate-400 font-medium bg-[#171E2D] px-2.5 py-1 rounded-full border border-white/10">
            Step {step} of 4
          </span>
        </div>

        {/* ── STEP 1: TARGET ROLE CONFIGURATION ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Select or Type Target Engineering Role
              </h1>
              <p className="text-sm text-slate-400">
                Type your specific specialization or click a suggestion below to calibrate the interview.
              </p>
            </div>

            {/* Custom Role Input Box */}
            <div className="p-5 rounded-3xl bg-[#131823] border border-white/10 shadow-2xl space-y-4">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
                Target Role / Tech Stack (Type Freely):
              </label>
              <input
                type="text"
                value={customRoleText}
                onChange={(e) => {
                  setCustomRoleText(e.target.value);
                  setSelectedRole({ id: 'custom', title: e.target.value || 'Custom Role', level: 'Custom Role' });
                }}
                placeholder="e.g. Backend Engineer (Go/Rust), Full Stack Developer, ML Engineer..."
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-2xl p-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-sans shadow-inner"
              />

              {/* Popular Role Chips */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Quick Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setCustomRoleText(chip);
                        setSelectedRole({ id: 'custom', title: chip, level: chip });
                      }}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        customRoleText === chip
                          ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20'
                          : 'bg-[#171E2D] hover:bg-[#1E273A] border-white/10 text-slate-300 font-medium'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Or pick standard track
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Role Domain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon || Cpu;
                const isSelected = customRoleText === role.title;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setCustomRoleText(role.title);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-400/80 ring-2 ring-teal-500/30 text-white shadow-xl shadow-teal-950/60'
                        : 'bg-[#131823] border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-teal-500 text-slate-950' : 'bg-[#171E2D] text-teal-400 border border-white/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm sm:text-base text-white">{role.title}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">{role.level}</p>
                    </div>
                  </button>
                );
              })}
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
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Continue to Level & Persona</span>
                <ArrowRight className="w-4 h-4" />
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
                <p className="text-sm text-slate-400">Calibrates technical depth, rubric rigor, and cross-examination probing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEVELS.map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDifficulty(lvl.id)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? `${lvl.color} ring-2 ring-teal-500/30 shadow-xl`
                          : 'bg-[#131823] border-white/10 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <p className="font-bold text-sm sm:text-base text-white">{lvl.label}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">{lvl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bar Raiser Persona Track */}
            {BAR_RAISER_PERSONAS && BAR_RAISER_PERSONAS.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">Select Interviewer Persona & Track</h2>
                  <p className="text-sm text-slate-400">Simulates real interview nuances and evaluation archetypes from top tech companies.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BAR_RAISER_PERSONAS.map((p) => {
                    const isSelected = selectedPersona?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPersona(p)}
                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-950/40 border-teal-400/80 ring-2 ring-teal-500/30 text-white shadow-xl shadow-teal-950/60'
                            : 'bg-[#131823] border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0 shadow-md">
                          <Brain className="w-6 h-6 text-teal-400" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-sm sm:text-base text-white truncate">{p.name}</p>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-teal-400 flex-shrink-0 font-mono">
                              {p.company}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">{p.title}</p>
                          <p className="text-xs text-teal-300/90 font-sans leading-relaxed mt-1 font-normal">{p.focus}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Continue to Format</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: FORMAT & TIMING ── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select Input Format & Timing</h1>
              <p className="text-sm text-slate-400">Choose between natural AI voice conversation or quiet text-only mode.</p>
            </div>

            <div className="space-y-3">
              {FORMATS.map((fmt) => {
                const Icon = fmt.icon || Mic;
                const isSelected = selectedFormat.id === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-400/80 ring-2 ring-teal-500/30 text-white shadow-xl'
                        : 'bg-[#131823] border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-teal-500 text-slate-950' : 'bg-[#171E2D] text-teal-400 border border-white/10'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm sm:text-base text-white">{fmt.title}</p>
                        <p className="text-xs text-slate-400">{fmt.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" /> Target Duration & Length
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '15', label: '15 Min', desc: '3 Qs / Round', count: '9 Questions Total' },
                  { id: '30', label: '30 Min', desc: '5 Qs / Round', count: '15 Questions Total' },
                  { id: '45', label: '45 Min', desc: '7 Qs / Round', count: '21 Questions Total' },
                ].map((d) => {
                  const isSelected = duration === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDuration(d.id)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-950/60 border-teal-400 text-white font-bold ring-2 ring-teal-500/30 shadow-lg'
                          : 'bg-[#131823] border-white/10 text-slate-300 hover:bg-[#171E2D]'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-bold text-white">{d.label}</p>
                      <p className="text-xs font-semibold text-teal-400 mt-1 font-mono">{d.count}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{d.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Review & Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: REVIEW & PRIVACY CONSENT ── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Review & Launch Mock Interview</h1>
              <p className="text-sm text-slate-400">Confirm your session parameters and audio consent prior to launch.</p>
            </div>

            {/* Error Banner */}
            {launchError && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>{launchError}</span>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-[#131823] border border-white/10 shadow-2xl p-6 rounded-3xl space-y-3.5 text-xs sm:text-sm font-sans">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Target Role:</span>
                <span className="text-white font-bold">{customRoleText || selectedRole.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Difficulty Level:</span>
                <span className="text-amber-400 font-bold">{difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Interviewer Persona:</span>
                <span className="text-teal-300 font-bold">{selectedPersona?.name} ({selectedPersona?.company})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Format:</span>
                <span className="text-teal-300 font-bold">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session Length:</span>
                <span className="text-white font-bold font-mono">
                  {duration === '15' ? '15 Min (3 Qs / Round • 9 Total)' : duration === '45' ? '45 Min (7 Qs / Round • 21 Total)' : '30 Min (5 Qs / Round • 15 Total)'}
                </span>
              </div>
            </div>

            {/* Microphone Status Banner */}
            {selectedFormat.id !== 'text-only' && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between ${
                micState === 'granted'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Microphone Status:</p>
                    <p className="text-xs opacity-80">
                      {micState === 'granted'
                        ? 'Browser microphone permission ready.'
                        : 'Microphone permission will prompt upon starting.'}
                    </p>
                  </div>
                </div>
                {micState !== 'granted' && (
                  <button
                    onClick={() => handleLaunchSession(true)}
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Switch to Text Mode
                  </button>
                )}
              </div>
            )}

            {/* Audio Consent */}
            {selectedFormat.id !== 'text-only' && (
              <label className="flex items-start gap-3 bg-[#131823] p-4 rounded-2xl border border-white/10 shadow-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioConsent}
                  onChange={(e) => setAudioConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-[#0D111A] border-white/20 text-teal-500 focus:ring-teal-500"
                />
                <div className="text-xs text-slate-300 leading-relaxed text-pretty">
                  <span className="font-bold text-white">Explicit Audio Consent: </span>
                  I understand that my speech is transcribed locally/via AI for interview evaluation metrics.
                </div>
              </label>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => handleLaunchSession(false)}
                className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-xl shadow-teal-500/30 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Launch Mock Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
