import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { transcribeAudio, getFollowUpProbe, getQuestionHint } from '../services/api';
import voiceAssistant from '../services/voiceAssistant';
import CodeSandbox from './CodeSandbox';
import SystemDesignWhiteboard from './SystemDesignWhiteboard';
import AiInterviewerAvatar from './AiInterviewerAvatar';
import {
  IconMicrophone as Mic,
  IconSquare as Square,
  IconSparkles as Sparkles,
  IconRotateClockwise2 as RotateCcw,
  IconCode as Code2,
  IconStack2 as Layers,
  IconSend as Send,
  IconAlertTriangle as AlertTriangle,
  IconVolume as Volume2,
  IconHeadphones as Headphones,
  IconUsers as Users,
  IconVideo as Video,
  IconBrain as Brain,
  IconBulb as Lightbulb,
  IconBolt as Zap,
  IconCircleCheck as CheckCircle2,
  IconRadio as Radio,
  IconFileText as FileText,
  IconActivity as Activity,
} from '@tabler/icons-react';

const ROUND_CONFIG = {
  aptitude: { label: 'Aptitude & Logic', color: 'bg-blue-950/80 text-blue-300 border-blue-500/40', icon: Brain },
  technical: { label: 'Technical Depth', color: 'bg-teal-950/80 text-teal-300 border-teal-500/40', icon: Code2 },
  hr: { label: 'HR Round', color: 'bg-amber-950/80 text-amber-300 border-amber-500/40', icon: Users },
};

