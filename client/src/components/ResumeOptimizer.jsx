import React, { useState, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { optimizeResume, uploadResume } from '../services/api';
import AppNavbar from './AppNavbar';

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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="resume-builder" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
        {/* Header Hero */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3.5 py-1 rounded-full text-xs font-semibold mb-1">
            <span>✨</span> Free ATS Audit & High-Impact Resume Rewrite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Optimize Your Resume for 90+ ATS Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Enter ↵</kbd> in any field to move directly to the next input.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="card-dark border-indigo-900/40 p-6 sm:p-8 space-y-6">
          {/* Target Role Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              🎯 Target Job Role to Optimize Against
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
              placeholder="e.g. Full Stack Developer, Data Analyst, Machine Learning Engineer (Press Enter to move next)..."
              className="input-field-dark text-sm mb-3"
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
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    targetRole === role
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setInputTab('existing')}
              className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all ${
                inputTab === 'existing'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 Upload / Paste Existing Resume
            </button>
            <button
              type="button"
              onClick={() => setInputTab('form')}
              className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all ${
                inputTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 Enter Candidate Details from Scratch
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
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : file
                      ? 'border-green-500/60 bg-green-500/5'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
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
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">✅</span>
                      <p className="font-semibold text-slate-200 text-xs">{file.name}</p>
                      <p className="text-[11px] text-slate-400">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl opacity-70">📁</span>
                      <p className="text-xs font-semibold text-slate-200">
                        Upload your current PDF or DOCX resume (Optional)
                      </p>
                      <p className="text-[11px] text-slate-500">Or paste text below</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Or Paste Resume Content
                </label>
                <textarea
                  ref={resumeTextRef}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e, null, true)}
                  placeholder="Paste your existing resume text, work experience, bullets, and skills here (Press Enter to audit)..."
                  rows={6}
                  className="input-field-dark text-xs font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Mode 2: Details Form with Sequential Enter Navigation */}
          {inputTab === 'form' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  ref={fullNameRef}
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, emailRef)}
                  placeholder="e.g. Alex Johnson (Press Enter to next)"
                  className="input-field-dark text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email & Phone
                </label>
                <input
                  ref={emailRef}
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, skillsRef)}
                  placeholder="alex@gmail.com | +1 555-0199 (Press Enter to next)"
                  className="input-field-dark text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Core Skills & Technologies
                </label>
                <input
                  ref={skillsRef}
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, experienceRef)}
                  placeholder="e.g. Python, SQL, React, AWS, Docker, Machine Learning (Press Enter to next)"
                  className="input-field-dark text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Work Experience (Past Roles & Tasks)
                </label>
                <textarea
                  ref={experienceRef}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, projectsRef)}
                  placeholder="e.g. Junior Data Analyst at TechCorp: Built ETL pipelines in Python, created dashboards (Press Enter to next, Shift+Enter for newline)"
                  rows={4}
                  className="input-field-dark text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Projects & Education
                </label>
                <textarea
                  ref={projectsRef}
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  onKeyDown={(e) => handleFieldKeyDown(e, null, true)}
                  placeholder="e.g. Customer Churn Prediction (Python, Scikit-learn). B.S. in Computer Science (Press Enter to audit & optimize)"
                  rows={3}
                  className="input-field-dark text-xs font-mono"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAnalyzeAndOptimize}
            disabled={isLoading || !targetRole.trim()}
            className="btn-primary w-full py-4 text-xs sm:text-sm font-bold shadow-xl btn-glow"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Auditing ATS Compliance & Rewriting Bullets...
              </span>
            ) : (
              '⚡ Audit ATS Score & Generate Optimized Resume (Press Enter ↵) →'
            )}
          </button>
        </div>

        {/* ── ATS Results & Output Section ── */}
        {atsResult && (
          <div className="space-y-6 animate-fade-in">
            {/* ATS Score Overview Grid */}
            <div className="card-dark border-indigo-900/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(atsResult.atsScore)}`}>
                    <span className="text-3xl">{atsResult.atsScore}</span>
                    <span className="text-[10px] font-normal uppercase tracking-wider opacity-70">ATS Score</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">ATS Compatibility Audit</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Role: <strong className="text-slate-200">{targetRole}</strong> • Rating:{' '}
                      <strong className="text-indigo-300">{atsResult.atsRating || 'Strong'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copyAsMarkdown}
                    className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{copied ? '✅ Copied!' : '📋 Copy Resume'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>🖨️ Export PDF</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Keyword Match</span>
                    <span className="font-bold text-white">{atsResult.keywordMatchScore || 85}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${atsResult.keywordMatchScore || 85}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Action Verbs & Metrics</span>
                    <span className="font-bold text-white">{atsResult.impactScore || 90}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${atsResult.impactScore || 90}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Formatting & Structure</span>
                    <span className="font-bold text-white">{atsResult.formattingScore || 95}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${atsResult.formattingScore || 95}%` }} />
                  </div>
                </div>
              </div>

              {/* Missing Keywords Pills */}
              {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                    ⚠️ High-Priority ATS Keywords Added to Resume:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── ATS Resume Preview (Printable) ── */}
            {atsResult.optimizedResume && (
              <div className="card-dark border-slate-800 p-8 sm:p-12 space-y-6 bg-slate-900 text-slate-100 font-sans shadow-2xl">
                {/* Resume Header */}
                <div className="text-center pb-4 border-b border-slate-700">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                    {atsResult.optimizedResume.fullName || 'Candidate Name'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 space-x-2">
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
                  <p className="text-xs text-indigo-400 mt-1 space-x-3">
                    {atsResult.optimizedResume.contactInfo?.linkedin && <span>{atsResult.optimizedResume.contactInfo.linkedin}</span>}
                    {atsResult.optimizedResume.contactInfo?.github && <span>{atsResult.optimizedResume.contactInfo.github}</span>}
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {atsResult.optimizedResume.professionalSummary}
                  </p>
                </div>

                {/* Core Competencies */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                    Core Competencies & Technical Skills
                  </h2>
                  <div className="text-xs text-slate-300 space-y-1">
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
                    <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
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
                    <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                      Technical Projects
                    </h2>
                    {atsResult.optimizedResume.projects.map((p, pIdx) => (
                      <div key={pIdx} className="text-xs text-slate-300 space-y-0.5">
                        <p>
                          <strong className="text-white">{p.title}</strong>{' '}
                          {p.technologies && p.technologies.length > 0 && (
                            <span className="text-slate-400">({p.technologies.join(', ')})</span>
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
                    <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                      Education & Certifications
                    </h2>
                    {atsResult.optimizedResume.education.map((ed, edIdx) => (
                      <div key={edIdx} className="flex justify-between text-xs text-slate-300">
                        <span><strong className="text-white">{ed.degree}</strong>{ed.institution ? `, ${ed.institution}` : ''}</span>
                        {ed.year && <span className="text-slate-400">{ed.year}</span>}
                      </div>
                    ))}
                    {(atsResult.optimizedResume.certifications || []).map((c, cIdx) => (
                      <p key={cIdx} className="text-xs text-slate-300">• {c}</p>
                    ))}
                  </div>
                )}

                {/* CTA to Practice with this Profile */}
                <div className="pt-6 border-t border-slate-800 flex justify-center">
                  <button
                    onClick={handleStartInterviewWithOptimized}
                    disabled={isStartingInterview}
                    className="btn-primary py-3.5 px-8 text-xs font-bold btn-glow shadow-xl"
                  >
                    {isStartingInterview ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Preparing AI Interview Session...
                      </span>
                    ) : (
                      '🎯 Practice AI Mock Interview with this Optimized Profile →'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center" />
    </div>
  );
}
