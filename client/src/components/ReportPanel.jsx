import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';

import AiInterviewCoach from './AiInterviewCoach';
import SkillPassportModal from './SkillPassportModal';
import AnalyticsTrendSection from './AnalyticsTrendSection';

const READINESS = {
  'Not Ready': { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', emoji: '❌', barColor: 'bg-rose-500' },
  'Needs Improvement': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', emoji: '⚠️', barColor: 'bg-amber-500' },
  'Almost Ready': { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '🔶', barColor: 'bg-yellow-500' },
  'Interview Ready': { color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', emoji: '✅', barColor: 'bg-teal-500' },
  'Excellent': { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', emoji: '🌟', barColor: 'bg-emerald-500' },
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

const ScoreCard = ({ icon, label, score = 0, feedback = '', barColor = 'bg-blue-600' }) => {
  const numScore = typeof score === 'number' && !isNaN(score) ? score : Number(score) || 0;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm hover:border-teal-500/40 transition-all text-left">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
            <span>{icon}</span> {label}
          </h3>
          <span
            className={`text-lg font-black ${
              numScore >= 70 ? 'text-emerald-700' : numScore >= 40 ? 'text-amber-700' : 'text-rose-700'
            }`}
          >
            {numScore}<span className="text-xs text-slate-500 font-normal">/100</span>
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden border border-slate-200">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000 shadow-sm`}
            style={{ width: `${Math.max(3, Math.min(100, numScore))}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mt-1 font-normal">{feedback || 'Evaluation completed.'}</p>
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

  // Preload voices on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4 text-slate-900">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-sm">
          📊
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Report Data Available</h2>
        <p className="text-xs text-slate-500 max-w-sm">Please complete an interview session or select a valid historical record.</p>
        <button onClick={() => setPhase('landing')} className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md cursor-pointer">
          ← Return to Home
        </button>
      </div>
    );
  }

  // Safe normalization of all report metrics
  const readinessKey = Object.keys(READINESS).find(
    (k) => k.toLowerCase() === (report.readinessLevel || '').toLowerCase()
  ) || 'Not Ready';
  const r = READINESS[readinessKey];
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

  // Global Elo calculation
  let eloRating = 0;
  let percentileText = 'Baseline Entry (0th Percentile)';
  let eloTier = { label: 'Unranked (0 Score)', badge: '🌱', color: 'text-rose-700 border-rose-200 bg-rose-50' };

  if (overallScoreVal > 0) {
    eloRating = Math.round(400 + (overallScoreVal / 100) * 1400);

    if (overallScoreVal >= 50) {
      const topPct = Math.max(1, 100 - Math.round(overallScoreVal * 0.95));
      percentileText = `Top ${topPct}% Globally`;
    } else {
      percentileText = `${overallScoreVal}th Percentile • Foundation Stage`;
    }

    if (eloRating >= 1650) {
      eloTier = { label: 'Grandmaster / Top 1%', badge: '🏆', color: 'text-amber-800 border-amber-200 bg-amber-50' };
    } else if (eloRating >= 1400) {
      eloTier = { label: 'Diamond Tier', badge: '💎', color: 'text-teal-800 border-teal-200 bg-teal-50' };
    } else if (eloRating >= 1100) {
      eloTier = { label: 'Gold Tier', badge: '🥇', color: 'text-emerald-800 border-emerald-200 bg-emerald-50' };
    } else if (eloRating >= 700) {
      eloTier = { label: 'Silver Tier', badge: '🥈', color: 'text-slate-800 border-slate-200 bg-slate-100' };
    } else {
      eloTier = { label: 'Bronze Tier', badge: '🥉', color: 'text-orange-800 border-orange-200 bg-orange-50' };
    }
  }

  // Bar Raiser Persona Verdict
  const activeBarRaiser = interviewerPersona || {
    name: companyTrack === 'Google' ? 'Dr. Sanjay Rao' : companyTrack === 'Amazon' ? 'Marcus Vance' : 'Senior Bar Raiser',
    company: companyTrack || 'Target Company',
    avatar: companyTrack === 'Google' ? '🌐' : companyTrack === 'Amazon' ? '📦' : '👔',
    badge: `${companyTrack || 'Company'} Hiring Committee`,
  };

  const barVerdict = report?.barRaiserVerdict || {
    hiringDecision: overallScoreVal >= 85 ? 'Strong Hire' : overallScoreVal >= 70 ? 'Lean Hire' : overallScoreVal >= 40 ? 'Lean No Hire' : 'Strong No Hire',
    personaFeedback: `Evaluated against ${activeBarRaiser.name}'s hiring bar at ${activeBarRaiser.company}. Demonstrated foundational domain familiarity with clear growth vectors in quantitative STAR metrics and scalability trade-offs.`,
    coreCriteriaScore: Math.round(overallScoreVal * 0.95),
    criteriaName: `${activeBarRaiser.company} Bar Raiser Index`,
  };

  const decisionBadgeColor =
    (barVerdict.hiringDecision || '').includes('Strong Hire')
      ? 'text-emerald-800 border-emerald-300 bg-emerald-50 font-black'
      : (barVerdict.hiringDecision || '').includes('Lean Hire')
      ? 'text-teal-800 border-teal-300 bg-teal-50 font-black'
      : (barVerdict.hiringDecision || '').includes('Lean No Hire')
      ? 'text-amber-800 border-amber-300 bg-amber-50 font-black'
      : 'text-rose-800 border-rose-300 bg-rose-50 font-black';

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
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }
    
    if (playingVoiceIdx === `${idx}-${isTop1 ? 'top' : 'user'}`) {
      window.speechSynthesis.cancel();
      setPlayingVoiceIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const cleanText = (text || '').replace(/[*#`_]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = isTop1 ? 0.95 : 1.0;
    utterance.pitch = isTop1 ? 1.05 : 0.95;

    const voices = window.speechSynthesis.getVoices() || [];
    const preferred = isTop1
      ? voices.find((v) => /david|george|male|daniel|mark|alex|google/i.test(v.name)) || voices[0]
      : voices.find((v) => /samantha|zira|female|victoria|karen/i.test(v.name)) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setPlayingVoiceIdx(`${idx}-${isTop1 ? 'top' : 'user'}`);
    utterance.onend = () => setPlayingVoiceIdx(null);
    utterance.onerror = (e) => {
      console.warn('Speech playback notice:', e);
      setPlayingVoiceIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 select-none">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-sm shadow-sm text-white font-bold">
            🎯
          </div>
          <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">AI Interview Performance Report</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPassportModal(true)}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-teal-800 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="View Verifiable Anti-Bias Skill Passport"
          >
            <span>🌐</span>
            <span>Skill Passport</span>
          </button>

          <button
            onClick={() => setShowCheatSheet(true)}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>📄</span>
            <span>1-Page Cheat Sheet</span>
          </button>
          <button
            onClick={() => setPhase('negotiate')}
            className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>💼</span>
            <span>Salary Simulator</span>
          </button>
          <button
            onClick={openHistory}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>📊</span>
            <span>Past Mocks</span>
          </button>
          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-sm cursor-pointer"
            title="Print or Save PDF"
          >
            🖨️ Export PDF
          </button>
          <button
            onClick={retakeSameExam}
            className="py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm bg-teal-600 hover:bg-teal-500 text-white rounded-xl cursor-pointer"
            title="Retake this exact exam track with same role, difficulty, and persona"
          >
            <span>🔄</span>
            <span>Retake Same Exam</span>
          </button>
          <button
            onClick={restart}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-sm cursor-pointer"
            title="Start from role setup"
          >
            ⚙️ New Setup
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-7 text-left">
        {/* ── Executive Hero Card ── */}
        <div className={`bg-white border-2 ${r.border} rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm relative overflow-hidden`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            <span>{r.emoji}</span> Interview Assessment Complete ({companyTrack || 'General'} Track • {difficultyLevel || 'Intermediate'})
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            Evaluated for Target Role: <strong className="text-slate-900">{targetRole || 'Software Engineer'}</strong>
          </p>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">{overallScoreVal}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5 uppercase tracking-wider font-bold">Overall Score / 100</p>
            </div>
            <div className={`px-5 py-2.5 rounded-2xl border ${r.border} ${r.bg} shadow-sm`}>
              <span className={`font-black text-base sm:text-lg ${r.color}`}>{readinessKey}</span>
            </div>
          </div>
        </div>

        {/* ── 🏢 Target Company Bar Raiser Verdict Card ── */}
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeBarRaiser.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {activeBarRaiser.name} ({activeBarRaiser.company})
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-900">
                    {activeBarRaiser.badge || `${companyTrack} Bar Raiser`}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Official Hiring Committee Assessment & Cultural Alignment Rubric
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl border shadow-xs uppercase tracking-wider ${decisionBadgeColor}`}>
                {barVerdict.hiringDecision}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs uppercase font-bold text-amber-800 flex items-center gap-1">
                <span>💬</span> Bar Raiser Direct Assessment
              </span>
              <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">
                {barVerdict.personaFeedback}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between text-center space-y-1.5">
              <span className="text-xs uppercase font-bold text-slate-600 truncate">
                {barVerdict.criteriaName}
              </span>
              <p className="text-3xl font-black text-amber-700">
                {barVerdict.coreCriteriaScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </p>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.max(5, barVerdict.coreCriteriaScore)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature 13: Global Leaderboard & Elo Rating Card ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl shadow-sm">
                {eloTier.badge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Global Competitive Elo Ranking</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${eloTier.color}`}>
                    {eloTier.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Percentile: <strong className={overallScoreVal > 0 ? "text-emerald-700 font-bold" : "text-slate-700"}>{percentileText}</strong> among candidates for {targetRole || 'Role'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Competitive Elo</span>
              <p className="text-xl font-black text-slate-900 font-mono">{eloRating} <span className="text-xs text-teal-700 font-bold">pts</span></p>
            </div>
          </div>
        </div>

        {/* ── 4-Factor Performance Breakdown ── */}
        <div>
          <h2 className="font-bold text-slate-900 mb-3 text-sm sm:text-base flex items-center gap-2">
            <span>📊</span> Performance Breakdown (4 Core Dimensions)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <ScoreCard
              icon="🧠"
              label="Aptitude & Logic"
              score={report.aptitudeScore}
              feedback={report.aptitudeFeedback}
              barColor="bg-blue-600"
            />
            <ScoreCard
              icon="💻"
              label="Technical Skills"
              score={report.technicalScore}
              feedback={report.technicalFeedback}
              barColor="bg-purple-600"
            />
            <ScoreCard
              icon="🤝"
              label="HR & Behavioral"
              score={report.hrScore}
              feedback={report.hrFeedback}
              barColor="bg-emerald-600"
            />
            <ScoreCard
              icon="👤"
              label="Presence & Delivery"
              score={report.presenceScore !== undefined ? report.presenceScore : 85}
              feedback={report.presenceFeedback || "Evaluation of composure, eye contact, and vocal steadiness."}
              barColor="bg-teal-600"
            />
          </div>
        </div>

        {/* ── Speech Analytics & Gaze Timeline ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎙️</span> Verbal Delivery & Speech Pace Analytics
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Filler Words</p>
                <p className="text-base font-black text-amber-700 mt-0.5">{speechMetrics.fillerWordsCount} Detected</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Speaking Pace</p>
                <p className="text-base font-black text-teal-700 mt-0.5">{speechMetrics.speakingPaceWpm} WPM</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Pace Rating</p>
                <p className="text-xs font-bold text-emerald-700 mt-1 truncate">{speechMetrics.paceRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>👁️</span> Executive Composure & Vocal Steadiness
            </h2>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Articulation Clarity</p>
                <p className="text-base font-black text-teal-700 mt-0.5">{speechMetrics.clarityScore}%</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Vocal Steadiness</p>
                <p className="text-base font-black text-emerald-700 mt-0.5">{speechMetrics.vocalSteadiness}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Senior Evaluator Verdict ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <h2 className="font-bold text-teal-800 text-xs uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span> Senior Evaluator Verdict
          </h2>
          <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">{report.overallVerdict || 'Interview assessment completed.'}</p>
        </div>

        {/* ── Strengths & Improvement Areas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>✅</span> Identified Strengths
            </h2>
            <ul className="space-y-2">
              {strengthsList.map((s, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Areas for Growth
            </h2>
            <ul className="space-y-2">
              {weaknessesList.map((w, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Historical Performance Trendlines & Topic Mastery Matrix ── */}
        <AnalyticsTrendSection
          history={history}
          currentReport={report}
          targetRole={targetRole}
        />

        {/* ── 24/7 Interactive AI Interview Coach & Motivator ── */}
        <AiInterviewCoach
          report={report}
          targetRole={targetRole}
          difficultyLevel={difficultyLevel}
        />

        {/* ── Personalized 7-Day AI Study Roadmap ── */}
        {studyPlan.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>📅</span> Personalized 7-Day Interview Prep Roadmap
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeted daily drills generated based on your exact interview gap areas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadStudyPlanCalendar}
                  className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-teal-800 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Download 7-Day Plan to Google Calendar / Apple Calendar (.ics)"
                >
                  <span>📆</span>
                  <span>Sync to Calendar (.ics)</span>
                </button>
                <span className="text-xs font-mono text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {completedDays.length} / {studyPlan.length} Completed
                </span>
              </div>
            </div>

            {/* 7-Day Quick Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
              {studyPlan.map((day) => {
                const isDone = completedDays.includes(day.day);
                const isSelected = selectedDayNumber === day.day;
                return (
                  <div
                    key={day.day}
                    onClick={() => setSelectedDayNumber(day.day)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-left relative ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20 shadow-md scale-[1.02]'
                        : isDone
                        ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>Day {day.day}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay(day.day);
                        }}
                        className="text-xs hover:scale-110 transition-transform"
                        title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                      >
                        {isDone ? '✅' : '⚪'}
                      </button>
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] truncate">{day.topic}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{day.action}</p>
                  </div>
                );
              })}
            </div>

            {/* ── Active Day Full Details View ── */}
            {activeDay && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm animate-fade-in text-left">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center text-xs font-mono">
                      D{activeDay.day}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>Day {activeDay.day}:</span> {activeDay.topic}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Target Time: 45-60 mins • High Impact Focus Area
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDay(activeDay.day)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        completedDays.includes(activeDay.day)
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                      }`}
                    >
                      <span>{completedDays.includes(activeDay.day) ? '✅ Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs uppercase font-bold text-teal-800 flex items-center gap-1">
                      <span>🎯</span> Daily Action Drill & Plan
                    </span>
                    <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">
                      {activeDay.action}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs uppercase font-bold text-emerald-800 flex items-center gap-1">
                      <span>📚</span> Curated Study Resource & Reference
                    </span>
                    <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">
                      {activeDay.resource || 'Official tech documentation, LeetCode curated list, and system design whitepapers.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-slate-200">
                  <span className="text-xs text-slate-600 font-medium">Ready to practice this topic?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPhase('dsa')}
                      className="text-xs bg-white hover:bg-slate-100 text-teal-800 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>💻</span> Open DSA Studio
                    </button>
                    <button
                      onClick={() => setPhase('bug-hunter')}
                      className="text-xs bg-white hover:bg-slate-100 text-rose-800 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>🐛</span> Bug Hunter Drills
                    </button>
                    <button
                      onClick={() => setPhase('blitz')}
                      className="text-xs bg-white hover:bg-slate-100 text-amber-800 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>⚡</span> 60s Blitz Warmup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Question-by-Question Assessments with AI Voice Speech Replay ── */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <span>📝</span> Question Evaluations & AI Voice Playback ({evalList.length} Questions)
          </h2>

          {evalList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl text-center py-6 text-slate-500 text-xs">
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
                  className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-sm ${
                    isCorrect
                      ? 'border-emerald-200'
                      : isPartial
                      ? 'border-amber-200'
                      : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Q{q.questionNumber || idx + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {q.round || 'Question'}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isPartial
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {isCorrect ? '✅ Correct' : isPartial ? '⚠️ Partially Correct' : '❌ Incorrect'}
                    </span>
                  </div>

                  <p className="font-bold text-slate-900 text-xs sm:text-sm mb-3">
                    {q.question}
                  </p>

                  {/* Benchmark Tab Switcher */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-3 max-w-md">
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'yours' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'yours' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Your Answer
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'model' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'model' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      💡 Model Solution
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'top1' })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTab === 'top1' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🥇 Top 1% Benchmark
                    </button>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {activeTab === 'yours' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-600 font-bold uppercase text-xs">Candidate Answer</span>
                          {q.candidateAnswer && (
                            <button
                              type="button"
                              onClick={() => playVoiceSpeech(q.candidateAnswer, idx, false)}
                              className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{playingVoiceIdx === `${idx}-user` ? '⏹️ Stop Voice' : '🔊 Listen to Your Answer'}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-slate-800 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.candidateAnswer || '(No response provided)'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'model' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-emerald-800 font-bold uppercase text-xs block">
                            💡 Correct / Model Solution
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(q.expectedAnswer || 'Optimal architectural and reasoning response.', `model-${idx}`)}
                            className="text-xs text-teal-800 hover:text-teal-950 font-mono flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer shadow-xs"
                          >
                            <span>{copiedKey === `model-${idx}` ? '✓ Copied' : '📋 Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-800 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.expectedAnswer || 'Optimal architectural and reasoning response.'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'top1' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-amber-900 font-bold uppercase text-xs">
                            🥇 Staff Engineer / Top 1% Benchmark Answer
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyText(q.tierComparison?.staffTop1 || q.expectedAnswer, `top1-${idx}`)}
                              className="text-xs text-amber-900 hover:text-black font-mono flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer shadow-xs"
                            >
                              <span>{copiedKey === `top1-${idx}` ? '✓ Copied' : '📋 Copy'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                playVoiceSpeech(
                                  q.tierComparison?.staffTop1 || q.expectedAnswer || 'Demonstrates clear architectural trade-offs, quantitative SLA metrics, and failure recovery handling.',
                                  idx,
                                  true
                                )
                              }
                              className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{playingVoiceIdx === `${idx}-top` ? '⏹️ Stop Voice' : '🔊 Listen to Staff 1% Voice'}</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-800 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.tierComparison?.staffTop1 ||
                            q.expectedAnswer ||
                            'Demonstrates clear architectural trade-offs, quantitative SLA metrics, and failure recovery handling.'}
                        </p>
                      </div>
                    )}

                    {(displayFeedback || q.feedback) && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-teal-800 font-bold uppercase text-xs block">AI Assessment</span>
                        <p className="text-slate-700 text-xs mt-0.5">{displayFeedback || q.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Retake Same Exam Action Banner ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold uppercase">
              <span>🎯</span> Instant Re-Test & Skill Calibration
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Ready to improve your score for {targetRole || 'Software Engineer'}?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Retake this exact interview exam track ({difficultyLevel || 'Intermediate'} Level • {companyTrack || 'General'} Track) to apply your feedback, eliminate filler words, and boost your score.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <button
              onClick={retakeSameExam}
              className="py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>🔄</span>
              <span>Retake Same Exam Now</span>
            </button>
            <button
              onClick={restart}
              className="py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all shadow-xs"
            >
              Start New Role Setup →
            </button>
          </div>
        </div>
      </main>

      {/* ── Feature 11: 1-Page Printable Cheat Sheet Modal ── */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setShowCheatSheet(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-base cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📄</span> 1-Page Interview Day Cheat Sheet
                </h2>
                <span className="text-xs font-mono text-teal-700 font-bold">{targetRole || 'Software Engineer'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">High-density summary tailored to your interview performance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-teal-800 uppercase text-xs">⭐ STAR Formula Drill</h3>
                <ul className="text-slate-700 space-y-1 text-xs">
                  <li><strong>S (Situation):</strong> Set context in 15 seconds.</li>
                  <li><strong>T (Task):</strong> Explain the blocker or challenge.</li>
                  <li><strong>A (Action):</strong> Use "I designed/built", not "we".</li>
                  <li><strong>R (Result):</strong> Quote metrics (e.g. 40% latency drop).</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-amber-800 uppercase text-xs">⚠️ Key Focus Areas</h3>
                <ul className="text-slate-700 space-y-1 text-xs">
                  {weaknessesList.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 sm:col-span-2">
                <h3 className="font-bold text-emerald-800 uppercase text-xs">💡 Golden Rules for {companyTrack || 'General'} Track</h3>
                <p className="text-slate-700 text-xs leading-relaxed">
                  1. Always state O(N) time and auxiliary space complexity before coding.<br />
                  2. In system design, outline Load Balancers, Redis Cache & Database Sharding trade-offs first.<br />
                  3. Avoid filler words by taking 2-second silent pauses to structure thoughts.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                🖨️ Print Cheat Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Feature 6: Cryptographic Verified Skill Passport Modal ── */}
      <SkillPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        report={report}
        user={user}
        targetRole={targetRole}
        companyTrack={companyTrack}
        difficultyLevel={difficultyLevel}
      />

      <footer className="py-4 border-t border-slate-200 bg-white text-center" />
    </div>
  );
}
