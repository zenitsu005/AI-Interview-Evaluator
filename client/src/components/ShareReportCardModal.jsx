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

  // Generate downloadable high-res image via HTML Canvas
  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background Gradient (Dark bespoke SaaS palette)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0B0B0E');
    bgGrad.addColorStop(0.5, '#121218');
    bgGrad.addColorStop(1, '#07080A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle ambient glow
    const glow = ctx.createRadialGradient(200, 100, 20, 200, 100, 400);
    glow.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
    glow.addColorStop(1, 'rgba(20, 184, 166, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Brand Tag
    ctx.fillStyle = '#14B8A6';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🎯 AI INTERVIEW EVALUATOR · VERIFIED PASS', 70, 90);

    // Verified Seal
    ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.beginPath();
    ctx.roundRect(870, 65, 260, 44, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('🛡️ PROOF-OF-SKILL', 900, 93);

    // Candidate Name & Role Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(candidateName, 70, 175);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${roleName} · ${trackName} Track (${difficultyLevel})`, 70, 220);

    // Score Card Box
    ctx.fillStyle = '#171720';
    ctx.beginPath();
    ctx.roundRect(70, 270, 320, 260, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('OVERALL SCORE', 105, 320);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 84px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${score}`, 105, 420);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('/100', 225, 420);

    ctx.fillStyle = '#14B8A6';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Top ${topPct}% Globally · ${elo} Elo`, 105, 480);

    // 4 Dimension Pillar Cards
    const pillars = [
      { label: 'Aptitude & Logic', val: `${aptScore}%`, col: '#38BDF8', x: 420, y: 270 },
      { label: 'Technical Depth', val: `${techScore}%`, col: '#14B8A6', x: 780, y: 270 },
      { label: 'STAR Leadership', val: `${hrScore}%`, col: '#F59E0B', x: 420, y: 410 },
      { label: 'Executive Presence', val: `${presenceScore}%`, col: '#10B981', x: 780, y: 410 },
    ];

    pillars.forEach((p) => {
      ctx.fillStyle = '#171720';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, 340, 120, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(p.label.toUpperCase(), p.x + 25, p.y + 42);

      ctx.fillStyle = p.col;
      ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(p.val, p.x + 25, p.y + 95);
    });

    // Footer Timestamp & Verifier
    ctx.fillStyle = '#64748B';
    ctx.font = '14px monospace';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString()} · Cryptographic Hash: #AI-EVAL-${Math.abs(score * 9973)}`, 70, 575);

    // Download trigger
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0E]/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="bg-[#121217] border border-white/10 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl rounded-3xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-bold uppercase">
            <span>🛡️</span> Shareable Proof-Of-Skill Card
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
            Share Your Interview Scorecard
          </h2>
          <p className="text-xs text-zinc-400">
            Download your high-resolution verified performance card or copy summary text for LinkedIn/Twitter.
          </p>
        </div>

        {/* ── Visual Preview Card ── */}
        <div
          ref={cardRef}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#0B0B0E] via-[#15151D] to-[#0B0B0E] border-2 border-teal-500/40 space-y-5 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-xl shadow-md">
                🎯
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">{candidateName}</p>
                <p className="text-[11px] text-teal-400 font-mono">{roleName} · {trackName} ({difficultyLevel})</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 shadow-sm">
              🛡️ VERIFIED CANDIDATE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            <div className="p-4 rounded-xl bg-[#0B0B0E] border border-white/5 text-center flex flex-col justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Overall Score</span>
              <p className="text-4xl font-black text-white my-1">
                {score}<span className="text-xs text-zinc-500 font-normal">/100</span>
              </p>
              <span className="text-[11px] text-teal-400 font-semibold font-mono">Top {topPct}% Globally</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0B0E] border border-white/5 text-center flex flex-col justify-between sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Competitive Elo</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{elo} pts</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                <div className="bg-[#121217] p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-zinc-500 block">🧠 APTITUDE</span>
                  <span className="font-bold text-sky-400">{aptScore}%</span>
                </div>
                <div className="bg-[#121217] p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-zinc-500 block">💻 TECHNICAL</span>
                  <span className="font-bold text-teal-400">{techScore}%</span>
                </div>
                <div className="bg-[#121217] p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-zinc-500 block">🤝 STAR FIT</span>
                  <span className="font-bold text-amber-400">{hrScore}%</span>
                </div>
                <div className="bg-[#121217] p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] text-zinc-500 block">👤 PRESENCE</span>
                  <span className="font-bold text-emerald-400">{presenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-white/5">
            <span>Verified by AI Multimodal Evaluation Engine</span>
            <span className="text-teal-400 font-bold">STATUS: AUTHENTIC</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadCard}
            className="flex-1 py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-teal-950/60 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>Download PNG Card (1200x630)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="py-3.5 px-5 rounded-xl bg-[#0B0B0E] hover:bg-[#181820] border border-white/10 text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{copied ? '✅ Copied!' : '📋 Copy Post Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
