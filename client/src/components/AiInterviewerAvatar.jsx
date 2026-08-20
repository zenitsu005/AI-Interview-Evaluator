import React, { useEffect, useState, useRef } from 'react';

export default function AiInterviewerAvatar({
  isSpeaking,
  persona,
  companyTrack = 'Amazon',
  currentQuestionText = '',
  onReplaySpeech,
  speechRate = 1.0,
  onSpeechRateChange,
}) {
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState('listening'); // 'speaking' | 'listening' | 'probing' | 'approving'
  const [showCaptions, setShowCaptions] = useState(true);
  const [audioWaveBarHeights, setAudioWaveBarHeights] = useState([8, 14, 22, 16, 10]);

  // Determine current emotion state
  useEffect(() => {
    if (isSpeaking) {
      setAvatarEmotion('speaking');
    } else {
      // Natural cycle between listening attentively and occasional approving/probing
      setAvatarEmotion('listening');
    }
  }, [isSpeaking]);

  // Animate mouth and soundwave bars when speaking
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen(Math.floor(Math.random() * 10) + 2);
        setAudioWaveBarHeights([
          Math.floor(Math.random() * 16) + 6,
          Math.floor(Math.random() * 24) + 8,
          Math.floor(Math.random() * 30) + 12,
          Math.floor(Math.random() * 22) + 8,
          Math.floor(Math.random() * 16) + 6,
        ]);
      }, 100);
    } else {
      setMouthOpen(0);
      setAudioWaveBarHeights([6, 8, 10, 8, 6]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Occasional natural eye blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 160);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const personaId = persona?.id || (companyTrack.toLowerCase().includes('google') ? 'google' : 'amazon');
  const personaName = persona?.name || (personaId === 'google' ? 'Dr. Sanjay Rao' : personaId === 'amazon' ? 'Marcus Vance' : 'Senior Bar Raiser');
  const personaTitle = persona?.title || (personaId === 'google' ? 'Google L7 Distinguished SWE' : personaId === 'amazon' ? 'Amazon Principal Bar Raiser' : 'Hiring Committee Lead');
  const personaAvatar = persona?.avatar || '👔';
  const personaCatchphrase = persona?.catchphrase || 'Demanding high ownership and measurable metrics.';

  // Theme styling based on persona
  const isFemalePersona = ['yc', 'microsoft', 'meta'].includes(personaId);
  const ringColor = isSpeaking ? '#6366f1' : '#334155';
  const suitColor = personaId === 'yc' ? '#18181b' : personaId === 'wallstreet' ? '#0f172a' : personaId === 'google' ? '#1e293b' : '#1e1b4b';
  const tieColor = personaId === 'amazon' ? '#f59e0b' : personaId === 'wallstreet' ? '#ef4444' : personaId === 'google' ? '#38bdf8' : '#818cf8';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden select-none p-3 sm:p-4">
      {/* Studio Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${isSpeaking ? 'bg-indigo-600/25 opacity-100' : 'bg-slate-700/10 opacity-50'}`} />
        <div className="w-40 h-40 bg-amber-500/10 rounded-full blur-2xl -top-10" />
      </div>

      {/* Top Header Controls within Avatar Tile */}
      <div className="w-full flex items-center justify-between z-20 text-[11px] gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md">
          <span className="text-sm">{personaAvatar}</span>
          <span className="font-bold">{personaName}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-semibold text-[10px]">{companyTrack} Bar Raiser</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Replay Audio Button */}
          {onReplaySpeech && (
            <button
              type="button"
              onClick={onReplaySpeech}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition-all font-semibold flex items-center gap-1 shadow-sm"
              title="Re-listen to question"
            >
              <span>🔊</span>
              <span className="hidden sm:inline">Re-Listen</span>
            </button>
          )}

          {/* Subtitle Toggle */}
          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-2 py-1 rounded-lg border font-mono font-bold text-[10px] transition-all ${
              showCaptions ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
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
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Collars & Tie / Tech Hoodie */}
          {personaId === 'yc' ? (
            <path d="M 85 145 Q 100 170 115 145" stroke="#3f3f46" strokeWidth="4" fill="none" />
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

          {/* Eyebrows (Dynamic Expression) */}
          {avatarEmotion === 'probing' ? (
            <>
              <path d="M 72 68 Q 82 62 90 68" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 110 72 Q 118 72 128 68" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M 72 70 Q 82 66 90 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 110 70 Q 118 66 128 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

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

          {/* Glasses for Academic / Google persona */}
          {personaId === 'google' && (
            <>
              <rect x="68" y="74" width="24" height="18" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="108" y="74" width="24" height="18" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="92" y1="82" x2="108" y2="82" stroke="#38bdf8" strokeWidth="2.5" />
            </>
          )}

          {/* Nose */}
          <path d="M 100 88 L 96 102 L 102 103" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Mouth (Dynamic Lip-Sync Opening) */}
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

      {/* Bottom: Dynamic Live Subtitles & Broadcast Waveform */}
      <div className="w-full z-20 space-y-2">
        {showCaptions && currentQuestionText && (
          <div className="bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-left shadow-lg">
            <p className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1 mb-0.5">
              <span>💬</span>
              <span>{personaName}:</span>
            </p>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
              "{currentQuestionText}"
            </p>
          </div>
        )}

        {/* Live Audio Visualizer Wave */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{isSpeaking ? 'Interviewer Speaking...' : 'Interviewer Listening...'}</span>
          </div>

          {/* Waveform Equalizer */}
          <div className="flex items-end gap-1 h-4">
            {audioWaveBarHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-100"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
