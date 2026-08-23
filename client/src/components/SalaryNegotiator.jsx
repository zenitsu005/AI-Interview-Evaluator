import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { sendSalaryNegotiation, transcribeAudio } from '../services/api';
import voiceAssistant from '../services/voiceAssistant';
import AppNavbar from './AppNavbar';
import {
  IconCurrencyDollar as DollarSign,
  IconMicrophone as Mic,
  IconSquare as Square,
  IconSend as Send,
  IconSparkles as Sparkles,
  IconRotateClockwise2 as RotateCcw,
  IconUser as User,
  IconTrendingUp as TrendingUp,
  IconCoins as Coins,
  IconBriefcase as Briefcase,
  IconVolume as Volume2,
  IconAlertTriangle as AlertTriangle,
  IconArrowRight as ArrowRight,
  IconCheck as Check,
  IconClock as Clock,
  IconAdjustments as Adjustments,
} from '@tabler/icons-react';

const NEGOTIATION_ROLES = [
  'Full Stack Software Engineer',
  'Frontend Developer (React / Next.js)',
  'Backend Engineer (Node / Python / Go)',
  'AI / Machine Learning Engineer',
  'Data Scientist / Analytics Lead',
  'DevOps & Cloud Infrastructure',
  'Engineering Manager / Lead',
  'Product Manager',
];

const INDIAN_COMP_BANDS = [
  {
    id: '0-2',
    level: 'Junior / Entry-Level (SDE-1)',
    experienceYears: '0-2 Years',
    desc: 'Foundational execution, bug fixes & feature implementation',
    base: 1400000,
    bonus: 10,
    equity: 500000,
    signing: 100000,
    ctcLabel: '₹17.4 LPA CTC',
  },
  {
    id: '2-5',
    level: 'Mid-Level Engineer (SDE-2)',
    experienceYears: '2-5 Years',
    desc: 'Autonomous delivery, system optimization & code reviews',
    base: 2600000,
    bonus: 15,
    equity: 1400000,
    signing: 300000,
    ctcLabel: '₹32.5 LPA CTC',
  },
  {
    id: '5-8',
    level: 'Senior Engineer / Tech Lead (Senior SDE)',
    experienceYears: '5-8 Years',
    desc: 'System architecture, technical leadership & mentoring',
    base: 4500000,
    bonus: 20,
    equity: 3000000,
    signing: 600000,
    ctcLabel: '₹58.5 LPA CTC',
  },
  {
    id: '8+',
    level: 'Staff / Principal Engineer (Staff SDE)',
    experienceYears: '8+ Years',
    desc: 'Organization-wide technical strategy & cross-team impact',
    base: 7500000,
    bonus: 25,
    equity: 6000000,
    signing: 1200000,
    ctcLabel: '₹1.05 Cr CTC',
  },
];

