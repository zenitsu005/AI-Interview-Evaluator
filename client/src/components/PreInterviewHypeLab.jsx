import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import AppNavbar from './AppNavbar';

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
];

export default function PreInterviewHypeLab() {
  const { setPhase, targetRole, companyTrack, interviewerPersona } = useInterview();

  const [activeStep, setActiveStep] = useState(1); // 1: Breathing, 2: Vocal, 3: Posture, 4: Quick Win, 5: Ready
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  const [breathCounter, setBreathCounter] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // Step 2 Vocal warm-up
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(0);
  const [vocalCheckDone, setVocalCheckDone] = useState(false);

  // Step 3 Posture check
  const [posturePassed, setPosturePassed] = useState(false);
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

  // Webcam stream for Step 3
  useEffect(() => {
    if (activeStep === 3) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {});
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    }
  }, [activeStep]);

  const streamRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const handleStartVocalTest = async () => {
    setIsMicTesting(true);
    setVocalCheckDone(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let checks = 0;

      checkIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVocalVolume(Math.min(100, Math.round(avg * 2.5)));

        if (avg > 15) {
          checks++;
          // Require at least 6 seconds of speaking (60 checks) before auto-completing, or user can click Stop anytime
          if (checks > 60) {
            handleStopVocalTest();
          }
        }
      }, 100);
    } catch (err) {
      setIsMicTesting(false);
      setVocalCheckDone(true);
    }
  };

  const handleStopVocalTest = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsMicTesting(false);
    setVocalCheckDone(true);
    playTriumphantChime();
  };


  const handleAnswerPuzzle = (idx) => {
    setSelectedOption(idx);
    setPuzzleAnswered(true);
    if (idx === QUICK_WIN_PUZZLES[selectedPuzzleIdx].correct) {
      playTriumphantChime();
    }
  };

  const handleFinishHype = () => {
    playTriumphantChime();
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between select-none">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="anxiety-prep" />

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6 text-left">
        {/* Header & Disclaimer Banner */}
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interview Confidence Lab</h1>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded-full">
              Pacing & Anxiety Prep
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
            Guided practice for answer pacing, vocal resonance, and nervous system grounding. This lab provides educational coaching techniques—it is not medical or psychological treatment.
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 justify-between gap-1 shadow-md">

          {[
            { step: 1, label: '🫁 Box Breathing', desc: 'Heart-Rate Reset' },
            { step: 2, label: '🎙️ Vocal Resonance', desc: 'Ground Shaky Tone' },
            { step: 3, label: '🧘 Power Posture', desc: 'Executive Presence' },
            { step: 4, label: '⚡ Brain Win', desc: 'Dopamine Activation' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all ${
                activeStep === s.step
                  ? 'bg-indigo-600 text-white font-bold shadow-lg scale-[1.02]'
                  : activeStep > s.step
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-700/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <p className="text-xs">{s.label}</p>
              <p className="text-[10px] text-slate-300/80 font-mono hidden sm:block">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* ── STEP 1: Diaphragmatic Box Breathing ── */}
        {activeStep === 1 && (
          <div className="card-dark border-indigo-500/40 p-8 text-center space-y-6 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-500/40 px-3 py-1 rounded-full inline-block">
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
                className={`absolute inset-0 rounded-full border-4 border-indigo-500/30 transition-all duration-1000 ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 bg-indigo-500/20 shadow-2xl shadow-indigo-500/50'
                    : breathPhase === 'Hold'
                    ? 'scale-110 bg-cyan-500/20 shadow-2xl shadow-cyan-500/50'
                    : breathPhase === 'Exhale'
                    ? 'scale-90 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                    : 'scale-90 bg-slate-800/40'
                }`}
              />
              <div className="relative z-10 text-center space-y-1">
                <span className="text-3xl sm:text-4xl font-black text-white">{breathPhase}</span>
                <p className="text-3xl font-black font-mono text-cyan-400">{breathCounter}s</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Cycle {breathCyclesCompleted + 1} / 3
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveStep(2)}
                className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-wider shadow-lg btn-glow"
              >
                Next: Vocal Resonance Warmup →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Vocal Resonance & Grounding ── */}
        {activeStep === 2 && (
          <div className="card-dark border-cyan-500/40 p-8 text-center space-y-6 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full inline-block">
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
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500">Read Aloud with Steady Tone:</span>
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed italic">
                "I am excited to discuss my engineering background, architectural trade-offs, and how I deliver high-impact results for this team."
              </p>
            </div>

            {/* Mic Energy Gauge */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Vocal Power Resonance:</span>
                <span className="text-cyan-400 font-bold font-mono">{vocalVolume}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100"
                  style={{ width: `${vocalVolume}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {!vocalCheckDone ? (
                !isMicTesting ? (
                  <button
                    type="button"
                    onClick={handleStartVocalTest}
                    className="btn-primary py-3.5 px-8 text-xs font-black uppercase tracking-wider shadow-lg bg-cyan-600 hover:bg-cyan-500"
                  >
                    🎙️ Start Voice Test (Read Sentence Aloud)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopVocalTest}
                    className="btn-primary py-3.5 px-8 text-xs font-black uppercase tracking-wider shadow-lg bg-emerald-600 hover:bg-emerald-500 animate-pulse"
                  >
                    ⏹️ Finished Reading — Ground Voice & Proceed →
                  </button>
                )
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="btn-primary py-3.5 px-8 text-xs font-black uppercase tracking-wider shadow-lg btn-glow"
                  >
                    ✅ Voice Grounded! Next: Posture Check →
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVocalCheckDone(false); handleStartVocalTest(); }}
                    className="btn-secondary py-3 px-4 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    🔄 Re-test Voice
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── STEP 3: Power Posture & Eye Contact ── */}
        {activeStep === 3 && (
          <div className="card-dark border-emerald-500/40 p-8 text-center space-y-6 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full inline-block">
                NON-VERBAL COMMAND • POWER POSE CALIBRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Executive Posture Alignment
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sit upright, pull your shoulders slightly back, and align your webcam directly at eye level.
              </p>
            </div>

            {/* Posture Video Camera Mirror */}
            <div className="relative max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-black shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror-mode"
                style={{ transform: 'scaleX(-1)', WebkitTransform: 'scaleX(-1)' }}
              />
              <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-r border-b border-emerald-500/30" />
                <div className="border-b border-emerald-500/30" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-emerald-300 font-mono">
                ✓ Eye-Level Target Centered
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto text-left text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                <span>✅</span> <span>Shoulders relaxed & wide</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                <span>✅</span> <span>Chin parallel to ground</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                <span>✅</span> <span>Direct lens eye contact</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveStep(4)}
                className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-wider shadow-lg btn-glow bg-emerald-600 hover:bg-emerald-500"
              >
                Next: Quick-Win Brain Activation →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: 1-Minute Dopamine Brain Victory ── */}
        {activeStep === 4 && (
          <div className="card-dark border-amber-500/40 p-8 text-center space-y-6 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full inline-block">
                PREFRONTAL CORTEX ACTIVATION • 1-MINUTE QUICK WIN
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Trigger Peak Mental Momentum
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Solve this quick concept check to prime your brain for high-speed problem-solving:
              </p>
            </div>

            {/* Puzzle Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-3 max-w-xl mx-auto shadow-inner">
              <p className="font-bold text-slate-100 text-xs sm:text-sm">
                {QUICK_WIN_PUZZLES[selectedPuzzleIdx].q}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_WIN_PUZZLES[selectedPuzzleIdx].options.map((opt, i) => {
                  const isCorrect = i === QUICK_WIN_PUZZLES[selectedPuzzleIdx].correct;
                  const isSelected = selectedOption === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswerPuzzle(i)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        puzzleAnswered
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                            : isSelected
                            ? 'border-red-500 bg-red-950/60 text-red-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-500'
                          : 'border-slate-800 bg-slate-900 hover:border-indigo-500 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {puzzleAnswered && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 animate-fade-in">
                  <strong className="text-emerald-400">Insight: </strong>
                  {QUICK_WIN_PUZZLES[selectedPuzzleIdx].explanation}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleFinishHype}
                className="btn-primary py-3.5 px-10 text-sm font-black uppercase tracking-wider shadow-2xl btn-glow bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-2xl animate-bounce"
              >
                🔥 I Am Primed & Ready — Start Interview! 🚀
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center" />
    </div>
  );
}
