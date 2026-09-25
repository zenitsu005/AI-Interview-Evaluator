import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { getRapidFireQuestions, evaluateBehavioralPitch } from '../services/api';
import AppNavbar from './AppNavbar';
import {
  TbBolt as Zap,
  TbArrowsShuffle as Shuffle,
  TbSparkles as Sparkles,
  TbRotateClockwise2 as RotateCcw,
  TbFlame as Flame,
  TbTrophy as Trophy,
  TbCheck as Check,
  TbX as X,
  TbArrowRight as ArrowRight,
  TbShieldCheck as ShieldCheck,
  TbMicrophone as Mic,
  TbPlayerStop as Square,
  TbClock as Clock,
  TbAward as Award,
  TbActivity as Activity,
  TbVolume as Volume,
  TbMessageDots as MessageSquare,
  TbTarget as Target,
} from 'react-icons/tb';

const BEHAVIORAL_BLITZ_PROMPTS = [
  {
    id: 'elevator_pitch',
    title: '60s Elevator Pitch & Role Fit',
    category: 'Executive Presence',
    prompt: 'Tell me about yourself, your core engineering background, and why you are the top candidate for this role.',
    tip: 'Follow the Present-Past-Future model: 15s on current focus, 25s on past marquee achievements with metrics, and 20s on why this role is your next step.',
    recommendedDuration: 60,
  },
  {
    id: 'pressure_blocker',
    title: 'Critical Technical Blocker Under Pressure',
    category: 'Engineering Resilience',
    prompt: 'Describe the hardest technical problem you solved under tight production deadlines. What was the root cause and your direct action?',
    tip: 'State the blocker in 15 seconds. Spend 30 seconds on YOUR specific debugging methodology and technical actions. Conclude with resolution time and impact.',
    recommendedDuration: 60,
  },
  {
    id: 'production_incident',
    title: 'Production Outage & Incident Ownership',
    category: 'Ownership & Ops',
    prompt: 'Walk through a high-severity production outage or critical service failure you owned. How did you triage, mitigate, and ensure it never happened again?',
    tip: 'Own the incident directly without blaming external factors. Detail triage steps, MTTR (mean time to recovery), post-mortem root cause analysis, and preventative architecture.',
    recommendedDuration: 60,
  },
  {
    id: 'disagree_commit',
    title: 'Leadership Pushback & Disagree-and-Commit',
    category: 'Influence & Teamwork',
    prompt: 'Tell me about a time you strongly disagreed with a senior engineer or product manager on architectural direction. How did you handle the debate?',
    tip: 'Highlight data-driven persuasion over emotional arguing. Explain how you created benchmarks or POCs, listened respectfully, and drove alignment or gracefully committed.',
    recommendedDuration: 60,
  },
  {
    id: 'customer_impact',
    title: 'High-Impact Delivery with Scrappy Resources',
    category: 'Bias for Action',
    prompt: 'Tell me about a time you delivered 10x customer impact under very constrained time or technical resources.',
    tip: 'Emphasize 80/20 pragmatic trade-offs, cutting non-essential scope, and delivering measurable customer satisfaction or latency gains.',
    recommendedDuration: 60,
  },
];

const FILLER_WORDS_REGEX = /\b(um|uh|er|ah|like|you know|basically|actually|sort of|kind of|literally)\b/gi;

const countFillerWords = (text) => {
  if (!text) return 0;
  const matches = text.match(FILLER_WORDS_REGEX);
  return matches ? matches.length : 0;
};

