import React, { useState, useEffect } from 'react';
import {
  IconRotateClockwise2 as RotateCcw,
  IconMessageDots as MessageSquare,
  IconSparkles as Sparkles,
} from '@tabler/icons-react';

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
  const [audioWaveBarHeights, setAudioWaveBarHeights] = useState([4, 8, 14, 6, 12, 18, 8, 10]);
  const [showCaptions, setShowCaptions] = useState(false);

  // Dynamic Lip-Sync Mouth Animation during Speech Synthesis
  useEffect(() => {
    let interval = null;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen(Math.floor(Math.random() * 8) + 2);
        setAudioWaveBarHeights([
          Math.floor(Math.random() * 12) + 4,
          Math.floor(Math.random() * 18) + 6,
          Math.floor(Math.random() * 22) + 8,
          Math.floor(Math.random() * 14) + 4,
          Math.floor(Math.random() * 20) + 6,
          Math.floor(Math.random() * 24) + 8,
          Math.floor(Math.random() * 12) + 4,
          Math.floor(Math.random() * 10) + 4,
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
      setTimeout(() => setEyeBlink(false), 160);
    }, Math.random() * 3000 + 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const trackKey = (companyTrack || 'Amazon').toLowerCase();
  const personaId = persona?.id || (trackKey.includes('google') ? 'google' : trackKey.includes('amazon') ? 'amazon' : trackKey.includes('meta') ? 'meta' : 'general');
  
  const personaName = persona?.name || `${companyTrack || 'AI'} Evaluator`;

  const isFemalePersona = ['meta', 'yc_female', 'microsoft'].includes(personaId);
  const skinTone = personaId === 'google' ? '#D4A373' : personaId === 'amazon' ? '#A06D4E' : '#E0B596';
  const skinShadow = personaId === 'google' ? '#B88252' : personaId === 'amazon' ? '#7A4D30' : '#C59573';
  const hairColor = '#1A1D24';
  const suitColor = personaId === 'google' ? '#1E293B' : personaId === 'amazon' ? '#0F172A' : '#182030';
  const tieColor = personaId === 'amazon' ? '#F59E0B' : personaId === 'google' ? '#0EA5E9' : '#14B8A6';

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#111622] via-[#0E121B] to-[#0A0D14] flex items-center justify-center overflow-hidden select-none rounded-2xl">
      
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl transition-all duration-700 ${
          isSpeaking ? 'bg-teal-500/20 scale-110 opacity-100' : 'bg-teal-500/5 scale-95 opacity-50'
        }`} />
      </div>

      {/* ── TOP FLOATING CONTROLS (Absolute overlay to prevent squishing the avatar) ── */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Interviewer ID Pill */}
        <div className="flex items-center gap-1.5 bg-[#0D111A]/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-lg pointer-events-auto max-w-[65%]">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSpeaking ? 'bg-teal-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-[11px] font-bold text-white truncate leading-none">
            {personaName}
          </span>
          <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-950/90 text-teal-300 border border-teal-500/30 flex-shrink-0">
            {companyTrack}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto flex-shrink-0">
          {onReplaySpeech && (
            <button
              type="button"
              onClick={onReplaySpeech}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0D111A]/85 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-[10px] font-semibold backdrop-blur-md cursor-pointer shadow-sm active:scale-95"
              title="Re-listen to question"
            >
              <RotateCcw className="w-2.5 h-2.5 text-teal-400" />
              <span>Replay</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-2 py-1 rounded-lg border font-mono font-bold text-[10px] transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
              showCaptions ? 'bg-teal-950/90 border-teal-500/50 text-teal-300' : 'bg-[#0D111A]/85 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Subtitles"
          >
            CC
          </button>
        </div>
      </div>

      {/* ── CENTER: PROPORTIONED HIGH-FIDELITY AVATAR ── */}
      <div className="relative z-10 w-full h-full max-h-[155px] sm:max-h-[200px] flex items-center justify-center p-2">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[185px] drop-shadow-2xl overflow-visible">
          <defs>
            <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity={isSpeaking ? "0.25" : "0.05"} />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={suitColor} />
              <stop offset="100%" stopColor="#0B0F17" />
            </linearGradient>
            <linearGradient id="tieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tieColor} />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
          </defs>

          {/* Glowing Radial Halo */}
          <circle cx="100" cy="98" r="85" fill="url(#haloGlow)" />

          {/* Active Audio Pulse Ring */}
          <circle
            cx="100"
            cy="98"
            r="82"
            fill="none"
            stroke={isSpeaking ? '#2DD4BF' : '#2A3447'}
            strokeWidth={isSpeaking ? "2.5" : "1.5"}
            strokeDasharray={isSpeaking ? '6 4' : 'none'}
            className={isSpeaking ? 'animate-spin' : ''}
            style={{ animationDuration: '10s', transformOrigin: '100px 98px' }}
            opacity={isSpeaking ? "0.85" : "0.4"}
          />

          {/* 1. Shoulders & Blazer (Fitted neatly) */}
          <path
            d="M 36 195 C 40 148, 70 140, 100 140 C 130 140, 160 148, 164 195 Z"
            fill="url(#suitGrad)"
            stroke="#2A3447"
            strokeWidth="1.5"
          />

          {/* Crisp Shirt Collar */}
          <polygon points="100,140 86,162 100,167 114,162" fill="#F8FAFC" />
          
          {/* Tie or Collar Line */}
          {personaId === 'yc' ? (
            <path d="M 88 144 Q 100 162 112 144" stroke="#475569" strokeWidth="2.5" fill="none" />
          ) : (
            <>
              <polygon points="100,146 94,185 100,195 106,185" fill="url(#tieGrad)" />
              <polygon points="96,146 100,152 104,146" fill={tieColor} />
            </>
          )}

          {/* Blazer Lapels */}
          <path d="M 58 195 L 86 142 L 100 168 L 100 195" fill="none" stroke="#222C3C" strokeWidth="2" />
          <path d="M 142 195 L 114 142 L 100 168 L 100 195" fill="none" stroke="#222C3C" strokeWidth="2" />

          {/* 2. Neck with anatomical shadow */}
          <rect x="89" y="118" width="22" height="26" fill={skinShadow} rx="4" />
          <rect x="91" y="118" width="18" height="22" fill={skinTone} rx="3" />

          {/* 3. Head & Ears */}
          <ellipse cx="64" cy="94" rx="5" ry="9" fill={skinTone} stroke={skinShadow} strokeWidth="1" />
          <ellipse cx="136" cy="94" rx="5" ry="9" fill={skinTone} stroke={skinShadow} strokeWidth="1" />
          <ellipse cx="100" cy="92" rx="37" ry="44" fill={skinTone} />

          {/* 4. Hair Styling */}
          {isFemalePersona ? (
            <g>
              <path
                d="M 58 92 C 58 50, 142 50, 142 92 C 146 122, 138 140, 134 140 C 130 118, 136 84, 132 76 C 118 56, 82 56, 68 76 C 64 84, 70 118, 66 140 C 62 140, 54 122, 58 92 Z"
                fill={hairColor}
              />
              <path d="M 64 74 Q 100 58 136 74" fill={hairColor} />
            </g>
          ) : (
            <g>
              {/* Modern executive fade hairstyle */}
              <path
                d="M 63 84 C 63 56, 137 56, 137 84 C 133 60, 67 60, 63 84 Z"
                fill={hairColor}
              />
              <path
                d="M 65 74 C 75 52, 125 52, 135 74 C 125 60, 75 60, 65 74 Z"
                fill="#2D3442"
              />
            </g>
          )}

          {/* 5. Refined Eyebrows */}
          <path d="M 76 77 Q 86 73 93 76" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 107 76 Q 114 73 124 77" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* 6. Natural Expressive Eyes with blinking */}
          {eyeBlink ? (
            <g>
              <path d="M 76 89 Q 84 92 92 89" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 108 89 Q 116 92 124 89" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g>
              {/* Eye Whites */}
              <ellipse cx="84" cy="88" rx="7" ry="5" fill="#FFFFFF" />
              <ellipse cx="116" cy="88" rx="7" ry="5" fill="#FFFFFF" />
              {/* Iris */}
              <circle cx="84" cy="88" r="3.5" fill="#2E1C14" />
              <circle cx="116" cy="88" r="3.5" fill="#2E1C14" />
              {/* Pupils & Light catch */}
              <circle cx="84" cy="88" r="2" fill="#0A0A0A" />
              <circle cx="116" cy="88" r="2" fill="#0A0A0A" />
              <circle cx="85.5" cy="86.5" r="1" fill="#FFFFFF" />
              <circle cx="117.5" cy="86.5" r="1" fill="#FFFFFF" />
            </g>
          )}

          {/* 7. Glasses for Google Persona */}
          {personaId === 'google' && (
            <g opacity="0.95">
              <rect x="74" y="80" width="20" height="15" rx="3.5" fill="none" stroke="#0EA5E9" strokeWidth="1.8" />
              <rect x="106" y="80" width="20" height="15" rx="3.5" fill="none" stroke="#0EA5E9" strokeWidth="1.8" />
              <line x1="94" y1="86" x2="106" y2="86" stroke="#0EA5E9" strokeWidth="1.8" />
              <line x1="68" y1="84" x2="74" y2="84" stroke="#0EA5E9" strokeWidth="1.5" />
              <line x1="126" y1="84" x2="132" y2="84" stroke="#0EA5E9" strokeWidth="1.5" />
            </g>
          )}

          {/* 8. Nose */}
          <path d="M 100 86 L 97 101 L 103 101" stroke={skinShadow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* 9. Dynamic Speech Lip-Sync Mouth */}
          {isSpeaking ? (
            <g>
              <ellipse
                cx="100"
                cy="114"
                rx="8"
                ry={mouthOpen}
                fill="#4C0519"
                stroke="#9F1239"
                strokeWidth="1.2"
              />
              {/* Subtle upper teeth highlight */}
              {mouthOpen > 4 && (
                <rect x="95" y="110" width="10" height="2" rx="1" fill="#F8FAFC" opacity="0.8" />
              )}
            </g>
          ) : (
            <path
              d="M 94 114 Q 100 118 106 114"
              stroke="#881337"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </div>

      {/* ── FLOATING LIVE CAPTION SUBTITLES (When CC is enabled) ── */}
      {showCaptions && currentQuestionText && (
        <div className="absolute bottom-8 left-2.5 right-2.5 z-20 bg-[#0B0D13]/95 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 shadow-2xl text-left animate-fade-in">
          <p className="text-[9px] text-teal-400 font-mono font-bold flex items-center gap-1 mb-0.5">
            <MessageSquare className="w-2.5 h-2.5" />
            <span>{personaName}:</span>
          </p>
          <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed font-normal">
            "{currentQuestionText}"
          </p>
        </div>
      )}

      {/* ── BOTTOM FLOATING STATUS & EQUALIZER ── */}
      <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 bg-[#0D111A]/85 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/5 shadow-md">
          <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-teal-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[9px] text-slate-300 font-mono">
            {isSpeaking ? 'Speaking...' : 'Listening...'}
          </span>
        </div>

        {/* Live Audio Equalizer Bars */}
        <div className="flex items-end gap-1 h-3.5 bg-[#0D111A]/85 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/5 shadow-md">
          {audioWaveBarHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-teal-400 to-cyan-300 rounded-full transition-all duration-100"
              style={{ height: `${Math.min(h, 10)}px` }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
