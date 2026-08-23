import React, { useState, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { optimizeResume, uploadResume } from '../services/api';
import AppNavbar from './AppNavbar';
import {
  IconFileText as FileText,
  IconUpload as Upload,
  IconSparkles as Sparkles,
  IconCircleCheck as CheckCircle2,
  IconCopy as Copy,
  IconPrinter as Printer,
  IconArrowRight as ArrowRight,
  IconAlertTriangle as AlertTriangle,
  IconCheck as Check,
  IconStack2 as Layers,
  IconBriefcase as Briefcase,
  IconFileCheck as FileCheck,
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

export default function ResumeOptimizer() {
  const { setPhase, handleResumeSubmit, setTargetRole: setGlobalTargetRole } = useInterview();

  const [inputTab, setInputTab] = useState('existing'); // 'existing' | 'form'
  const [targetRole, setTargetRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Field Refs for Auto-Moving to Next Field on Enter
  const targetRoleRef = useRef(null);
  const resumeTextRef = useRef(null);
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);

  // Form Details State (for building from scratch)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Auto-focus next field on Enter press
  const handleFieldKeyDown = (e, nextRef, isLastField = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLastField) {
        handleAnalyzeAndOptimize(e);
      } else if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyzeAndOptimize = async (e) => {
    e?.preventDefault();
    if (!targetRole.trim()) {
      setError('Please specify your target job role.');
      targetRoleRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopied(false);

    try {
      let textToSend = resumeText;
      if (inputTab === 'existing' && file) {
        const uploadRes = await uploadResume(file);
        textToSend = uploadRes.resumeText;
        setResumeText(textToSend);
      }

      const res = await optimizeResume({
        resumeText: inputTab === 'existing' ? textToSend : '',
        targetRole: targetRole.trim(),
        userDetails: inputTab === 'form' ? formData : {},
      });

      setAtsResult(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze and optimize resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterviewWithOptimized = async () => {
    if (!atsResult?.optimizedResume) return;
    setIsStartingInterview(true);
    setError(null);
    try {
      const resume = atsResult.optimizedResume;
      const constructedText = `
Name: ${resume.fullName || 'Candidate'}
Target Role: ${targetRole}
Professional Summary: ${resume.professionalSummary || ''}
Technical Skills: ${(resume.skills?.technicalSkills || []).join(', ')}
Tools: ${(resume.skills?.frameworksAndTools || []).join(', ')}
Experience: ${(resume.experience || []).map((e) => `${e.role || ''} at ${e.company || ''}: ${(e.bullets || []).join(' ')}`).join('\n')}
Projects: ${(resume.projects || []).map((p) => `${p.title || ''}: ${p.description || ''}`).join('\n')}
Education: ${(resume.education || []).map((ed) => `${ed.degree || ''} ${ed.institution || ''}`).join('\n')}
      `.trim();

      await handleResumeSubmit(constructedText, null, targetRole.trim(), 'Intermediate');
    } catch (err) {
      setError(err.message || 'Failed to start interview.');
      setIsStartingInterview(false);
    }
  };

  const copyAsMarkdown = () => {
    if (!atsResult?.optimizedResume) return;
    const r = atsResult.optimizedResume;
    const md = `
# ${r.fullName}
${r.contactInfo?.email} | ${r.contactInfo?.phone} | ${r.contactInfo?.location} | ${r.contactInfo?.linkedin} | ${r.contactInfo?.github}

## Professional Summary
${r.professionalSummary}

## Core Competencies & Skills
- **Technical Skills**: ${(r.skills?.technicalSkills || []).join(', ')}
- **Tools & Frameworks**: ${(r.skills?.frameworksAndTools || []).join(', ')}
- **Methodologies**: ${(r.skills?.methodologies || []).join(', ')}

## Professional Experience
${(r.experience || [])
  .map(
    (exp) => `
### ${exp.role} — ${exp.company}
*${exp.duration} | ${exp.location}*
${(exp.bullets || []).map((b) => `- ${b}`).join('\n')}
`
  )
  .join('\n')}

## Key Projects
${(r.projects || [])
  .map(
    (p) => `
- **${p.title}** (${(p.technologies || []).join(', ')}): ${p.description}
`
  )
  .join('\n')}

## Education & Certifications
${(r.education || []).map((ed) => `- **${ed.degree}**, ${ed.institution} (${ed.year}) ${ed.details ? `— ${ed.details}` : ''}`).join('\n')}
${(r.certifications || []).map((c) => `- ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-700/60 bg-green-950/40';
    if (score >= 50) return 'text-yellow-400 border-yellow-700/60 bg-yellow-950/40';
    return 'text-red-400 border-red-700/60 bg-red-950/40';
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Universal Top Bar */}
      <AppNavbar currentActive="resume-builder" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8 flex-1 text-left">
        {/* Header Hero */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/30 text-teal-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-1 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Free ATS Audit & High-Impact Resume Rewrite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Optimize Your Resume for 90+ ATS Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Press <kbd className="px-2 py-0.5 rounded bg-[#171E2D] border border-white/10 text-teal-300 font-mono text-[10px]">Enter ↵</kbd> in any field to move directly to the next input.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Target Role Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teal-400 mb-2 font-mono flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Target Job Role to Optimize Against
            </label>
            <input
              ref={targetRoleRef}
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={(e) =>
                handleFieldKeyDown(
                  e,
                  inputTab === 'existing' ? resumeTextRef : fullNameRef
                )
              }
              placeholder="e.g. Full Stack Developer, Data Analyst, Machine Learning Engineer..."
              className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none mb-3 shadow-inner"
              required
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setTargetRole(role);
                    if (inputTab === 'existing') resumeTextRef.current?.focus();
                    else fullNameRef.current?.focus();
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    targetRole === role
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md'
                      : 'bg-[#171E2D] text-slate-300 border-white/10 hover:bg-[#1E273A] hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#0D111A] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setInputTab('existing')}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                inputTab === 'existing'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload / Paste Existing Resume</span>
            </button>
            <button
              type="button"
              onClick={() => setInputTab('form')}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                inputTab === 'form'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Enter Details from Scratch</span>
            </button>
          </div>

          {/* Mode 1: Existing Resume (Paste or Upload) */}
          {inputTab === 'existing' && (
            <div className="space-y-4">
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-teal-400 bg-teal-950/40'
                      : file
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-white/10 bg-[#0D111A] hover:bg-[#171E2D]'
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
                    <div className="flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      <p className="font-bold text-white text-xs">{file.name}</p>
                      <p className="text-[11px] text-slate-400">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload className="w-8 h-8 text-teal-400 opacity-80" />
                      <p className="text-xs font-bold text-white">
                        Upload your current PDF or DOCX resume (Optional)
                      </p>
                      <p className="text-[11px] text-slate-400">Or paste text below</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  Or Paste Resume Content
                </label>
                <textarea
                  ref={resumeTextRef}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e, null, true)}
                  placeholder="Paste your existing resume text, work experience, bullets, and skills here..."
                  rows={6}
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Mode 2: Details Form with Sequential Enter Navigation */}
          {inputTab === 'form' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Full Name
                </label>
                <input
                  ref={fullNameRef}
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, emailRef)}
                  placeholder="e.g. Candidate Name"
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Email & Phone
                </label>
                <input
                  ref={emailRef}
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, skillsRef)}
                  placeholder="candidate@domain.com | +1 555-0199"
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Core Skills & Technologies
                </label>
                <input
                  ref={skillsRef}
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, experienceRef)}
                  placeholder="e.g. Python, SQL, React, AWS, Docker, Machine Learning"
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Work Experience (Past Roles & Tasks)
                </label>
                <textarea
                  ref={experienceRef}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, projectsRef)}
                  placeholder="e.g. Junior Data Analyst at TechCorp: Built ETL pipelines in Python, created dashboards"
                  rows={4}
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Projects & Education
                </label>
                <textarea
                  ref={projectsRef}
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, null, true)}
                  placeholder="e.g. Customer Churn Prediction (Python, Scikit-learn). B.S. in Computer Science"
                  rows={3}
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none shadow-inner"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAnalyzeAndOptimize}
            disabled={isLoading || !targetRole.trim()}
            className="w-full py-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-xl shadow-teal-500/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Auditing ATS Compliance & Rewriting Bullets...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Audit ATS Score & Generate Optimized Resume (Press Enter ↵)</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>

        {/* ATS Results & Output Section */}
        {atsResult && (
          <div className="space-y-6 animate-fade-in">
            {/* ATS Score Overview Grid */}
            <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${
                    atsResult.atsScore >= 80
                      ? 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60'
                      : atsResult.atsScore >= 50
                      ? 'text-amber-300 border-amber-500/40 bg-amber-950/60'
                      : 'text-rose-300 border-rose-500/40 bg-rose-950/60'
                  }`}>
                    <span className="text-3xl font-mono">{atsResult.atsScore}</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider opacity-80">ATS Score</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-white">ATS Compatibility Audit</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Role: <strong className="text-white">{targetRole}</strong> • Rating:{' '}
                      <strong className="text-teal-400 font-mono">{atsResult.atsRating || 'Strong'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copyAsMarkdown}
                    className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 rounded-xl shadow-sm cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Resume'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 rounded-xl shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-2 font-mono">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Keyword Match</span>
                    <span className="font-bold text-white">{atsResult.keywordMatchScore || 85}/100</span>
                  </div>
                  <div className="h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${atsResult.keywordMatchScore || 85}%` }} />
                  </div>
                </div>

                <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-2 font-mono">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Action Verbs & Metrics</span>
                    <span className="font-bold text-white">{atsResult.impactScore || 90}/100</span>
                  </div>
                  <div className="h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${atsResult.impactScore || 90}%` }} />
                  </div>
                </div>

                <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-2 font-mono">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Formatting & Structure</span>
                    <span className="font-bold text-white">{atsResult.formattingScore || 95}/100</span>
                  </div>
                  <div className="h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${atsResult.formattingScore || 95}%` }} />
                  </div>
                </div>
              </div>

              {/* Missing Keywords Pills */}
              {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                <div className="pt-5 border-t border-white/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> High-Priority ATS Keywords Injected:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-300 shadow-sm"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ATS Resume Preview */}
            {atsResult.optimizedResume && (
              <div className="bg-[#131823] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 text-slate-300 font-sans shadow-2xl">
                {/* Resume Header */}
                <div className="text-center pb-5 border-b border-white/10">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
                    {atsResult.optimizedResume.fullName || 'Candidate Name'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-2 space-x-2 font-mono">
                    {atsResult.optimizedResume.contactInfo?.email && <span>{atsResult.optimizedResume.contactInfo.email}</span>}
                    {atsResult.optimizedResume.contactInfo?.phone && (
                      <>
                        <span>•</span>
                        <span>{atsResult.optimizedResume.contactInfo.phone}</span>
                      </>
                    )}
                    {atsResult.optimizedResume.contactInfo?.location && (
                      <>
                        <span>•</span>
                        <span>{atsResult.optimizedResume.contactInfo.location}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-teal-400 mt-1 space-x-3 font-mono">
                    {atsResult.optimizedResume.contactInfo?.linkedin && <span>{atsResult.optimizedResume.contactInfo.linkedin}</span>}
                    {atsResult.optimizedResume.contactInfo?.github && <span>{atsResult.optimizedResume.contactInfo.github}</span>}
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-1 font-mono">
                    Professional Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {atsResult.optimizedResume.professionalSummary}
                  </p>
                </div>

                {/* Core Competencies */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-1 font-mono">
                    Core Competencies & Technical Skills
                  </h2>
                  <div className="text-xs text-slate-300 space-y-1 font-mono">
                    <p>
                      <strong className="text-white">Technical Skills:</strong>{' '}
                      {(atsResult.optimizedResume.skills?.technicalSkills || []).join(', ')}
                    </p>
                    <p>
                      <strong className="text-white">Tools & Frameworks:</strong>{' '}
                      {(atsResult.optimizedResume.skills?.frameworksAndTools || []).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                {atsResult.optimizedResume.experience && atsResult.optimizedResume.experience.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-1 font-mono">
                      Professional Experience
                    </h2>
                    {atsResult.optimizedResume.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm">
                          <strong className="text-white font-bold">{exp.role} {exp.company ? `— ${exp.company}` : ''}</strong>
                          {exp.duration && <span className="text-slate-400 font-mono text-xs">{exp.duration}</span>}
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1">
                          {(exp.bullets || []).map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {atsResult.optimizedResume.projects && atsResult.optimizedResume.projects.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-1 font-mono">
                      Technical Projects
                    </h2>
                    {atsResult.optimizedResume.projects.map((p, pIdx) => (
                      <div key={pIdx} className="text-xs text-slate-300 space-y-0.5">
                        <p>
                          <strong className="text-white">{p.title}</strong>{' '}
                          {p.technologies && p.technologies.length > 0 && (
                            <span className="text-teal-400 font-mono">({p.technologies.join(', ')})</span>
                          )}
                          : {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {atsResult.optimizedResume.education && atsResult.optimizedResume.education.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-1 font-mono">
                      Education & Certifications
                    </h2>
                    {atsResult.optimizedResume.education.map((ed, edIdx) => (
                      <div key={edIdx} className="flex justify-between text-xs text-slate-300">
                        <span><strong className="text-white">{ed.degree}</strong>{ed.institution ? `, ${ed.institution}` : ''}</span>
                        {ed.year && <span className="text-slate-400 font-mono">{ed.year}</span>}
                      </div>
                    ))}
                    {(atsResult.optimizedResume.certifications || []).map((c, cIdx) => (
                      <p key={cIdx} className="text-xs text-slate-300">• {c}</p>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="pt-6 border-t border-white/10 flex justify-center">
                  <button
                    onClick={handleStartInterviewWithOptimized}
                    disabled={isStartingInterview}
                    className="py-4 px-8 text-xs font-extrabold bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 rounded-2xl shadow-xl shadow-teal-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isStartingInterview ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Preparing AI Interview Session...
                      </span>
                    ) : (
                      <>
                        <span>Practice AI Mock Interview with this Optimized Profile</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}