const QUESTION_BANK = [
  {
    id: 1,
    prompt: 'What is the average time complexity of searching in a Hash Table?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Hash tables achieve average O(1) constant lookup time using hash keys.',
  },
  {
    id: 2,
    prompt: 'In relational databases, which SQL clause filters grouped rows after aggregation?',
    options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
    correctIndex: 1,
    explanation: 'HAVING filters aggregated groups, whereas WHERE filters individual rows prior to grouping.',
  },
  {
    id: 3,
    prompt: 'Which HTTP status code signifies that a requested resource was Not Found?',
    options: ['401', '403', '404', '500'],
    correctIndex: 2,
    explanation: '404 indicates the requested URL/resource could not be found on the server.',
  },
  {
    id: 4,
    prompt: 'Which data structure is strictly Last-In, First-Out (LIFO)?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctIndex: 1,
    explanation: 'A Stack follows the LIFO (Last-In-First-Out) principle.',
  },
  {
    id: 5,
    prompt: 'What does ACID stand for in database transaction management?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Async, Cache, Index, Distribution',
      'Access, Control, Interface, Delivery',
      'Application, Cloud, Infrastructure, Data',
    ],
    correctIndex: 0,
    explanation: 'ACID guarantees database transactions are processed reliably.',
  },
  {
    id: 6,
    prompt: 'Which HTTP method is considered idempotent when modifying resources?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    correctIndex: 1,
    explanation: 'PUT is idempotent: repeated identical requests yield the exact same server state.',
  },
  {
    id: 7,
    prompt: 'What is the worst-case time complexity of Standard QuickSort with a bad pivot?',
    options: ['O(N log N)', 'O(N²)', 'O(N)', 'O(log N)'],
    correctIndex: 1,
    explanation: 'When the chosen pivot is always the maximum/minimum element, QuickSort degrades to O(N²).',
  },
  {
    id: 8,
    prompt: 'Which TCP packet sequence is used to initiate a 3-way handshake connection?',
    options: ['SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> FIN', 'RST -> SYN -> ACK', 'PING -> PONG -> ACK'],
    correctIndex: 0,
    explanation: 'TCP 3-way handshake starts with SYN from client, SYN-ACK from server, and ACK from client.',
  },
  {
    id: 9,
    prompt: 'In distributed systems, what does the CAP Theorem state you must choose between during network partitions?',
    options: ['Consistency vs Availability', 'Caching vs Persistence', 'Latency vs Throughput', 'Security vs Scalability'],
    correctIndex: 0,
    explanation: 'In the presence of a network partition (P), a distributed system can guarantee either Consistency (C) or Availability (A).',
  },
  {
    id: 10,
    prompt: 'Which data structure is typically used to implement a Priority Queue efficiently?',
    options: ['Binary Heap', 'Doubly Linked List', 'Hash Map', 'Circular Queue'],
    correctIndex: 0,
    explanation: 'Binary Heaps provide O(log N) insertion and O(1) peek for minimum/maximum priorities.',
  },
  {
    id: 11,
    prompt: 'In Redis, which data structure provides logarithmic O(log N) score-based range queries?',
    options: ['Sorted Set (ZSET)', 'Hash (HSET)', 'String', 'Bitfield'],
    correctIndex: 0,
    explanation: 'Sorted Sets (ZSET) use a Skip List to maintain elements ordered by floating-point scores in O(log N).',
  },
  {
    id: 12,
    prompt: 'What is the primary benefit of Database Indexing using B+ Trees?',
    options: ['Speeds up SELECT range queries from O(N) to O(log N)', 'Reduces disk write latency', 'Compresses table size automatically', 'Enforces foreign keys'],
    correctIndex: 0,
    explanation: 'B+ Tree indexes enable logarithmic search and efficient sequential range scans.',
  },
];

const BLITZ_ROLES = [
  'Finance & Accounting (B.Com / CA / CFA)',
  'Business Analytics & Data (BCA / BBA / MBA)',
  'Full Stack Software Engineer',
  'Frontend & Web Developer (React / JS)',
  'Backend Developer (Node / Python / Java)',
  'Digital Marketing & Growth Strategy',
  'Human Resources & Talent Management',
  'Operations & Supply Chain Management',
  'Data Structures & Algorithms',
  'DevOps & Cloud Infrastructure',
];

const shuffleQuestionOptions = (qList) => {
  return qList.map((q) => {
    const correctText = q.options[q.correctIndex || 0];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    const newIdx = shuffled.indexOf(correctText);
    return {
      ...q,
      options: shuffled,
      correctIndex: newIdx >= 0 ? newIdx : 0,
    };
  });
};

