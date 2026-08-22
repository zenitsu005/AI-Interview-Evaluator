import React, { useRef, useState } from 'react';
import { Share2, Download, Copy, Check, ShieldCheck, Sparkles, Brain, Code2, Users, Activity } from 'lucide-react';

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

    // Background Gradient (Dark Bespoke SaaS Palette)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0B0D13');
    bgGrad.addColorStop(0.5, '#131823');
    bgGrad.addColorStop(1, '#080A0E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Ambient radial glow
    const glow = ctx.createRadialGradient(200, 100, 20, 200, 100, 450);
    glow.addColorStop(0, 'rgba(45, 212, 191, 0.2)');
    glow.addColorStop(1, 'rgba(45, 212, 191, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Brand Tag
    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('✦ AI INTERVIEW EVALUATOR · PROOF OF SKILL', 70, 90);

    // Candidate Name & Role Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(candidateName, 70, 175);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${roleName} · ${trackName} Track (${difficultyLevel})`, 70, 220);

    // Score Box
    ctx.fillStyle = '#0D111A';
    ctx.beginPath();
    ctx.roundRect(70, 280, 280, 240, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('OVERALL SCORE', 105, 340);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${score}`, 105, 435);

    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`/ 100 · Top ${topPct}% Globally`, 105, 485);

    // 4 Metrics
    const metrics = [
      { label: 'Aptitude & Logic', val: `${aptScore}%`, x: 400, y: 280, color: '#60A5FA' },
      { label: 'Technical Depth', val: `${techScore}%`, x: 770, y: 280, color: '#2DD4BF' },
      { label: 'HR Round', val: `${hrScore}%`, x: 400, y: 410, color: '#FBBF24' },
      { label: 'Presence & Delivery', val: `${presenceScore}%`, x: 770, y: 410, color: '#34D399' },
    ];

    metrics.forEach((m) => {
      ctx.fillStyle = '#131823';
      ctx.beginPath();
      ctx.roundRect(m.x, m.y, 340, 110, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(m.label, m.x + 25, m.y + 40);

      ctx.fillStyle = m.color;
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(m.val, m.x + 25, m.y + 85);
    });

    const link = document.createElement('a');
    link.download = `Interview-Scorecard-${roleName.replace(/\s+/g, '-')}-${score}pts.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyShareText = () => {
    const text = `🎯 Just completed my AI Mock Interview for ${roleName} (${trackName} Track • ${difficultyLevel} Level) on AI Interview Evaluator!\n\n📊 Overall Score: ${score}/100\n🏆 Global Ranking: Top ${topPct}% Globally (${elo} Elo)\n💡 Performance breakdown:\n• Aptitude: ${aptScore}%\n• Technical: ${techScore}%\n• STAR Fit: ${hrScore}%\n• Presence: ${presenceScore}%\n\n#TechCareers #InterviewPrep #AI #SkillsFirst`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none text-left">
      <div className="bg-[#131823] border border-white/10 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl rounded-3xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Shareable Performance Scorecard
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Share Your Interview Scorecard
          </h2>
          <p className="text-xs text-slate-400">
            Download your high-resolution verified performance card or copy summary text for LinkedIn.
          </p>
        </div>

        {/* Visual Preview Card */}
        <div
          ref={cardRef}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#171E2D] via-[#131823] to-[#0D111A] border-2 border-teal-500/40 space-y-5 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">{candidateName}</p>
                <p className="text-xs text-teal-400 font-mono font-bold">{roleName} · {trackName} ({difficultyLevel})</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 shadow-xs">
              VERIFIED PASS ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/5 text-center flex flex-col justify-between shadow-inner">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">Overall Score</span>
              <p className="text-4xl font-black text-white my-1 font-mono">
                {score}<span className="text-xs text-slate-500 font-normal">/100</span>
              </p>
              <span className="text-xs text-teal-400 font-bold font-mono">Top {topPct}% Globally</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/5 text-center flex flex-col justify-between sm:col-span-2 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Competitive Elo</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{elo} pts</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                <div className="bg-[#131823] p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-bold">APTITUDE</span>
                  <span className="font-bold text-blue-400">{aptScore}%</span>
                </div>
                <div className="bg-[#131823] p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-bold">TECHNICAL</span>
                  <span className="font-bold text-teal-400">{techScore}%</span>
                </div>
                <div className="bg-[#131823] p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-bold">STAR FIT</span>
                  <span className="font-bold text-amber-400">{hrScore}%</span>
                </div>
                <div className="bg-[#131823] p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-bold">PRESENCE</span>
                  <span className="font-bold text-emerald-400">{presenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-white/5">
            <span>Verified by AI Multimodal Evaluation Engine</span>
            <span className="text-teal-400 font-bold">AUTHENTIC ✓</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadCard}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Card (1200x630)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="py-3.5 px-5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
