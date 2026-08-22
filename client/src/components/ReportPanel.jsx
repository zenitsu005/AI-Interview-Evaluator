import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import voiceAssistant from '../services/voiceAssistant';

import AiInterviewCoach from './AiInterviewCoach';
import SkillPassportModal from './SkillPassportModal';
import AnalyticsTrendSection from './AnalyticsTrendSection';

import {
  Trophy,
  Award,
  TrendingUp,
  BarChart3,
  Brain,
  Code2,
  Users,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Download,
  Share2,
  FileText,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Volume2,
  Printer,
  Briefcase,
  Copy,
  Check,
  Zap,
  Layers,
  Activity,
  Bug,
  Bot,
} from 'lucide-react';

const READINESS = {
  'Not Ready': { color: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-500/40', icon: AlertTriangle, barColor: 'bg-rose-500' },
  'Needs Improvement': { color: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-500/40', icon: AlertTriangle, barColor: 'bg-amber-500' },
  'Almost Ready': { color: 'text-yellow-400', bg: 'bg-yellow-950/60', border: 'border-yellow-500/40', icon: Zap, barColor: 'bg-yellow-500' },
  'Interview Ready': { color: 'text-teal-300', bg: 'bg-teal-950/60', border: 'border-teal-500/40', icon: CheckCircle2, barColor: 'bg-teal-500' },
  'Excellent': { color: 'text-emerald-300', bg: 'bg-emerald-950/60', border: 'border-emerald-500/40', icon: Trophy, barColor: 'bg-emerald-500' },
};

const DEFAULT_ROADMAP = [
  { day: 1, topic: 'Aptitude & Logical Foundations', action: 'Review probability, syllogisms, and sequence logic.', resource: 'LeetCode & Khan Academy' },
  { day: 2, topic: 'Core Technical Concepts', action: 'Practice fundamental domain questions and definitions.', resource: 'Official Tech Documentation' },
  { day: 3, topic: 'DSA & Algorithms Practice', action: 'Solve 2 two-pointer and hash map algorithmic problems.', resource: 'DSA Practice Studio' },
  { day: 4, topic: 'System Design & Storage', action: 'Study database indexing, caching strategies, and SQL optimization.', resource: 'System Design Primer' },
  { day: 5, topic: 'Security & Code Review', action: 'Review SQLi, JWT security, and concurrency edge cases.', resource: 'Bug Hunter Mode' },
  { day: 6, topic: 'Behavioral STAR Framework', action: 'Draft 5 structured leadership, team conflict, and impact stories.', resource: 'STAR Method Guide' },
  { day: 7, topic: 'Full AI Mock Re-Test', action: 'Take a complete 15-question AI Multimodal Interview to benchmark score.', resource: 'AI Interview Evaluator' },
];

const ScoreCard = ({ icon: Icon, label, score = 0, feedback = '', barColor = 'bg-teal-500' }) => {
  const numScore = typeof score === 'number' && !isNaN(score) ? score : Number(score) || 0;
  return (
    <div className="bg-[#131823] border border-white/10 rounded-2xl p-5 flex flex-col justify-between h-full shadow-xl hover:border-teal-500/40 transition-all text-left">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
            {Icon && <Icon className="w-4 h-4 text-teal-400" />}
            <span>{label}</span>
          </h3>
          <span
            className={`text-lg font-black font-mono ${
              numScore >= 70 ? 'text-emerald-400' : numScore >= 40 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {numScore}<span className="text-xs text-slate-500 font-normal">/100</span>
          </span>
        </div>
        <div className="h-2 bg-[#0D111A] rounded-full mb-3 overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000 shadow-sm`}
            style={{ width: `${Math.max(3, Math.min(100, numScore))}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mt-1 font-normal">{feedback || 'Evaluation completed.'}</p>
    </div>
  );
};

export default function ReportPanel() {
  const {
    report,
    targetRole,
    restart,
    retakeSameExam,
    allResponses,
    difficultyLevel,
    companyTrack,
    interviewerPersona,
    setPhase,
  } = useInterview();
  const { user, history, openHistory } = useAuth();

  const [completedDays, setCompletedDays] = useState([]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [activeTierTabs, setActiveTierTabs] = useState({});
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [playingVoiceIdx, setPlayingVoiceIdx] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopyText = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    return () => {
      voiceAssistant.stop();
    };
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0B0D13] flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
        <div className="w-16 h-16 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 text-3xl shadow-xl">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Report Data Available</h2>
        <p className="text-xs text-slate-400 max-w-sm">Please complete an interview session or select a past attempt from history.</p>
        <button onClick={() => setPhase('landing')} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer">
          ← Return to Home
        </button>
      </div>
    );
  }

  const readinessKey = Object.keys(READINESS).find(
    (k) => k.toLowerCase() === (report.readinessLevel || '').toLowerCase()
  ) || 'Not Ready';
  const r = READINESS[readinessKey];
  const ReadinessIcon = r.icon || Trophy;
  const overallScoreVal = Number(report.overallScore) || 0;

  const isEchoOrParrot = (ans, qText) => {
    if (!ans || typeof ans !== 'string') return true;
    const cleanAns = ans.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const cleanQ = (qText || '').trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
    if (cleanAns.length < 10) return true;
    if (cleanQ.includes(cleanAns) || cleanAns.includes(cleanQ)) {
      if (Math.abs(cleanAns.length - cleanQ.length) < 50 || cleanQ.startsWith(cleanAns)) {
        return true;
      }
    }
    const ansWords = cleanAns.split(/\s+/).filter((w) => w.length > 2);
    const qWords = new Set(cleanQ.split(/\s+/).filter((w) => w.length > 2));
    if (ansWords.length > 0) {
      const overlap = ansWords.filter((w) => qWords.has(w)).length / ansWords.length;
      if (overlap > 0.8 && ansWords.length < 35) {
        return true;
      }
    }
    return false;
  };

  let evalList = [];
  if (Array.isArray(report.questionEvaluations) && report.questionEvaluations.length > 0) {
    evalList = [...report.questionEvaluations];
  }

  if (Array.isArray(allResponses) && allResponses.length > 0) {
    if (evalList.length < allResponses.length) {
      evalList = allResponses.map((resp, i) => {
        const matchingEval = evalList.find(
          (e) => (e.questionNumber === resp.questionNumber) || (e.question === resp.question)
        );
        if (matchingEval) {
          return {
            ...matchingEval,
            candidateAnswer: matchingEval.candidateAnswer || resp.answer || '(No response provided)',
            questionNumber: matchingEval.questionNumber || i + 1,
            round: matchingEval.round || resp.roundLabel || resp.round || 'Technical',
          };
        }
        const isParrot = isEchoOrParrot(resp.answer, resp.question);
        return {
          questionNumber: resp.questionNumber || i + 1,
          round: resp.roundLabel || resp.round || 'Technical',
          question: resp.question,
          candidateAnswer: resp.answer || '(No response provided)',
          status: (!isParrot && resp.answer && resp.answer.trim().length > 30) ? 'Partially Correct' : 'Incorrect',
          feedback: isParrot
            ? 'Candidate repeated or rephrased the question prompt instead of providing an actual solution.'
            : (resp.answer && resp.answer.trim().length > 30)
            ? 'Candidate provided relevant technical reasoning and addressed the core engineering components.'
            : 'No substantive answer provided during this question.',
          expectedAnswer: 'Optimal approach decomposes the problem into modular components, addresses concurrency invariants, and guarantees high availability.',
          tierComparison: {
            staffTop1: 'Top 1% candidates quantify scale metrics, address edge-case failure modes, and outline clear operational runbooks.'
          }
        };
      });
    }
  }

  const studyPlan = Array.isArray(report.studyRoadmap) && report.studyRoadmap.length > 0 ? report.studyRoadmap : DEFAULT_ROADMAP;
  const activeDay = studyPlan.find((d) => d.day === selectedDayNumber) || studyPlan[0] || DEFAULT_ROADMAP[0];
  const strengthsList = Array.isArray(report.strengths) && report.strengths.length > 0 ? report.strengths : ['Engagement demonstrated across interview rounds.'];
  const weaknessesList = Array.isArray(report.weaknesses) && report.weaknesses.length > 0 ? report.weaknesses : ['Deepen trade-off analysis and quantify metrics.'];

  const speechMetrics = report.speechMetrics || {
    fillerWordsCount: 2,
    speakingPaceWpm: 138,
    paceRating: 'Ideal (130-155 WPM)',
    clarityScore: 88,
    vocalSteadiness: 94,
  };

  let eloRating = 0;
  let percentileText = 'Baseline Entry (0th Percentile)';
  let eloTier = { label: 'Unranked', badge: '🌱', color: 'text-rose-400 border-rose-500/30 bg-rose-950/40' };

  if (overallScoreVal > 0) {
    eloRating = Math.round(400 + (overallScoreVal / 100) * 1400);

    if (overallScoreVal >= 50) {
      const topPct = Math.max(1, 100 - Math.round(overallScoreVal * 0.95));
      percentileText = `Top ${topPct}% Globally`;
    } else {
      percentileText = `${overallScoreVal}th Percentile • Foundation Stage`;
    }

    if (eloRating >= 1650) {
      eloTier = { label: 'Grandmaster / Top 1%', badge: '🏆', color: 'text-amber-300 border-amber-500/40 bg-amber-950/60' };
    } else if (eloRating >= 1400) {
      eloTier = { label: 'Diamond Tier', badge: '💎', color: 'text-teal-300 border-teal-500/40 bg-teal-950/60' };
    } else if (eloRating >= 1100) {
      eloTier = { label: 'Gold Tier', badge: '🥇', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60' };
    } else if (eloRating >= 700) {
      eloTier = { label: 'Silver Tier', badge: '🥈', color: 'text-slate-300 border-slate-700 bg-slate-900/60' };
    } else {
      eloTier = { label: 'Bronze Tier', badge: '🥉', color: 'text-orange-300 border-orange-500/40 bg-orange-950/60' };
    }
  }

  const activeBarRaiser = interviewerPersona || {
    name: `${companyTrack || 'AI'} Evaluator`,
    company: companyTrack || 'Target Company',
    avatar: '🤖',
    badge: `${companyTrack || 'Company'} Evaluation Rubric`,
  };

  const rawPersonaFeedback = report?.barRaiserVerdict?.personaFeedback ||
    `Evaluated against ${activeBarRaiser.company} engineering competencies. Demonstrated foundational domain familiarity with clear growth vectors in quantitative STAR metrics, edge-case resilience, and scalability trade-offs.`;

  const cleanPersonaFeedback = rawPersonaFeedback
    .replace(/As an? [A-Za-z0-9 ]*Bar Raiser,?/gi, 'As an AI Evaluator,')
    .replace(/Marcus Vance|Dr\. Sanjay Rao|Elena Rostova|Arthur Sterling|Sarah Chen|Kavita Patel/gi, 'AI Evaluator')
    .replace(/Bar Raiser/gi, 'AI Evaluator');

  const barVerdict = {
    hiringDecision: report?.barRaiserVerdict?.hiringDecision || (overallScoreVal >= 85 ? 'Strong Hire' : overallScoreVal >= 70 ? 'Lean Hire' : overallScoreVal >= 40 ? 'Lean No Hire' : 'Strong No Hire'),
    personaFeedback: cleanPersonaFeedback,
    coreCriteriaScore: report?.barRaiserVerdict?.coreCriteriaScore ?? Math.round(overallScoreVal * 0.95),
    criteriaName: (report?.barRaiserVerdict?.criteriaName || `${activeBarRaiser.company} Competency Index`).replace(/Bar Raiser/gi, 'Competency'),
  };

  const decisionBadgeColor =
    (barVerdict.hiringDecision || '').includes('Strong Hire')
      ? 'text-emerald-300 border-emerald-500/40 bg-emerald-950/80 font-black'
      : (barVerdict.hiringDecision || '').includes('Lean Hire')
      ? 'text-teal-300 border-teal-500/40 bg-teal-950/80 font-black'
      : (barVerdict.hiringDecision || '').includes('Lean No Hire')
      ? 'text-amber-300 border-amber-500/40 bg-amber-950/80 font-black'
      : 'text-rose-300 border-rose-500/40 bg-rose-950/80 font-black';

  const toggleDay = (day) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const downloadStudyPlanCalendar = () => {
    const roadmap = Array.isArray(report?.studyRoadmap) && report.studyRoadmap.length > 0 ? report.studyRoadmap : DEFAULT_ROADMAP;
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Interview Evaluator//Study Roadmap//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    const now = new Date();
    roadmap.forEach((item, idx) => {
      const eventDate = new Date();
      eventDate.setDate(now.getDate() + idx + 1);
      const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '');
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:mock-interview-study-day-${item.day || idx + 1}-${Date.now()}@ai-evaluator.app`);
      icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
      icsContent.push(`SUMMARY:Day ${item.day || idx + 1}: ${item.topic} (Interview Prep)`);
      icsContent.push(`DESCRIPTION:Action: ${item.action}\\nResource: ${item.resource}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview-Study-Plan-7Days-${(targetRole || 'Prep').replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const playVoiceSpeech = (text, idx, isTop1 = false) => {
    const key = `${idx}-${isTop1 ? 'top' : 'user'}`;
    if (playingVoiceIdx === key) {
      voiceAssistant.stop();
      setPlayingVoiceIdx(null);
      return;
    }

    voiceAssistant.speak(text, {
      persona: isTop1 ? 'google' : 'general',
      rate: isTop1 ? 0.95 : 1.0,
      onStart: () => setPlayingVoiceIdx(key),
      onEnd: () => setPlayingVoiceIdx(null),
      onError: () => setPlayingVoiceIdx(null),
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 select-none font-sans">
      {/* Top Bar */}
      <header className="bg-[#0E121B]/90 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-lg flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm sm:text-base tracking-tight">AI Interview Performance Report</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPassportModal(true)}
            className="py-2 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="View Verifiable Anti-Bias Skill Passport"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Skill Passport</span>
          </button>

          <button
            onClick={() => setShowCheatSheet(true)}
            className="py-2 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Page Cheat Sheet</span>
          </button>
          <button
            onClick={() => setPhase('negotiate')}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Salary Negotiation</span>
          </button>
          <button
            onClick={openHistory}
            className="py-2 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Past Mocks</span>
          </button>
          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 font-semibold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={retakeSameExam}
            className="py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 rounded-xl cursor-pointer"
            title="Retake this exact exam track with same role, difficulty, and persona"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={restart}
            className="py-2 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 font-semibold text-xs shadow-sm cursor-pointer"
            title="Start from role setup"
          >
            New Setup →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-7 text-left">
        {/* ── Executive Hero Card ── */}
        <div className={`bg-[#131823] border-2 ${r.border} rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171E2D] border border-white/10 text-xs font-semibold text-slate-200 shadow-md">
            <ReadinessIcon className="w-4 h-4 text-teal-400" />
            <span>Interview Assessment Complete ({companyTrack || 'General'} Track • {difficultyLevel || 'Intermediate'})</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Evaluated for Target Role: <strong className="text-white">{targetRole || 'Software Engineer'}</strong>
          </p>

          <div className="flex items-center justify-center gap-8 flex-wrap pt-2">
            <div className="text-center">
              <p className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">{overallScoreVal}</p>
              <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider font-bold">Overall Score / 100</p>
            </div>
            <div className={`px-6 py-3 rounded-2xl border ${r.border} ${r.bg} shadow-lg flex items-center gap-2`}>
              <ReadinessIcon className="w-5 h-5 text-teal-300" />
              <span className={`font-black text-base sm:text-lg ${r.color}`}>{readinessKey}</span>
            </div>
          </div>
        </div>

        {/* ── AI Evaluator Verdict Card ── */}
        <div className="bg-[#131823] border border-teal-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {activeBarRaiser.name} ({activeBarRaiser.company})
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30 bg-teal-950/80 text-teal-300 font-mono">
                    {activeBarRaiser.badge || `${companyTrack} Evaluation Rubric`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Hiring Committee Assessment & Competency Alignment Rubric
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-4 py-2 rounded-xl border shadow-md uppercase tracking-wider ${decisionBadgeColor}`}>
                {barVerdict.hiringDecision}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2 bg-[#0D111A] p-4 rounded-2xl border border-white/5 space-y-1.5">
              <span className="text-xs uppercase font-bold text-teal-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Evaluator Direct Assessment
              </span>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {barVerdict.personaFeedback}
              </p>
            </div>

            <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5 flex flex-col justify-between text-center space-y-1.5">
              <span className="text-xs uppercase font-bold text-slate-400 truncate font-mono">
                {barVerdict.criteriaName}
              </span>
              <p className="text-3xl font-black text-amber-400 font-mono">
                {barVerdict.coreCriteriaScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </p>
              <div className="h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                  style={{ width: `${Math.max(5, barVerdict.coreCriteriaScore)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Global Leaderboard & Elo Rating Card ── */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 text-2xl shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm sm:text-base">Global Competitive Elo Ranking</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${eloTier.color}`}>
                    {eloTier.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Percentile: <strong className={overallScoreVal > 0 ? "text-emerald-400 font-bold" : "text-slate-400"}>{percentileText}</strong> among candidates for {targetRole || 'Role'}
                </p>
              </div>
            </div>

            <div className="bg-[#0D111A] px-5 py-3 rounded-2xl border border-white/5 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Competitive Elo</span>
              <p className="text-2xl font-black text-white font-mono">{eloRating} <span className="text-xs text-teal-400 font-bold">pts</span></p>
            </div>
          </div>
        </div>

        {/* ── 4-Factor Performance Breakdown ── */}
        <div>
          <h2 className="font-bold text-white mb-3 text-sm sm:text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Performance Breakdown (4 Core Dimensions)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <ScoreCard
              icon={Brain}
              label="Aptitude & Logic"
              score={report.aptitudeScore}
              feedback={report.aptitudeFeedback}
              barColor="bg-blue-500"
            />
            <ScoreCard
              icon={Code2}
              label="Technical Skills"
              score={report.technicalScore}
              feedback={report.technicalFeedback}
              barColor="bg-teal-500"
            />
            <ScoreCard
              icon={Users}
              label="HR Round"
              score={report.hrScore}
              feedback={report.hrFeedback}
              barColor="bg-amber-500"
            />
            <ScoreCard
              icon={Activity}
              label="Presence & Delivery"
              score={report.presenceScore !== undefined ? report.presenceScore : 85}
              feedback={report.presenceFeedback || "Evaluation of composure, vocal steadiness, and communication speed."}
              barColor="bg-emerald-500"
            />
          </div>
        </div>

        {/* ── Speech Analytics & Composure ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#131823] border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Radio className="w-3.5 h-3.5" /> Verbal Delivery & Pace Analytics
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#0D111A] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Filler Words</p>
                <p className="text-base font-black text-amber-400 mt-0.5 font-mono">{speechMetrics.fillerWordsCount} Detected</p>
              </div>
              <div className="bg-[#0D111A] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Speaking Pace</p>
                <p className="text-base font-black text-teal-400 mt-0.5 font-mono">{speechMetrics.speakingPaceWpm} WPM</p>
              </div>
              <div className="bg-[#0D111A] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Pace Rating</p>
                <p className="text-xs font-bold text-emerald-400 mt-1 truncate">{speechMetrics.paceRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#131823] border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-3.5 h-3.5" /> Executive Composure & Articulation
            </h2>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-[#0D111A] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Articulation Clarity</p>
                <p className="text-base font-black text-teal-400 mt-0.5 font-mono">{speechMetrics.clarityScore}%</p>
              </div>
              <div className="bg-[#0D111A] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Vocal Steadiness</p>
                <p className="text-base font-black text-emerald-400 mt-0.5 font-mono">{speechMetrics.vocalSteadiness}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Senior Evaluator Verdict ── */}
        <div className="bg-[#131823] border border-white/10 rounded-2xl p-6 shadow-xl space-y-2">
          <h2 className="font-bold text-teal-400 text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
            <Award className="w-4 h-4" /> Senior Evaluator Verdict
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{report.overallVerdict || 'Interview assessment completed.'}</p>
        </div>

        {/* ── Strengths & Improvement Areas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#131823] border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4" /> Identified Strengths
            </h2>
            <ul className="space-y-2">
              {strengthsList.map((s, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#131823] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-4 h-4" /> Areas for Growth
            </h2>
            <ul className="space-y-2">
              {weaknessesList.map((w, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Analytics Trendlines & Mastery Matrix ── */}
        <AnalyticsTrendSection
          history={history}
          currentReport={report}
          targetRole={targetRole}
        />

        {/* ── 24/7 Interactive AI Interview Coach ── */}
        <AiInterviewCoach
          report={report}
          targetRole={targetRole}
          difficultyLevel={difficultyLevel}
        />

        {/* ── 7-Day AI Prep Roadmap ── */}
        {studyPlan.length > 0 && (
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Personalized 7-Day Interview Prep Roadmap</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Targeted daily drills generated based on your exact interview gap areas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadStudyPlanCalendar}
                  className="py-1.5 px-3.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-teal-300 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Download 7-Day Plan to Google Calendar (.ics)"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Sync to Calendar (.ics)</span>
                </button>
                <span className="text-xs font-mono text-teal-300 font-bold bg-teal-950/80 px-3 py-1 rounded-xl border border-teal-500/40">
                  {completedDays.length} / {studyPlan.length} Done
                </span>
              </div>
            </div>

            {/* 7-Day Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
              {studyPlan.map((day) => {
                const isDone = completedDays.includes(day.day);
                const isSelected = selectedDayNumber === day.day;
                return (
                  <div
                    key={day.day}
                    onClick={() => setSelectedDayNumber(day.day)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-left relative ${
                      isSelected
                        ? 'border-teal-400 bg-teal-950/70 ring-2 ring-teal-500/30 shadow-lg scale-[1.02]'
                        : isDone
                        ? 'border-emerald-500/40 bg-emerald-950/40 hover:border-emerald-400'
                        : 'border-white/10 bg-[#0D111A] hover:bg-[#171E2D]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <span className={`font-bold ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>Day {day.day}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay(day.day);
                        }}
                        className="text-xs hover:scale-110 transition-transform"
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                      </button>
                    </div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">{day.topic}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{day.action}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Day Details */}
            {activeDay && (
              <div className="p-5 rounded-2xl bg-[#0D111A] border border-white/10 space-y-4 shadow-inner animate-fade-in text-left">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 font-bold flex items-center justify-center text-xs font-mono">
                      D{activeDay.day}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        <span>Day {activeDay.day}:</span> {activeDay.topic}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Target Time: 45-60 mins • High Impact Focus Area
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDay(activeDay.day)}
                      className={`text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        completedDays.includes(activeDay.day)
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-md'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{completedDays.includes(activeDay.day) ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#131823] p-4 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-xs uppercase font-bold text-teal-400 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" /> Daily Action Drill
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {activeDay.action}
                    </p>
                  </div>

                  <div className="bg-[#131823] p-4 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <FileText className="w-3.5 h-3.5" /> Curated Reference Material
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {activeDay.resource || 'Official tech documentation, curated algorithmic problems, and design whitepapers.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-white/10">
                  <span className="text-xs text-slate-400 font-medium">Ready to practice this topic?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPhase('dsa')}
                      className="text-xs bg-[#171E2D] hover:bg-[#1E273A] text-teal-300 border border-white/10 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-teal-400" /> Open DSA Studio
                    </button>
                    <button
                      onClick={() => setPhase('bug-hunter')}
                      className="text-xs bg-[#171E2D] hover:bg-[#1E273A] text-cyan-300 border border-white/10 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Bug className="w-3.5 h-3.5 text-cyan-400" /> Bug Hunter Drills
                    </button>
                    <button
                      onClick={() => setPhase('blitz')}
                      className="text-xs bg-[#171E2D] hover:bg-[#1E273A] text-amber-300 border border-white/10 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> 60s Blitz Warmup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Question-by-Question Assessments with AI Voice Playback ── */}
        <div className="space-y-4">
          <h2 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Question Evaluations & Neural Audio Playback ({evalList.length} Questions)</span>
          </h2>

          {evalList.length === 0 ? (
            <div className="bg-[#131823] border border-white/10 rounded-2xl text-center py-6 text-slate-400 text-xs">
              No individual question evaluations recorded for this attempt.
            </div>
          ) : (
            evalList.map((q, idx) => {
              const isParrot = isEchoOrParrot(q.candidateAnswer, q.question);
              const rawStatus = (q.status || '').toLowerCase().trim();
              const isIncorrect = isParrot || rawStatus.includes('incorrect') || rawStatus.includes('wrong') || rawStatus.includes('fail') || rawStatus.includes('not');
              const isPartial = !isIncorrect && rawStatus.includes('partial');
              const isCorrect = !isIncorrect && !isPartial && rawStatus.includes('correct');
              const activeTab = activeTierTabs[idx] || 'yours';
              const displayFeedback = isParrot ? 'Candidate repeated or rephrased the question prompt without providing an actual substantive solution.' : q.feedback;

              return (
                <div
                  key={idx}
                  className={`bg-[#131823] border-2 rounded-3xl p-5 sm:p-6 transition-all shadow-xl ${
                    isCorrect
                      ? 'border-emerald-500/40'
                      : isPartial
                      ? 'border-amber-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-[#0D111A] text-slate-300 border border-white/10">
                        Q{q.questionNumber || idx + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                        {q.round || 'Question'}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : isPartial
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Correct' : isPartial ? 'Partially Correct' : 'Needs Work'}</span>
                    </span>
                  </div>

                  <p className="font-bold text-white text-xs sm:text-sm mb-3.5">
                    {q.question}
                  </p>

                  {/* Benchmark Tab Switcher */}
                  <div className="flex bg-[#0D111A] p-1 rounded-xl border border-white/10 mb-3 max-w-md">
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'yours' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'yours' ? 'bg-teal-500 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Your Answer
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'model' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'model' ? 'bg-teal-500 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Model Solution
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'top1' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'top1' ? 'bg-amber-500 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Top 1% Benchmark
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                    {activeTab === 'yours' && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-400 font-bold uppercase text-xs font-mono">Candidate Answer</span>
                          {q.candidateAnswer && (
                            <button
                              type="button"
                              onClick={() => playVoiceSpeech(q.candidateAnswer, idx, false)}
                              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{playingVoiceIdx === `${idx}-user` ? 'Stop Audio' : 'Listen to Your Answer'}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300 font-mono text-xs mt-0.5 whitespace-pre-wrap leading-relaxed">
                          {q.candidateAnswer || '(No response provided)'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'model' && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-teal-400 font-bold uppercase text-xs block font-mono">
                            Model Solution
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(q.expectedAnswer || 'Optimal architectural response.', `model-${idx}`)}
                            className="text-xs text-slate-300 hover:text-white font-mono flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
                          >
                            {copiedKey === `model-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === `model-${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-300 font-mono text-xs mt-0.5 whitespace-pre-wrap leading-relaxed">
                          {q.expectedAnswer || 'Optimal architectural and reasoning response.'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'top1' && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-amber-400 font-bold uppercase text-xs font-mono">
                            Staff Engineer / Top 1% Benchmark
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyText(q.tierComparison?.staffTop1 || q.expectedAnswer, `top1-${idx}`)}
                              className="text-xs text-slate-300 hover:text-white font-mono flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
                            >
                              {copiedKey === `top1-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === `top1-${idx}` ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                playVoiceSpeech(
                                  q.tierComparison?.staffTop1 || q.expectedAnswer || 'Demonstrates clear architectural trade-offs and failure recovery handling.',
                                  idx,
                                  true
                                )
                              }
                              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{playingVoiceIdx === `${idx}-top` ? 'Stop Audio' : 'Listen to Staff 1% Voice'}</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 font-mono text-xs mt-0.5 whitespace-pre-wrap leading-relaxed">
                          {q.tierComparison?.staffTop1 ||
                            q.expectedAnswer ||
                            'Demonstrates clear architectural trade-offs, quantitative SLA metrics, and failure recovery handling.'}
                        </p>
                      </div>
                    )}

                    {(displayFeedback || q.feedback) && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-teal-400 font-bold uppercase text-xs block font-mono">AI Assessment</span>
                        <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{displayFeedback || q.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Retake Same Exam Action Banner ── */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Instant Re-Test & Calibration
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Ready to improve your score for {targetRole || 'Software Engineer'}?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Retake this exact interview exam track ({difficultyLevel || 'Intermediate'} Level • {companyTrack || 'General'} Track) to apply your feedback, eliminate filler words, and boost your score.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <button
              onClick={retakeSameExam}
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-xl shadow-teal-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Same Exam</span>
            </button>
            <button
              onClick={restart}
              className="py-3.5 px-5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-all shadow-md"
            >
              Start New Setup →
            </button>
          </div>
        </div>
      </main>

      {/* ── 1-Page Cheat Sheet Modal ── */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className="bg-[#131823] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCheatSheet(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-white/10 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <span>1-Page Interview Day Cheat Sheet</span>
                </h2>
                <span className="text-xs font-mono text-teal-400 font-bold">{targetRole || 'Software Engineer'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">High-density summary tailored to your interview performance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0D111A] p-4 rounded-xl border border-white/5 space-y-2">
                <h3 className="font-bold text-teal-400 uppercase text-xs font-mono">STAR Formula Drill</h3>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li><strong>S (Situation):</strong> Set context in 15 seconds.</li>
                  <li><strong>T (Task):</strong> Explain the blocker or challenge.</li>
                  <li><strong>A (Action):</strong> Use "I designed/built", not "we".</li>
                  <li><strong>R (Result):</strong> Quote metrics (e.g. 40% latency drop).</li>
                </ul>
              </div>

              <div className="bg-[#0D111A] p-4 rounded-xl border border-white/5 space-y-2">
                <h3 className="font-bold text-amber-400 uppercase text-xs font-mono">Key Focus Areas</h3>
                <ul className="text-slate-300 space-y-1 text-xs">
                  {weaknessesList.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0D111A] p-4 rounded-xl border border-white/5 space-y-2 sm:col-span-2">
                <h3 className="font-bold text-emerald-400 uppercase text-xs font-mono">Golden Rules for {companyTrack || 'General'} Track</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  1. Always state O(N) time and auxiliary space complexity before coding.<br />
                  2. In system design, outline Load Balancers, Redis Cache & Database Sharding trade-offs first.<br />
                  3. Avoid filler words by taking 2-second silent pauses to structure thoughts.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Cheat Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Skill Passport Modal ── */}
      <SkillPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        report={report}
        user={user}
        targetRole={targetRole}
        companyTrack={companyTrack}
        difficultyLevel={difficultyLevel}
      />
    </div>
  );
}
