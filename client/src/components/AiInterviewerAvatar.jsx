import React, { useState, useEffect } from 'react';

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
  const [avatarEmotion, setAvatarEmotion] = useState('attentive'); // 'neutral' | 'probing' | 'attentive' | 'nodding'
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

  // Dynamic Avatar Profile Parameters
  const personaId = persona?.id || (companyTrack?.toLowerCase() === 'google' ? 'google' : companyTrack?.toLowerCase() === 'amazon' ? 'amazon' : 'general');
  const personaName = persona?.name || (personaId === 'google' ? 'Dr. Sanjay Rao' : personaId === 'amazon' ? 'Marcus Vance' : 'Senior Bar Raiser');
  const personaAvatar = persona?.avatar || '👔';

  // Theme styling based on persona
  const isFemalePersona = ['yc', 'microsoft', 'meta'].includes(personaId);
  const ringColor = isSpeaking ? '#0D9488' : '#cbd5e1';
  const suitColor = personaId === 'yc' ? '#334155' : personaId === 'wallstreet' ? '#1e293b' : personaId === 'google' ? '#1e293b' : '#334155';
  const tieColor = personaId === 'amazon' ? '#d97706' : personaId === 'wallstreet' ? '#ef4444' : personaId === 'google' ? '#0ea5e9' : '#0d9488';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-50 border border-slate-200 overflow-hidden select-none p-3 sm:p-4 rounded-2xl">
      {/* Studio Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${isSpeaking ? 'bg-teal-500/10 opacity-100' : 'bg-slate-200/40 opacity-50'}`} />
      </div>

      {/* Top Header Controls within Avatar Tile */}
      <div className="w-full flex items-center justify-between z-20 gap-2">
        {/* Interviewer ID Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm border ${
            isSpeaking ? 'border-teal-400 bg-teal-50 shadow-teal-500/10' : 'border-slate-200 bg-white'
          } transition-all`}>
            {personaAvatar}
            {/* Live speaking indicator */}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
            )}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate">{personaName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wide whitespace-nowrap">
                {companyTrack}
              </span>
              <span className="text-[9px] text-slate-500 truncate">Bar Raiser</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Replay Audio Button */}
          {onReplaySpeech && (
            <button
              type="button"
              onClick={onReplaySpeech}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs font-semibold shadow-xs cursor-pointer"
              title="Re-listen to question"
            >
              <span>🔊</span>
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {/* Subtitle Toggle */}
          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-2 py-1 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
              showCaptions ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-white border-slate-200 text-slate-500'
            }`}
            title="Toggle Live Subtitles"
          >
            CC
          </button>
        </div>
      </div>

      {/* Center: Reactive SVG Animated Avatar */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 my-auto transition-transform duration-300 transform">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
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

          {/* Eyebrows */}
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

          {/* Glasses for Google persona */}
          {personaId === 'google' && (
            <>
              <rect x="68" y="74" width="24" height="18" rx="5" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="108" y="74" width="24" height="18" rx="5" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="92" y1="82" x2="108" y2="82" stroke="#0284c7" strokeWidth="2.5" />
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

      {/* Bottom: Dynamic Live Subtitles & Broadcast Waveform */}
      <div className="w-full z-20 space-y-2 text-left">
        {showCaptions && currentQuestionText && (
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-left shadow-sm">
            <p className="text-[10px] text-teal-700 font-mono font-bold flex items-center gap-1 mb-0.5">
              <span>💬</span>
              <span>{personaName}:</span>
            </p>
            <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed font-medium">
              "{currentQuestionText}"
            </p>
          </div>
        )}

        {/* Live Audio Visualizer Wave */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-teal-600 animate-ping' : 'bg-emerald-600'}`} />
            <span>{isSpeaking ? 'Interviewer Speaking...' : 'Interviewer Listening...'}</span>
          </div>

          {/* Waveform Equalizer */}
          <div className="flex items-end gap-1 h-4">
            {audioWaveBarHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-teal-600 rounded-full transition-all duration-100"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
