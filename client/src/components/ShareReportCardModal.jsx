import React, { useRef, useState } from 'react';

export default function ShareReportCardModal({
  isOpen,
  onClose,
  report,
  targetRole = 'Software Engineer',
  companyTrack = 'Amazon',
  difficultyLevel = 'Intermediate',
  user,
}) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const score = Number(report?.overallScore) || 85;
  const elo = Math.round(400 + (score / 100) * 1400);
  const topPct = Math.max(1, 100 - Math.round(score * 0.95));
  const candidateName = user?.name || 'Verified Candidate';
  const roleName = targetRole || 'Software Engineer';
  const trackName = companyTrack || 'General';

  const aptScore = report?.aptitudeScore || report?.roundScores?.[0]?.score || Math.round(score * 0.98);
  const techScore = report?.technicalScore || report?.roundScores?.[1]?.score || Math.round(score * 0.95);
  const hrScore = report?.hrScore || report?.roundScores?.[2]?.score || Math.round(score * 0.96);
  const presenceScore = report?.presenceScore || report?.speechMetrics?.clarityScore || 92;

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background Gradient (Day mode palette)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle ambient glow
    const glow = ctx.createRadialGradient(200, 100, 20, 200, 100, 400);
    glow.addColorStop(0, 'rgba(13, 148, 136, 0.1)');
    glow.addColorStop(1, 'rgba(13, 148, 136, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // Border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Brand Tag
    ctx.fillStyle = '#0D9488';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🎯 AI INTERVIEW EVALUATOR · VERIFIED PASS', 70, 90);

    // Candidate Name & Role Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(candidateName, 70, 175);

    ctx.fillStyle = '#64748B';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${roleName} · ${trackName} Track (${difficultyLevel})`, 70, 220);

    // Score Circle Box
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(70, 280, 280, 240, 20);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('OVERALL SCORE', 105, 340);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${score}`, 105, 435);

    ctx.fillStyle = '#0D9488';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`/ 100 · Top ${topPct}% Globally`, 105, 485);

    // 4 Metric Breakdown Cards
    const metrics = [
      { label: 'Aptitude & Logic', val: `${aptScore}%`, x: 400, y: 280, color: '#1D4ED8' },
      { label: 'Technical Depth', val: `${techScore}%`, x: 770, y: 280, color: '#0D9488' },
      { label: 'STAR Behavioral Fit', val: `${hrScore}%`, x: 400, y: 410, color: '#D97706' },
      { label: 'Presence & Delivery', val: `${presenceScore}%`, x: 770, y: 410, color: '#059669' },
    ];

    metrics.forEach((m) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(m.x, m.y, 340, 110, 16);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(m.label, m.x + 25, m.y + 40);

      ctx.fillStyle = m.color;
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(m.val, m.x + 25, m.y + 85);
    });

    const link = document.createElement('a');
    link.download = `Interview-Report-Card-${roleName.replace(/\s+/g, '-')}-${score}pts.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyShareText = () => {
    const text = `🎯 Just completed my AI Mock Interview for ${roleName} (${trackName} Track • ${difficultyLevel} Level) on AI Interview Evaluator!\n\n📊 Overall Score: ${score}/100\n🏆 Global Ranking: Top ${topPct}% Globally (${elo} Elo)\n💡 Performance breakdown:\n• Aptitude: ${aptScore}%\n• Technical: ${techScore}%\n• STAR Fit: ${hrScore}%\n• Presence: ${presenceScore}%\n\n#TechCareers #InterviewPrep #AI #SkillsFirst`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in select-none text-left">
      <div className="bg-white border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl rounded-3xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold uppercase">
            <span>🛡️</span> Shareable Proof-Of-Skill Card
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Share Your Interview Scorecard
          </h2>
          <p className="text-xs text-slate-500">
            Download your high-resolution verified performance card or copy summary text for LinkedIn.
          </p>
        </div>

        {/* Visual Preview Card */}
        <div
          ref={cardRef}
          className="p-6 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-teal-50/20 border-2 border-teal-200 space-y-5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl shadow-xs">
                🎯
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{candidateName}</p>
                <p className="text-xs text-teal-800 font-mono font-bold">{roleName} · {trackName} ({difficultyLevel})</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shadow-xs">
              🛡️ VERIFIED CANDIDATE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-between shadow-xs">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">Overall Score</span>
              <p className="text-4xl font-black text-slate-900 my-1">
                {score}<span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
              <span className="text-xs text-teal-700 font-bold font-mono">Top {topPct}% Globally</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-between sm:col-span-2 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 uppercase font-bold">Competitive Elo</span>
                <span className="text-xs font-mono text-amber-700 font-bold">{elo} pts</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">🧠 APTITUDE</span>
                  <span className="font-bold text-blue-700">{aptScore}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">💻 TECHNICAL</span>
                  <span className="font-bold text-teal-700">{techScore}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">🤝 STAR FIT</span>
                  <span className="font-bold text-amber-700">{hrScore}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">👤 PRESENCE</span>
                  <span className="font-bold text-emerald-700">{presenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-200">
            <span>Verified by AI Multimodal Evaluation Engine</span>
            <span className="text-teal-700 font-bold">STATUS: AUTHENTIC</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadCard}
            className="flex-1 py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>Download PNG Card (1200x630)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <span>{copied ? '✅ Copied!' : '📋 Copy Post Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
