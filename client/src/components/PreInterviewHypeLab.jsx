import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';
import {
  HeartPulse,
  Activity,
  Mic,
  Flame,
  Sparkles,
  CheckCircle2,
  Video,
  Play,
  ArrowRight,
  RotateCcw,
  Zap,
  Check,
  Volume2,
  Smile,
  ShieldCheck,
} from 'lucide-react';

// Web Audio API Calming Tones and Fanfare
const playCalmTone = (freq = 432, duration = 2.5) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

const playTriumphantChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.45);
    });
  } catch (e) {}
};

const QUICK_WIN_PUZZLES = [
  {
    q: 'If a distributed cluster doubles its throughput every 3 minutes, and is at full capacity in 30 minutes, when was it at 50% capacity?',
    options: ['15 minutes', '27 minutes', '28.5 minutes', '29 minutes'],
    correct: 1,
    explanation: 'Since throughput doubles every 3 minutes, it was at 50% exactly 3 minutes before full capacity (30 - 3 = 27 minutes).',
  },
  {
    q: 'You need to reverse an array in-place. What is the minimum auxiliary space complexity required?',
    options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
    correct: 2,
    explanation: 'Using two pointers swapping elements from ends toward the center requires strictly O(1) extra memory.',
  },
  {
    q: 'Which HTTP status code signifies that a resource was successfully created on the server?',
    options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
    correct: 1,
    explanation: '201 Created is the standard RFC response for successful entity creation (e.g. POST requests).',
  },
  {
    q: 'In a microservices architecture, which pattern prevents cascading failures when a downstream dependency is unhealthy?',
    options: ['Circuit Breaker', 'Two-Phase Commit', 'Saga Orchestrator', 'Write-Ahead Log'],
    correct: 0,
    explanation: 'The Circuit Breaker pattern trips open to immediately fail fast and prevent thread pool exhaustion when a service fails.',
  }
];