export default function VideoInterview() {
  const {
    phase,
    currentRound,
    currentQuestion,
    questionIndexInRound,
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

  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'sandbox' | 'whiteboard'
  const [sandboxCode, setSandboxCode] = useState('');
  const [probeQuestion, setProbeQuestion] = useState(null);
  const [probeAnswer, setProbeAnswer] = useState('');
  const [isProbing, setIsProbing] = useState(false);

  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [soundscape, setSoundscape] = useState('none');
  const [showFillerFlash, setShowFillerFlash] = useState(false);
  const prevFillersCountRef = useRef(0);

  const [composureScore, setComposureScore] = useState(96);
  const [vocalSteadiness, setVocalSteadiness] = useState(94);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [meetingLayout, setMeetingLayout] = useState('dual');

  const fillerWordsRegex = /\b(um|uh|like|you know|basically|actually|literally|sort of|kind of)\b/gi;
  const detectedFillers = (transcript.match(fillerWordsRegex) || []).length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const estimatedWpm = recordingSeconds > 3 ? Math.round(wordCount / (recordingSeconds / 60)) : 0;

  useEffect(() => {
    if (detectedFillers > prevFillersCountRef.current) {
      setShowFillerFlash(true);
      const t = setTimeout(() => setShowFillerFlash(false), 2000);
      prevFillersCountRef.current = detectedFillers;
      return () => clearTimeout(t);
    }
  }, [detectedFillers]);

  const setAmbientSoundscape = (type) => {
    setSoundscape(type);
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (type === 'none') {
        if (ambientGainRef.current) ambientGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
        return;
      }

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
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        ambientGainRef.current = gainNode;
      } else {
        ambientGainRef.current.gain.setValueAtTime(0.02, ctx.currentTime);
      }
    } catch (e) {
      console.warn('Ambient engine notice:', e);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setCamReady(false);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = s;
      setCamReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera notice:', err);
      setCameraError('Camera access unavailable. Using virtual candidate avatar.');
      setVirtualMode(true);
      setCamReady(true);
    }
  };

  const attachVideoStream = (node) => {
    videoRef.current = node;
    if (node && streamRef.current && streamRef.current.active) {
      if (node.srcObject !== streamRef.current) {
        node.srcObject = streamRef.current;
        node.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (!virtualMode) {
      if (!streamRef.current || !streamRef.current.active) {
        startCamera();
      } else if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
        setCamReady(true);
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      voiceAssistant.stop();
    };
  }, [meetingLayout, virtualMode]);

  const speakText = (text) => {
    if (!text) return;
    voiceAssistant.speak(text, {
      persona: interviewerPersona?.id || companyTrack?.toLowerCase(),
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    if (currentQuestion?.question) {
      setTranscript('');
      setProbeQuestion(null);
      setProbeAnswer('');
      setHint(null);
      framesRef.current = [];
      speakText(currentQuestion.question);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [currentQuestion]);

  useEffect(() => {
    let timer = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const captureFrame = () => {
    if (!videoRef.current || virtualMode) return;
    try {
      const v = videoRef.current;
      if (!v.videoWidth || !v.videoHeight) return;
      const c = document.createElement('canvas');
      c.width = 160;
      c.height = 120;
      const ctx = c.getContext('2d');
      ctx.drawImage(v, 0, 0, 160, 120);
      const b64 = c.toDataURL('image/jpeg', 0.5);
      framesRef.current.push(b64);
      if (framesRef.current.length > 5) framesRef.current.shift();
    } catch (e) {}
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(audioChunksRef.current, { type: mimeType });
        handleAudioBlob(fullBlob, mimeType);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;
      setStatusMessage('Listening to your answer...');
    } catch (err) {
      console.warn('Microphone issue:', err);
      setStatusMessage('Microphone access denied. You can type your answer in the box.');
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, []);

  const handleAudioBlob = async (blob, mimeType) => {
    if (blob.size < 100) return;
    setIsTranscribing(true);
    setStatusMessage('Transcribing speech...');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const res = await transcribeAudio(base64, mimeType);
          if (res?.text) {
            setTranscript((prev) => (prev ? `${prev} ${res.text}` : res.text));
            setStatusMessage('Speech transcribed! Edit or submit below.');
            setTimeout(() => setStatusMessage(null), 3000);
          }
        } catch (e) {
          console.warn('Transcription error:', e);
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn(err);
      setIsTranscribing(false);
    }
  };

  const handleRequestHint = async () => {
    if (isHintLoading || hint) return;
    setIsHintLoading(true);
    try {
      const res = await getQuestionHint({
        question: currentQuestion?.question,
        targetRole,
        companyTrack,
        round: currentRound?.id,
      });
      if (res?.hint) {
        setHint(res.hint);
        setHintsUsed((prev) => prev + 1);
        speakText(`Here is a guiding hint: ${res.hint}`);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleRequestProbe = async () => {
    if (isProbing || !transcript.trim()) return;
    setIsProbing(true);
    try {
      const res = await getFollowUpProbe({
        question: currentQuestion?.question,
        candidateAnswer: transcript.trim(),
        targetRole,
        companyTrack,
      });
      if (res?.followUp) {
        setProbeQuestion(res.followUp);
        speakText(`Follow-up cross-examination: ${res.followUp}`);
        setTimeout(() => probeInputRef.current?.focus(), 200);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProbing(false);
    }
  };

  const handleSubmit = async () => {
    if (isLoading || isRecording || isTranscribing) return;
    const finalAnswer = transcript.trim() || '(No response provided)';

    captureFrame();
    clearError();
    voiceAssistant.stop();
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
  const RoundIcon = roundCfg?.icon || Brain;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D13] text-slate-100 relative select-none">
      {/* ── Filler Word Flash Notification ── */}
      {showFillerFlash && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4" />
          <span>Filler Word Detected ("{transcript.match(fillerWordsRegex)?.slice(-1)[0]}") — Pause & Breathe</span>
        </div>
      )}

      {/* ── Top Bar ── */}
      <header className="bg-[#0E121B]/90 border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-lg gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="font-bold text-white text-sm sm:text-base tracking-tight">AI Interview Studio</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
              {targetRole} · {companyTrack}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambiance Selector */}
          <div className="flex items-center gap-1.5 bg-[#171E2D] px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <Headphones className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={soundscape}
              onChange={(e) => setAmbientSoundscape(e.target.value)}
              className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="none" className="bg-[#131823]">Quiet</option>
              <option value="boardroom" className="bg-[#131823]">Boardroom</option>
              <option value="open_office" className="bg-[#131823]">Office</option>
              <option value="focus" className="bg-[#131823]">Rain Focus</option>
            </select>
          </div>

          {/* Tool Tabs */}
          <div className="flex bg-[#171E2D] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('text')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'text' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Answer
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'sandbox' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'whiteboard' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Design
            </button>
          </div>

          {/* Question Counter */}
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono">
            {Math.min(answeredCount + 1, totalQuestions)} / {totalQuestions}
          </span>
        </div>
      </header>

      {/* Evaluating Overlay when finishing */}
      {phase === 'evaluating' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0D13]/95 backdrop-blur-2xl p-6 text-center space-y-5 animate-fade-in text-white">
          <div className="w-20 h-20 rounded-3xl bg-teal-950/80 border-2 border-teal-400 flex items-center justify-center text-teal-300 shadow-2xl shadow-teal-500/20 animate-bounce">
            <Brain className="w-10 h-10" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Interview Evaluator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Evaluating all responses across Aptitude, Technical Depth, STAR Fit, and Speech Delivery...
            </p>
          </div>
          <div className="w-64 h-2 bg-[#171E2D] rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="h-1 bg-[#131823] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-500 shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Studio Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-left">
        {/* Left Column: Live Camera & Question Prompt (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Meeting View Mode Selector */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Video className="w-3.5 h-3.5 text-teal-400" /> Meeting Feed
            </span>
            <div className="flex bg-[#171E2D] p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMeetingLayout('dual')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  meetingLayout === 'dual' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dual Meet
              </button>
              <button
                type="button"
                onClick={() => setMeetingLayout('avatar-only')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  meetingLayout === 'avatar-only' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Avatar Lead
              </button>
              <button
                type="button"
                onClick={() => setMeetingLayout('candidate-only')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  meetingLayout === 'candidate-only' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Webcam
              </button>
            </div>
          </div>

          {/* Meeting Tile Container */}
          <div className={`grid gap-3 ${meetingLayout === 'dual' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Tile 1: AI Interviewer Lead Feed */}
            {(meetingLayout === 'dual' || meetingLayout === 'avatar-only') && (
              <div className="bg-[#131823] p-0 overflow-hidden relative border border-white/10 aspect-video flex items-center justify-center shadow-xl rounded-2xl">
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
              <div className="bg-[#131823] p-0 overflow-hidden relative border border-white/10 aspect-video flex items-center justify-center shadow-xl rounded-2xl">
                {virtualMode ? (
                  <div className="flex flex-col items-center justify-center text-center p-4 pt-7 space-y-1.5 bg-[#131823] w-full h-full">
                    <div className="w-11 h-11 rounded-2xl bg-[#171E2D] border border-white/10 flex items-center justify-center text-teal-400 shadow-md">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-white font-bold tracking-tight">Virtual Candidate Mode Active</p>
                    <p className="text-[10px] text-slate-400">Speech telemetry and audio response active</p>
                  </div>
                ) : (
                  <video
                    ref={attachVideoStream}
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
                    <span className="text-xs">Initializing Live AI Vision...</span>
                  </div>
                )}

                {cameraError && !virtualMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#131823]/95 text-slate-300 text-xs space-y-2 z-10">
                    <p className="font-bold text-white text-xs">{cameraError}</p>
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
                        Virtual Mode
                      </button>
                    </div>
                  </div>
                )}

                {/* Candidate Feed Overlays (Top-Left YOU tag & Bottom Telemetry HUD to eliminate any collision) */}
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-black/85 backdrop-blur-md text-rose-400 border border-rose-500/30 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    YOU
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-mono shadow-md">
                    Composure: {composureScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/85 backdrop-blur-md text-teal-300 border border-teal-500/30 font-mono shadow-md">
                    Steadiness: {vocalSteadiness}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Current Question Card */}
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider flex items-center gap-1.5 font-mono ${roundCfg?.color || ''}`}>
                  <RoundIcon className="w-3.5 h-3.5" />
                  <span>{roundCfg?.label}</span>
                </span>
                <span className="text-xs font-mono text-slate-300 bg-[#171E2D] px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
                  Q{questionIndexInRound} of {currentRound?.total || 3}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={isHintLoading || hint}
                  className="text-xs text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 font-semibold disabled:opacity-40 cursor-pointer"
                  title="Receive a subtle hint (-5 pts penalty)"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHintLoading ? '...' : hint ? 'Revealed' : 'Hint (-5pts)'}</span>
                </button>

                <button
                  onClick={() => currentQuestion?.question && speakText(currentQuestion.question)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#171E2D] hover:bg-white/10 transition-all border border-white/10 cursor-pointer font-medium"
                  title="Replay Question Audio"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                  <span>Replay</span>
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-base font-bold text-white leading-relaxed pt-1">
              {currentQuestion?.question || 'Loading question...'}
            </p>

            {hint && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 animate-fade-in space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Socratic Guide</span>
                  <span className="text-[10px] font-mono text-amber-300/80">(-5 pts)</span>
                </p>
                <p className="text-slate-300 leading-relaxed">{hint}</p>
              </div>
            )}
          </div>

          {/* Follow-Up Probe Box */}
          {probeQuestion && (
            <div className="bg-[#131823] border border-amber-500/40 rounded-3xl p-5 space-y-3 animate-fade-in shadow-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <Zap className="w-4 h-4" /> Adaptive Cross-Examination Follow-Up
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">{probeQuestion}</p>
              <input
                ref={probeInputRef}
                type="text"
                value={probeAnswer}
                onChange={(e) => setProbeAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response to this cross-examination challenge..."
                className="w-full bg-[#0D111A] border border-white/10 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Workspace Tool (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'whiteboard' ? (
            <div className="h-80">
              <SystemDesignWhiteboard />
            </div>
          ) : activeTab === 'sandbox' ? (
            <div className="h-80">
              <CodeSandbox code={sandboxCode} onChange={setSandboxCode} />
            </div>
          ) : null}

          {/* Response Box & Speech Analytics */}
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Your Answer</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  detectedFillers > 2
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-[#171E2D] text-slate-300 border-white/10'
                }`}>
                  Fillers: {detectedFillers} {detectedFillers > 2 ? '⚠️' : '✓'}
                </span>
                {estimatedWpm > 0 && (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#171E2D] text-teal-300 border border-white/10 font-bold">
                    {estimatedWpm} WPM
                  </span>
                )}
                {hintsUsed > 0 && (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                    -{hintsUsed * 5}pts
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-[150px] flex flex-col relative">
              <textarea
                ref={textareaRef}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your structured answer here, or click Speak below to answer verbally..."
                rows={activeTab !== 'text' ? 4 : 7}
                disabled={isLoading || isTranscribing}
                className="w-full bg-[#0D111A] border border-white/10 hover:border-white/20 focus:border-teal-400 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none outline-none transition-all leading-relaxed shadow-inner"
              />

              <div className="flex items-center justify-between mt-2.5 px-1">
                <div className="flex-1 h-1.5 bg-[#171E2D] rounded-full mr-3 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      wordCount < 30 ? 'bg-slate-500' : wordCount < 80 ? 'bg-teal-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min((wordCount / 150) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {wordCount} words
                </span>
              </div>

              {statusMessage && (
                <div className="text-xs text-teal-400 mt-2 flex items-center gap-1.5 animate-pulse font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading || isTranscribing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 active:scale-95 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/20 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Speak Answer</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-rose-950/60 animate-pulse transition-all cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Recording ({formatSeconds(recordingSeconds)})</span>
                </button>
              )}

              {transcript.length > 20 && !probeQuestion && (
                <button
                  type="button"
                  onClick={handleRequestProbe}
                  disabled={isProbing}
                  className="text-xs text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 px-3.5 py-2.5 rounded-xl transition-all font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isProbing ? 'Thinking...' : 'Cross-Examine'}</span>
                </button>
              )}
            </div>

            {error && (
              <p className="text-rose-300 text-xs bg-rose-950/40 p-3.5 rounded-xl border border-rose-500/30 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || isRecording || isTranscribing}
              className="w-full py-3.5 rounded-2xl text-sm font-extrabold tracking-wide transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-slate-950 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Computing Evaluation...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Submit Answer</span>
                  <Send className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
