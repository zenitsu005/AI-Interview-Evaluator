import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { getRapidFireQuestions } from '../services/api';
import AppNavbar from './AppNavbar';

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="blitz" />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5 flex-1 flex flex-col justify-center text-left">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>⚡</span> 60-Second Rapid-Fire Blitz
            </h1>
            <p className="text-xs text-slate-500">Warmup Drill for <strong className="text-amber-700">{targetRole || 'Software Engineer'}</strong></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShufflePool}
              className="text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl transition-all font-semibold shadow-sm cursor-pointer"
            >
              🔀 Shuffle Pool
            </button>
            <button
              type="button"
              onClick={fetchAiQuestions}
              disabled={isLoading}
              className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? '⏳ Loading...' : '✨ New AI Questions'}</span>
            </button>
          </div>
        </div>
        {!gameOver ? (
          <div className="space-y-6 animate-fade-in">
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-amber-600">{timeLeft}</span>
                  <span className="text-[9px] uppercase text-slate-500">SEC</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Score</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">{score}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-xl font-black flex items-center gap-1 shadow-sm animate-pulse">
                    <span>🔥</span>
                    <span>{streak}x Streak</span>
                  </div>
                )}
                <span className="text-xs font-mono text-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  Q {currentIndex + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';
                  if (isAnswered) {
                    if (optIdx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20';
                    } else if (optIdx === selectedOption) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all active:scale-95 flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && optIdx === currentQ.correctIndex && <span>✅</span>}
                      {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && <span>❌</span>}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 animate-fade-in">
                  💡 <strong className="text-amber-800">Analysis:</strong> {currentQ.explanation}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Finished Scorecard */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-3xl mx-auto shadow-md">
              🏆
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900">60s Rapid-Fire Blitz Complete!</h1>
              <p className="text-xs text-slate-500">Warmup Speed & Technical Reflex Evaluation</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Final Score</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">{score}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Max Streak</p>
                <p className="text-2xl font-black text-teal-700 mt-0.5">{maxStreak}x 🔥</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={fetchAiQuestions}
                className="py-3 px-6 text-xs font-semibold w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl shadow-sm cursor-pointer"
              >
                <span>🔄</span>
                <span>Refresh Questions</span>
              </button>

              <button
                onClick={() => setPhase('setup')}
                className="py-3 px-8 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md w-full sm:w-auto cursor-pointer"
              >
                🎯 Jump to Full AI Interview →
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-slate-200 bg-white text-center" />
    </div>
  );
}