export default function PreInterviewHypeLab() {
  const { setPhase } = useInterview();

  const [activeStep, setActiveStep] = useState(1); // 1: Breathing, 2: Vocal, 3: Posture, 4: Quick Win
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale -> Hold -> Exhale -> Rest
  const [breathCounter, setBreathCounter] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // Step 2 Vocal warm-up
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(0);
  const [vocalCheckDone, setVocalCheckDone] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [simulatedBars, setSimulatedBars] = useState([20, 45, 60, 80, 55, 30, 70, 85, 40, 65, 30, 50]);

  // Step 3 Posture check
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [postureChecklist, setPostureChecklist] = useState({
    shoulders: false,
    eyeLevel: false,
    spine: false,
  });
  const videoRef = useRef(null);

  // Step 4 Quick Win
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [puzzleAnswered, setPuzzleAnswered] = useState(false);

  // Box Breathing Loop
  useEffect(() => {
    if (activeStep !== 1) return;

    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (breathPhase === 'Inhale') {
          setBreathPhase('Hold');
          playCalmTone(520, 1.5);
          return 4;
        } else if (breathPhase === 'Hold') {
          setBreathPhase('Exhale');
          playCalmTone(380, 1.5);
          return 4;
        } else if (breathPhase === 'Exhale') {
          setBreathPhase('Rest');
          playCalmTone(320, 1.5);
          return 4;
        } else {
          setBreathPhase('Inhale');
          setBreathCyclesCompleted((c) => c + 1);
          playCalmTone(440, 1.5);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeStep, breathPhase]);

  // Vocal simulation bar animation when testing
  useEffect(() => {
    if (!isMicTesting) return;
    const barTimer = setInterval(() => {
      setSimulatedBars(
        Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 25)
      );
    }, 120);
    return () => clearInterval(barTimer);
  }, [isMicTesting]);

  // Webcam stream for Step 3
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser environment.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.log('Webcam access error:', err);
      setCameraError('Camera access denied or unavailable. You can use the visual alignment guide below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeStep === 3) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeStep]);

  const streamRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const handleStartVocalTest = async () => {
    setIsMicTesting(true);
    setVocalCheckDone(false);
    setMicPermissionDenied(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let highVolumeTicks = 0;

      checkIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const volumeScaled = Math.min(100, Math.round(avg * 2.8));
        setVocalVolume(volumeScaled);

        if (volumeScaled > 20) {
          highVolumeTicks++;
          if (highVolumeTicks >= 30) { // ~3s of clear voice
            handleStopVocalTest();
          }
        }
      }, 100);
    } catch (err) {
      console.log('Mic test fallback:', err);
      setMicPermissionDenied(true);
      // Simulate animated resonance test if real mic is blocked
      let fakeVol = 15;
      checkIntervalRef.current = setInterval(() => {
        fakeVol = Math.floor(Math.random() * 45) + 45;
        setVocalVolume(fakeVol);
      }, 150);
    }
  };

  const handleStopVocalTest = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsMicTesting(false);
    setVocalCheckDone(true);
    setVocalVolume(88);
    playTriumphantChime();
  };

  const handleQuickCalibrate = () => {
    setIsMicTesting(true);
    setTimeout(() => {
      handleStopVocalTest();
    }, 1500);
  };

  const toggleChecklistItem = (key) => {
    setPostureChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAnswerPuzzle = (idx) => {
    setSelectedOption(idx);
    setPuzzleAnswered(true);
    if (idx === QUICK_WIN_PUZZLES[selectedPuzzleIdx].correct) {
      playTriumphantChime();
    }
  };

  const handleNextPuzzle = () => {
    setSelectedOption(null);
    setPuzzleAnswered(false);
    setSelectedPuzzleIdx((prev) => (prev + 1) % QUICK_WIN_PUZZLES.length);
  };

  const handleFinishHype = () => {
    playTriumphantChime();
    setPhase('setup');
  };

  const allPostureChecked = postureChecklist.shoulders && postureChecklist.eyeLevel && postureChecklist.spine;

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Universal Top Bar */}
      <AppNavbar currentActive="anxiety-prep" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6 text-left">
        {/* Header & Disclaimer Banner */}
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interview Confidence Lab</h1>
            <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full">
              Pacing & Anxiety Prep
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed text-pretty">
            Guided practice for answer pacing, vocal resonance, and nervous system grounding. This lab provides educational coaching techniques.
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex bg-[#0D111A] p-1.5 rounded-2xl border border-white/10 justify-between gap-1 shadow-inner">
          {[
            { step: 1, label: 'Box Breathing', desc: 'Heart-Rate Reset', icon: HeartPulse },
            { step: 2, label: 'Vocal Resonance', desc: 'Ground Shaky Tone', icon: Mic },
            { step: 3, label: 'Power Posture', desc: 'Executive Presence', icon: ShieldCheck },
            { step: 4, label: 'Brain Drill', desc: 'Dopamine Win', icon: Zap },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activeStep === s.step
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-md scale-[1.02]'
                    : activeStep > s.step
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <p className="text-xs font-semibold">{s.label}</p>
                </div>
                <p className="text-[10px] opacity-70 font-mono hidden sm:block">{s.desc}</p>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Diaphragmatic Box Breathing */}
        {activeStep === 1 && (
          <div className="bg-[#131823] border border-white/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl rounded-3xl animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full inline-block">
                NEUROSCIENCE PROTOCOL • VAGUS NERVE STABILIZATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Reset Cortisol & Heart Rate
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Slow, rhythmic 4-second box breathing halts adrenaline spikes and restores clear, sharp memory recall.
              </p>
            </div>

            {/* Glowing Breathing Visualizer */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 bg-teal-950/60 border-teal-400 shadow-2xl shadow-teal-500/30'
                    : breathPhase === 'Hold'
                    ? 'scale-110 bg-cyan-950/60 border-cyan-400 shadow-2xl shadow-cyan-500/30'
                    : breathPhase === 'Exhale'
                    ? 'scale-90 bg-emerald-950/60 border-emerald-400 shadow-2xl shadow-emerald-500/30'
                    : 'scale-90 bg-[#0D111A] border-white/10'
                }`}
              />
              <div className="relative z-10 text-center space-y-1">
                <span className="text-3xl sm:text-4xl font-black text-white">{breathPhase}</span>
                <p className="text-3xl font-black font-mono text-teal-400">{breathCounter}s</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Cycle {breathCyclesCompleted + 1} / 3
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Next: Vocal Resonance Warmup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Vocal Resonance & Grounding */}
        {activeStep === 2 && (
          <div className="bg-[#131823] border border-white/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl rounded-3xl animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full inline-block">
                ACOUSTIC CALIBRATION • DEEP DIAPHRAGM PROJECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Eliminate Shaky Voice
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Nervous tension causes vocal cords to tighten, making candidates sound hesitant. Read this sentence aloud with chest resonance:
              </p>
            </div>

            {/* Script to Read Aloud */}
            <div className="bg-[#0D111A] p-5 rounded-2xl border border-white/10 text-left space-y-2 max-w-xl mx-auto shadow-inner">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider font-mono">
                Read Aloud with Steady Pitch:
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed italic font-sans">
                "I am excited to discuss my engineering background, architectural trade-offs, and how I deliver high-impact results for this team."
              </p>
            </div>

            {/* Equalizer Frequency Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-14 max-w-xs mx-auto">
              {simulatedBars.map((height, idx) => (
                <div
                  key={idx}
                  className="w-3 rounded-full transition-all duration-100"
                  style={{
                    height: `${isMicTesting ? height : vocalCheckDone ? 50 : 15}%`,
                    backgroundColor: isMicTesting ? '#14b8a6' : vocalCheckDone ? '#10b981' : '#334155',
                  }}
                />
              ))}
            </div>

            {/* Mic Energy Gauge */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Vocal Power Resonance:</span>
                <span className="text-teal-400 font-bold">
                  {vocalCheckDone ? '100% (Grounded)' : `${vocalVolume}%`}
                </span>
              </div>
              <div className="h-3 bg-[#0D111A] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-150"
                  style={{ width: vocalCheckDone ? '100%' : `${vocalVolume}%` }}
                />
              </div>
            </div>

            {micPermissionDenied && (
              <p className="text-[11px] text-amber-400 font-mono">
                Microphone permission is optional. You can test live or click "Quick Resonance Calibration".
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {!vocalCheckDone ? (
                !isMicTesting ? (
                  <>
                    <button
                      type="button"
                      onClick={handleStartVocalTest}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Start Voice Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickCalibrate}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] text-slate-200 border border-white/10 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>Quick Tone Calibration</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopVocalTest}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer animate-pulse"
                  >
                    Finish Reading (Save Resonance)
                  </button>
                )
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Voice Grounded! Next: Posture Check</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVocalCheckDone(false);
                      setVocalVolume(0);
                      handleStartVocalTest();
                    }}
                    className="py-3 px-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-test Voice</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Power Posture & Eye Contact */}
        {activeStep === 3 && (
          <div className="bg-[#131823] border border-white/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl rounded-3xl animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                NON-VERBAL COMMAND • POWER POSE CALIBRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Executive Posture Alignment
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sit upright, pull your shoulders slightly back, and align your gaze at eye level to project natural confidence.
              </p>
            </div>

            {/* Posture Video Camera Mirror */}
            <div className="relative max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border-2 border-teal-500/30 bg-[#0D111A] shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                style={{ transform: 'scaleX(-1)', WebkitTransform: 'scaleX(-1)' }}
              />

              {!cameraActive && (
                <div className="p-6 text-center space-y-3 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto">
                    {cameraError ? cameraError : 'Camera Mirror Mode'}
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enable Live Camera</span>
                  </button>
                </div>
              )}

              {/* Grid Alignment Overlay */}
              <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-b border-emerald-500/30" />
              </div>

              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-emerald-300 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{cameraActive ? 'Live Eye-Level Grid' : 'Alignment Guide Active'}</span>
              </div>
            </div>

            {/* Interactive Posture Checkboxes */}
            <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs font-sans">
              <button
                type="button"
                onClick={() => toggleChecklistItem('shoulders')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  postureChecklist.shoulders
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold shadow-md'
                    : 'bg-[#0D111A] border-white/10 text-slate-400 hover:bg-[#171E2D]'
                }`}
              >
                {postureChecklist.shoulders ? <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                <span>Shoulders relaxed & wide</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChecklistItem('eyeLevel')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  postureChecklist.eyeLevel
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold shadow-md'
                    : 'bg-[#0D111A] border-white/10 text-slate-400 hover:bg-[#171E2D]'
                }`}
              >
                {postureChecklist.eyeLevel ? <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                <span>Direct eye-level gaze</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChecklistItem('spine')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  postureChecklist.spine
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold shadow-md'
                    : 'bg-[#0D111A] border-white/10 text-slate-400 hover:bg-[#171E2D]'
                }`}
              >
                {postureChecklist.spine ? <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                <span>Spine tall & upright</span>
              </button>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Next: Quick-Win Brain Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 1-Minute Dopamine Brain Victory */}
        {activeStep === 4 && (
          <div className="bg-[#131823] border border-white/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl rounded-3xl animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full inline-block">
                PREFRONTAL CORTEX ACTIVATION • 1-MINUTE QUICK WIN
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Trigger Peak Mental Momentum
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Solve this quick concept check to prime your brain for high-speed technical problem solving:
              </p>
            </div>

            {/* Puzzle Card */}
            <div className="bg-[#0D111A] p-5 sm:p-6 rounded-2xl border border-white/10 text-left space-y-4 max-w-xl mx-auto shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  Concept Drill #{selectedPuzzleIdx + 1} of {QUICK_WIN_PUZZLES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next Drill</span>
                </button>
              </div>

              <p className="font-bold text-white text-xs sm:text-sm leading-relaxed">
                {QUICK_WIN_PUZZLES[selectedPuzzleIdx].q}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_WIN_PUZZLES[selectedPuzzleIdx].options.map((opt, i) => {
                  const isCorrect = i === QUICK_WIN_PUZZLES[selectedPuzzleIdx].correct;
                  const isSelected = selectedOption === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswerPuzzle(i)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        puzzleAnswered
                          ? isCorrect
                            ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 font-bold shadow-sm'
                            : isSelected
                            ? 'border-rose-500/50 bg-rose-950/60 text-rose-300 font-bold'
                            : 'border-white/5 bg-[#0D111A] text-slate-500'
                          : 'border-white/10 bg-[#171E2D] hover:bg-[#1E273A] text-slate-200 shadow-sm'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {puzzleAnswered && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1 animate-fade-in shadow-sm flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-400 font-mono">Explanation:</p>
                    <p className="text-amber-200/90 leading-relaxed">{QUICK_WIN_PUZZLES[selectedPuzzleIdx].explanation}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFinishHype}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-teal-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>I Am Primed & Ready — Start Interview!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {puzzleAnswered && (
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  className="py-3 px-5 text-xs text-slate-300 hover:text-white font-mono border border-white/10 rounded-xl bg-[#171E2D] shadow-sm cursor-pointer"
                >
                  Try Another Drill →
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}