export default function SalaryNegotiator() {
  const { targetRole: contextRole, setPhase } = useInterview();

  // Role & Experience Selection State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [selectedRole, setSelectedRole] = useState(contextRole || 'Full Stack Software Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [selectedExpIndex, setSelectedExpIndex] = useState(1); // Default to Mid-Level (2-5 yrs)

  const [offer, setOffer] = useState({
    base: INDIAN_COMP_BANDS[1].base,
    bonus: INDIAN_COMP_BANDS[1].bonus,
    equity: INDIAN_COMP_BANDS[1].equity,
    signing: INDIAN_COMP_BANDS[1].signing,
  });

  const [messages, setMessages] = useState([
    {
      sender: 'recruiter',
      text: `Hello! We were thoroughly impressed by your performance for the ${contextRole || 'Full Stack Software Engineer'} role (${INDIAN_COMP_BANDS[1].experienceYears} experience). We're excited to extend an initial offer package of ₹26,00,000 (₹26 LPA) fixed base salary, 15% annual performance bonus, ₹14,00,000 in ESOPs (vested over 4 years), and a ₹3,00,000 joining bonus (Year 1 CTC: ~₹32.5 LPA). What are your thoughts on this package?`,
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTacticScore, setLastTacticScore] = useState(null);
  const [tacticFeedback, setTacticFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Video & Audio States
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const textInputRef = useRef(null);

  const [camReady, setCamReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [virtualMode, setVirtualMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);

  // Live Speech Analytics
  const fillerWordsRegex = /\b(um|uh|like|you know|basically|actually|literally|sort of|kind of)\b/gi;
  const detectedFillers = (inputMsg.match(fillerWordsRegex) || []).length;
  const wordCount = inputMsg.trim() ? inputMsg.trim().split(/\s+/).length : 0;
  const estimatedWpm = recordingSeconds > 3 ? Math.round(wordCount / (recordingSeconds / 60)) : 0;

  useEffect(() => {
    return () => {
      voiceAssistant.stop();
    };
  }, []);

  const speakText = (text) => {
    voiceAssistant.speak(text, {
      persona: 'recruiter',
      gender: 'female',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // ── Start Webcam Stream ───────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCamReady(false);
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (e1) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamReady(true);
      setCameraError(null);
      setVirtualMode(false);
    } catch (err) {
      console.warn('Webcam access error:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission blocked. Click the lock/camera icon in your address bar to Allow.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is in use by another app (Zoom, Teams, etc.). Close them and click Retry.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No physical webcam detected on this device.');
      } else {
        setCameraError('Webcam not detected. You can use Virtual Avatar mode.');
      }
    }

    try {
      const aStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = aStream;
    } catch (aErr) {
      console.warn('Microphone access notice:', aErr.message);
    }
  }, []);

  // Start Negotiation Simulation
  const handleStartNegotiation = (role, expIdx) => {
    const finalRole = (role || customRoleInput.trim() || selectedRole).trim();
    const finalExpIdx = expIdx !== undefined ? expIdx : selectedExpIndex;
    const band = INDIAN_COMP_BANDS[finalExpIdx];

    setSelectedRole(finalRole);
    setSelectedExpIndex(finalExpIdx);
    setOffer({
      base: band.base,
      bonus: band.bonus,
      equity: band.equity,
      signing: band.signing,
    });

    const totalVal = band.base + Math.round((band.base * band.bonus) / 100) + Math.round(band.equity / 4) + band.signing;
    const openingMsg = `Hello! We were thoroughly impressed by your performance for the ${finalRole} role (${band.experienceYears} experience). We're excited to extend an initial offer package of ₹${(band.base/100000).toFixed(1)} LPA fixed base salary, ${band.bonus}% annual performance bonus, ₹${(band.equity/100000).toFixed(1)} Lakhs in ESOPs (vested over 4 years), and a ₹${(band.signing/100000).toFixed(1)} Lakhs joining bonus (Year 1 CTC: ~${band.ctcLabel}). What are your thoughts on this package?`;

    setMessages([{ sender: 'recruiter', text: openingMsg }]);
    setIsConfiguring(false);
    startCamera();
    setTimeout(() => speakText(openingMsg), 300);
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Timer for recording ──────────────────────────────────────────────────
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // ── Start Audio Recording ────────────────────────────────────────────────
  const startRecording = async () => {
    if (isLoading || isTranscribing) return;
    audioChunksRef.current = [];

    try {
      let stream = audioStreamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
      }

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else mimeType = '';
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        await handleAudioBlob(blob, recorder.mimeType || 'audio/webm');
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (err) {
      console.error('Audio record error:', err);
    }
  };

  // ── Stop Audio Recording ─────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Handle Recorded Audio Blob ───────────────────────────────────────────
  const handleAudioBlob = async (blob, mimeType) => {
    if (blob.size < 100) return;
    setIsTranscribing(true);
    setStatusMessage('Transcribing your speech...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const res = await transcribeAudio(base64, mimeType);
          if (res?.text) {
            setInputMsg((prev) => (prev ? `${prev} ${res.text}` : res.text));
            setStatusMessage('Speech transcribed! Click "Send Counter-Offer" or speak more.');
            setTimeout(() => setStatusMessage(null), 3500);
          }
        } catch (e) {
          console.warn('Transcription issue:', e);
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Blob error:', err);
      setIsTranscribing(false);
    }
  };

  // ── Send Counter-Offer Message ────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim() || isLoading || isRecording) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    const updatedMessages = [...messages, { sender: 'candidate', text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await sendSalaryNegotiation({
        targetRole: targetRole || 'Software Engineer',
        offerDetails: offer,
        conversationHistory: updatedMessages,
        candidateMessage: userText,
      });

      if (res.updatedOffer) {
        setOffer(res.updatedOffer);
      }
      setLastTacticScore(res.tacticScore);
      setTacticFeedback(res.tacticFeedback);

      const recruiterReply = res.recruiterResponse || 'Thank you for your response.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'recruiter',
          text: recruiterReply,
        },
      ]);
      speakText(recruiterReply);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'recruiter',
          text: 'I understand your perspective regarding market benchmarks. Let me review with our compensation committee.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  };

  // Format INR in Lakhs / LPA
  const formatLPA = (num) => {
    const lpa = num / 100000;
    if (lpa >= 100) return `₹${(lpa / 100).toFixed(2)} Cr`;
    return `₹${lpa.toFixed(1)} LPA`;
  };

  // Year 1 Total Comp (Fixed Base + Bonus + 25% Equity + Sign-On)
  const totalValue =
    offer.base +
    Math.round((offer.base * (offer.bonus || 0)) / 100) +
    Math.round((offer.equity || 0) / 4) +
    (offer.signing || 0);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Universal Top Bar */}
      <AppNavbar currentActive="negotiate" />

      {/* Main Container */}
      {isConfiguring ? (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1 flex flex-col justify-center text-left animate-fade-in">
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 mx-auto shadow-lg shadow-teal-500/20">
                <DollarSign className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Salary Negotiation Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Calibrate market compensation benchmarks & AI recruiter counter-offers for your exact role and years of experience.
              </p>
            </div>

            {/* Step 1: Target Role Selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 1. Select Target Job Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {NEGOTIATION_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setCustomRoleInput('');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedRole === r && !customRoleInput.trim()
                        ? 'bg-teal-500/15 border-teal-400 text-teal-300 shadow-sm'
                        : 'bg-[#0D111A] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedRole === r && !customRoleInput.trim() && (
                      <Check className="w-4 h-4 text-teal-400" />
                    )}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => {
                  setCustomRoleInput(e.target.value);
                  if (e.target.value.trim()) setSelectedRole(e.target.value.trim());
                }}
                placeholder="Or enter custom role (e.g. Flutter Mobile Lead, Security Architect)..."
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none mt-1"
              />
            </div>

            {/* Step 2: Experience Level Selection */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <label className="block text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 2. Select Years of Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INDIAN_COMP_BANDS.map((band, idx) => (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setSelectedExpIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      selectedExpIndex === idx
                        ? 'bg-teal-500/15 border-teal-400 shadow-sm ring-1 ring-teal-400/40'
                        : 'bg-[#0D111A] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{band.level}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30">
                        {band.ctcLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{band.desc}</p>
                    <p className="text-[10px] text-slate-500 font-mono pt-1">
                      ₹{(band.base / 100000).toFixed(0)}L Base • {band.bonus}% Bonus • ₹{(band.equity / 100000).toFixed(0)}L ESOPs
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Launch CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartNegotiation()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-extrabold text-sm shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_8px_24px_rgba(20,184,166,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Negotiation for {customRoleInput.trim() || selectedRole} ({INDIAN_COMP_BANDS[selectedExpIndex].experienceYears})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* Active Negotiation Simulation Studio */
        <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-4 flex-1 text-left animate-fade-in">
          
          {/* Active Role & Experience Header Banner */}
          <div className="flex items-center justify-between bg-[#131823] p-4 rounded-2xl border border-white/10 shadow-sm flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>{selectedRole}</span>
                  <span className="text-xs font-mono text-teal-300 font-normal">• {INDIAN_COMP_BANDS[selectedExpIndex].experienceYears} Experience ({INDIAN_COMP_BANDS[selectedExpIndex].level})</span>
                </p>
                <p className="text-[11px] text-slate-400">Target Indian CTC Baseline: {INDIAN_COMP_BANDS[selectedExpIndex].ctcLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsConfiguring(true);
                streamRef.current?.getTracks().forEach((t) => t.stop());
                audioStreamRef.current?.getTracks().forEach((t) => t.stop());
                window.speechSynthesis?.cancel();
              }}
              className="text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Adjustments className="w-3.5 h-3.5 text-teal-400" />
              <span>Change Role & Exp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Live Camera & Compensation Dashboard (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Live Webcam Box */}
              <div className="bg-[#131823] border border-white/10 p-0 overflow-hidden relative rounded-3xl aspect-video flex items-center justify-center shadow-2xl">
                {virtualMode ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#0D111A] relative">
                    <div className="w-16 h-16 rounded-2xl bg-teal-950/80 border-2 border-teal-500/40 flex items-center justify-center text-teal-400 shadow-md">
                      <User className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-white mt-2">Virtual Candidate Presence</p>
                    <p className="text-[10px] text-teal-400 font-mono">Negotiation Video Enabled ✓</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror-mode"
                    style={{ transform: 'scaleX(-1)', WebkitTransform: 'scaleX(-1)' }}
                  />
                )}

                {!camReady && !cameraError && !virtualMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#131823] text-slate-400">
                    <svg className="animate-spin h-6 w-6 text-teal-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-xs">Connecting Live Studio Camera...</span>
                  </div>
                )}

                {cameraError && !virtualMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#131823]/95 text-slate-300 text-xs space-y-2 z-10">
                    <p className="font-bold text-white">{cameraError}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="py-1 px-3 text-[11px] font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg cursor-pointer"
                      >
                        Retry Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVirtualMode(true);
                          setCamReady(true);
                          setCameraError(null);
                        }}
                        className="py-1 px-3 text-[11px] font-semibold text-teal-300 bg-teal-950 border border-teal-500/40 rounded-lg cursor-pointer"
                      >
                        Virtual Avatar
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/80 backdrop-blur-md text-rose-400 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    NEGOTIATION ON-AIR
                  </span>
                </div>

                {isSpeaking && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-teal-300 border border-teal-500/30 animate-pulse font-mono">
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Recruiter Speaking...</span>
                  </div>
                )}
              </div>

              {/* Live Compensation Package Card */}
              <div className="bg-[#131823] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3.5">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-teal-400 tracking-wider font-mono">Live Compensation Offer</p>
                    <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                      {formatLPA(totalValue)}{' '}
                      <span className="text-[11px] text-slate-400 font-normal font-mono">(Year 1 CTC: ₹{totalValue.toLocaleString('en-IN')})</span>
                    </h2>
                  </div>
                  {lastTacticScore !== null && (
                    <div className="flex items-center gap-1.5 bg-[#0D111A] px-3 py-1 rounded-xl border border-white/5 font-mono">
                      <span className="text-[10px] text-slate-400">Leverage:</span>
                      <span className={`text-xs font-black ${lastTacticScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {lastTacticScore}/100
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-[#0D111A] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Fixed Base</p>
                    <p className="font-bold text-white text-xs sm:text-sm mt-0.5">{formatLPA(offer.base)}</p>
                  </div>
                  <div className="bg-[#0D111A] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Perf Bonus</p>
                    <p className="font-bold text-teal-400 text-xs sm:text-sm mt-0.5">{offer.bonus}%</p>
                  </div>
                  <div className="bg-[#0D111A] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">ESOPs (4Y)</p>
                    <p className="font-bold text-cyan-400 text-xs sm:text-sm mt-0.5">{formatLPA(offer.equity)}</p>
                  </div>
                  <div className="bg-[#0D111A] p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Joining Bonus</p>
                    <p className="font-bold text-purple-400 text-xs sm:text-sm mt-0.5">{formatLPA(offer.signing)}</p>
                  </div>
                </div>

                {tacticFeedback && (
                  <div className="p-3 bg-[#0D111A] rounded-2xl border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-teal-300 font-mono text-[11px] uppercase">AI Negotiation Feedback</p>
                      <p className="text-slate-300 text-xs mt-0.5">{tacticFeedback}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Real Indian Tech Compensation Bands */}
              <div className="bg-[#131823] border border-white/10 rounded-3xl p-5 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Market Compensation Bands (INR / LPA)
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Auto-Target</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {INDIAN_COMP_BANDS.map((band) => (
                    <button
                      key={band.level}
                      type="button"
                      onClick={() => setOffer({ base: band.base, bonus: band.bonus, equity: band.equity, signing: band.signing })}
                      className="p-3 rounded-xl bg-[#0D111A] hover:bg-[#171E2D] border border-white/5 hover:border-teal-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-teal-300 text-[11px]">{band.level}</p>
                        <p className="text-[10px] text-slate-400 font-mono">₹{(band.base/100000).toFixed(0)}L Base • ₹{(band.equity/100000).toFixed(0)}L ESOP</p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-400 font-mono">{band.ctcLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dialogue Stream & Audio Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Dialogue Log Card */}
              <div className="bg-[#131823] border border-white/10 rounded-3xl h-96 overflow-y-auto p-5 space-y-3.5 shadow-2xl">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'candidate' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1 font-mono">
                      {m.sender === 'candidate' ? 'Candidate (You)' : 'Senior Recruiter / HR'}
                    </span>
                    <div
                      className={`p-4 rounded-2xl max-w-md text-xs sm:text-sm leading-relaxed ${
                        m.sender === 'candidate'
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold rounded-br-none shadow-md'
                          : 'bg-[#0D111A] text-slate-200 border border-white/10 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-teal-400 py-2 font-mono">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Recruiter evaluating compensation bands...</span>
                  </div>
                )}
              </div>

              {/* Response Box with Audio Transcription */}
              <form onSubmit={handleSendMessage} className="bg-[#131823] border border-white/10 rounded-3xl p-5 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-white/10">
                  <span className="font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Your Counter-Offer (Speak or Type)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      detectedFillers > 1 ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' : 'bg-[#0D111A] text-slate-400 border-white/5'
                    }`}>
                      Fillers: {detectedFillers}
                    </span>
                    {estimatedWpm > 0 && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0D111A] text-teal-300 border border-white/5">
                        {estimatedWpm} WPM
                      </span>
                    )}
                  </div>
                </div>

                <textarea
                  ref={textInputRef}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="State your expectations in LPA (e.g. 'I am expecting ₹24 LPA fixed base and ₹10 Lakhs in ESOPs based on market standards...')"
                  rows={3}
                  disabled={isLoading || isTranscribing}
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed"
                />

                {statusMessage && (
                  <p className="text-[11px] text-teal-400 animate-pulse font-mono">{statusMessage}</p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={isLoading || isTranscribing}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-teal-300 text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-teal-400" />
                        <span>Speak Offer</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow-md animate-pulse transition-all cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>Stop Speaking ({formatSeconds(recordingSeconds)})</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !inputMsg.trim() || isRecording || isTranscribing}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>Send Counter-Offer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      )}

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}