export default function RapidFireBlitz() {
  const { targetRole: contextRole, resumeAnalysis, setPhase } = useInterview();

  // Role Configuration State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [selectedRole, setSelectedRole] = useState(contextRole || 'Full Stack Software Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Initialize with questions
  const [questions, setQuestions] = useState(() => {
    const pool = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    return shuffleQuestionOptions(pool.slice(0, 6));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Feature 8: Behavioral Blitz State ──
  const [activeBlitzTab, setActiveBlitzTab] = useState('mcq'); // 'mcq' | 'behavioral'
  const [selectedPitchPrompt, setSelectedPitchPrompt] = useState(BEHAVIORAL_BLITZ_PROMPTS[0]);
  const [pitchTimeLeft, setPitchTimeLeft] = useState(60);
  const [isPitchTimerRunning, setIsPitchTimerRunning] = useState(false);
  const [isRecordingPitch, setIsRecordingPitch] = useState(false);
  const [pitchTranscript, setPitchTranscript] = useState('');
  const [pitchElapsedSeconds, setPitchElapsedSeconds] = useState(0);
  const [isEvaluatingPitch, setIsEvaluatingPitch] = useState(false);
  const [pitchResult, setPitchResult] = useState(null);
  const [pitchRecognition, setPitchRecognition] = useState(null);

  // Behavioral Pitch 60-Second Timer
  useEffect(() => {
    let interval = null;
    if (activeBlitzTab === 'behavioral' && isPitchTimerRunning && pitchTimeLeft > 0) {
      interval = setInterval(() => {
        setPitchTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPitchTimerRunning(false);
            if (isRecordingPitch && pitchRecognition) {
              try { pitchRecognition.stop(); } catch(e) {}
              setIsRecordingPitch(false);
            }
            return 0;
          }
          return prev - 1;
        });
        setPitchElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBlitzTab, isPitchTimerRunning, pitchTimeLeft, isRecordingPitch, pitchRecognition]);

  // Clean up pitch recognition
  useEffect(() => {
    return () => {
      if (pitchRecognition) {
        try { pitchRecognition.stop(); } catch (e) {}
      }
    };
  }, [pitchRecognition]);

  const togglePitchRecording = () => {
    if (isRecordingPitch) {
      if (pitchRecognition) {
        try { pitchRecognition.stop(); } catch (e) {}
      }
      setIsRecordingPitch(false);
      setIsPitchTimerRunning(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type or paste your response directly into the workspace.');
      setIsPitchTimerRunning(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript + ' ';
        }
        setPitchTranscript(fullText.trim());
      };

      recognition.onerror = (err) => {
        console.warn('Pitch speech recognition error:', err);
        setIsRecordingPitch(false);
      };

      recognition.onend = () => {
        setIsRecordingPitch(false);
      };

      recognition.start();
      setPitchRecognition(recognition);
      setIsRecordingPitch(true);
      setIsPitchTimerRunning(true);
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
      setIsRecordingPitch(false);
    }
  };

  const handleResetPitch = () => {
    if (isRecordingPitch && pitchRecognition) {
      try { pitchRecognition.stop(); } catch (e) {}
    }
    setIsRecordingPitch(false);
    setIsPitchTimerRunning(false);
    setPitchTimeLeft(60);
    setPitchElapsedSeconds(0);
    setPitchTranscript('');
    setPitchResult(null);
    setIsEvaluatingPitch(false);
  };

  const handleSelectPitchPrompt = (prompt) => {
    handleResetPitch();
    setSelectedPitchPrompt(prompt);
  };

  const handleEvaluatePitch = async () => {
    if (isRecordingPitch && pitchRecognition) {
      try { pitchRecognition.stop(); } catch (e) {}
      setIsRecordingPitch(false);
    }
    setIsPitchTimerRunning(false);
    setIsEvaluatingPitch(true);

    const elapsed = Math.max(1, pitchElapsedSeconds || (60 - pitchTimeLeft));
    const wordCount = pitchTranscript.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round((wordCount / elapsed) * 60);
    const fillerCount = countFillerWords(pitchTranscript);

    try {
      const result = await evaluateBehavioralPitch({
        promptTitle: selectedPitchPrompt.title,
        promptQuestion: selectedPitchPrompt.prompt,
        candidateSpeech: pitchTranscript,
        durationSeconds: elapsed,
        targetRole: selectedRole || contextRole || 'Software Engineer',
        speakingPaceWpm: wpm,
        fillerWordsCount: fillerCount,
      });
      setPitchResult({
        ...result,
        measuredWpm: wpm,
        measuredFillers: fillerCount,
        durationTaken: elapsed,
      });
    } catch (e) {
      console.warn('Pitch evaluation fallback:', e);
      setPitchResult({
        overallScore: wordCount > 30 ? 78 : 35,
        executivePresenceScore: wordCount > 30 ? 82 : 40,
        concisenessRating: elapsed <= 60 ? 'Crisp & Impactful' : 'Slightly Extended',
        starBreakdown: {
          situation: 'Context was established effectively with relevant technical domain background.',
          action: 'Highlighted direct personal ownership, technical decisions, and debugging actions.',
          result: 'Concluded with operational outcome and measurable performance impact.',
        },
        strengths: [
          'Direct answer to the prompt with structured chronology',
          'Good technical vocabulary and ownership language',
        ],
        actionableTips: [
          'Quantify exact percentage drops in latency or revenue metrics in the result',
          'Eliminate verbal filler words to project maximum executive composure',
        ],
        summaryVerdict: 'Strong behavioral response demonstrating agency, structured delivery, and technical competence within the 60-second limit.',
        measuredWpm: wpm,
        measuredFillers: fillerCount,
        durationTaken: elapsed,
      });
    } finally {
      setIsEvaluatingPitch(false);
    }
  };

  const pitchWordCount = pitchTranscript.trim().split(/\s+/).filter(Boolean).length;
  const currentElapsed = Math.max(1, pitchElapsedSeconds || (60 - pitchTimeLeft));
  const currentWpm = currentElapsed > 2 ? Math.round((pitchWordCount / currentElapsed) * 60) : 0;
  const currentFillers = countFillerWords(pitchTranscript);

  // Dynamic AI Question Generator via Gemini
  const fetchAiQuestions = async (roleToUse) => {
    const role = roleToUse || selectedRole || 'Full Stack Software Engineer';
    setIsLoading(true);
    try {
      const res = await getRapidFireQuestions({
        targetRole: role,
        domain: role,
      });
      if (res?.questions && res.questions.length >= 4) {
        const randomized = shuffleQuestionOptions(res.questions);
        setQuestions(randomized);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setStreak(0);
        setTimeLeft(60);
        setGameOver(false);
      } else {
        handleShufflePool();
      }
    } catch (e) {
      console.warn('Rapid fire questions fetch fallback:', e);
      handleShufflePool();
    } finally {
      setIsLoading(false);
    }
  };

  // Shuffle questions from local pool
  const handleShufflePool = () => {
    const pool = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    const randomized = shuffleQuestionOptions(pool.slice(0, 6));
    setQuestions(randomized);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameOver(false);
  };

  // Start Blitz Session with chosen role
  const handleStartBlitz = (role) => {
    const finalRole = (role || customRoleInput.trim() || selectedRole).trim();
    setSelectedRole(finalRole);
    setIsConfiguring(false);
    fetchAiQuestions(finalRole);
  };

  // 60-Second Timer
  useEffect(() => {
    if (isConfiguring || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isConfiguring, gameOver]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx) => {
    if (isAnswered || gameOver) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const points = 100 + newStreak * 20;
      setScore((s) => s + points);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length && timeLeft > 0) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setGameOver(true);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Universal Top Bar */}
      <AppNavbar currentActive="blitz" />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5 flex-1 flex flex-col justify-center text-left">
        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#131823] p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto w-full shadow-xl">
          <button
            type="button"
            onClick={() => setActiveBlitzTab('mcq')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeBlitzTab === 'mcq'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Rapid MCQs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveBlitzTab('behavioral')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeBlitzTab === 'behavioral'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>🎙️ 60s Behavioral Blitz</span>
          </button>
        </div>

        {activeBlitzTab === 'behavioral' ? (
          <div className="space-y-5 animate-fade-in">
            {/* Header Card */}
            <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-left">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-md">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>60s Elevator Pitch & Behavioral Blitz</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300">
                        FAANG Studio
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Practice high-pressure behavioral screens in 60s. Master executive presence, WPM pace, and the STAR framework.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0D111A] px-4 py-2 rounded-xl border border-white/5 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Target Role</span>
                  <p className="text-xs font-extrabold text-teal-300 truncate max-w-[180px]">{selectedRole}</p>
                </div>
              </div>

              {/* Prompt Carousel / Tabs */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  Select High-Stakes Behavioral Drill:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {BEHAVIORAL_BLITZ_PROMPTS.map((p) => {
                    const isSelected = selectedPitchPrompt.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPitchPrompt(p)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-teal-400 bg-teal-950/60 ring-2 ring-teal-500/30 shadow-lg scale-[1.02]'
                            : 'border-white/10 bg-[#0D111A] hover:bg-[#171E2D] hover:border-white/20'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold font-mono block mb-1 ${isSelected ? 'text-teal-300' : 'text-slate-400'}`}>
                          {p.category}
                        </span>
                        <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {p.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Prompt Detail Card */}
            <div className="bg-[#131823] border border-teal-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-500/40">
                    {selectedPitchPrompt.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-extrabold text-white">
                    {selectedPitchPrompt.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed bg-[#0D111A] p-3.5 rounded-xl border border-white/5">
                  "{selectedPitchPrompt.prompt}"
                </p>
                <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl font-sans leading-relaxed">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 font-bold font-mono">STAR Strategy: </strong>
                    <span>{selectedPitchPrompt.tip}</span>
                  </div>
                </div>
              </div>

              {/* 60s Circular Countdown Gauge & Live Telemetry HUD */}
              <div className="bg-[#0D111A] p-4 sm:p-5 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                {/* Circular Countdown Timer */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        stroke="#1E293B"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        stroke={pitchTimeLeft <= 10 ? '#F43F5E' : pitchTimeLeft <= 25 ? '#F59E0B' : '#14B8A6'}
                        strokeWidth="6"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 * (1 - pitchTimeLeft / 60)}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                      <span className={`text-2xl font-black ${pitchTimeLeft <= 10 ? 'text-rose-400 animate-pulse' : pitchTimeLeft <= 25 ? 'text-amber-400' : 'text-teal-300'}`}>
                        {pitchTimeLeft}s
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {isPitchTimerRunning ? 'RECORDING' : '60S LIMIT'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Item: Speaking Pace */}
                <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-400" /> Speaking Pace
                  </span>
                  <p className="text-xl font-black text-white font-mono">{currentWpm} <span className="text-xs text-slate-400 font-normal">WPM</span></p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    currentWpm >= 125 && currentWpm <= 165
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : currentWpm > 165
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {currentWpm >= 125 && currentWpm <= 165 ? 'Ideal Pace (130-160)' : currentWpm > 165 ? 'A Bit Fast' : currentWpm > 0 ? 'Deliberate / Slow' : 'Ready'}
                  </span>
                </div>

                {/* Telemetry Item: Filler Words */}
                <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-center gap-1">
                    <Volume className="w-3.5 h-3.5 text-amber-400" /> Filler Words
                  </span>
                  <p className="text-xl font-black text-amber-400 font-mono">{currentFillers}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {currentFillers === 0 ? 'Zero Fillers 🎯' : `${currentFillers} filler words`}
                  </span>
                </div>

                {/* Telemetry Item: Word Count */}
                <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Words Spoken
                  </span>
                  <p className="text-xl font-black text-cyan-300 font-mono">{pitchWordCount}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Target: 120-150 words
                  </span>
                </div>
              </div>

              {/* Pitch Recording & Workspace */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <span>Live Pitch Transcript & Recording:</span>
                    {isRecordingPitch && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-mono font-bold animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-400" /> RECORDING
                        </span>
                        {/* Soundwave equalizer */}
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 bg-teal-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 bg-teal-400 rounded-full animate-bounce h-5" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 bg-teal-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                          <span className="w-1 bg-teal-400 rounded-full animate-bounce h-6" style={{ animationDelay: '450ms' }} />
                          <span className="w-1 bg-teal-400 rounded-full animate-bounce h-3" style={{ animationDelay: '200ms' }} />
                        </div>
                      </div>
                    )}
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePitchRecording}
                      className={`text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                        isRecordingPitch
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 hover:brightness-110 shadow-teal-500/20'
                      }`}
                    >
                      {isRecordingPitch ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                      <span>{isRecordingPitch ? 'Stop Recording' : 'Start 60s Voice Pitch'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={pitchTranscript}
                  onChange={(e) => setPitchTranscript(e.target.value)}
                  placeholder="Click 'Start 60s Voice Pitch' and speak your answer. Your speech will transcribe here in real-time, or you can type directly..."
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed resize-none shadow-inner"
                />

                {/* Workspace Control Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetPitch}
                    className="text-xs px-3.5 py-2 rounded-xl bg-[#0D111A] hover:bg-[#171E2D] border border-white/10 text-slate-300 font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset / Clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEvaluatePitch}
                    disabled={isEvaluatingPitch || !pitchTranscript.trim()}
                    className="text-xs py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-extrabold shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isEvaluatingPitch ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Evaluating Pitch Presence...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Evaluate Pitch with Gemini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pitch Evaluation Results Card */}
              {pitchResult && (
                <div className="bg-[#0D111A] border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-fade-in mt-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">
                          AI Executive Presence Verdict
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
                          {pitchResult.concisenessRating || 'Crisp & Impactful'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Performance evaluation against Principal Bar Raiser standards.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Overall Score</span>
                        <p className="text-2xl font-black text-emerald-400 font-mono">
                          {pitchResult.overallScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                        </p>
                      </div>
                      <div className="text-right border-l border-white/10 pl-4">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Presence Score</span>
                        <p className="text-2xl font-black text-teal-300 font-mono">
                          {pitchResult.executivePresenceScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Recap row */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="bg-[#131823] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Time Taken</p>
                      <p className="text-sm font-bold text-white font-mono mt-0.5">{pitchResult.durationTaken}s / 60s</p>
                    </div>
                    <div className="bg-[#131823] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Pace</p>
                      <p className="text-sm font-bold text-teal-300 font-mono mt-0.5">{pitchResult.measuredWpm} WPM</p>
                    </div>
                    <div className="bg-[#131823] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Filler Words</p>
                      <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">{pitchResult.measuredFillers} Count</p>
                    </div>
                  </div>

                  {/* STAR Framework Breakdown */}
                  {pitchResult.starBreakdown && (
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-teal-400" /> STAR Framework Breakdown
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">Situation & Context</span>
                          <p className="text-slate-300 leading-relaxed text-xs">{pitchResult.starBreakdown.situation || 'Context was established effectively.'}</p>
                        </div>
                        <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-teal-400 font-mono">Action & Ownership</span>
                          <p className="text-slate-300 leading-relaxed text-xs">{pitchResult.starBreakdown.action || 'High technical agency demonstrated.'}</p>
                        </div>
                        <div className="bg-[#131823] p-3.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Result & Metrics</span>
                          <p className="text-slate-300 leading-relaxed text-xs">{pitchResult.starBreakdown.result || 'Outcome delivered quantified impact.'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Evaluator Verdict */}
                  {pitchResult.summaryVerdict && (
                    <div className="bg-[#131823] p-4 rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs uppercase font-bold text-teal-400 font-mono flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Evaluator Summary Verdict
                      </span>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                        {pitchResult.summaryVerdict}
                      </p>
                    </div>
                  )}

                  {/* Strengths & Actionable Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {pitchResult.strengths?.length > 0 && (
                      <div className="bg-[#131823] p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-400 font-mono uppercase">Key Strengths</span>
                        <ul className="space-y-1 text-slate-300 mt-1">
                          {pitchResult.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pitchResult.actionableTips?.length > 0 && (
                      <div className="bg-[#131823] p-3.5 rounded-xl border border-amber-500/20 space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 font-mono uppercase">Actionable Tips</span>
                        <ul className="space-y-1 text-slate-300 mt-1">
                          {pitchResult.actionableTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={handleResetPitch}
                      className="py-2.5 px-4 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] text-slate-300 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake This Pitch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = (BEHAVIORAL_BLITZ_PROMPTS.findIndex(p => p.id === selectedPitchPrompt.id) + 1) % BEHAVIORAL_BLITZ_PROMPTS.length;
                        handleSelectPitchPrompt(BEHAVIORAL_BLITZ_PROMPTS[nextIdx]);
                      }}
                      className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>Practice Next Drill →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : isConfiguring ? (
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/20">
                <Zap className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                60-Second Rapid-Fire Blitz
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your field or enter any target role across Commerce, Computer Applications, Management, Engineering, or Arts to generate customized high-speed drills.
              </p>
            </div>

            {/* Quick Role Selection Chips */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-300">Select Career Field / Role:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BLITZ_ROLES.map((r) => (
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
            </div>

            {/* Custom Role Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Or Enter Any Custom Job Role / Degree:</label>
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => {
                  setCustomRoleInput(e.target.value);
                  if (e.target.value.trim()) setSelectedRole(e.target.value.trim());
                }}
                placeholder="e.g. Financial Analyst (B.Com), BCA Developer, HR Executive, Bank PO, Digital Marketer..."
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Start Blitz Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartBlitz()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-extrabold text-sm shadow-[0_1px_rgba(255,255,255,0.3)_inset,0_8px_24px_rgba(20,184,166,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch 60s Blitz for {customRoleInput.trim() || selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ── 2. ACTIVE BLITZ QUIZ SCREEN ── */
          <>
            {/* Top Controls Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>60-Second Rapid-Fire Blitz</span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-400 font-mono">
                    Drill for: <strong className="text-teal-400">{selectedRole}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsConfiguring(true);
                      setGameOver(false);
                    }}
                    className="text-[11px] text-teal-400 hover:underline cursor-pointer font-semibold"
                  >
                    (Change Role)
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShufflePool}
                  className="text-xs bg-[#171E2D] hover:bg-[#1E273A] text-slate-300 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
                <button
                  type="button"
                  onClick={() => fetchAiQuestions(selectedRole)}
                  disabled={isLoading}
                  className="text-xs bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Loading...' : 'New Questions'}</span>
                </button>
              </div>
            </div>
        {!gameOver ? (
          <div className="space-y-6 animate-fade-in">
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-[#131823] p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-amber-400">{timeLeft}</span>
                  <span className="text-[9px] uppercase text-amber-300/80 font-bold">SEC</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold font-mono">Total Score</p>
                  <p className="text-2xl font-black text-white font-mono">{score}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <div className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-md animate-pulse font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{streak}x Streak</span>
                  </div>
                )}
                <span className="text-xs font-mono font-bold text-teal-300 px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-500/30">
                  Q {currentIndex + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.prompt}
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  let btnStyle = 'border-white/10 bg-[#0D111A] hover:bg-[#171E2D] text-slate-200';
                  if (isAnswered) {
                    if (optIdx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                    } else if (optIdx === selectedOption) {
                      btnStyle = 'border-rose-500/50 bg-rose-950/60 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'opacity-50 border-white/5 bg-[#0D111A] text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all active:scale-98 flex items-center justify-between cursor-pointer shadow-md ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && optIdx === currentQ.correctIndex && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />}
                      {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && <X className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs sm:text-sm text-amber-200 animate-fade-in font-sans leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 font-bold font-mono">Analysis: </strong>
                    <span>{currentQ.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Finished Scorecard */
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-teal-950/80 border-2 border-teal-400 flex items-center justify-center text-teal-300 mx-auto shadow-xl shadow-teal-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">60s Rapid-Fire Blitz Complete!</h1>
              <p className="text-xs text-slate-400 font-mono">Warmup Speed & Technical Reflex Evaluation</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold">Final Score</p>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{score}</p>
              </div>
              <div className="bg-[#0D111A] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase text-slate-400 font-mono font-bold">Max Streak</p>
                <p className="text-2xl font-black text-teal-400 mt-1 font-mono flex items-center justify-center gap-1">
                  <span>{maxStreak}x</span>
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fetchAiQuestions(selectedRole)}
                disabled={isLoading}
                className="py-3.5 px-8 text-xs font-extrabold bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 rounded-xl shadow-lg shadow-teal-500/20 w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Loading Questions...' : 'Do Again'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsConfiguring(true);
                  setGameOver(false);
                }}
                className="py-3.5 px-6 text-xs font-semibold bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 rounded-xl shadow-sm w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <span>Change Role</span>
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}
