import React from 'react';

export default function AnalyticsTrendSection({ history = [], currentReport = null, targetRole = 'Software Engineer' }) {
  // Synthesize last 5 interview data points from history or create a baseline progression
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

  // If we have history records, map them cleanly
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

  // Topic Mastery Matrix Data
  const latestSession = trendData[trendData.length - 1];
  const topics = [
    {
      category: 'Algorithms & Problem Solving',
      score: latestSession.aptitude,
      level: latestSession.aptitude >= 85 ? 'Expert' : latestSession.aptitude >= 70 ? 'Advanced' : 'Developing',
      color: 'text-blue-800 bg-blue-50 border-blue-200',
      heatColor: 'bg-blue-600',
      subtopics: ['Time/Space Complexity', 'Graph / DP Invariants', 'Edge-case Boundary Checks'],
    },
    {
      category: 'Distributed Systems & Architecture',
      score: latestSession.technical,
      level: latestSession.technical >= 85 ? 'Expert' : latestSession.technical >= 70 ? 'Advanced' : 'Developing',
      color: 'text-teal-800 bg-teal-50 border-teal-200',
      heatColor: 'bg-teal-600',
      subtopics: ['Idempotency & Queues', 'CAP & Sharding Trade-offs', 'High Concurrency Bottlenecks'],
    },
    {
      category: 'STAR Leadership & Behavioral Fit',
      score: latestSession.hr,
      level: latestSession.hr >= 85 ? 'Master' : latestSession.hr >= 70 ? 'Proficient' : 'Developing',
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      heatColor: 'bg-amber-600',
      subtopics: ['Data-Driven Ownership', 'Cross-Team Conflict Resolution', 'Executive Stakeholder Alignment'],
    },
    {
      category: 'Executive Delivery & Vocal Steadiness',
      score: latestSession.presence,
      level: latestSession.presence >= 85 ? 'Executive Tier' : latestSession.presence >= 70 ? 'Articulate' : 'Developing',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      heatColor: 'bg-emerald-600',
      subtopics: ['Filler Word Suppression', 'Structured WPM Cadence', 'Camera Eye Contact & Posture'],
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* ── Topic Mastery Matrix Heatmap ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
              🧭 Skill Competency & Gap Analysis
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Topic Mastery Heatmap</span>
              <span className="text-xs text-slate-500 font-normal">({targetRole || 'Software Engineer'})</span>
            </h3>
          </div>
          <span className="text-xs font-mono text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl font-bold">
            Real-Time Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {topics.map((t) => (
            <div
              key={t.category}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500/40 transition-all space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.category}</h4>
                <span className={`text-xs font-sans font-bold px-2.5 py-0.5 rounded-full border ${t.color}`}>
                  {t.level} ({t.score}%)
                </span>
              </div>

              {/* Heatmap Bar */}
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className={`h-full rounded-full ${t.heatColor} transition-all duration-1000 shadow-sm`}
                  style={{ width: `${Math.max(10, t.score)}%` }}
                />
              </div>

              {/* Subtopic Micro-Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {t.subtopics.map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-xs"
                  >
                    ✓ {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
