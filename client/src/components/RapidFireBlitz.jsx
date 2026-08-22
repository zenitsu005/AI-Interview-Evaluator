import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { getRapidFireQuestions } from '../services/api';
import AppNavbar from './AppNavbar';
import {
  Zap,
  Shuffle,
  Sparkles,
  RotateCcw,
  Flame,
  Trophy,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

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
  const { targetRole, resumeAnalysis, setPhase } = useInterview();

  // Initialize with 6 randomized questions from pool with shuffled options
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

  // Dynamic AI Question Generator via Gemini
  const fetchAiQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await getRapidFireQuestions({
        targetRole: targetRole || 'Software Engineer',
        domain: resumeAnalysis?.domain || 'Software Engineering',
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

  // Fetch fresh questions on mount
  useEffect(() => {
    fetchAiQuestions();
  }, [targetRole]);

  // 60-Second Timer
  useEffect(() => {
    if (gameOver) return;
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
  }, [gameOver]);

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
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>60-Second Rapid-Fire Blitz</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Warmup Drill for <strong className="text-teal-400">{targetRole || 'Software Engineer'}</strong></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShufflePool}
              className="text-xs bg-[#171E2D] hover:bg-[#1E273A] text-slate-300 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Pool</span>
            </button>
            <button
              type="button"
              onClick={fetchAiQuestions}
              disabled={isLoading}
              className="text-xs bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold px-4 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Loading...' : 'New AI Questions'}</span>
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
                onClick={fetchAiQuestions}
                className="py-3 px-6 text-xs font-semibold w-full sm:w-auto flex items-center justify-center gap-2 bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 rounded-xl shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                <span>Refresh Questions</span>
              </button>

              <button
                onClick={() => setPhase('setup')}
                className="py-3 px-8 text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 rounded-xl shadow-lg shadow-teal-500/20 w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Jump to Full AI Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-white/10 bg-[#0E121B] text-center" />
    </div>
  );
}
