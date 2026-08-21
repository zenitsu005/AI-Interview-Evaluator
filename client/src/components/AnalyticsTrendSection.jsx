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

  const latestElo = trendData[trendData.length - 1]?.elo || 1550;
  const firstElo = trendData[0]?.elo || 1350;
  const eloDiff = latestElo - firstElo;

  const latestFillers = trendData[trendData.length - 1]?.fillers || 2;
  const firstFillers = trendData[0]?.fillers || 7;
  const fillerReductionPct = firstFillers > 0
    ? Math.round(((firstFillers - latestFillers) / firstFillers) * 100)
    : 75;

  // Topic Mastery Matrix Data
  const latestSession = trendData[trendData.length - 1];
  const topics = [
    {
      category: 'Algorithms & Problem Solving',
      score: latestSession.aptitude,
      level: latestSession.aptitude >= 85 ? 'Expert' : latestSession.aptitude >= 70 ? 'Advanced' : 'Developing',
      color: 'text-sky-400 bg-sky-950/40 border-sky-800/60',
      heatColor: 'bg-sky-500',
      subtopics: ['Time/Space Complexity', 'Graph / DP Invariants', 'Edge-case Boundary Checks'],
    },
    {
      category: 'Distributed Systems & Architecture',
      score: latestSession.technical,
      level: latestSession.technical >= 85 ? 'Expert' : latestSession.technical >= 70 ? 'Advanced' : 'Developing',
      color: 'text-teal-400 bg-teal-950/40 border-teal-800/60',
      heatColor: 'bg-teal-500',
      subtopics: ['Idempotency & Queues', 'CAP & Sharding Trade-offs', 'High Concurrency Bottlenecks'],
    },
    {
      category: 'STAR Leadership & Behavioral Fit',
      score: latestSession.hr,
      level: latestSession.hr >= 85 ? 'Master' : latestSession.hr >= 70 ? 'Proficient' : 'Developing',
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
      heatColor: 'bg-amber-500',
      subtopics: ['Data-Driven Ownership', 'Cross-Team Conflict Resolution', 'Executive Stakeholder Alignment'],
    },
    {
      category: 'Executive Delivery & Vocal Steadiness',
      score: latestSession.presence,
      level: latestSession.presence >= 85 ? 'Executive Tier' : latestSession.presence >= 70 ? 'Articulate' : 'Developing',
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
      heatColor: 'bg-emerald-500',
      subtopics: ['Filler Word Suppression', 'Structured WPM Cadence', 'Camera Eye Contact & Posture'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Analytics Sparkline Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Elo Growth Trendline */}
        <div className="card-dark border-teal-500/30 bg-[#121217] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                📈 Elo Rating Trajectory
              </span>
              <h3 className="text-sm font-bold text-white">
                {latestElo} pts <span className="text-xs text-emerald-400 font-mono">({eloDiff >= 0 ? `+${eloDiff}` : eloDiff} pts)</span>
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-[#0B0B0E] px-2.5 py-1 rounded-lg border border-white/5">
              Past {trendData.length} Mocks
            </span>
          </div>

          {/* SVG Sparkline Graph */}
          <div className="h-28 w-full relative flex items-end justify-between pt-4 px-2 bg-[#0B0B0E] rounded-xl border border-white/5">
            {trendData.map((d, i) => {
              const heightPct = Math.min(100, Math.max(20, ((d.elo - 1000) / 1000) * 100));
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <div className="text-[10px] font-mono text-teal-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.elo}
                  </div>
                  <div
                    className="w-8 sm:w-10 rounded-t-lg bg-gradient-to-t from-teal-900 to-teal-400 transition-all duration-500 group-hover:brightness-125 relative shadow-md shadow-teal-500/20"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[60px]">
                    {d.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Filler Word Reduction Rate */}
        <div className="card-dark border-amber-500/30 bg-[#121217] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                🎙️ Speech Clarity & Filler Suppression
              </span>
              <h3 className="text-sm font-bold text-white">
                {fillerReductionPct >= 0 ? `${fillerReductionPct}% Reduction` : 'Calibrating'}
                <span className="text-xs text-amber-300 font-mono ml-2">({latestFillers} fillers now)</span>
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-[#0B0B0E] px-2.5 py-1 rounded-lg border border-white/5">
              Cadence HUD
            </span>
          </div>

          {/* Filler Word Progression Bar Chart */}
          <div className="h-28 w-full relative flex items-end justify-between pt-4 px-2 bg-[#0B0B0E] rounded-xl border border-white/5">
            {trendData.map((d, i) => {
              const barHeight = Math.min(100, Math.max(15, (d.fillers / 10) * 100));
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <div className="text-[10px] font-mono text-amber-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.fillers}w
                  </div>
                  <div
                    className="w-8 sm:w-10 rounded-t-lg bg-gradient-to-t from-amber-900 to-amber-400 transition-all duration-500 group-hover:brightness-125 relative shadow-md shadow-amber-500/20"
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[60px]">
                    {d.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Topic Mastery Matrix Heatmap ── */}
      <div className="card-dark border-white/10 bg-[#121217] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
              🧭 Skill Competency & Gap Analysis
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Topic Mastery Heatmap</span>
              <span className="text-[11px] text-zinc-400 font-normal">({targetRole || 'Software Engineer'})</span>
            </h3>
          </div>
          <span className="text-[11px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-lg">
            Real-Time Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {topics.map((t) => (
            <div
              key={t.category}
              className="p-4 rounded-2xl bg-[#0B0B0E] border border-white/5 hover:border-white/10 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-200">{t.category}</h4>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${t.color}`}>
                  {t.level} ({t.score}%)
                </span>
              </div>

              {/* Heatmap Bar */}
              <div className="h-1.5 bg-[#181820] rounded-full overflow-hidden border border-white/5">
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
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#121217] text-zinc-400 border border-white/5"
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
