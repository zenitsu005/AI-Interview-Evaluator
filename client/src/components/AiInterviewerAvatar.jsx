import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, MessageSquare, Radio, Sparkles } from 'lucide-react';

export default function AiInterviewerAvatar({
  isSpeaking = false,
  persona = null,
  companyTrack = 'Amazon',
  currentQuestionText = '',
  onReplaySpeech = null,
  speechRate = 1.0,
  onSpeechRateChange = null,
}) {
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState('attentive');
  const [audioWaveBarHeights, setAudioWaveBarHeights] = useState([4, 8, 14, 6, 12, 18, 8, 10]);
  const [showCaptions, setShowCaptions] = useState(true);

  // Dynamic Lip-Sync Mouth Animation during Speech Synthesis
  useEffect(() => {
    let interval = null;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen(Math.floor(Math.random() * 12) + 2);
        setAudioWaveBarHeights([
          Math.floor(Math.random() * 16) + 4,
          Math.floor(Math.random() * 22) + 6,
          Math.floor(Math.random() * 26) + 8,
          Math.floor(Math.random() * 18) + 4,
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 28) + 8,
          Math.floor(Math.random() * 16) + 4,
          Math.floor(Math.random() * 12) + 4,
        ]);
      }, 90);
    } else {
      setMouthOpen(0);
      setAudioWaveBarHeights([3, 4, 3, 5, 4, 3, 4, 3]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural Eye Blink Cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 180);
    }, Math.random() * 3000 + 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const personaId = persona?.id || (companyTrack?.toLowerCase() === 'google' ? 'google' : companyTrack?.toLowerCase() === 'amazon' ? 'amazon' : 'general');
  const personaName = persona?.name || (personaId === 'google' ? 'Dr. Sanjay Rao' : personaId === 'amazon' ? 'Marcus Vance' : 'Senior Bar Raiser');

  const isFemalePersona = ['yc', 'microsoft', 'meta'].includes(personaId);
  const ringColor = isSpeaking ? '#2DD4BF' : '#334155';
  const suitColor = personaId === 'yc' ? '#1E293B' : personaId === 'wallstreet' ? '#0F172A' : personaId === 'google' ? '#1E293B' : '#0F172A';
  const tieColor = personaId === 'amazon' ? '#F59E0B' : personaId === 'wallstreet' ? '#EF4444' : personaId === 'google' ? '#0EA5E9' : '#14B8A6';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#131823] border border-white/10 overflow-hidden select-none p-3 sm:p-4 rounded-2xl shadow-xl">
      {/* Studio Ambient Backlight Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${
          isSpeaking ? 'bg-teal-500/20 opacity-100' : 'bg-teal-500/5 opacity-50'
        }`} />
      </div>

      {/* Top Header Controls within Avatar Tile */}
      <div className="w-full flex items-center justify-between z-20 gap-2">
        {/* Interviewer ID Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs shadow-md border ${
            isSpeaking ? 'border-teal-400 bg-teal-950/80 shadow-teal-500/20 text-teal-300' : 'border-white/10 bg-[#171E2D] text-slate-300'
          } transition-all`}>
            <Sparkles className="w-4 h-4" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-[#131823] animate-pulse" />
            )}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-bold text-white leading-tight truncate">{personaName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30 uppercase tracking-wide whitespace-nowrap font-mono">
                {companyTrack}
              </span>
              <span className="text-[9px] text-slate-400 truncate">Bar Raiser</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Replay Audio Button */}
          {onReplaySpeech && (
            <button
              type="button"
              onClick={onReplaySpeech}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#171E2D] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold shadow-xs cursor-pointer"
              title="Re-listen to question"
            >
              <RotateCcw className="w-3 h-3 text-teal-400" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {/* Subtitle Toggle */}
          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-2.5 py-1 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
              showCaptions ? 'bg-teal-950/80 border-teal-500/40 text-teal-300' : 'bg-[#171E2D] border-white/10 text-slate-400'
            }`}
            title="Toggle Live Subtitles"
          >
            CC
          </button>
        </div>
      </div>

      {/* Center: Reactive SVG Animated Avatar */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 my-auto transition-transform duration-300 transform">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          {/* Animated Frequency Halo Ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeDasharray={isSpeaking ? '8 4' : 'none'}
            className={isSpeaking ? 'animate-spin' : ''}
            style={{ animationDuration: '8s' }}
          />

          {/* Shoulders & Clothing */}
          <path
            d="M 32 195 C 38 142, 162 142, 168 195 Z"
            fill={suitColor}
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Collars & Tie */}
          {personaId === 'yc' ? (
            <path d="M 85 145 Q 100 170 115 145" stroke="#334155" strokeWidth="4" fill="none" />
          ) : (
            <>
              <polygon points="100,145 92,192 100,200 108,192" fill={tieColor} />
              <polygon points="88,145 100,162 112,145" fill="#f8fafc" />
            </>
          )}

          {/* Head & Neck */}
          <rect x="88" y="125" width="24" height="25" fill="#f87171" rx="4" opacity="0.9" />
          <ellipse cx="100" cy="92" rx="46" ry="52" fill="#fca5a5" />

          {/* Hair Styling */}
          {isFemalePersona ? (
            <path
              d="M 48 95 C 48 35, 152 35, 152 95 C 158 135, 140 160, 134 160 C 130 135, 142 90, 140 80 C 120 50, 80 50, 60 80 C 58 90, 70 135, 66 160 C 60 160, 42 135, 48 95 Z"
              fill="#0f172a"
            />
          ) : (
            <path
              d="M 54 80 C 54 40, 146 40, 146 80 C 130 52, 70 52, 54 80 Z"
              fill="#0f172a"
            />
          )}

          {/* Eyebrows */}
          <path d="M 72 70 Q 82 66 90 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 110 70 Q 118 66 128 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Eyes with Natural Blink */}
          {eyeBlink ? (
            <>
              <line x1="72" y1="84" x2="88" y2="84" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <line x1="112" y1="84" x2="128" y2="84" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="80" cy="84" rx="8" ry="6" fill="#ffffff" />
              <ellipse cx="120" cy="84" rx="8" ry="6" fill="#ffffff" />
              <circle cx="80" cy="84" r="4" fill="#0f172a" />
              <circle cx="120" cy="84" r="4" fill="#0f172a" />
              <circle cx="82" cy="82" r="1.5" fill="#ffffff" />
              <circle cx="122" cy="82" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Glasses for Google persona */}
          {personaId === 'google' && (
            <>
              <rect x="68" y="74" width="24" height="18" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="108" y="74" width="24" height="18" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="92" y1="82" x2="108" y2="82" stroke="#38bdf8" strokeWidth="2.5" />
            </>
          )}

          {/* Nose */}
          <path d="M 100 88 L 96 102 L 102 103" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Mouth */}
          {isSpeaking ? (
            <ellipse
              cx="100"
              cy="120"
              rx="11"
              ry={mouthOpen}
              fill="#881337"
              stroke="#e11d48"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M 92 120 Q 100 126 108 120"
              stroke="#881337"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </div>

      {/* Bottom: Subtitles & Audio Waveform Visualizer */}
      <div className="w-full z-20 space-y-2 text-left">
        {showCaptions && currentQuestionText && (
          <div className="bg-[#0B0D13]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-left shadow-lg">
            <p className="text-[10px] text-teal-400 font-mono font-bold flex items-center gap-1 mb-0.5">
              <MessageSquare className="w-3 h-3" />
              <span>{personaName}:</span>
            </p>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
              "{currentQuestionText}"
            </p>
          </div>
        )}

        {/* Live Audio Visualizer */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-teal-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{isSpeaking ? 'Neural Voice Speaking...' : 'AI Listening...'}</span>
          </div>

          {/* Waveform Equalizer */}
          <div className="flex items-end gap-1 h-4">
            {audioWaveBarHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full transition-all duration-100"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
