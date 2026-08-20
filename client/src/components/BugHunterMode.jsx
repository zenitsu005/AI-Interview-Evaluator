import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { generateBugHunterDrills } from '../services/api';
import AppNavbar from './AppNavbar';

const DEFAULT_BUG_DRILLS = [
  {
    id: 1,
    title: 'Drill 1: SQL Injection Vulnerability',
    category: 'Security & Backend',
    language: 'python',
    code: `def get_user_profile(user_id):
    # Retrieve user record from PostgreSQL
    query = f"SELECT * FROM users WHERE id = '{user_id}';"
    cursor.execute(query)
    return cursor.fetchone()`,
    buggyLine: 3,
    bugExplanation: 'Direct f-string string concatenation in SQL query introduces critical SQL Injection vulnerability.',
    fixOptions: [
      'cursor.execute("SELECT * FROM users WHERE id = %s;", (user_id,))',
      'query = "SELECT * FROM users WHERE id = " + str(user_id)',
      'query = f"SELECT * FROM users WHERE id = {user_id};"',
      'cursor.execute(eval(query))',
    ],
    correctFixIndex: 0,
  },
  {
    id: 2,
    title: 'Drill 2: Python Mutable Default Argument Trap',
    category: 'Language Quirks & Memory',
    language: 'python',
    code: `def append_to_cache(item, cache=[]):
    cache.append(item)
    return cache

print(append_to_cache(1)) # [1]
print(append_to_cache(2)) # Expected [2], but returns [1, 2]!`,
    buggyLine: 1,
    bugExplanation: 'Default arguments in Python are evaluated once at function definition time, sharing the mutable list across all calls.',
    fixOptions: [
      'def append_to_cache(item, cache=None): if cache is None: cache = []',
      'def append_to_cache(item, cache=list()):',
      'def append_to_cache(item, cache=[item]):',
      'def append_to_cache(item, cache=copy([])):',
    ],
    correctFixIndex: 0,
  },
  {
    id: 3,
    title: 'Drill 3: JavaScript Async Promise Race Condition',
    category: 'Concurrency & Frontend',
    language: 'javascript',
    code: `async function fetchAllUserData(userIds) {
    const results = [];
    userIds.forEach(async (id) => {
        const data = await api.getUser(id);
        results.push(data);
    });
    return results; // Bug: returns empty array immediately!
}`,
    buggyLine: 3,
    bugExplanation: 'Array.prototype.forEach does not await async callbacks. The function returns the empty array before any promises resolve.',
    fixOptions: [
      'return Promise.all(userIds.map(id => api.getUser(id)))',
      'userIds.forEach(id => { await api.getUser(id) })',
      'return results.wait()',
      'for (let id in userIds) { results.push(api.getUser(id)) }',
    ],
    correctFixIndex: 0,
  },
  {
    id: 4,
    title: 'Drill 4: JWT Unverified Decode Auth Bypass',
    category: 'Security & Auth',
    language: 'javascript',
    code: `function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Bug: jwt.decode does not verify signature!
    const user = jwt.decode(token);
    req.user = user;
    next();
}`,
    buggyLine: 5,
    bugExplanation: 'jwt.decode only deserializes the payload without verifying HMAC/RSA cryptographic signatures.',
    fixOptions: [
      'const user = jwt.verify(token, process.env.JWT_SECRET)',
      'const user = jwt.decode(token, { verify: true })',
      'const user = JSON.parse(atob(token))',
      'const user = jwt.sign(token, "secret")',
    ],
    correctFixIndex: 0,
  },
  {
    id: 5,
    title: 'Drill 5: Resource Leak in Database Connection',
    category: 'System Reliability',
    language: 'python',
    code: `def process_transaction(db_pool, payload):
    conn = db_pool.get_connection()
    result = conn.execute(payload)
    if not result:
        return False # Bug: connection is never released back to pool on early return!
    conn.release()
    return True`,
    buggyLine: 4,
    bugExplanation: 'Early return without releasing connection leaks database connections, eventually exhausting the pool.',
    fixOptions: [
      'Use a context manager (with db_pool.get_connection() as conn: ...)',
      'conn.release() before every if statement',
      'db_pool.close_all()',
      'conn = None',
    ],
    correctFixIndex: 0,
  },
  {
    id: 6,
    title: 'Drill 6: Off-by-One Array Out of Bounds',
    category: 'Algorithms & Memory',
    language: 'cpp',
    code: `void printReversed(std::vector<int>& arr) {
    for (int i = arr.size(); i >= 0; i--) {
        std::cout << arr[i] << " "; // Bug: arr[arr.size()] is out of bounds!
    }
}`,
    buggyLine: 2,
    bugExplanation: 'Vector indexing is 0-indexed. Accessing arr[arr.size()] reads unallocated memory outside the vector bounds.',
    fixOptions: [
      'for (int i = arr.size() - 1; i >= 0; i--)',
      'for (int i = arr.size(); i > 0; i--)',
      'for (int i = 0; i <= arr.size(); i++)',
      'for (int i = arr.size() - 1; i > 0; i--)',
    ],
    correctFixIndex: 0,
  },
  {
    id: 7,
    title: 'Drill 7: Goroutine Memory Leak with Unbuffered Channel',
    category: 'Concurrency & Go',
    language: 'go',
    code: `func queryFirst(urls []string) string {
    ch := make(chan string) // Bug: unbuffered channel blocks abandoned goroutines!
    for _, url := range urls {
        go func(u string) { ch <- httpGet(u) }(url)
    }
    return <-ch
}`,
    buggyLine: 2,
    bugExplanation: 'Unbuffered channel permanently leaks (len(urls)-1) goroutines blocked on sending to an unread channel.',
    fixOptions: [
      'ch := make(chan string, len(urls))',
      'ch := make(chan string, 0)',
      'go func() { close(ch) }()',
      'defer close(ch)',
    ],
    correctFixIndex: 0,
  },
  {
    id: 8,
    title: 'Drill 8: ReDoS Catastrophic Backtracking Regex',
    category: 'Security & Performance',
    language: 'javascript',
    code: `function validateEmail(input) {
    // Bug: Nested quantifiers (a+)+ cause catastrophic backtracking!
    const regex = /^([a-zA-Z0-9_.-]+)+@([a-zA-Z0-9_.-]+)+$/;
    return regex.test(input);
}`,
    buggyLine: 3,
    bugExplanation: 'Nested Kleene stars/plus operators (a+)+ trigger exponential time complexity O(2^N) when processing evil payloads.',
    fixOptions: [
      'const regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+$/;',
      'const regex = /^([a-zA-Z0-9_.-]*)*@([a-zA-Z0-9_.-]*)*$/;',
      'const regex = eval("/^[a-z]+@[a-z]+$/");',
      'const regex = new RegExp(".*@.*");',
    ],
    correctFixIndex: 0,
  },
  {
    id: 9,
    title: 'Drill 9: Stale Closure in React useEffect Timer',
    category: 'Frontend & State',
    language: 'javascript',
    code: `function Counter() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(count + 1); // Bug: captures initial count = 0 forever!
        }, 1000);
        return () => clearInterval(id);
    }, []); // empty dependency array
}`,
    buggyLine: 5,
    bugExplanation: 'Functional state updater setCount(prev => prev + 1) is required to avoid capturing stale closure state.',
    fixOptions: [
      'setCount(prev => prev + 1);',
      'count = count + 1;',
      'setCount(this.state.count + 1);',
      'useEffect(() => {}, [count]);',
    ],
    correctFixIndex: 0,
  },
  {
    id: 10,
    title: 'Drill 10: Insecure CORS Wildcard with Credentials',
    category: 'Security & Web API',
    language: 'javascript',
    code: `app.use((req, res, next) => {
    // Bug: Access-Control-Allow-Origin: * cannot be used with Credentials: true
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});`,
    buggyLine: 3,
    bugExplanation: 'Browsers reject responses with Allow-Credentials: true when Allow-Origin is set to wildcard (*). Must reflect specific origin.',
    fixOptions: [
      'res.header("Access-Control-Allow-Origin", req.headers.origin || "https://myapp.com");',
      'res.header("Access-Control-Allow-Origin", "null");',
      'res.header("Access-Control-Allow-Credentials", "false");',
      'res.header("Access-Control-Allow-Origin", "**");',
    ],
    correctFixIndex: 0,
  },
];

