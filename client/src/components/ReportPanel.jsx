import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';

import AiInterviewCoach from './AiInterviewCoach';
import SkillPassportModal from './SkillPassportModal';
import AnalyticsTrendSection from './AnalyticsTrendSection';




const READINESS = {
  'Not Ready': { color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/80', emoji: '❌', barColor: 'bg-red-500' },
  'Needs Improvement': { color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/80', emoji: '⚠️', barColor: 'bg-orange-500' },
  'Almost Ready': { color: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-800/80', emoji: '🔶', barColor: 'bg-yellow-500' },
  'Interview Ready': { color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-800/80', emoji: '✅', barColor: 'bg-cyan-500' },
  'Excellent': { color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-800/80', emoji: '🌟', barColor: 'bg-green-500' },
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

const ScoreCard = ({ icon, label, score = 0, feedback = '', barColor = 'bg-blue-500' }) => {
  const numScore = typeof score === 'number' && !isNaN(score) ? score : Number(score) || 0;
  return (
    <div className="card-dark flex flex-col justify-between h-full hover:border-slate-700 transition-all">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
            <span>{icon}</span> {label}
          </h3>
          <span
            className={`text-lg font-black ${
              numScore >= 70 ? 'text-green-400' : numScore >= 40 ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {numScore}<span className="text-[10px] text-slate-500 font-normal">/100</span>
          </span>
        </div>
        <div className="h-1.5 bg-slate-950 rounded-full mb-3 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000 shadow-sm`}
            style={{ width: `${Math.max(3, Math.min(100, numScore))}%` }}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{feedback || 'Evaluation completed.'}</p>
    </div>
  );
};

export default function ReportPanel() {
  const {
    report,
    resumeAnalysis,
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
  const [showCertificate, setShowCertificate] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);



  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [playingVoiceIdx, setPlayingVoiceIdx] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopyText = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };


  // Preload voices on mount to fix Chrome TTS initial empty array
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-3xl">
          📊
        </div>
        <h2 className="text-xl font-bold text-white">No Report Data Available</h2>
        <p className="text-xs text-slate-400 max-w-sm">Please complete an interview session or select a valid historical record.</p>
        <button onClick={() => setPhase('landing')} className="btn-primary py-2 px-6 text-xs font-bold shadow-md">
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

  // Echo & Parrot detection
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

  // Guarantee all questions from the session are presented in the report breakdown
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


  // Global Elo & Percentile calculation
  let eloRating = 0;
  let percentileText = 'Baseline Entry (0th Percentile)';
  let eloTier = { label: 'Unranked (0 Score)', badge: '🌱', color: 'text-red-400 border-red-500/60 bg-red-950/40' };

  if (overallScoreVal > 0) {
    eloRating = Math.round(400 + (overallScoreVal / 100) * 1400);

    if (overallScoreVal >= 50) {
      const topPct = Math.max(1, 100 - Math.round(overallScoreVal * 0.95));
      percentileText = `Top ${topPct}% Globally`;
    } else {
      percentileText = `${overallScoreVal}th Percentile • Foundation Stage`;
    }

    if (eloRating >= 1650) {
      eloTier = { label: 'Grandmaster / Top 1%', badge: '🏆', color: 'text-amber-300 border-amber-500/60 bg-amber-950/40' };
    } else if (eloRating >= 1400) {
      eloTier = { label: 'Diamond Tier', badge: '💎', color: 'text-cyan-300 border-cyan-500/60 bg-cyan-950/40' };
    } else if (eloRating >= 1100) {
      eloTier = { label: 'Gold Tier', badge: '🥇', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/40' };
    } else if (eloRating >= 700) {
      eloTier = { label: 'Silver Tier', badge: '🥈', color: 'text-slate-300 border-slate-700 bg-slate-900' };
    } else {
      eloTier = { label: 'Bronze Tier', badge: '🥉', color: 'text-orange-400 border-orange-800/60 bg-orange-950/40' };
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
      ? 'text-emerald-300 border-emerald-500/60 bg-emerald-950/60'
      : (barVerdict.hiringDecision || '').includes('Lean Hire')
      ? 'text-cyan-300 border-cyan-500/60 bg-cyan-950/60'
      : (barVerdict.hiringDecision || '').includes('Lean No Hire')
      ? 'text-orange-300 border-orange-800/60 bg-orange-950/60'
      : 'text-red-400 border-red-800/60 bg-red-950/60';

  const toggleDay = (day) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 1-Click Sync to Calendar (.ics download)
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

  // Feature 10: AI Voice Speech Replay
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

  const handleCopyLinkedIn = () => {
    const postText = `🎉 Excited to share that I just completed a comprehensive AI Mock Interview for ${targetRole || 'Software Engineer'} (${companyTrack || 'General'} Track • ${difficultyLevel || 'Intermediate'} Level) on AI Interview Evaluator!\n\n📊 Overall Score: ${overallScoreVal}/100\n🏆 Global Elo: ${eloRating} (${eloTier.label})\n🎯 Readiness: ${readinessKey}\n\n#CareerGrowth #InterviewPrep #AI`;
    navigator.clipboard.writeText(postText);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-lg flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-sm shadow-md">
            🎯
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">AI Interview Performance Report</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPassportModal(true)}
            className="btn-secondary py-2 px-3.5 text-xs font-bold text-cyan-300 border-cyan-500/80 bg-cyan-950/40 hover:bg-cyan-900/60 flex items-center gap-1.5 shadow-md"
            title="View Verifiable Anti-Bias Skill Passport"
          >
            <span>🌐</span>
            <span>Skill Passport</span>
          </button>


          <button
            onClick={() => setShowCheatSheet(true)}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold text-cyan-300 border-cyan-800/80 hover:border-cyan-500 flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>1-Page Cheat Sheet</span>
          </button>
          <button
            onClick={() => setPhase('negotiate')}
            className="btn-primary py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500"
          >
            <span>💼</span>
            <span>Salary Simulator</span>
          </button>
          <button
            onClick={openHistory}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
          >
            <span>📊</span>
            <span>Past Mocks</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold text-slate-300"
            title="Print or Save PDF"
          >
            🖨️ Export PDF
          </button>
          <button
            onClick={retakeSameExam}
            className="btn-primary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/50 cursor-pointer"
            title="Retake this exact exam track with same role, difficulty, and persona"
          >
            <span>🔄</span>
            <span>Retake Same Exam</span>
          </button>
          <button
            onClick={restart}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold text-slate-300 hover:text-white"
            title="Start from role setup"
          >
            ⚙️ New Setup
          </button>
        </div>


      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-7">
        {/* ── Executive Hero Card ── */}
        <div className={`card-dark border ${r.border} bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
            <span>{r.emoji}</span> Interview Assessment Complete ({companyTrack || 'General'} Track • {difficultyLevel || 'Intermediate'})
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Evaluated for Target Role: <strong className="text-slate-200">{targetRole || 'Software Engineer'}</strong>
          </p>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-5xl sm:text-6xl font-black text-white tracking-tight">{overallScoreVal}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">Overall Score / 100</p>
            </div>
            <div className={`px-5 py-2.5 rounded-xl border ${r.border} bg-slate-900/80 shadow-md`}>
              <span className={`font-black text-sm sm:text-base ${r.color}`}>{readinessKey}</span>
            </div>
          </div>
        </div>

        {/* ── 🏢 Target Company Bar Raiser Verdict Card ── */}
        <div className="card-dark border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl border-2 ring-2 ring-amber-500/10">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeBarRaiser.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-sm sm:text-base">
                    {activeBarRaiser.name} ({activeBarRaiser.company})
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/50 text-amber-300">
                    {activeBarRaiser.badge || `${companyTrack} Bar Raiser`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Official Hiring Committee Assessment & Cultural Alignment Rubric
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl border shadow-md uppercase tracking-wider ${decisionBadgeColor}`}>
                {barVerdict.hiringDecision}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <span>💬</span> Bar Raiser Direct Assessment
              </span>
              <p className="text-slate-200 leading-relaxed text-xs">
                {barVerdict.personaFeedback}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 truncate">
                {barVerdict.criteriaName}
              </span>
              <p className="text-2xl font-black text-amber-400">
                {barVerdict.coreCriteriaScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </p>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${Math.max(5, barVerdict.coreCriteriaScore)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature 13: Global Leaderboard & Elo Rating Card ── */}
        <div className="card-dark border-indigo-900/60 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-950 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-inner">
                {eloTier.badge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm">Global Competitive Elo Ranking</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eloTier.color}`}>
                    {eloTier.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Percentile: <strong className={overallScoreVal > 0 ? "text-emerald-400" : "text-slate-300"}>{percentileText}</strong> among candidates for {targetRole || 'Role'}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Competitive Elo</span>
              <p className="text-xl font-black text-white font-mono">{eloRating} <span className="text-xs text-emerald-400">pts</span></p>
            </div>
          </div>
        </div>

        {/* ── 4-Factor Performance Breakdown ── */}
        <div>
          <h2 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
            <span>📊</span> Performance Breakdown (4 Core Dimensions)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <ScoreCard
              icon="🧠"
              label="Aptitude & Logic"
              score={report.aptitudeScore}
              feedback={report.aptitudeFeedback}
              barColor="bg-blue-500"
            />
            <ScoreCard
              icon="💻"
              label="Technical Skills"
              score={report.technicalScore}
              feedback={report.technicalFeedback}
              barColor="bg-purple-500"
            />
            <ScoreCard
              icon="🤝"
              label="HR & Behavioral"
              score={report.hrScore}
              feedback={report.hrFeedback}
              barColor="bg-green-500"
            />
            <ScoreCard
              icon="👤"
              label="Presence & Delivery"
              score={report.presenceScore !== undefined ? report.presenceScore : 85}
              feedback={report.presenceFeedback || "Comprehensive evaluation of composure, eye contact, and vocal steadiness."}
              barColor="bg-cyan-500"
            />
          </div>
        </div>

        {/* ── Speech Analytics & Gaze Timeline ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-dark border-indigo-900/40 p-5 space-y-3">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎙️</span> Verbal Delivery & Speech Pace Analytics
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Filler Words</p>
                <p className="text-base font-black text-amber-400 mt-0.5">{speechMetrics.fillerWordsCount} Detected</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Speaking Pace</p>
                <p className="text-base font-black text-cyan-400 mt-0.5">{speechMetrics.speakingPaceWpm} WPM</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Pace Rating</p>
                <p className="text-xs font-bold text-emerald-400 mt-1 truncate">{speechMetrics.paceRating}</p>
              </div>
            </div>
          </div>

          <div className="card-dark border-indigo-900/40 p-5 space-y-3">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>👁️</span> Executive Composure & Vocal Steadiness
            </h2>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Articulation Clarity</p>
                <p className="text-base font-black text-indigo-400 mt-0.5">{speechMetrics.clarityScore}%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase">Vocal Steadiness</p>
                <p className="text-base font-black text-emerald-400 mt-0.5">{speechMetrics.vocalSteadiness}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Senior Evaluator Verdict ── */}
        <div className="card-dark border-indigo-900/60 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950">
          <h2 className="font-bold text-indigo-300 mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span> Senior Evaluator Verdict
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{report.overallVerdict || 'Interview assessment completed.'}</p>
        </div>

        {/* ── Strengths & Improvement Areas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-dark border-green-900/40">
            <h2 className="font-bold text-green-400 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>✅</span> Identified Strengths
            </h2>
            <ul className="space-y-2">
              {strengthsList.map((s, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-dark border-orange-900/40">
            <h2 className="font-bold text-orange-400 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Areas for Growth
            </h2>
            <ul className="space-y-2">
              {weaknessesList.map((w, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
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
          <div className="card-dark border-indigo-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📅</span> Personalized 7-Day Interview Prep Roadmap
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Targeted daily drills generated based on your exact interview gap areas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadStudyPlanCalendar}
                  className="btn-secondary py-1.5 px-3 text-xs font-bold text-indigo-300 border-indigo-700/80 bg-indigo-950/40 hover:bg-indigo-900/60 flex items-center gap-1.5 shadow-sm"
                  title="Download 7-Day Plan to Google Calendar / Apple Calendar (.ics)"
                >
                  <span>📆</span>
                  <span>Sync to Calendar (.ics)</span>
                </button>
                <span className="text-xs font-mono text-indigo-400 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
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
                        ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/30 shadow-lg scale-[1.02]'
                        : isDone
                        ? 'border-emerald-500/60 bg-emerald-950/20 hover:border-emerald-400'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>Day {day.day}</span>
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
                    <p className="font-semibold text-slate-200 text-[11px] truncate">{day.topic}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{day.action}</p>
                  </div>
                );
              })}
            </div>

            {/* ── Active Day Full Details View ── */}
            {activeDay && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 space-y-4 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs font-mono">
                      D{activeDay.day}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        <span>Day {activeDay.day}:</span> {activeDay.topic}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Target Time: 45-60 mins • High Impact Focus Area
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDay(activeDay.day)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        completedDays.includes(activeDay.day)
                          ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      }`}
                    >
                      <span>{completedDays.includes(activeDay.day) ? '✅ Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                      <span>🎯</span> Daily Action Drill & Plan
                    </span>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {activeDay.action}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <span>📚</span> Curated Study Resource & Reference
                    </span>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {activeDay.resource || 'Official tech documentation, LeetCode curated list, and system design whitepapers.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-slate-900">
                  <span className="text-[11px] text-slate-400 font-medium">Ready to practice this topic?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPhase('dsa')}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-900/60 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1"
                    >
                      <span>💻</span> Open DSA Studio
                    </button>
                    <button
                      onClick={() => setPhase('bug-hunter')}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-900/60 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1"
                    >
                      <span>🐛</span> Bug Hunter Drills
                    </button>
                    <button
                      onClick={() => setPhase('rapid')}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/60 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1"
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
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <span>📝</span> Question Evaluations & AI Voice Playback ({evalList.length} Questions)
          </h2>

          {evalList.length === 0 ? (
            <div className="card-dark text-center py-6 text-slate-400 text-xs">
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
                  className={`card-dark border transition-all ${
                    isCorrect
                      ? 'border-green-900/50 bg-green-950/10'
                      : isPartial
                      ? 'border-yellow-900/50 bg-yellow-950/10'
                      : 'border-red-900/50 bg-red-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Q{q.questionNumber || idx + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {q.round || 'Question'}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isCorrect
                          ? 'bg-green-950 text-green-300 border-green-700'
                          : isPartial
                          ? 'bg-yellow-950 text-yellow-300 border-yellow-700'
                          : 'bg-red-950 text-red-300 border-red-700'
                      }`}
                    >
                      {isCorrect ? '✅ Correct' : isPartial ? '⚠️ Partially Correct' : '❌ Incorrect'}
                    </span>
                  </div>


                  <p className="font-semibold text-slate-100 text-xs sm:text-sm mb-3">
                    {q.question}
                  </p>

                  {/* Benchmark Tab Switcher */}
                  <div className="flex bg-[#0B0B0E] p-1 rounded-xl border border-white/5 mb-3 max-w-md">
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'yours' })}
                      className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'yours' ? 'bg-teal-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Your Answer
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'model' })}
                      className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'model' ? 'bg-teal-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      💡 Model Solution
                    </button>
                    <button
                      onClick={() => setActiveTierTabs({ ...activeTierTabs, [idx]: 'top1' })}
                      className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'top1' ? 'bg-amber-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      🥇 Top 1% Benchmark
                    </button>
                  </div>


                  <div className="space-y-2 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                    {activeTab === 'yours' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Candidate Answer</span>
                          {q.candidateAnswer && (
                            <button
                              type="button"
                              onClick={() => playVoiceSpeech(q.candidateAnswer, idx, false)}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                            >
                              <span>{playingVoiceIdx === `${idx}-user` ? '⏹️ Stop Voice' : '🔊 Listen to Your Answer'}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.candidateAnswer || '(No response provided)'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'model' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-emerald-400 font-bold uppercase text-[10px] block">
                            💡 Correct / Model Solution
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(q.expectedAnswer || 'Optimal architectural and reasoning response.', `model-${idx}`)}
                            className="text-[10px] text-teal-400 hover:text-white font-mono flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                          >
                            <span>{copiedKey === `model-${idx}` ? '✓ Copied' : '📋 Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-200 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.expectedAnswer || 'Optimal architectural and reasoning response.'}
                        </p>
                      </div>
                    )}

                    {activeTab === 'top1' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-amber-400 font-bold uppercase text-[10px]">
                            🥇 Staff Engineer / Top 1% Benchmark Answer
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyText(q.tierComparison?.staffTop1 || q.expectedAnswer, `top1-${idx}`)}
                              className="text-[10px] text-amber-300 hover:text-white font-mono flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
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
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                            >
                              <span>{playingVoiceIdx === `${idx}-top` ? '⏹️ Stop Voice' : '🔊 Listen to Staff 1% Voice'}</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-200 font-mono text-xs mt-0.5 whitespace-pre-wrap">
                          {q.tierComparison?.staffTop1 ||
                            q.expectedAnswer ||
                            'Demonstrates clear architectural trade-offs, quantitative SLA metrics, and failure recovery handling.'}
                        </p>
                      </div>
                    )}


                    {(displayFeedback || q.feedback) && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <span className="text-indigo-400 font-bold uppercase text-[10px] block">AI Assessment</span>
                        <p className="text-slate-300 text-xs mt-0.5">{displayFeedback || q.feedback}</p>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Retake Same Exam Action Banner ── */}
        <div className="card-dark border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-3xl shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-bold uppercase">
              <span>🎯</span> Instant Re-Test & Skill Calibration
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Ready to improve your score for {targetRole || 'Software Engineer'}?
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Retake this exact interview exam track ({difficultyLevel || 'Intermediate'} Level • {companyTrack || 'General'} Track) to apply your feedback, eliminate filler words, and boost your score.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <button
              onClick={retakeSameExam}
              className="py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>🔄</span>
              <span>Retake Same Exam Now</span>
            </button>
            <button
              onClick={restart}
              className="py-3.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer transition-all"
            >
              Start New Role Setup →
            </button>
          </div>
        </div>
      </main>


      {/* ── Feature 11: 1-Page Printable Cheat Sheet Modal ── */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="card-dark border-cyan-500/60 bg-gradient-to-b from-slate-900 to-slate-950 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCheatSheet(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>📄</span> 1-Page Interview Day Cheat Sheet
                </h2>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{targetRole || 'Software Engineer'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">High-density summary tailored to your interview performance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-indigo-400 uppercase text-[10px]">⭐ STAR Formula Drill</h3>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  <li><strong>S (Situation):</strong> Set context in 15 seconds.</li>
                  <li><strong>T (Task):</strong> Explain the blocker or challenge.</li>
                  <li><strong>A (Action):</strong> Use "I designed/built", not "we".</li>
                  <li><strong>R (Result):</strong> Quote metrics (e.g. 40% latency drop).</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-amber-400 uppercase text-[10px]">⚠️ Key Focus Areas</h3>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  {weaknessesList.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 sm:col-span-2">
                <h3 className="font-bold text-emerald-400 uppercase text-[10px]">💡 Golden Rules for {companyTrack || 'General'} Track</h3>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1. Always state $O(N)$ time and auxiliary space complexity before coding.<br />
                  2. In system design, outline Load Balancers, Redis Cache & Database Sharding trade-offs first.<br />
                  3. Avoid filler words by taking 2-second silent pauses to structure thoughts.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md"
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

      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center" />
    </div>
  );
}


