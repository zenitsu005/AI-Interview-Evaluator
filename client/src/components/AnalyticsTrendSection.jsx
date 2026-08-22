import React from 'react';
import { Compass, TrendingUp, BarChart3, Activity, Brain, Code2, Users, Radio, CheckCircle2 } from 'lucide-react';

export default function AnalyticsTrendSection({ history = [], currentReport = null, targetRole = 'Software Engineer' }) {
  const sessions = history.length > 0
    ? history.slice(-5)
    : [
        {
          date: 'Initial Assessment',
          overallScore: currentReport?.overallScore ? Math.max(50, currentReport.overallScore - 15) : 68,
          fillerCount: 7,
          elo: currentReport?.overallScore ? Math.round(400 + ((currentReport.overallScore - 15) / 100) * 1400) : 1350,
          aptitude: 70,
          technical: 65,
          hr: 72,
          presence: 75,
        },
        {
          date: 'Current Performance',
          overallScore: currentReport?.overallScore || 85,
          fillerCount: currentReport?.speechMetrics?.fillerWordsCount || 2,
          elo: Math.round(400 + ((currentReport?.overallScore || 85) / 100) * 1400),
          aptitude: currentReport?.aptitudeScore || 88,
          technical: currentReport?.technicalScore || 85,
          hr: currentReport?.hrScore || 87,
          presence: currentReport?.presenceScore || 92,
        },
      ];

  const trendData = sessions.map((s, idx) => {
    const score = s.overallScore || s.report?.overallScore || 75;
    const fillers = s.report?.speechMetrics?.fillerWordsCount !== undefined
      ? s.report.speechMetrics.fillerWordsCount
      : Math.max(1, 8 - idx * 2);
    const elo = Math.round(400 + (score / 100) * 1400);
    return {
      sessionName: s.targetRole || `Session #${idx + 1}`,
      date: s.date ? new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Mock ${idx + 1}`,
      score,
      fillers,
      elo,
      aptitude: s.report?.aptitudeScore || s.aptitude || Math.round(score * 0.96),
      technical: s.report?.technicalScore || s.technical || Math.round(score * 0.94),
      hr: s.report?.hrScore || s.hr || Math.round(score * 0.95),
      presence: s.report?.presenceScore || s.presence || 90,
    };
  });

  const latestSession = trendData[trendData.length - 1];
  const topics = [
    {
      category: 'Algorithms & Problem Solving',
      icon: Brain,
      score: latestSession.aptitude,
      level: latestSession.aptitude >= 85 ? 'Expert' : latestSession.aptitude >= 70 ? 'Advanced' : 'Developing',
      color: 'text-blue-300 bg-blue-950/80 border-blue-500/40',
      heatColor: 'bg-blue-500',
      subtopics: ['Time/Space Complexity', 'Graph / DP Invariants', 'Edge-case Boundary Checks'],
    },
    {
      category: 'Distributed Systems & Architecture',
      icon: Code2,
      score: latestSession.technical,
      level: latestSession.technical >= 85 ? 'Expert' : latestSession.technical >= 70 ? 'Advanced' : 'Developing',
      color: 'text-teal-300 bg-teal-950/80 border-teal-500/40',
      heatColor: 'bg-teal-500',
      subtopics: ['Idempotency & Queues', 'CAP & Sharding Trade-offs', 'High Concurrency Bottlenecks'],
    },
    {
      category: 'HR Round',
      icon: Users,
      score: latestSession.hr,
      level: latestSession.hr >= 85 ? 'Master' : latestSession.hr >= 70 ? 'Proficient' : 'Developing',
      color: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
      heatColor: 'bg-amber-500',
      subtopics: ['Data-Driven Ownership', 'Cross-Team Conflict Resolution', 'Executive Stakeholder Alignment'],
    },
    {
      category: 'Executive Delivery & Vocal Steadiness',
      icon: Activity,
      score: latestSession.presence,
      level: latestSession.presence >= 85 ? 'Executive Tier' : latestSession.presence >= 70 ? 'Articulate' : 'Developing',
      color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40',
      heatColor: 'bg-emerald-500',
      subtopics: ['Filler Word Suppression', 'Structured WPM Cadence', 'Camera Eye Contact & Posture'],
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* ── Topic Mastery Matrix Heatmap ── */}
      <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Skill Competency & Gap Analysis
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Topic Mastery Heatmap</span>
              <span className="text-xs text-slate-400 font-normal">({targetRole || 'Software Engineer'})</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => {
            const Icon = t.icon || Brain;
            return (
              <div key={t.category} className="p-4 rounded-2xl bg-[#0D111A] border border-white/5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white">{t.category}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${t.color}`}>
                    {t.level}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Mastery Index</span>
                    <span className="font-bold text-white font-mono">{t.score}%</span>
                  </div>
                  <div className="h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${t.heatColor} rounded-full transition-all duration-1000`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.subtopics.map((sub, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#131823] text-slate-300 border border-white/5 font-mono">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
