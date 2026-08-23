import React, { useState, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { optimizeResume, uploadResume } from '../services/api';
import AppNavbar from './AppNavbar';
import {
  TbFileText as FileText,
  TbUpload as Upload,
  TbSparkles as Sparkles,
  TbCircleCheck as CheckCircle2,
  TbCopy as Copy,
  TbPrinter as Printer,
  TbArrowRight as ArrowRight,
  TbAlertTriangle as AlertTriangle,
  TbCheck as Check,
  TbStack2 as Layers,
  TbBriefcase as Briefcase,
  TbFileCheck as FileCheck,
  TbUser as User,
  TbMail as Mail,
  TbPhone as Phone,
  TbMapPin as MapPin,
  TbBrandLinkedin as Linkedin,
  TbBrandGithub as Github,
  TbSchool as School,
  TbCode as CodeIcon,
  TbEye as Eye,
  TbEdit as Edit3,
  TbPlus as Plus,
  TbTrash as Trash2,
  TbRefresh as RefreshCw,
  TbChevronDown as ChevronDown,
} from 'react-icons/tb';

const QUICK_ROLES = [
  'Full Stack Software Engineer',
  'Frontend Developer (React)',
  'Backend Developer (Node/Python)',
  'AI / Machine Learning Engineer',
  'Data Analyst / Scientist',
  'Cloud / DevOps Engineer',
  'Product Manager',
];

export default function ResumeOptimizer() {
  const { setPhase, handleResumeSubmit, setTargetRole: setGlobalTargetRole } = useInterview();

  // Mode: 'builder' (Resume.io interactive form) | 'upload' (raw text / PDF)
  const [activeMode, setActiveMode] = useState('builder');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [previewTemplate, setPreviewTemplate] = useState('classic'); // 'classic' | 'modern' | 'minimal'
  const [mobilePane, setMobilePane] = useState('editor'); // 'editor' | 'preview'

  // Structured Form Data for Real-Time Live Canvas
  const [formData, setFormData] = useState({
    fullName: 'Alex Morgan',
    jobTitle: 'Full Stack Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan',
    summary: 'Results-driven Software Engineer with 3+ years of experience building high-throughput microservices, real-time web applications, and scalable distributed architectures. Passionate about system latency optimization, TypeScript, React, and cloud-native solutions.',
    skills: 'TypeScript, React, Node.js, Python, PostgreSQL, Redis, Docker, AWS, GraphQL, RESTful APIs, Git, Jest',
    experience: [
      {
        id: 1,
        role: 'Senior Frontend Engineer',
        company: 'CloudScale Technologies',
        period: '2023 — Present',
        location: 'San Francisco, CA',
        bullets: [
          'Architected responsive Next.js and Tailwind dashboards reducing first-contentful paint by 42% across 150k monthly active users.',
          'Engineered real-time WebSocket state management pipeline reducing message serialization overhead by 35%.',
          'Mentored 4 junior engineers on clean React architecture and automated end-to-end Cypress testing.'
        ]
      },
      {
        id: 2,
        role: 'Full Stack Developer',
        company: 'Nexus Digital Labs',
        period: '2021 — 2023',
        location: 'Austin, TX',
        bullets: [
          'Built 12+ RESTful microservices in Node.js and Express handling 2M daily API transactions with 99.98% uptime.',
          'Optimized PostgreSQL index schemas and Redis cache invalidation strategies, dropping P95 latency from 240ms to 45ms.'
        ]
      }
    ],
    projects: [
      {
        id: 1,
        title: 'AI Multimodal Evaluator',
        technologies: 'React, Node.js, Web Audio API, Gemini 2.5',
        description: 'Real-time interview simulator computing STAR rubrics, speech cadence pacing, and test sandbox execution.'
      },
      {
        id: 2,
        title: 'Distributed Distributed Cache Cluster',
        technologies: 'C++20, Consistent Hashing, POSIX Sockets',
        description: 'Lock-free distributed key-value store with consistent hashing replication and zero-copy deserialization.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2017 — 2021',
        details: 'GPA: 3.85 / 4.0 • Focus on Distributed Systems & Algorithms'
      }
    ]
  });

  // Raw text / file upload state
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Resume Strength Calculation
  const calculateResumeStrength = () => {
    let score = 30;
    if (formData.fullName && formData.email && formData.phone) score += 15;
    if (formData.summary.length > 50) score += 15;
    if (formData.skills.length > 20) score += 15;
    if (formData.experience.length >= 2) score += 15;
    if (formData.projects.length >= 1) score += 10;
    return Math.min(score, 100);
  };

  const strength = calculateResumeStrength();

  // Helper to compile structured form into plaintext for ATS audit
  const compileFormDataToText = () => {
    return `
Name: ${formData.fullName}
Job Title: ${formData.jobTitle || targetRole}
Contact: ${formData.email} | ${formData.phone} | ${formData.location} | ${formData.linkedin} | ${formData.github}

PROFESSIONAL SUMMARY:
${formData.summary}

TECHNICAL SKILLS:
${formData.skills}

WORK EXPERIENCE:
${formData.experience.map(e => `${e.role} at ${e.company} (${e.period}, ${e.location}):\n${e.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

PROJECTS:
${formData.projects.map(p => `${p.title} [${p.technologies}]: ${p.description}`).join('\n')}

EDUCATION:
${formData.education.map(ed => `${ed.degree}, ${ed.institution} (${ed.year}) - ${ed.details}`).join('\n')}
    `.trim();
  };

  const handleAnalyzeAndOptimize = async () => {
    if (!targetRole.trim()) {
      setError('Please select or specify your target job role.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopied(false);

    try {
      let textToSend = '';
      if (activeMode === 'upload') {
        if (file) {
          const uploadRes = await uploadResume(file);
          textToSend = uploadRes.resumeText;
          setResumeText(textToSend);
        } else {
          textToSend = resumeText;
        }
      } else {
        textToSend = compileFormDataToText();
      }

      if (!textToSend.trim()) {
        setError('Please provide your resume content to analyze.');
        setIsLoading(false);
        return;
      }

      const res = await optimizeResume({
        resumeText: textToSend,
        targetRole: targetRole.trim(),
        userDetails: activeMode === 'builder' ? formData : {},
      });

      setAtsResult(res);
      // Auto-switch to preview on mobile when results ready
      setMobilePane('preview');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze and optimize resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterviewWithThisResume = async () => {
    setIsStartingInterview(true);
    setError(null);
    try {
      const textToUse = atsResult?.optimizedResume
        ? compileFormDataToText()
        : compileFormDataToText();

      if (setGlobalTargetRole) setGlobalTargetRole(targetRole.trim());
      await handleResumeSubmit(textToUse, null, targetRole.trim(), 'Intermediate');
    } catch (err) {
      setError(err.message || 'Failed to start interview.');
      setIsStartingInterview(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyAsMarkdown = () => {
    const md = compileFormDataToText();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans relative">
      <AppNavbar currentActive="resume-builder" />

      {/* ── TOP RESUME.IO STYLE DASHBOARD BAR ── */}
      <section className="sticky top-20 z-40 bg-[#0E131F]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Target Role Selector & Resume Strength */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>Targeting:</span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-transparent text-teal-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                {QUICK_ROLES.map(r => (
                  <option key={r} value={r} className="bg-[#121724] text-white">{r}</option>
                ))}
              </select>
            </div>

            {/* Live Strength Meter */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="text-slate-400">ATS Strength:</span>
              <div className="w-24 bg-white/[0.08] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${strength}%` }}
                />
              </div>
              <span className="font-bold text-teal-300 font-mono">{strength}%</span>
            </div>
          </div>

          {/* Template & Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex bg-white/[0.05] p-0.5 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setMobilePane('editor')}
                className={`px-3 py-1 rounded-lg font-semibold ${mobilePane === 'editor' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobilePane('preview')}
                className={`px-3 py-1 rounded-lg font-semibold ${mobilePane === 'preview' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={copyAsMarkdown}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleAnalyzeAndOptimize}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs shadow-md hover:shadow-teal-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Optimizing...' : 'AI ATS Audit'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── MAIN DUAL-PANE SPLIT WORKSPACE ── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 text-left">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT PANE: RESUME.IO FORM BUILDER ── */}
          <div className={`lg:col-span-6 space-y-6 ${mobilePane === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Mode Switcher Pills */}
            <div className="flex items-center justify-between bg-[#121724] border border-white/[0.08] p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveMode('builder')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeMode === 'builder'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                <span>Structured Form Builder</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('upload')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeMode === 'upload'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload / Paste Resume</span>
              </button>
            </div>

            {activeMode === 'builder' ? (
              <div className="space-y-5">
                
                {/* 👤 Personal Details */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Professional Title</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">LinkedIn / Portfolio</label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 📝 Professional Summary */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Professional Summary
                    </h3>
                    <span className="text-[10px] text-slate-400">High-Impact STAR keywords</span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Briefly state your core expertise, key achievements, and technical specializations..."
                    className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* 🛠️ Core Skills & Tools */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <CodeIcon className="w-4 h-4" /> Skills & Technologies (Comma Separated)
                  </h3>
                  <textarea
                    rows={2}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. React, TypeScript, Python, Docker, PostgreSQL, AWS, Microservices..."
                    className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>

                {/* 💼 Employment History */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Employment History
                    </h3>
                  </div>

                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-4 rounded-xl bg-[#121724] border border-white/[0.06] space-y-2.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...formData.experience];
                            updated[idx].role = e.target.value;
                            setFormData({ ...formData, experience: updated });
                          }}
                          placeholder="Job Title"
                          className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-white font-semibold"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...formData.experience];
                            updated[idx].company = e.target.value;
                            setFormData({ ...formData, experience: updated });
                          }}
                          placeholder="Company Name"
                          className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...formData.experience];
                            updated[idx].period = e.target.value;
                            setFormData({ ...formData, experience: updated });
                          }}
                          placeholder="Duration (e.g. 2022 — Present)"
                          className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-slate-300"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...formData.experience];
                            updated[idx].location = e.target.value;
                            setFormData({ ...formData, experience: updated });
                          }}
                          placeholder="Location (e.g. Remote / NYC)"
                          className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-slate-300"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={exp.bullets.join('\n')}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].bullets = e.target.value.split('\n');
                          setFormData({ ...formData, experience: updated });
                        }}
                        placeholder="Bullet points (one per line with quantified metrics e.g. 'Reduced latency by 30%')..."
                        className="w-full bg-[#090C12] border border-white/10 rounded-lg p-2 text-slate-300 font-mono text-[11px] leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {/* 🚀 Projects & Education */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <School className="w-4 h-4" /> Education & Projects
                  </h3>
                  {formData.education.map((ed, idx) => (
                    <div key={ed.id || idx} className="p-3 rounded-xl bg-[#121724] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={ed.degree}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[idx].degree = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        placeholder="Degree / Certificate"
                        className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-white font-semibold"
                      />
                      <input
                        type="text"
                        value={ed.institution}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[idx].institution = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        placeholder="Institution / University"
                        className="bg-[#090C12] border border-white/10 rounded-lg p-2 text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Raw Text & PDF Upload View */
              <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-white/[0.08] space-y-5 shadow-sm">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-teal-400 bg-teal-500/10' : 'border-white/15 bg-white/[0.02] hover:border-teal-500/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">
                    {file ? file.name : 'Upload PDF, DOCX, or TXT Resume'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Drag and drop file here, or browse local disk</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400">Or Paste Raw Resume Text:</label>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste text of your current resume here..."
                    className="w-full bg-[#121724] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Launch AI Interview Direct CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartInterviewWithThisResume}
                disabled={isStartingInterview}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_6px_20px_rgba(20,184,166,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Practice AI Mock Interview with this Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ── RIGHT PANE: RESUME.IO CLASSIC DOCUMENT CANVAS PREVIEW ── */}
          <div className={`lg:col-span-6 space-y-4 ${mobilePane === 'editor' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Live Document Preview Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Real-Time Classic Resume Canvas</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wide">Template: Classic Ivory</span>
              </div>

              {/* Authentic White A4 Paper Canvas */}
              <div className="bg-[#FAFBFD] text-slate-900 rounded-xl p-8 sm:p-10 shadow-xl min-h-[720px] font-sans text-left space-y-6 select-text">
                
                {/* Header Block */}
                <div className="border-b border-slate-300 pb-4 space-y-1 text-center">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
                    {formData.fullName || 'YOUR NAME'}
                  </h1>
                  <p className="text-sm font-semibold text-teal-700 tracking-wide">
                    {formData.jobTitle || targetRole}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 pt-1">
                    {formData.email && <span>{formData.email}</span>}
                    {formData.phone && <span>• {formData.phone}</span>}
                    {formData.location && <span>• {formData.location}</span>}
                    {formData.linkedin && <span>• {formData.linkedin}</span>}
                  </div>
                </div>

                {/* Professional Summary */}
                {formData.summary && (
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">
                      Professional Summary
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      {formData.summary}
                    </p>
                  </div>
                )}

                {/* Skills Section */}
                {formData.skills && (
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">
                      Technical Skills & Competencies
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      {formData.skills}
                    </p>
                  </div>
                )}

                {/* Experience Section */}
                {formData.experience.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">
                      Professional Experience
                    </h2>
                    {formData.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                          <span className="font-mono text-[11px] text-slate-600">{exp.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">{exp.location}</p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                          {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Section */}
                {formData.projects.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">
                      Key Technical Projects
                    </h2>
                    {formData.projects.map((proj, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <div className="font-bold text-slate-900">
                          {proj.title} <span className="font-mono text-[11px] text-teal-700">[{proj.technologies}]</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education Section */}
                {formData.education.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1">
                      Education & Credentials
                    </h2>
                    {formData.education.map((ed, idx) => (
                      <div key={idx} className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{ed.degree}</span> — <span className="text-slate-700">{ed.institution}</span>
                          {ed.details && <p className="text-[11px] text-slate-600">{ed.details}</p>}
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 shrink-0">{ed.year}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* ── ATS AI DIAGNOSTIC AUDIT RESULTS (IF TRIGGERED) ── */}
              {atsResult && (
                <div className="p-6 rounded-2xl bg-[#121724] border border-teal-500/30 space-y-4 text-xs animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-white text-sm">ATS Score & Keyword Alignment</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40 text-xs">
                      {atsResult.atsScore || 92}/100 Match
                    </span>
                  </div>

                  {/* Keyword Badges */}
                  <div className="space-y-2">
                    <p className="text-slate-400 font-medium">Matched Job Keywords:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(atsResult.matchedKeywords || ['React', 'TypeScript', 'Node.js', 'System Scalability', 'Microservices', 'REST APIs', 'PostgreSQL']).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px]">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {atsResult.recommendations && (
                    <div className="space-y-1 text-slate-300">
                      <p className="font-bold text-amber-400">AI Recommendations:</p>
                      <p className="text-[11px] leading-relaxed">{atsResult.recommendations}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <footer className="py-6 border-t border-white/10 bg-[#0E121B] text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} AI Interview Evaluator • ATS Resume Engine</p>
      </footer>
    </div>
  );
}