const shuffleDrillOptions = (drillsList) => {
  return drillsList.map((drill) => {
    const correctOptionText = drill.fixOptions[drill.correctFixIndex || 0];
    const shuffledOptions = [...drill.fixOptions].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
    return {
      ...drill,
      fixOptions: shuffledOptions,
      correctFixIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    };
  });
};

export default function BugHunterMode() {
  const { setPhase } = useInterview();

  // Initialize with a randomized subset of 5 drills from the pool
  const [drills, setDrills] = useState(() => {
    const randomizedPool = [...DEFAULT_BUG_DRILLS].sort(() => Math.random() - 0.5);
    return shuffleDrillOptions(randomizedPool.slice(0, 5));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Timer Countdown
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const currentDrill = drills[currentIndex] || drills[0];

  const handleSelectOption = (idx) => {
    if (isAnswered || isFinished) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentDrill.correctFixIndex) {
      setScore((s) => s + 100 + timeLeft);
    }

    setTimeout(() => {
      if (currentIndex + 1 < drills.length && timeLeft > 0) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  // 🔀 Shuffle existing drills and pick 5 fresh ones from pool
  const handleShuffle = () => {
    const shuffledPool = [...DEFAULT_BUG_DRILLS].sort(() => Math.random() - 0.5);
    const randomized = shuffleDrillOptions(shuffledPool.slice(0, 5));
    setDrills(randomized);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(60);
    setScore(0);
    setIsFinished(false);
  };

  // ✨ Dynamic AI Problem Generator via Gemini
  const handleGenerateFreshDrills = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await generateBugHunterDrills();
      if (res?.drills && res.drills.length > 0) {
        const randomized = shuffleDrillOptions(res.drills);
        setDrills(randomized);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(60);
        setScore(0);
        setIsFinished(false);
      } else {
        handleShuffle();
      }
    } catch (e) {
      console.warn('AI Bug Hunter generation fallback:', e);
      handleShuffle();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between">
      {/* ── Universal Top Bar ── */}
      <AppNavbar currentActive="bug-hunter" />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5 flex-1 flex flex-col justify-center">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>🐛</span> Bug Hunter & Security Flaw Triage
            </h1>
            <p className="text-xs text-slate-400">60s Real-Time Code Review • {drills.length} Drills Loaded</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl transition-all font-semibold"
            >
              🔀 Shuffle
            </button>
            <button
              type="button"
              onClick={handleGenerateFreshDrills}
              disabled={isGenerating}
              className="text-xs bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{isGenerating ? '⏳ Crafting...' : '✨ New AI Drills'}</span>
            </button>
          </div>
        </div>
        {!isFinished ? (
          <div className="space-y-5 animate-fade-in">
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-amber-400">{timeLeft}</span>
                  <span className="text-[9px] uppercase text-slate-500">SEC</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Bug Triage Score</p>
                  <p className="text-2xl font-black text-white font-mono">{score}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                Drill {currentIndex + 1} / {drills.length}
              </span>
            </div>

            {/* Buggy Code Card */}
            <div className="card-dark border-red-900/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🚨</span> {currentDrill.title}
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-500/30 bg-red-950/40 text-red-300">
                  {currentDrill.category}
                </span>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed select-text">
                {currentDrill.code}
              </pre>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select the Correct Code Fix:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentDrill.fixOptions.map((opt, optIdx) => {
                    let style = 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-200';
                    if (isAnswered) {
                      if (optIdx === currentDrill.correctFixIndex) {
                        style = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-2 ring-emerald-500/20';
                      } else if (optIdx === selectedOption) {
                        style = 'border-red-500 bg-red-950/60 text-red-300';
                      } else {
                        style = 'opacity-40 border-slate-900 bg-slate-950 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        disabled={isAnswered}
                        className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all active:scale-95 flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === currentDrill.correctFixIndex && <span>✅</span>}
                        {isAnswered && optIdx === selectedOption && optIdx !== currentDrill.correctFixIndex && (
                          <span>❌</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isAnswered && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 animate-fade-in">
                  💡 <strong className="text-amber-400">Security / Logic Analysis:</strong> {currentDrill.bugExplanation}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Finished Scorecard */
          <div className="card-dark border-amber-900/60 p-8 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-3xl mx-auto shadow-lg">
              🛡️
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white">Bug Hunter Challenge Complete!</h1>
              <p className="text-xs text-slate-400">Production Code Review & Security Analysis Score</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Total Score</p>
                <p className="text-2xl font-black text-amber-400 mt-0.5">{score}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Rating</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">
                  {score >= 350 ? 'Staff SRE' : 'Senior Dev'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGenerateFreshDrills}
                className="btn-secondary py-3 px-6 text-xs font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Generate 5 New AI Drills</span>
              </button>
              <button
                onClick={() => setPhase('setup')}
                className="btn-primary py-3 px-8 text-xs font-bold btn-glow shadow-xl w-full sm:w-auto"
              >
                🎯 Jump to Full AI Interview →
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center" />
    </div>
  );
}
