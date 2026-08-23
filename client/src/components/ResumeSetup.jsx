import React, { useState, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import {
  IconFileText,
  IconCheck,
  IconAlertCircle,
  IconLoader2,
  IconUpload,
  IconFilePlus,
  IconWorld,
  IconBrain,
  IconBriefcase,
  IconRocket,
  IconBrandGoogle,
  IconBrandAmazon,
  IconCircleCheck,
  IconX,
  IconEdit,
} from '@tabler/icons-react';

const QUICK_ROLES = [
  'Data Analyst',
  'Junior Data Scientist',
  'Full Stack Software Engineer',
  'AI / Machine Learning Engineer',
  'Frontend Developer (React)',
  'Backend Developer (Node/Python)',
  'Cloud / DevOps Engineer',
  'Product Manager',
];

const DIFFICULTY_LEVELS = [
  {
    id: 'Beginner',
    label: 'Beginner / Fresher',
    sub: '0-1 yrs exp • Foundational concepts & gentle pacing',
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    sub: '2-4 yrs exp • Real-world scenarios & standard industry bar',
  },
  {
    id: 'Experienced',
    label: 'Experienced / Senior',
    sub: '5+ yrs exp • System design, trade-offs & architectural depth',
  },
];

const COMPANY_TRACKS = [
  { id: 'General', label: 'Standard Industry Bar', sub: 'Balanced technical & HR round questions', icon: IconWorld },
  { id: 'Google', label: 'Google Track', sub: 'Algorithmic efficiency, time complexity & Googlyness', icon: IconBrandGoogle },
  { id: 'Amazon', label: 'Amazon Bar-Raiser', sub: '16 Leadership Principles, STAR drills & AWS scaling', icon: IconBrandAmazon },
  { id: 'McKinsey', label: 'McKinsey / Consulting', sub: 'Case studies, market sizing & quantitative logic', icon: IconBriefcase },
  { id: 'Stripe', label: 'Stripe / Fintech', sub: 'High-precision API design, concurrency & transactions', icon: IconRocket },
  { id: 'Meta', label: 'Meta Track', sub: 'Product architecture, real-time feeds & fast debugging', icon: IconBrain },
  { id: 'Mentor', label: 'Supportive Mentor', sub: 'Coaching style with encouraging tone & subtle hints' },
  { id: 'Founder', label: 'Startup Founder', sub: 'Fast-paced, pragmatic trade-offs & rapid execution' },
];

export default function ResumeSetup() {
  const {
    handleResumeSubmit,
    isLoading,
    error,
    clearError,
    setPhase,
    difficultyLevel,
    setDifficultyLevel,
    companyTrack,
    setCompanyTrack,
    BAR_RAISER_PERSONAS,
    interviewerPersona,
    setInterviewerPersona,
  } = useInterview();

  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'upload'
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(difficultyLevel || 'Intermediate');
  const [selectedCompany, setSelectedCompany] = useState(companyTrack || 'Amazon');
  const [selectedPersona, setSelectedPersona] = useState(interviewerPersona || BAR_RAISER_PERSONAS?.[0]);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const targetRoleRef = useRef(null);
  const resumeTextRef = useRef(null);

  const isSubmitDisabled = isLoading || !targetRole.trim();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    clearError();
    setDifficultyLevel(selectedLevel);
    setCompanyTrack(selectedCompany);
    if (selectedPersona && setInterviewerPersona) {
      setInterviewerPersona(selectedPersona);
    }
    await handleResumeSubmit(
      inputMode === 'paste' ? resumeText : '',
      inputMode === 'upload' ? file : null,
      targetRole.trim(),
      selectedLevel,
      selectedCompany,
      selectedPersona
    );
  };

  const handleTargetRoleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMode === 'paste' && resumeTextRef.current) {
        resumeTextRef.current.focus();
      } else if (targetRole.trim()) {
        handleSubmit();
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-900 select-none">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="setup" />

      {/* ── Main Form ── */}
      <main className="max-w-3xl mx-auto w-full px-6 py-10 flex-1 space-y-6 text-left">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Configure Your Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Choose your target role, company track / interview style, and difficulty level.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ⚡ 1-Click Instant Demo Profiles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <span>⚡</span> 1-Click Instant Demo Profiles (Test Immediately)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetRole('Senior Full Stack Engineer');
                  setSelectedCompany('Amazon');
                  setSelectedLevel('Experienced');
                  const p = (BAR_RAISER_PERSONAS || []).find((b) => b.id === 'amazon') || (BAR_RAISER_PERSONAS || [])[0];
                  if (p) setSelectedPersona(p);
                  setResumeText(`SENIOR FULL STACK SOFTWARE ENGINEER\nSummary: 5+ years building distributed web applications with React, TypeScript, Node.js, and AWS.\nExperience:\n- Architected real-time event streaming pipeline processing 12,000 req/sec with Redis & Kafka.\n- Reduced API p99 response times from 420ms to 65ms with multi-tiered Redis caching and Postgres read replicas.\n- Led migration of monolith to microservices on AWS ECS with zero downtime.\nSkills: TypeScript, React, Node.js, PostgreSQL, Redis, Docker, AWS, CI/CD.`);
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group cursor-pointer shadow-sm"
              >
                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">📦 Amazon Full Stack</p>
                <p className="text-[10px] text-slate-500 mt-0.5">React, Node, Kafka, AWS</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetRole('AI / LLM Systems Engineer');
                  setSelectedCompany('Google');
                  setSelectedLevel('Experienced');
                  const p = (BAR_RAISER_PERSONAS || []).find((b) => b.id === 'google') || (BAR_RAISER_PERSONAS || [])[0];
                  if (p) setSelectedPersona(p);
                  setResumeText(`AI & LLM SYSTEMS ENGINEER\nSummary: Machine Learning specialist in Transformer fine-tuning, RAG pipelines, and high-throughput inference.\nExperience:\n- Deployed enterprise RAG search system with pgvector and Milvus indexing 2M+ research papers at 18ms latency.\n- Fine-tuned open-source Llama-3-70B using LoRA and quantized with vLLM, saving $35k/mo in inference cost.\n- Designed evaluation framework measuring hallucination rate and semantic similarity.\nSkills: Python, PyTorch, LangChain, LlamaIndex, vLLM, Pinecone, Docker, FastAPI, Kubernetes.`);
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group cursor-pointer shadow-sm"
              >
                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">🌐 Google AI Engineer</p>
                <p className="text-[10px] text-slate-500 mt-0.5">PyTorch, RAG, vLLM, Python</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetRole('Startup Founding Engineer');
                  setSelectedCompany('YC Startup');
                  setSelectedLevel('Intermediate');
                  const p = (BAR_RAISER_PERSONAS || []).find((b) => b.id === 'yc') || (BAR_RAISER_PERSONAS || [])[0];
                  if (p) setSelectedPersona(p);
                  setResumeText(`FOUNDING FULL STACK ENGINEER\nSummary: Fast-shipping product engineer with experience taking products from 0 to 100k active users.\nExperience:\n- Built and launched full-stack SaaS product with Next.js, Supabase, and Stripe in 3 weeks.\n- Implemented real-time collaborative whiteboard using WebSockets with 60 FPS performance.\n- Optimized conversion funnel reducing signup churn by 28% through rigorous A/B experimentation.\nSkills: Next.js, React, TailwindCSS, Supabase, PostgreSQL, WebSockets, Stripe API.`);
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group cursor-pointer shadow-sm"
              >
                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">🚀 YC Startup Hacker</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Next.js, Supabase, Stripe</p>
              </button>
            </div>
          </div>

          {/* Target Role Input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-teal-700">
              🎯 Target Job Role
            </label>
            <input
              ref={targetRoleRef}
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={handleTargetRoleKeyDown}
              placeholder="e.g. Junior Data Scientist, Full Stack Developer, AI Engineer..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-3 text-sm text-slate-900 focus:outline-none shadow-sm"
              required
            />

            {/* Quick Pick Role Tags */}
            <div>
              <p className="text-[11px] text-slate-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      if (inputMode === 'paste') resumeTextRef.current?.focus();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      targetRole === role
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🏢 Target Company Culture & Bar Raiser Persona Matcher Studio */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <span>🏢</span> Target Company Culture & Bar Raiser Persona Matcher
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select your dream company to face their real hiring committee bar, culture principles, and interrogation style.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Active: {selectedPersona?.name} ({selectedPersona?.company})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {(BAR_RAISER_PERSONAS || []).map((persona) => {
                const isSelected = (selectedPersona?.id || selectedCompany) === persona.id || selectedCompany === persona.company;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(persona);
                      setSelectedCompany(persona.company);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/30 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{persona.avatar}</span>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{persona.name}</p>
                            <p className="text-xs text-teal-700 font-semibold">{persona.company}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                            SELECTED
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-800 mb-1">{persona.badge}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {persona.focus}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <p className="text-xs text-amber-800 font-sans italic truncate">
                        "{persona.catchphrase}"
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-teal-700">
              ⚡ Choose Interview Difficulty Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTY_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedLevel === lvl.id
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">{lvl.label}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{lvl.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target Job Description Paste (Optional) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-teal-700">
              📄 Target Job Description (JD) / LinkedIn Posting <span className="text-[10px] text-slate-500 font-normal normal-case">(Optional)</span>
            </label>
            <p className="text-[11px] text-slate-500">Paste the job posting to align questions with the exact tech stack & requirements.</p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Optional: Paste LinkedIn / Indeed job description here to tailor questions..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none shadow-sm"
            />
          </div>

          {/* Resume Input Mode Toggle (Optional) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                  <IconFileText className="w-3.5 h-3.5" />
                  <span>Resume / Experience</span> <span className="text-[10px] text-slate-500 font-normal normal-case">(Optional)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">Leave blank to use a standard curriculum for this role, or provide your resume.</p>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === 'paste'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>Paste Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === 'upload'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconUpload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {/* Paste Text Area */}
            {inputMode === 'paste' && (
              <div>
                <textarea
                  ref={resumeTextRef}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Paste your resume text here (experience, skills, projects, education)..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none shadow-sm"
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-mono">
                  <span>{resumeText.trim().length} characters</span>
                  {resumeText.trim().length > 50 && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <IconCheck className="w-3 h-3" /> Resume text loaded
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* File Upload Zone */}
            {inputMode === 'upload' && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-teal-500 bg-teal-50'
                      : file
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setFile(e.target.files[0]);
                    }}
                  />

                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <IconCircleCheck className="w-8 h-8 text-emerald-500" />
                      <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {(file.size / 1024).toFixed(1)} KB • Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <IconFilePlus className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-semibold text-slate-700">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-xs text-slate-400">Supports PDF, DOCX, or TXT (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-xs flex items-center gap-2">
              <IconAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full py-4 text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-all active:scale-98"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 className="animate-spin h-4 w-4 text-white" />
                AI Calibrating {selectedCompany} Track & 15 Questions...
              </span>
            ) : (
              `Start Calibration for ${selectedCompany} (${selectedLevel}) →`
            )}
          </button>
        </form>
      </main>

      <footer className="py-4 border-t border-slate-200 bg-white text-center" />
    </div>
  );
}

