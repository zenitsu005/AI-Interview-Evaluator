import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { sendSalaryNegotiation, transcribeAudio } from '../services/api';
import AppNavbar from './AppNavbar';

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

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /hindi|indian|neerja|en-IN/i.test(v.lang) || /female/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="negotiate" />

      {/* ── Main Studio Layout (Split View) ── */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 text-left">
        {/* ── Left Column: Live Camera & Compensation Dashboard (5 Cols) ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Webcam Box */}
          <div className="bg-white border border-slate-200 p-0 overflow-hidden relative rounded-2xl aspect-video flex items-center justify-center shadow-sm">
            {virtualMode ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 relative">
                <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-500/40 flex items-center justify-center text-3xl shadow-sm animate-pulse">
                  👤
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2">Virtual Candidate Presence</p>
                <p className="text-[10px] text-teal-700 font-mono">Negotiation Video Enabled ✓</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror-mode"
              />
            )}

            {!camReady && !cameraError && !virtualMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-500">
                <svg className="animate-spin h-6 w-6 text-teal-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-xs">Connecting Live Studio Camera...</span>
              </div>
            )}

            {cameraError && !virtualMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-white/95 text-slate-700 text-xs space-y-2 z-10">
                <p className="font-bold text-slate-900">{cameraError}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="py-1 px-3 text-[11px] font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg shadow-sm cursor-pointer"
                  >
                    🔄 Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVirtualMode(true);
                      setCamReady(true);
                      setCameraError(null);
                    }}
                    className="py-1 px-3 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer shadow-sm"
                  >
                    👤 Virtual Avatar
                  </button>
                </div>
              </div>
            )}

            {/* Live Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-white/80 backdrop-blur-md text-red-600 border border-red-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                NEGOTIATION ON-AIR
              </span>
            </div>

            {isSpeaking && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal-50/90 backdrop-blur-md text-teal-800 border border-teal-300 animate-pulse shadow-sm">
                <span>🔊 Recruiter Speaking...</span>
              </div>
            )}
          </div>

          {/* Live Compensation Package Card (Indian Currency INR) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">Live Compensation Offer</p>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {formatLPA(totalValue)}{' '}
                  <span className="text-[11px] text-slate-500 font-normal font-mono">(Year 1 CTC: ₹{totalValue.toLocaleString('en-IN')})</span>
                </h2>
              </div>
              {lastTacticScore !== null && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500">Leverage:</span>
                  <span className={`text-xs font-black ${lastTacticScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {lastTacticScore}/100
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Fixed Base</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatLPA(offer.base)}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Perf Bonus</p>
                <p className="font-bold text-teal-700 text-xs sm:text-sm">{offer.bonus}%</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">ESOPs (4Y)</p>
                <p className="font-bold text-purple-700 text-xs sm:text-sm">{formatLPA(offer.equity)}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Joining Bonus</p>
                <p className="font-bold text-amber-700 text-xs sm:text-sm">{formatLPA(offer.signing)}</p>
              </div>
            </div>

            {tacticFeedback && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
                <span>💡</span>
                <div>
                  <strong className="text-teal-700">Negotiation Coach:</strong> {tacticFeedback}
                </div>
              </div>
            )}
          </div>

          {/* Real Indian Tech Compensation Bands (LPA / INR) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                📊 Indian Tech Market Compensation Bands (INR / LPA)
              </span>
              <span className="text-[9px] text-slate-500 font-mono">1-Click Auto-Target</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {INDIAN_COMP_BANDS.map((band) => (
                <button
                  key={band.level}
                  type="button"
                  onClick={() => setOffer({ base: band.base, bonus: band.bonus, equity: band.equity, signing: band.signing })}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-500/50 text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-teal-700 text-[11px]">{band.level}</p>
                    <p className="text-[10px] text-slate-500 font-mono">₹{(band.base/100000).toFixed(0)}L Base • ₹{(band.equity/100000).toFixed(0)}L ESOP</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 font-mono">{band.ctcLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Dialogue Stream & Audio Mic Controls (7 Cols) ── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dialogue Log Card */}
          <div className="bg-white border border-slate-200 rounded-2xl h-96 overflow-y-auto p-4 space-y-3.5 shadow-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'candidate' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-500 mb-1 px-1">
                  {m.sender === 'candidate' ? 'Candidate (You)' : 'Senior Recruiter / HR'}
                </span>
                <div
                  className={`p-3.5 rounded-2xl max-w-md text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'candidate'
                      ? 'bg-teal-600 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <svg className="animate-spin h-3.5 w-3.5 text-teal-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Recruiter is evaluating budget and compensation bands...</span>
              </div>
            )}
          </div>

          {/* Response Box with Audio Transcription */}
          <form onSubmit={handleSendMessage} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-100">
              <span className="font-bold uppercase tracking-wider text-teal-700">
                Your Counter-Offer (Speak or Type)
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  detectedFillers > 1 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  🎙️ Fillers: {detectedFillers}
                </span>
                {estimatedWpm > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    ⚡ {estimatedWpm} WPM
                  </span>
                )}
              </div>
            </div>

            <textarea
              ref={textInputRef}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="State your expectations in LPA (e.g. 'I am expecting ₹24 LPA fixed base and ₹10 Lakhs in ESOPs based on market standards...')"
              rows={3}
              disabled={isLoading || isTranscribing}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-3 text-xs text-slate-900 focus:outline-none leading-relaxed"
            />

            {statusMessage && (
              <p className="text-[11px] text-teal-700 animate-pulse">{statusMessage}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isLoading || isTranscribing}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <span>🎙️ Speak Offer</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-semibold shadow-sm animate-pulse transition-all cursor-pointer"
                  >
                    <span>⏹️ Stop Speaking ({formatSeconds(recordingSeconds)})</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputMsg.trim() || isRecording || isTranscribing}
                className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                Send Counter-Offer ➔
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-4 border-t border-slate-200 bg-white text-center" />
    </div>
  );
}

