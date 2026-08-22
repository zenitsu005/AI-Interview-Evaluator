import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { sendSalaryNegotiation, transcribeAudio } from '../services/api';
import voiceAssistant from '../services/voiceAssistant';
import AppNavbar from './AppNavbar';
import {
  DollarSign,
  Mic,
  Square,
  Send,
  Sparkles,
  RotateCcw,
  User,
  TrendingUp,
  Coins,
  Briefcase,
  Volume2,
  AlertTriangle,
} from 'lucide-react';

const INDIAN_COMP_BANDS = [
  { level: 'SDE-1 / Junior (0-2 yrs)', base: 1400000, bonus: 10, equity: 500000, signing: 100000, ctcLabel: '₹17.4 LPA CTC' },
  { level: 'SDE-2 / Mid-Level (2-5 yrs)', base: 2600000, bonus: 15, equity: 1400000, signing: 300000, ctcLabel: '₹32.5 LPA CTC' },
  { level: 'Senior SDE / Lead (5-8 yrs)', base: 4500000, bonus: 20, equity: 3000000, signing: 600000, ctcLabel: '₹58.5 LPA CTC' },
  { level: 'Staff / Principal (8+ yrs)', base: 7500000, bonus: 25, equity: 6000000, signing: 1200000, ctcLabel: '₹1.05 Cr CTC' },
];

export default function SalaryNegotiator() {
  const { targetRole, setPhase } = useInterview();

  const [offer, setOffer] = useState({
    base: 1800000, // ₹18 LPA
    bonus: 12,     // 12%
    equity: 800000, // ₹8 Lakhs over 4 yrs
    signing: 150000, // ₹1.5 Lakhs
  });

  const [messages, setMessages] = useState([
    {
      sender: 'recruiter',
      text: `Hello! We were thoroughly impressed by your performance for the ${targetRole || 'Software Engineer'} role. We're excited to extend an initial offer package of ₹18,00,000 (₹18 LPA) fixed base salary, 12% annual performance bonus, ₹8,00,000 in ESOPs (vested over 4 years), and a ₹1,50,000 joining bonus (Year 1 CTC: ~₹21.66 LPA). What are your thoughts on this package?`,
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

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis?.cancel();
    };
  }, [startCamera]);

  // ── Auto-Speak Recruiter's Opening Statement on Mount ────────────────────
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'recruiter') {
      speakText(messages[0].text);
    }
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

      {/* Main Studio Layout */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 text-left">
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
                <p className="font-bold text-amber-400 text-xs sm:text-sm mt-0.5">{formatLPA(offer.signing)}</p>
              </div>
            </div>

            {tacticFeedback && (
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-400 font-mono">Negotiation Coach: </strong>
                  <span>{tacticFeedback}</span>
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
      </main>

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}

