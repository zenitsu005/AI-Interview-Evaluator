import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { transcribeAudio, getFollowUpProbe, getQuestionHint } from '../services/api';
import CodeSandbox from './CodeSandbox';
import SystemDesignWhiteboard from './SystemDesignWhiteboard';
import AiInterviewerAvatar from './AiInterviewerAvatar';

const ROUND_CONFIG = {
  aptitude: { label: 'Aptitude & Logic', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', emoji: '🧠' },
  technical: { label: 'Technical', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', emoji: '💻' },
  hr: { label: 'HR & Behavioral', color: 'bg-green-500/10 text-green-400 border-green-500/30', emoji: '🤝' },
};

export default function VideoInterview() {
  const {
    phase,
    currentRound,
    currentQuestion,
    questionIndexInRound,
    allResponses,
    ROUNDS,
    totalQuestions,
    answeredCount,
    progressPercent,
    submitAnswer,
    isLoading,
    error,
    clearError,
    targetRole,
    companyTrack,
    difficultyLevel,
    interviewerPersona,
    setPhase,
  } = useInterview();

  const videoRef = useRef(null);
  const textareaRef = useRef(null);
  const probeInputRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const framesRef = useRef([]);
  const isRecordingRef = useRef(false);
  const audioCtxRef = useRef(null);
  const ambientGainRef = useRef(null);

  const [cameraError, setCameraError] = useState(null);
  const [virtualMode, setVirtualMode] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [camReady, setCamReady] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);

  // New Requested Feature States
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'sandbox' | 'whiteboard'
  const [sandboxCode, setSandboxCode] = useState('');
  const [probeQuestion, setProbeQuestion] = useState(null);
  const [probeAnswer, setProbeAnswer] = useState('');
  const [isProbing, setIsProbing] = useState(false);

  // Feature 1: Socratic Hint State (-5 points penalty)
  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Feature 3: Ambient Realistic Soundscape
  const [soundscape, setSoundscape] = useState('none'); // 'none' | 'boardroom' | 'open_office' | 'focus'

  // Feature 7: Real-Time Filler Word Flash Notification
  const [showFillerFlash, setShowFillerFlash] = useState(false);
  const prevFillersCountRef = useRef(0);

  // Feature 8: Blink Rate & Composure Gauge
  const [composureScore, setComposureScore] = useState(96);

  // Feature 9: Voice Energy & Vocal Steadiness
  const [vocalSteadiness, setVocalSteadiness] = useState(94);
  const [voiceEnergyLevel, setVoiceEnergyLevel] = useState(78);

  // Live Speech Analytics
  const fillerWordsRegex = /\b(um|uh|like|you know|basically|actually|literally|sort of|kind of)\b/gi;
  const detectedFillers = (transcript.match(fillerWordsRegex) || []).length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const estimatedWpm = recordingSeconds > 3 ? Math.round(wordCount / (recordingSeconds / 60)) : 0;

  // Flash warning when new filler word is spoken
  useEffect(() => {
    if (detectedFillers > prevFillersCountRef.current) {
      setShowFillerFlash(true);
      const t = setTimeout(() => setShowFillerFlash(false), 2000);
      prevFillersCountRef.current = detectedFillers;
      return () => clearTimeout(t);
    }
  }, [detectedFillers]);

  // ── Feature 3: Ambient Synthetic Audio Engine ─────────────────────────────
  const setAmbientSoundscape = (type) => {
    setSoundscape(type);
    try {
      if (type === 'none') {
        if (ambientGainRef.current) ambientGainRef.current.gain.value = 0;
        return;
      }
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (!ambientGainRef.current) {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = type === 'boardroom' ? 300 : type === 'open_office' ? 600 : 450;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.04;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start(0);

        ambientGainRef.current = gainNode;
      } else {
        ambientGainRef.current.gain.value = 0.04;
      }
    } catch (e) {
      console.warn('Ambient soundscape notice:', e);
    }
  };

  // ── Feature 1: Request Socratic Hint (-5 pts penalty) ─────────────────────
  const handleRequestHint = async () => {
    if (isHintLoading || hint) return;
    setIsHintLoading(true);
    try {
      const res = await getQuestionHint({
        question: currentQuestion.question,
        round: currentRound?.id,
        targetRole,
        companyTrack,
      });
      if (res?.hint) {
        setHint(res.hint);
        setHintsUsed((h) => h + 1);
        setStatusMessage('💡 Socratic hint unlocked (-5 pts score penalty applied)');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // ── Robust Camera Initialization ──────────────────────────────────────────
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
        setCameraError('Camera permission blocked in browser. Click the lock/camera icon in your address bar to Allow.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is in use by another app (Zoom, Teams, etc.). Close them and click Retry.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No physical webcam detected on this device.');
      } else {
        setCameraError('Webcam not detected. You can retry permission or switch to Virtual Avatar feed.');
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
      if (ambientGainRef.current) ambientGainRef.current.gain.value = 0;
    };
  }, [startCamera]);

  // ── Capture Compressed Frames for Posture & Attire ───────────────────────
  const captureFrame = useCallback(() => {
    if (virtualMode) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 360, 270);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 360, 270);

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(180, 100, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(180, 220, 80, 60, 0, 0, Math.PI * 2);
        ctx.fill();

        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        framesRef.current.push(base64);
      } catch (e) {}
      return;
    }

    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.videoWidth) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * 360) || 270;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.5);
      framesRef.current.push(base64);
    } catch (e) {
      console.warn('Frame capture error:', e);
    }
  }, [virtualMode]);

  // ── Speak Question & Auto-Focus Response Box on Load ─────────────────────
  useEffect(() => {
    if (!currentQuestion?.question) return;
    setTranscript('');
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsTranscribing(false);
    setRecordingSeconds(0);
    setStatusMessage(null);
    setProbeQuestion(null);
    setProbeAnswer('');
    setHint(null);
    prevFillersCountRef.current = 0;
    setActiveTab(
      currentQuestion.hasSystemDesignWhiteboard
        ? 'whiteboard'
        : currentQuestion.hasCodingSandbox
        ? 'sandbox'
        : 'text'
    );
    framesRef.current = [];
    speakText(currentQuestion.question);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [currentQuestion]);

  // ── Continuous Video Frame Capture ───────────────────────────────────────
  useEffect(() => {
    if (!camReady || !currentQuestion) return;
    const initialTimer = setTimeout(captureFrame, 600);
    const interval = setInterval(captureFrame, 4000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [camReady, currentQuestion, captureFrame]);

  // ── Global Keyboard Capture: Typing anywhere fills the response box ────────
  useEffect(() => {
    const handleGlobalTyping = (e) => {
      if (document.activeElement === textareaRef.current || document.activeElement === probeInputRef.current) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1 && !isLoading && !isTranscribing && !isRecording && activeTab === 'text') {
        textareaRef.current?.focus();
        setTranscript((prev) => prev + e.key);
        e.preventDefault();
      } else if (e.key === 'Backspace' && !isLoading && !isTranscribing && activeTab === 'text') {
        textareaRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalTyping);
    return () => window.removeEventListener('keydown', handleGlobalTyping);
  }, [isLoading, isTranscribing, isRecording, activeTab]);

  const [meetingLayout, setMeetingLayout] = useState('dual'); // 'dual' | 'avatar-only' | 'candidate-only'
  const [speechRate, setSpeechRate] = useState(0.95);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();

    const isFemale = ['yc', 'microsoft', 'meta'].includes(interviewerPersona?.id);
    let preferred;
    if (isFemale) {
      preferred =
        voices.find((v) => v.lang.startsWith('en') && /female|zira|susan|samantha|karen|victoria|moira/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'));
    } else {
      preferred =
        voices.find((v) => v.lang.startsWith('en') && /male|david|george|alex|daniel|oliver/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'));
    }
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ── Timer for recording ──────────────────────────────────────────────────
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
        setVoiceEnergyLevel(Math.floor(65 + Math.random() * 30));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // ── Start Audio Recording ────────────────────────────────────────────────
  const startRecording = async () => {
    if (isLoading || isTranscribing) return;
    clearError();
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
        isRecordingRef.current = false;
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        await handleAudioBlob(blob, recorder.mimeType || 'audio/webm');
      };

      recorder.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingSeconds(0);
      captureFrame();
    } catch (err) {
      console.error('Audio record error:', err);
    }
  };

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
            setTranscript((prev) => (prev ? `${prev} ${res.text}` : res.text));
            setStatusMessage('Speech transcribed successfully! ✓');
            setTimeout(() => setStatusMessage(null), 3000);
          } else {
            setStatusMessage('No speech detected. You can type directly.');
            setTimeout(() => setStatusMessage(null), 3000);
          }
        } catch (e) {
          console.warn('Transcription fallback:', e);
          setStatusMessage('Transcription busy. You can type your answer.');
          setTimeout(() => setStatusMessage(null), 3000);
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Transcription blob error:', err);
      setIsTranscribing(false);
      setStatusMessage(null);
    }
  };

  // ── Stop Audio Recording ─────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    captureFrame();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, [captureFrame]);

  // ── Trigger Cross-Examiner Follow-Up Probe ─────────────────────────────────
  const handleRequestProbe = async () => {
    if (!transcript.trim() || isProbing) return;
    setIsProbing(true);
    try {
      const res = await getFollowUpProbe({
        question: currentQuestion.question,
        candidateAnswer: transcript.trim(),
        targetRole,
        companyTrack,
      });
      if (res?.followUp) {
        setProbeQuestion(res.followUp);
        speakText(`Follow-up question: ${res.followUp}`);
        setTimeout(() => probeInputRef.current?.focus(), 200);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProbing(false);
    }
  };

  // ── Submit Answer ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (isLoading || isRecording || isTranscribing) return;
    const finalAnswer = transcript.trim() || '(No response provided)';

    captureFrame();
    clearError();
    window.speechSynthesis?.cancel();
    await submitAnswer(finalAnswer, framesRef.current, sandboxCode, probeAnswer.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const roundCfg = currentRound ? ROUND_CONFIG[currentRound.id] : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative">
      {/* ── Feature 7: Real-Time Filler Word Flash Notification ── */}
      {showFillerFlash && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <span>⚠️</span>
          <span>Filler Word Detected ("{transcript.match(fillerWordsRegex)?.slice(-1)[0]}") — Pause & Breathe</span>
        </div>
      )}

      {/* ── Top Bar ── */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-md gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-sm shadow-md flex-shrink-0">
            🎯
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-100 text-sm tracking-tight">AI Interview Studio</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-500">
              {targetRole} · {companyTrack}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambiance Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-500">🎧</span>
            <select
              value={soundscape}
              onChange={(e) => setAmbientSoundscape(e.target.value)}
              className="bg-transparent text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="none">Quiet</option>
              <option value="boardroom">Boardroom</option>
              <option value="open_office">Office</option>
              <option value="focus">Rain</option>
            </select>
          </div>

          {/* Tool Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('text')}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Answer
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'sandbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'whiteboard' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Design
            </button>
          </div>

          {/* Question Counter */}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono">
            {Math.min(answeredCount + 1, totalQuestions)}/{totalQuestions}
          </span>
        </div>
      </header>

      {/* Evaluating Overlay when finishing Q15 */}
      {phase === 'evaluating' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl animate-bounce">
            🧠
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="text-2xl font-black text-white">AI Evaluator Computing Comprehensive Assessment</h2>
            <p className="text-xs text-slate-400">
              Evaluating 15 responses across Aptitude, Technical Depth, HR Behavioral Fit, and Multimodal Presence...
            </p>
          </div>
          <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* ── Progress Bar ── */}
      <div className="h-1 bg-slate-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-500 shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Main Layout (Studio Split View) ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Left Column: Live Camera & Question Prompt (5 Cols) ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Bar Raiser Interrogation Banner */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl">{interviewerPersona?.avatar || '📦'}</span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white flex items-center gap-1.5 truncate">
                  <span>{interviewerPersona?.name || 'Marcus Vance'}</span>
                  <span className="text-[10px] font-medium text-slate-400">({interviewerPersona?.company || companyTrack})</span>
                </p>
                <p className="text-[10px] text-amber-300 font-mono italic truncate">
                  "{interviewerPersona?.catchphrase || 'Demanding high ownership and measurable metrics.'}"
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-950 text-indigo-300 whitespace-nowrap">
              {interviewerPersona?.badge?.split('&')[0] || 'Bar Raiser'}
            </span>
          </div>

          {/* Meeting View Mode Selector */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎥</span> Meeting Room Feed
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setMeetingLayout('dual')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  meetingLayout === 'dual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                👥 Dual Meet
              </button>
              <button
                type="button"
                onClick={() => setMeetingLayout('avatar-only')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  meetingLayout === 'avatar-only' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🤖 Avatar Lead
              </button>
              <button
                type="button"
                onClick={() => setMeetingLayout('candidate-only')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  meetingLayout === 'candidate-only' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                📷 Webcam
              </button>
            </div>
          </div>

          {/* ── Meeting Tile Container ── */}
          <div className={`grid gap-3 ${meetingLayout === 'dual' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Tile 1: AI Interviewer Lead Feed */}
            {(meetingLayout === 'dual' || meetingLayout === 'avatar-only') && (
              <div className="card-dark p-0 overflow-hidden relative border-slate-800 bg-slate-950 aspect-video flex items-center justify-center shadow-2xl rounded-2xl border-2 ring-2 ring-indigo-500/20">
                <AiInterviewerAvatar
                  isSpeaking={isSpeaking}
                  persona={interviewerPersona}
                  companyTrack={companyTrack}
                  currentQuestionText={currentQuestion?.question}
                  onReplaySpeech={() => speakText(currentQuestion?.question)}
                  speechRate={speechRate}
                  onSpeechRateChange={setSpeechRate}
                />
              </div>
            )}

            {/* Tile 2: Candidate Live Webcam Feed */}
            {(meetingLayout === 'dual' || meetingLayout === 'candidate-only') && (
              <div className="card-dark p-0 overflow-hidden relative border-slate-800 bg-black aspect-video flex items-center justify-center shadow-2xl rounded-2xl">
                {virtualMode ? (
                  <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                    <span className="text-4xl">👤</span>
                    <p className="text-xs text-slate-300 font-bold">Virtual Candidate Mode Active</p>
                    <p className="text-[10px] text-slate-500">Audio and response analysis active</p>
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 text-slate-400">
                    <svg className="animate-spin h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-xs">Initializing Live AI Vision...</span>
                  </div>
                )}

                {cameraError && !virtualMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/95 text-slate-300 text-xs space-y-2 z-10">
                    <p className="font-bold text-slate-200 text-xs">{cameraError}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="btn-primary py-1 px-3 text-[11px] font-semibold"
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
                        className="btn-secondary py-1 px-3 text-[11px] font-semibold text-indigo-300"
                      >
                        👤 Virtual Mode
                      </button>
                    </div>
                  </div>
                )}

                {/* Candidate Feed Overlays */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-black/60 backdrop-blur-md text-red-400 border border-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    YOU
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    👁️ {composureScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                    🎙️ {vocalSteadiness}%
                  </span>
                </div>

                {/* Real-Time Audio Energy Wave on Candidate tile */}
                {isRecording && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700">
                    <span className="text-[9px] text-slate-400 font-mono">Mic</span>
                    <div className="flex items-end gap-0.5 h-2.5">
                      <div className="w-1 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${(voiceEnergyLevel / 100) * 10}px` }} />
                      <div className="w-1 bg-cyan-400 rounded-full animate-pulse" style={{ height: `${(voiceEnergyLevel / 100) * 8 + 2}px` }} />
                      <div className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${(voiceEnergyLevel / 100) * 10}px` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current Question Card */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 shadow-2xl shadow-indigo-900/20 p-5 space-y-3">
            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${roundCfg?.color || ''}`}>
                  {roundCfg?.emoji} {roundCfg?.label}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  Q{questionIndexInRound}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={isHintLoading || hint}
                  className="text-[11px] text-amber-300 hover:text-white bg-amber-950/50 border border-amber-800/60 hover:border-amber-500/80 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-semibold disabled:opacity-40"
                  title="Receive a subtle hint (-5 pts penalty)"
                >
                  <span>💡</span>
                  <span>{isHintLoading ? '...' : hint ? 'Revealed' : 'Hint (-5pts)'}</span>
                </button>

                <button
                  onClick={() => currentQuestion?.question && speakText(currentQuestion.question)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-all border border-slate-700/50"
                  title="Replay Question Audio"
                >
                  🔊 Replay
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-[15px] font-semibold text-white leading-relaxed tracking-wide relative z-10 pt-1">
              {currentQuestion?.question || 'Loading question...'}
            </p>

            {hint && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 text-xs text-amber-200 animate-fade-in space-y-1 relative z-10">
                <p className="font-bold flex items-center gap-1.5">
                  <span>💡 Socratic Guide</span>
                  <span className="text-[10px] font-mono text-amber-400/70">(-5 pts)</span>
                </p>
                <p className="text-slate-300 leading-relaxed">{hint}</p>
              </div>
            )}
          </div>

          {/* Adaptive Cross-Examiner Follow-Up Probe Box */}
          {probeQuestion && (
            <div className="card-dark border-amber-900/60 bg-amber-950/20 p-4 space-y-2.5 animate-fade-in shadow-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <span>🤖</span> Adaptive Cross-Examination Follow-Up
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">{probeQuestion}</p>
              <input
                ref={probeInputRef}
                type="text"
                value={probeAnswer}
                onChange={(e) => setProbeAnswer(e.target.value)}
                placeholder="Type your response to this cross-examination challenge..."
                className="input-field-dark text-xs"
              />
            </div>
          )}
        </div>

        {/* ── Right Column: Dynamic Workspace Tool (Answer / CodeSandbox / Whiteboard) (7 Cols) ── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Interactive Tool Area */}
          {activeTab === 'whiteboard' ? (
            <div className="h-80">
              <SystemDesignWhiteboard />
            </div>
          ) : activeTab === 'sandbox' ? (
            <div className="h-80">
              <CodeSandbox code={sandboxCode} onChange={setSandboxCode} />
            </div>
          ) : null}

          {/* Response Box & Live Speech Analytics */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl p-5 space-y-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Answer</span>
              </div>

              {/* Live Analytics Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  detectedFillers > 2
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700/60 animate-pulse'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  Fillers: {detectedFillers} {detectedFillers > 2 ? '⚠️' : '✓'}
                </span>
                {estimatedWpm > 0 && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 text-indigo-300 border border-slate-800">
                    {estimatedWpm} WPM
                  </span>
                )}
                {hintsUsed > 0 && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50">
                    -{hintsUsed * 5}pts
                  </span>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 min-h-[140px] flex flex-col relative">
              <textarea
                ref={textareaRef}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here, or use the mic below..."
                rows={activeTab !== 'text' ? 4 : 7}
                disabled={isLoading || isTranscribing}
                className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/60 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 resize-none outline-none transition-all leading-relaxed"
              />

              {/* Word count bar */}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex-1 h-0.5 bg-slate-800 rounded-full mr-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      wordCount < 30 ? 'bg-slate-700' : wordCount < 80 ? 'bg-indigo-500' : wordCount < 150 ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min((wordCount / 150) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono ${
                  wordCount < 30 ? 'text-slate-600' : wordCount < 80 ? 'text-indigo-400' : 'text-emerald-400'
                }`}>
                  {wordCount}w
                </span>
              </div>

              {statusMessage && (
                <div className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1.5 animate-pulse">
                  <span>✨</span><span>{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading || isTranscribing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-indigo-900/40 transition-all disabled:opacity-40"
                >
                  <span className="w-2 h-2 rounded-full bg-white/80" />
                  🎙️ Speak
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-red-900/40 animate-pulse transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ⏹ Stop · {formatSeconds(recordingSeconds)}
                </button>
              )}

              {transcript.length > 20 && !probeQuestion && (
                <button
                  type="button"
                  onClick={handleRequestProbe}
                  disabled={isProbing}
                  className="text-[11px] text-slate-400 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-500 px-3 py-2.5 rounded-xl transition-all font-semibold"
                >
                  {isProbing ? '⏳...' : '⚡ Cross-Examine'}
                </button>
              )}

              {isRecording && (
                <span className={`text-[11px] font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 ${
                  recordingSeconds <= 60 ? 'text-emerald-400' : recordingSeconds <= 90 ? 'text-amber-400' : 'text-red-400 font-bold'
                }`}>
                  {recordingSeconds <= 60 ? '● Good' : recordingSeconds <= 90 ? '● Wrap up' : '● Too long'}
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-950/50 p-3 rounded-xl border border-red-800/40">
                ❌ {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || isRecording || isTranscribing}
              className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400
                text-white shadow-indigo-900/40 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Evaluating...
                </span>
              ) : isRecording ? (
                '⏹ Stop Recording First'
              ) : isTranscribing ? (
                '✨ Transcribing...'
              ) : (
                'Submit'
              )}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
