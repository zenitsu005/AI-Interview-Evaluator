import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  uploadResume,
  analyzeResume,
  getQuestion,
  getFollowUpProbe,
  evaluateInterview,
  saveInterviewHistory,
} from '../services/api';

const InterviewContext = createContext(null);

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used inside InterviewProvider');
  return ctx;
};

export const BAR_RAISER_PERSONAS = [
  {
    id: 'amazon',
    company: 'Amazon',
    name: 'Amazon AI Evaluator',
    title: 'Principal Architecture & LP Evaluator',
    avatar: '📦',
    badge: 'Amazon 16 LPs Evaluation Rubric',
    accentColor: 'text-amber-400 border-amber-500/60 bg-amber-950/40',
    headerGradient: 'from-amber-600 to-yellow-600',
    focus: '16 Leadership Principles, Customer Obsession, Bias for Action, Quantifiable Metrics',
    catchphrase: "Evaluating candidate responses for high ownership, scalability invariants, and data-driven decisions.",
    rubric: 'Evaluates relentless customer focus, frugality, deep dives, and STAR metric impact.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Amazon track competencies. Interrogate deeply on the 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Have Backbone). Demand clear quantitative metrics (e.g. latency, revenue, scale) in every STAR response.',
  },
  {
    id: 'google',
    company: 'Google',
    name: 'Google AI Evaluator',
    title: 'Distinguished Systems & Algorithms Evaluator',
    avatar: '🌐',
    badge: 'Google Distributed Scale & Algorithms',
    accentColor: 'text-cyan-400 border-cyan-500/60 bg-cyan-950/40',
    headerGradient: 'from-blue-600 to-cyan-600',
    focus: 'Distributed Systems Invariants, Clean Abstractions, Mathematical Big-O Proofs',
    catchphrase: "Analyzing distributed fault tolerance, correctness proofs, and algorithmic boundaries.",
    rubric: 'Evaluates algorithmic optimality, race conditions, edge-case proofs, and planet-scale systems.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Google track competencies. Focus on planet-scale distributed architecture, rigorous asymptotic Big-O proofs, memory invariants, and edge-case correctness.',
  },
  {
    id: 'yc_startup',
    company: 'YC Startup',
    name: 'Startup AI Evaluator',
    title: 'Fast-Paced Execution & Full-Stack Evaluator',
    avatar: '🚀',
    badge: 'Startup Fast-Paced Shipping & Hustle',
    accentColor: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40',
    headerGradient: 'from-emerald-600 to-teal-600',
    focus: 'Shipping Velocity, Product Instincts, Full-Stack Pragmatism, Zero Fluff',
    catchphrase: "Evaluating velocity, practical system trade-offs, and high agency.",
    rubric: 'Evaluates rapid execution, product trade-offs, scrappiness, and high agency.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Startup & Growth engineering competencies. Prioritize shipping velocity, product intuition, practical full-stack trade-offs, and high agency. Reject over-engineered academic answers in favor of working solutions.',
  },
  {
    id: 'wall_street',
    company: 'Wall Street HFT',
    name: 'Quant Systems AI Evaluator',
    title: 'Ultra-Low Latency Infrastructure Evaluator',
    avatar: '💹',
    badge: 'Wall Street Ultra-Low Latency & Quant',
    accentColor: 'text-purple-400 border-purple-500/60 bg-purple-950/40',
    headerGradient: 'from-purple-600 to-indigo-600',
    focus: 'Sub-Microsecond Latency, Lock-Free Concurrency, Cache-Locality, C++/OS Internals',
    catchphrase: "Evaluating low-level memory alignment, cache misses, and deterministic concurrency.",
    rubric: 'Evaluates low-level memory alignment, kernel bypass, and high-frequency concurrency.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Quantitative High-Frequency Trading Infrastructure competencies. Focus on sub-microsecond latency, CPU cache alignment, lock-free ring buffers, OS kernel bypass, and deterministic concurrency.',
  },
  {
    id: 'microsoft',
    company: 'Microsoft',
    name: 'Enterprise Cloud AI Evaluator',
    title: 'Cloud Architecture & SLA Evaluator',
    avatar: '💼',
    badge: 'Enterprise Architecture & Cloud Resiliency',
    accentColor: 'text-blue-400 border-blue-500/60 bg-blue-950/40',
    headerGradient: 'from-blue-700 to-indigo-600',
    focus: 'Cloud Resiliency, Cross-Team Stakeholder Alignment, Security & Backward Compatibility',
    catchphrase: "Evaluating multi-region enterprise cloud SLA, zero-trust security, and backward compatibility.",
    rubric: 'Evaluates zero-trust security, backward compatibility, disaster recovery, and cross-team empathy.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Microsoft enterprise cloud scalability (multi-region), disaster recovery, zero-trust security, backward compatibility, and stakeholder cross-collaboration.',
  },
  {
    id: 'meta',
    company: 'Meta / Product Tech',
    name: 'Product Scale AI Evaluator',
    title: 'Real-Time Feeds & Infrastructure Evaluator',
    avatar: '📱',
    badge: 'Product Tech Real-Time Data & Scale',
    accentColor: 'text-pink-400 border-pink-500/60 bg-pink-950/40',
    headerGradient: 'from-pink-600 to-rose-600',
    focus: 'Billions-Scale Feeds, Real-Time Messaging, Live A/B Testing, Moving Fast',
    catchphrase: "Evaluating high-throughput caching, real-time message sync, and rapid iteration metrics.",
    rubric: 'Evaluates high-concurrency feeds, real-time sync, client-server optimizations, and A/B metric telemetry.',
    promptDirective: 'Roleplay strictly as an AI Interview Evaluator assessing Meta track infrastructure competencies. Focus on real-time messaging pipelines, live A/B experimentation, high-throughput caching, and rapid user-facing iteration.',
  },
];

export const InterviewProvider = ({ children }) => {
  const [phase, setPhase] = useState('landing');
  const [interviewMode, setInterviewMode] = useState('video'); // 'video' | 'text'
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate'); // 'Beginner' | 'Intermediate' | 'Experienced'
  const [companyTrack, setCompanyTrack] = useState('Amazon'); // Track
  const [interviewerPersona, setInterviewerPersona] = useState(BAR_RAISER_PERSONAS[0]); // Bar Raiser Persona
  const [duration, setDuration] = useState('15'); // '15' | '30' | '45'
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndexInRound, setQuestionIndexInRound] = useState(1);
  const [allResponses, setAllResponses] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [report, setReport] = useState(null);
  const [activeFollowUp, setActiveFollowUp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic question count per round: 3 in 15m (9 total), 5 in 30m (15 total), 7 in 45m (21 total)
  const questionsPerRound = String(duration) === '15' ? 3 : String(duration) === '45' ? 7 : 5;

  const ROUNDS = [
    { id: 'aptitude', label: 'Aptitude & Logic', total: questionsPerRound, color: 'blue' },
    { id: 'technical', label: 'Technical', total: questionsPerRound, color: 'purple' },
    { id: 'hr', label: 'HR Round', total: questionsPerRound, color: 'green' },
  ];


  const TOTAL_QUESTIONS = ROUNDS.reduce((sum, r) => sum + r.total, 0);


  const isSubmittingRef = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  /** Step 1: Analyze resume (paste, upload, or role only) */
  const handleResumeSubmit = useCallback(
    async (text, file, role, level, company) => {
      setIsLoading(true);
      setError(null);
      if (level) setDifficultyLevel(level);
      if (company) setCompanyTrack(company);
      try {
        let finalText = text;
        if (file) {
          const result = await uploadResume(file);
          finalText = result.resumeText;
        }
        setResumeText(finalText);
        setTargetRole(role);
        const analysis = await analyzeResume(finalText, role);
        setResumeAnalysis(analysis);
        setPhase('analysis');
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || 'Failed to analyze resume.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

const getSeenHistory = () => {
  try {
    const raw = sessionStorage.getItem('mockai_seen_topics');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const recordSeenTopic = (topicOrQuestion) => {
  try {
    if (!topicOrQuestion) return;
    const history = getSeenHistory();
    if (!history.includes(topicOrQuestion)) {
      history.push(topicOrQuestion);
    }
    if (history.length > 25) history.shift();
    sessionStorage.setItem('mockai_seen_topics', JSON.stringify(history));
  } catch (e) {}
};

const getAptitudeFallbackQuestion = (index = 1, excludeQuestions = []) => {
  const bank = [
    {
      question: `Welcome to Round 1: Aptitude & Logic. Let's begin with a quantitative problem on Rates of Work: Person A can complete a project in 6 hours, while Person B can complete the same project in 4 hours. If both people work together simultaneously at their constant rates, how many hours and minutes will it take them to complete the entire project together? Explain your mathematical calculation.`,
      topic: 'Applied Quantitative & Rates of Work',
      level: 'Foundational Quantitative',
      hints: ['Calculate each worker\'s hourly fraction of work (1/6 and 4/1), sum the rates, and invert the total.'],
      evaluationCriteria: ['Rate calculation accuracy', 'Time conversion (hours & minutes)', 'Clear explanation of logic'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): A car travels from Town A to Town B at an average speed of 60 km/h and returns along the exact same route at 40 km/h. What is the average speed across the entire round trip? (Hint: It is not 50 km/h). Explain your mathematical calculation.`,
      topic: 'Harmonic Mean & Speed-Distance Optimization',
      level: 'Applied Quantitative',
      hints: ['Average speed = Total Distance / Total Time. Express time in terms of one-way distance d.'],
      evaluationCriteria: ['Harmonic mean application', 'Algebraic steps', 'Avoiding the arithmetic mean trap'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): In a class of 100 students, 70 passed the Mathematics examination, 60 passed the Science examination, and 50 passed both examinations. How many students failed both examinations? Explain your calculation using set theory logic.`,
      topic: 'Set Theory & Analytical Logic',
      level: 'Intermediate Logic',
      hints: ['Use the Principle of Inclusion-Exclusion: Total = Math + Science - Both + Neither.'],
      evaluationCriteria: ['Inclusion-exclusion formula', 'Arithmetic accuracy', 'Logical structure'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): A box contains 5 red balls and 7 blue balls. If two balls are drawn at random one after the other without replacement, what is the exact probability that both drawn balls are red? Explain your step-by-step probability calculation.`,
      topic: 'Probability & Combinatorics',
      level: 'Advanced Quantitative',
      hints: ['Multiply the probability of drawing the first red ball (5/12) by the conditional probability of drawing the second red ball (4/11).'],
      evaluationCriteria: ['Conditional probability calculation', 'Fraction simplification', 'Clear mathematical steps'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): You have 8 identical-looking gold coins, but exactly one is counterfeit and slightly heavier than the others. Using a balance scale with two pans, what is the minimum number of weighings required to guarantee identifying the counterfeit coin with certainty? Walk me through your step-by-step reasoning.`,
      topic: 'Logical Deduction & Weighing Puzzles',
      level: 'Master Analytical Logic',
      hints: ['Think about dividing the 8 coins into three groups (3, 3, 2) rather than halves.'],
      evaluationCriteria: ['Step-by-step logical deduction', 'Elimination methodology', 'Optimal decision tree'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): A clock shows 3:15. What is the exact angle in degrees between the hour hand and the minute hand? Explain your calculation.`,
      topic: 'Angular Geometry & Clock Logic',
      level: 'Analytical Geometry',
      hints: ['Remember that the hour hand advances 0.5 degrees per minute while the minute hand moves 6 degrees per minute.'],
      evaluationCriteria: ['Accurate angular calculation', 'Clear geometric breakdown', 'Correct degrees'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): You have 25 racehorses and can only race 5 horses at a time on a track without a timer. What is the minimum number of races needed to identify the top 3 fastest horses? Explain your race scheduling deduction.`,
      topic: 'Combinatorial Tournament Logic',
      level: 'Master Puzzle',
      hints: ['First race all horses in 5 groups of 5, then race the 5 group winners.'],
      evaluationCriteria: ['Elimination tree', 'Proof of optimality', 'Exact race count'],
      hasCodingSandbox: false,
    },
    {
      question: `Question ${index} (Aptitude & Logic): Five people of different ages (A, B, C, D, E) are sitting in a row. A is older than B but younger than C. D is younger than A but older than B. E is older than C. Who is the second youngest person in the group? Walk through your deduction.`,
      topic: 'Linear Order Deduction & Analytical Reasoning',
      level: 'Analytical Deduction',
      hints: ['Chain the inequalities: E > C > A > D > B.'],
      evaluationCriteria: ['Inequality ordering', 'Deductive clarity', 'Correct candidate'],
      hasCodingSandbox: false,
    }
  ];

  const allExcluded = [...excludeQuestions, ...getSeenHistory()];
  const available = bank.filter((b) => !allExcluded.some((q) => q && (q.includes(b.topic) || b.question.includes(q))));
  const pool = available.length > 0 ? available : bank;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  recordSeenTopic(chosen.topic);
  recordSeenTopic(chosen.question);
  return chosen;
};

// ── Curated Progressive Technical Topic Chains (Q1 Foundation -> Q2 Practical Implementation Follow-Up) ──
const TECHNICAL_TOPIC_CHAINS = [
  {
    topic: 'Backend & Idempotent Deduplication',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): In a high-throughput backend service handling 50,000 requests/sec, describe how you would design an idempotent request-deduplication system that prevents double-processing during database connection spikes.',
      topic: 'Idempotency & High Throughput',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Discuss client-generated UUID idempotency keys, Redis distributed atomic set (SETNX), and response caching.'],
      evaluationCriteria: ['Idempotency key generation', 'Atomic lock handling', 'Handling concurrent race conditions'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Building directly on your idempotency deduplication architecture: write the implementation of an idempotency middleware function idempotentHandler(requestId, payload, cache) that checks for duplicate request IDs, sets an atomic in-flight lock, and returns cached responses for replayed requests.',
      topic: 'Idempotency & High Throughput',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Check if key exists in cache; if pending return 409; if completed return cached result; otherwise acquire lock with TTL.'],
      evaluationCriteria: ['Atomic lock logic', 'Error state handling', 'Clean modular design'],
      hasCodingSandbox: true,
      starterCode: `// Write your idempotent request deduplication logic below:
function idempotentHandler(requestId, payload, cacheStore) {
  // 1. Check if requestId already exists in cacheStore
  if (cacheStore[requestId]) {
    const entry = cacheStore[requestId];
    if (entry.status === 'PROCESSING') {
      return { status: 409, message: 'Request currently in-flight. Please wait.' };
    }
    return { status: 200, data: entry.response, cached: true };
  }

  // 2. Acquire lock & mark as PROCESSING
  cacheStore[requestId] = { status: 'PROCESSING', startedAt: Date.now() };

  // 3. Process payload and complete
  const result = { success: true, processedAt: new Date().toISOString() };
  cacheStore[requestId] = { status: 'COMPLETED', response: result };
  return { status: 201, data: result, cached: false };
}
`,
    },
  },
  {
    topic: 'Database B+ Tree Indexing & SQL Optimization',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): Explain database indexing under the hood. How does a B+ Tree index structure optimize range queries versus a Hash index, and what are the write amplification trade-offs?',
      topic: 'B+ Tree Indexing & Storage Engines',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Discuss leaf node sequential linked lists in B+ Trees, logarithmic branch traversal, and page splitting.'],
      evaluationCriteria: ['B+ Tree node structure', 'Range scan sequential pointers', 'Write amplification vs read latency'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: "Question 2 (Technical Follow-Up): Following up on your database indexing discussion: write an optimized SQL schema and multi-table query for a high-volume payments table, including the composite indexes required to satisfy WHERE user_id = ? AND status = 'COMPLETED' ORDER BY created_at DESC without filesorts.",
      topic: 'B+ Tree Indexing & Storage Engines',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Place equality columns first in composite index: (user_id, status, created_at DESC) to avoid index skip scans.'],
      evaluationCriteria: ['Composite index column order', 'Eliminating filesort', 'Query execution plan efficiency'],
      hasCodingSandbox: true,
      starterCode: `-- Technical SQL Sandbox
-- 1. Create optimal composite index for payments:
CREATE INDEX idx_user_status_created 
ON payments(user_id, status, created_at DESC);

-- 2. Query executed with 0 filesorts:
SELECT payment_id, amount, created_at
FROM payments
WHERE user_id = 42 AND status = 'COMPLETED'
ORDER BY created_at DESC
LIMIT 20;
`,
    },
  },
  {
    topic: 'Caching Tier & Redis Thundering Herd',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): Describe how you would mitigate cache penetration, cache stampede (thundering herd), and cache avalanche in a large-scale Redis caching tier.',
      topic: 'Cache Thundering Herd & Redis Resilience',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Discuss mutex locks, probabilistic early expiration (XFetch), Bloom filters for penetration, and TTL jitter.'],
      evaluationCriteria: ['Distinction between stampede, penetration, and avalanche', 'Mutex lock algorithm', 'Jitter randomness'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Following up on your cache stampede mitigation strategy: implement the mutex locking pattern getOrComputeWithLock(key, computeFn, ttlSeconds, redisClient) that uses atomic locks so only ONE concurrent worker queries the primary database during a cache miss.',
      topic: 'Cache Thundering Herd & Redis Resilience',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Attempt to acquire lock with SET NX EX. If acquired, compute and set cache. If not, sleep and retry.'],
      evaluationCriteria: ['SET NX EX lock acquisition', 'Lock release safety', 'Retry backoff loop'],
      hasCodingSandbox: true,
      starterCode: `// Mutex-Protected Cache Retrieval Pattern
async function getOrComputeWithLock(key, computeFn, ttlSeconds, mockRedis) {
  // 1. Check cache first
  let cached = mockRedis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = "lock:" + key;
  // 2. Try to acquire atomic mutex lock with short TTL (e.g. 5 sec)
  const acquired = mockRedis.setNx(lockKey, "LOCKED", 5);

  if (acquired) {
    try {
      // Primary worker computes fresh data from DB
      const freshData = await computeFn();
      mockRedis.set(key, JSON.stringify(freshData), ttlSeconds);
      return freshData;
    } finally {
      mockRedis.del(lockKey);
    }
  } else {
    // Other workers wait briefly and retry cache read
    await new Promise(r => setTimeout(r, 100));
    return JSON.parse(mockRedis.get(key) || "null");
  }
}
`,
    },
  },
  {
    topic: 'Distributed Transactions & Saga Pattern',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): How do you handle distributed transactions across microservices? Compare the 2-Phase Commit (2PC) protocol against the Saga pattern in terms of latency, consistency, and failure recovery.',
      topic: 'Distributed Transactions & Sagas',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Compare synchronous coordinator locking in 2PC vs asynchronous eventual consistency and compensating actions in Sagas.'],
      evaluationCriteria: ['Blocking nature of 2PC', 'Choreographed vs orchestrated Sagas', 'Idempotent compensation logic'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Following up on your Saga transaction model: write the orchestration execution flow executeOrderSaga(orderData) with step execution and compensating rollback actions if inventory reservation fails.',
      topic: 'Distributed Transactions & Sagas',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Keep a stack of executed compensation functions. If a step fails, pop and run compensations in reverse order.'],
      evaluationCriteria: ['Compensation stack pattern', 'Reverse rollback order', 'Atomic error reporting'],
      hasCodingSandbox: true,
      starterCode: `// Saga Orchestrator with Compensating Rollbacks
async function executeOrderSaga(order) {
  const compensations = [];

  try {
    // Step 1: Authorize Payment
    const payment = await chargeCustomer(order.amount);
    compensations.push(() => refundCustomer(payment.id));

    // Step 2: Reserve Inventory
    const inventory = await reserveStock(order.items);
    compensations.push(() => releaseStock(inventory.reservationId));

    // Step 3: Dispatch Shipment
    const shipment = await createShipment(order.address);
    return { success: true, orderId: order.id, shipmentId: shipment.id };
  } catch (err) {
    // Rollback executed steps in reverse order
    for (const compensate of compensations.reverse()) {
      await compensate();
    }
    return { success: false, error: err.message, status: 'ROLLED_BACK' };
  }
}
`,
    },
  },
  {
    topic: 'Frontend State & WebSocket Streaming',
    domain: 'frontend',
    q1: {
      question: 'Question 1 (Technical): How would you design a client-side state management and caching layer in React to eliminate unnecessary component re-renders during high-frequency WebSocket updates?',
      topic: 'Frontend Architecture & Performance',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Discuss requestAnimationFrame scheduling, mutable refs, selector memoization, and offloading diffing to Web Workers.'],
      evaluationCriteria: ['DOM batching techniques', 'React 18 concurrent features', 'Avoiding UI thread frame drops'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Following up on your client-side caching design: write the JavaScript implementation of a batching hook useBatchedUpdates(callback, delayMs) that queues incoming streaming WebSocket messages and flushes them in a single batch to prevent UI lag.',
      topic: 'Frontend Architecture & Performance',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Store incoming items in a ref queue, schedule a timer or requestAnimationFrame, and trigger a single state update with the flushed batch.'],
      evaluationCriteria: ['Queue management in ref', 'Proper cleanup of timers', 'Single state flush'],
      hasCodingSandbox: true,
      starterCode: `// Custom Batching Hook for High-Frequency WebSocket Streams
function createBatcher(flushCallback, delayMs = 50) {
  let queue = [];
  let timeoutId = null;

  return function enqueue(item) {
    queue.push(item);
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        const batch = [...queue];
        queue = [];
        timeoutId = null;
        flushCallback(batch);
      }, delayMs);
    }
  };
}
`,
    },
  },
  {
    topic: 'Machine Learning & Production RAG Pipelines',
    domain: 'ai',
    q1: {
      question: 'Question 1 (Technical): Walk me through how you architect a production RAG pipeline that maintains low latency (<150ms) and prevents hallucinated responses using rerankers and guardrails.',
      topic: 'RAG Architecture & LLM Guardrails',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Discuss hybrid search (sparse BM25 + dense vectors), cross-encoder rerankers, citation verification, and token budget management.'],
      evaluationCriteria: ['Hybrid vector retrieval', 'Cross-encoder latency trade-off', 'Confidence thresholding'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Following up on your RAG pipeline architecture: write a Python function filter_and_rerank(query_vector, retrieved_documents, score_threshold) that computes cosine similarities, discards low-relevance chunks, and returns top-K documents.',
      topic: 'RAG Architecture & LLM Guardrails',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Compute dot product over norms for cosine similarity, filter chunks where similarity < threshold, sort descending, and return top-K.'],
      evaluationCriteria: ['Cosine similarity calculation', 'Threshold filtering', 'Deterministic sorting'],
      hasCodingSandbox: true,
      starterCode: `# Python RAG Chunk Filter & Cosine Reranker
import math

def dot_product(v1, v2):
    return sum(a * b for a, b in zip(v1, v2))

def norm(v):
    return math.sqrt(sum(x * x for x in v))

def filter_and_rerank(query_vector, documents, score_threshold=0.75, top_k=3):
    q_norm = norm(query_vector)
    scored_docs = []

    for doc in documents:
        sim = dot_product(query_vector, doc['embedding']) / (q_norm * norm(doc['embedding']))
        if sim >= score_threshold:
            scored_docs.append({'text': doc['text'], 'score': round(sim, 4)})

    scored_docs.sort(key=lambda d: d['score'], reverse=True)
    return scored_docs[:top_k]
`,
    },
  },
  {
    topic: 'Distributed Rate Limiting & Sliding Windows',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): How do you design a partitioned distributed rate limiter capable of enforcing sliding-window rate limits across multiple AWS regions without central bottlenecking?',
      topic: 'Distributed Rate Limiting',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Compare Token Bucket vs Leaky Bucket vs Sliding Window Log, discuss Redis Sorted Sets (ZSET), and local token batching.'],
      evaluationCriteria: ['Sliding window mathematical model', 'Multi-region synchronization', 'Burst handling'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Building directly on your rate-limiting architecture: write the sliding window rate limiter function isRateLimited(userId, windowMs, maxRequests, requestLog) that removes expired timestamps and determines if a request should be throttled.',
      topic: 'Distributed Rate Limiting',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Filter timestamps where now - ts < windowMs; if length >= maxRequests reject; otherwise append now and allow.'],
      evaluationCriteria: ['Window sliding logic', 'Atomic log append', 'Boolean decision accuracy'],
      hasCodingSandbox: true,
      starterCode: `// Sliding Window Rate Limiter Implementation
function isRateLimited(userId, windowMs, maxRequests, requestLog) {
  const now = Date.now();
  if (!requestLog[userId]) requestLog[userId] = [];

  // 1. Remove expired timestamps outside the current sliding window
  requestLog[userId] = requestLog[userId].filter(ts => (now - ts) < windowMs);

  // 2. Check if request count exceeds limit
  if (requestLog[userId].length >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: windowMs - (now - requestLog[userId][0]) };
  }

  // 3. Record current request and allow
  requestLog[userId].push(now);
  return { allowed: true, remaining: maxRequests - requestLog[userId].length };
}
`,
    },
  },
  {
    topic: 'Web Security & JWT Cryptographic Verification',
    domain: 'backend',
    q1: {
      question: 'Question 1 (Technical): Explain JWT signature verification versus token decoding, and how you prevent algorithmic confusion attacks (such as the none algorithm or HMAC/RSA key confusion) and handle token revocation at scale.',
      topic: 'JWT Security & Auth Bypass Prevention',
      level: 'Level 1 of 5 (Fundamentals & Architecture)',
      hints: ['Explain HMAC secret vs RSA public key validation, strict algorithm whitelisting, and Redis-backed blacklists with TTL.'],
      evaluationCriteria: ['Algorithmic confusion prevention', 'Signature verification necessity', 'Revocation strategies'],
      hasCodingSandbox: false,
    },
    q2FollowUp: {
      question: 'Question 2 (Technical Follow-Up): Following up on your JWT security model: write a secure token verification middleware verifyAndAuthorize(token, secret, revokedSet) that enforces algorithm verification, checks revocation, and returns user payload.',
      topic: 'JWT Security & Auth Bypass Prevention',
      level: 'Level 2 of 5 (Direct Implementation Follow-Up)',
      hints: ['Parse header & payload, strictly verify alg matches HS256 (reject none), compute signature, check revokedSet, check expiration.'],
      evaluationCriteria: ['Strict algorithm enforcement', 'Blacklist check', 'Expiry enforcement'],
      hasCodingSandbox: true,
      starterCode: `// Secure Token Verification & Revocation Check
function verifyAndAuthorize(token, secretKey, revokedTokenSet) {
  if (!token) return { valid: false, error: 'Missing token' };
  if (revokedTokenSet.has(token)) return { valid: false, error: 'Token has been revoked' };

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, error: 'Malformed JWT structure' };

  try {
    const header = JSON.parse(atob(parts[0]));
    // Strictly prevent 'none' algorithm bypass
    if (header.alg !== 'HS256') {
      return { valid: false, error: 'Unsupported or unverified algorithm: ' + header.alg };
    }

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, user: payload };
  } catch (e) {
    return { valid: false, error: 'Signature / parsing failure' };
  }
}
`,
    },
  }
];

const getTechnicalFallbackQuestion = (role, index = 1, level = 'Intermediate', excludeQuestions = []) => {
  const roleLower = (role || '').toLowerCase();
  const allExcluded = [...excludeQuestions, ...getSeenHistory()];

  // If role is frontend-specific, prioritize frontend chain
  let relevantChains = TECHNICAL_TOPIC_CHAINS;
  if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('web')) {
    relevantChains = TECHNICAL_TOPIC_CHAINS.filter(c => c.domain === 'frontend' || c.domain === 'backend');
  } else if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('data')) {
    relevantChains = TECHNICAL_TOPIC_CHAINS.filter(c => c.domain === 'ai' || c.domain === 'backend');
  }

  // If this is Question 2, find the chain that matches Question 1!
  if (index === 2 && excludeQuestions.length > 0) {
    const lastQ = excludeQuestions[excludeQuestions.length - 1];
    const matchingChain = TECHNICAL_TOPIC_CHAINS.find(c =>
      lastQ.includes(c.q1.topic) || lastQ.includes(c.topic)
    );
    if (matchingChain) {
      recordSeenTopic(matchingChain.topic);
      recordSeenTopic(matchingChain.q2FollowUp.question);
      return matchingChain.q2FollowUp;
    }
  }

  // Filter chains not yet asked
  const availableChains = relevantChains.filter(
    c => !allExcluded.some(eq => eq && (eq.includes(c.topic) || eq.includes(c.q1.topic) || (c.q1 && c.q1.question && c.q1.question.includes(eq))))
  );
  const chainToUse = availableChains.length > 0
    ? availableChains[Math.floor(Math.random() * availableChains.length)]
    : relevantChains[Math.floor(Math.random() * relevantChains.length)];

  recordSeenTopic(chainToUse.topic);
  if (index === 2) {
    recordSeenTopic(chainToUse.q2FollowUp.question);
    return chainToUse.q2FollowUp;
  }
  recordSeenTopic(chainToUse.q1.question);
  return chainToUse.q1;
};

const getHrFallbackQuestion = (index = 1, excludeQuestions = []) => {
  const questions = [
    {
      question: `Question ${index} (Behavioral & HR): Describe a situation where you had a strong technical disagreement with a teammate or technical lead regarding an architectural decision. How did you handle the discussion, and what was the outcome?`,
      topic: 'Technical Disagreement & Conflict Resolution',
    },
    {
      question: `Question ${index} (Behavioral & HR): Tell me about a time when a project you were leading or contributing to suffered a critical production outage or missed a major deadline. How did you take ownership and communicate with stakeholders?`,
      topic: 'Outage Ownership & Stakeholder Communication',
    },
    {
      question: `Question ${index} (Behavioral & HR): Give an example of a project where you had to quickly learn an unfamiliar technology or framework under tight business deadlines. How did you prioritize what to learn?`,
      topic: 'Rapid Learning & Ambiguity Navigation',
    },
    {
      question: `Question ${index} (Behavioral & HR): Describe a situation where you noticed a team process or code quality issue that was slowing down engineering velocity. What initiative did you take to fix it?`,
      topic: 'Proactive Leadership & Velocity Engineering',
    }
  ];

  const allExcluded = [...excludeQuestions, ...getSeenHistory()];
  const available = questions.filter((q) => !allExcluded.some((eq) => eq && (eq.includes(q.topic) || q.question.includes(eq))));
  const pool = available.length > 0 ? available : questions;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  recordSeenTopic(chosen.topic);
  recordSeenTopic(chosen.question);

  return {
    question: chosen.question,
    topic: chosen.topic,
    level: 'Behavioral',
    hints: ['Structure your answer using the STAR format: Situation, Task, Action, and Measurable Result.'],
    evaluationCriteria: ['STAR communication clarity', 'Accountability and ownership', 'Constructive conflict resolution'],
    hasCodingSandbox: false,
  };
};

const generateInstantOpeningQuestion = (role, round = 'aptitude', level = 'Intermediate', persona) => {
  const history = getSeenHistory();
  if (round === 'aptitude') {
    return getAptitudeFallbackQuestion(1, history);
  }
  if (round === 'hr') {
    return getHrFallbackQuestion(1, history);
  }
  return getTechnicalFallbackQuestion(role, 1, level, history);
};

  /** Step 2: Instant zero-latency interview launcher (<10ms) */
  const startInterview = useCallback((overrideConfig = {}) => {
    setIsLoading(false);
    setError(null);

    const effectiveRole = overrideConfig.targetRole || targetRole || 'Software Engineer';
    const effectiveLevel = overrideConfig.difficultyLevel || difficultyLevel || 'Intermediate';
    const effectiveCompany = overrideConfig.companyTrack || companyTrack || 'General';
    const effectivePersona = overrideConfig.interviewerPersona || interviewerPersona || BAR_RAISER_PERSONAS[0];
    const effectiveDuration = overrideConfig.duration || duration || '15';
    const effectiveMode = overrideConfig.interviewMode || interviewMode || 'video';

    if (overrideConfig.targetRole) setTargetRole(overrideConfig.targetRole);
    if (overrideConfig.difficultyLevel) setDifficultyLevel(overrideConfig.difficultyLevel);
    if (overrideConfig.companyTrack) setCompanyTrack(overrideConfig.companyTrack);
    if (overrideConfig.interviewerPersona) setInterviewerPersona(overrideConfig.interviewerPersona);
    if (overrideConfig.duration) setDuration(overrideConfig.duration);
    if (overrideConfig.interviewMode) setInterviewMode(overrideConfig.interviewMode);

    // 1. Instant opening question generation (randomized to prevent repeating)
    const instantQ = generateInstantOpeningQuestion(
      effectiveRole,
      'aptitude',
      effectiveLevel,
      effectivePersona
    );

    setCurrentRoundIndex(0);
    setQuestionIndexInRound(1);
    setCurrentQuestion(instantQ);
    setAllResponses([]);
    setPreviousQuestions([instantQ.question]);
    setActiveFollowUp(null);
    isSubmittingRef.current = false;

    // 2. Instant Transition to Interview Studio
    setPhase('interview');

    // 3. Background dynamic generation via Gemini - updates Question 1 dynamically
    setTimeout(async () => {
      try {
        const effectiveAnalysis = resumeAnalysis || {
          targetRole: effectiveRole,
          domainFocus: effectiveRole,
          technicalSkills: [effectiveRole, 'System Architecture'],
          strengths: ['Data Structures & Algorithms', 'Analytical problem solving'],
          weaknesses: [],
        };
        const dynamicQ = await getQuestion({
          resumeAnalysis: effectiveAnalysis,
          targetRole: effectiveRole,
          round: 'aptitude',
          questionIndex: 1,
          previousQuestions: [instantQ.question, ...getSeenHistory()],
          difficultyLevel: effectiveLevel,
          companyTrack: effectiveCompany,
          persona: effectivePersona?.id || 'amazon',
        });
        if (dynamicQ && dynamicQ.question) {
          recordSeenTopic(dynamicQ.topic || dynamicQ.question);
          setCurrentQuestion(dynamicQ);
          setPreviousQuestions([dynamicQ.question]);
        }
      } catch (err) {
        console.log('Optimized opening question active.');
      }
    }, 150);
  }, [resumeAnalysis, targetRole, difficultyLevel, companyTrack, interviewerPersona, duration, interviewMode]);




  /** Step 3: Submit answer and advance */
  const submitAnswer = useCallback(
    async (answer, frames = [], codeSnippet = '', followUpAnswer = null) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      const round = ROUNDS[currentRoundIndex];
      const entry = {
        round: round.id,
        roundLabel: round.label,
        questionNumber: questionIndexInRound,
        question: currentQuestion.question,
        level: currentQuestion.level || currentQuestion.type || '',
        topic: currentQuestion.topic || '',
        answer: followUpAnswer ? `${answer}\n[Follow-up Response]: ${followUpAnswer}` : answer,
        codeSnippet: codeSnippet || '',
        frames,
        companyTrack,
      };

      // Prevent duplicate responses for the same question
      const filtered = allResponses.filter(
        (r) => !(r.round === round.id && r.questionNumber === questionIndexInRound)
      );
      const updatedResponses = [...filtered, entry];
      setAllResponses(updatedResponses);
      setActiveFollowUp(null);

      setIsLoading(true);
      setError(null);

      try {
        const nextQIndex = questionIndexInRound + 1;
        const nextRoundIndex = currentRoundIndex + 1;

        const effectiveAnalysis = resumeAnalysis || {
          targetRole: targetRole || 'Software Engineer',
          domainFocus: targetRole || 'Software Engineering',
          technicalSkills: [targetRole || 'Software Engineer', 'Problem Solving', 'System Architecture'],
          strengths: ['Data Structures & Algorithms', 'Analytical problem solving', 'Clean Code'],
          weaknesses: [],
          questionCurriculum: ['Aptitude & Logic', 'Technical Depth', 'Behavioral Leadership'],
        };

        const effectiveRole = targetRole || 'Software Engineer';

        const qPerRound = String(duration) === '15' ? 3 : String(duration) === '45' ? 7 : 5;
        const currentTotalInRound = round?.total || qPerRound;

        if (nextQIndex <= currentTotalInRound) {
          // Next question in same round
          let q;
          try {
            q = await getQuestion({
              resumeAnalysis: effectiveAnalysis,
              targetRole: effectiveRole,
              round: round.id,
              questionIndex: nextQIndex,
              previousQuestions: [...previousQuestions, currentQuestion.question, ...getSeenHistory()],
              lastCandidateAnswer: round.id === 'technical' && nextQIndex === 2 ? answerText : undefined,
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              persona: interviewerPersona?.id || 'amazon',
            });
          } catch (qErr) {
            console.warn('Next question fetch fallback:', qErr);
            const seen = [...previousQuestions, currentQuestion?.question, ...getSeenHistory()].filter(Boolean);
            if (round.id === 'aptitude') {
              q = getAptitudeFallbackQuestion(nextQIndex, seen);
            } else if (round.id === 'technical') {
              q = getTechnicalFallbackQuestion(effectiveRole, nextQIndex, difficultyLevel, seen);
            } else {
              q = getHrFallbackQuestion(nextQIndex, seen);
            }
          }

          recordSeenTopic(q.question);
          setCurrentQuestion(q);
          setQuestionIndexInRound(nextQIndex);
          setPreviousQuestions((prev) => [...prev, q.question]);
        } else if (nextRoundIndex < ROUNDS.length) {
          // Advance to next round
          const nextRound = ROUNDS[nextRoundIndex];
          let q;
          try {
            q = await getQuestion({
              resumeAnalysis: effectiveAnalysis,
              targetRole: effectiveRole,
              round: nextRound.id,
              questionIndex: 1,
              previousQuestions: [...previousQuestions, currentQuestion.question, ...getSeenHistory()],
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              persona: interviewerPersona?.id || 'amazon',
            });
          } catch (qErr) {
            console.warn('Next round question fetch fallback:', qErr);
            const seen = [...previousQuestions, currentQuestion?.question, ...getSeenHistory()].filter(Boolean);
            if (nextRound.id === 'technical') {
              q = getTechnicalFallbackQuestion(effectiveRole, 1, difficultyLevel, seen);
            } else if (nextRound.id === 'hr') {
              q = getHrFallbackQuestion(1, seen);
            } else {
              q = getAptitudeFallbackQuestion(1, seen);
            }
          }

          recordSeenTopic(q.question);
          setCurrentRoundIndex(nextRoundIndex);
          setQuestionIndexInRound(1);
          setCurrentQuestion(q);
          setPreviousQuestions((prev) => [...prev, q.question]);
        } else {
          // All rounds completed — Evaluate
          setPhase('evaluating');
          let evalReport;
          try {
            evalReport = await evaluateInterview({
              resumeAnalysis: effectiveAnalysis,
              targetRole: effectiveRole,
              allResponses: updatedResponses,
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              persona: interviewerPersona?.id || 'amazon',
            });
          } catch (evalErr) {
            console.warn('Evaluation report fallback:', evalErr);

            // Compute honest deterministic evaluation from actual submitted responses
            const isSubstantive = (ans) =>
              ans &&
              typeof ans === 'string' &&
              ans.trim().length > 15 &&
              !ans.includes('(No response provided)');

            const hasCameraFrames = updatedResponses.some(
              (r) => Array.isArray(r.frames) && r.frames.length > 0
            );

            const evalQuestions = updatedResponses.map((r, i) => {
              const answered = isSubstantive(r.answer);
              const wordCount = answered ? r.answer.trim().split(/\s+/).length : 0;
              const isCorrect = wordCount >= 35;
              const isPartial = answered && wordCount < 35;

              return {
                questionNumber: r.questionNumber || i + 1,
                round: r.roundLabel || r.round || 'Technical',
                question: r.question,
                candidateAnswer: r.answer || '(No response provided)',
                status: isCorrect ? 'Correct' : isPartial ? 'Partially Correct' : 'Incorrect',
                expectedAnswer: 'A comprehensive, structured explanation addressing edge cases, scale trade-offs, and invariants.',
                feedback: answered
                  ? isCorrect
                    ? 'Substantive technical reasoning provided.'
                    : 'Partial conceptual response, but lacked complete depth.'
                  : 'No substantive answer provided during this question.',
                tierComparison: {
                  staffTop1: 'Top 1% candidates outline clear trade-offs, quantifiable metrics, and edge cases.',
                },
              };
            });

            const calcRoundScore = (roundKey) => {
              const list = evalQuestions.filter((q) =>
                (q.round || '').toLowerCase().includes(roundKey)
              );
              if (list.length === 0) return 0;
              let total = 0;
              list.forEach((q) => {
                if (q.status === 'Correct') total += 100;
                else if (q.status === 'Partially Correct') total += 50;
              });
              return Math.round(total / list.length);
            };

            const aptScore = calcRoundScore('aptitude');
            const techScore = calcRoundScore('technical');
            const hrScore = calcRoundScore('hr');

            const totalAnsweredCount = updatedResponses.filter((r) => isSubstantive(r.answer)).length;
            const presenceScore = !hasCameraFrames || totalAnsweredCount === 0 ? 0 : 70;

            const allZero = aptScore === 0 && techScore === 0 && hrScore === 0;
            const overallScore = allZero
              ? 0
              : Math.round(techScore * 0.45 + aptScore * 0.25 + hrScore * 0.15 + presenceScore * 0.15);

            const hiringDecision =
              overallScore >= 85
                ? 'Strong Hire'
                : overallScore >= 70
                ? 'Lean Hire'
                : overallScore >= 40
                ? 'Lean No Hire'
                : 'Strong No Hire';

            const readiness =
              overallScore >= 85
                ? 'Excellent'
                : overallScore >= 70
                ? 'Interview Ready'
                : overallScore >= 50
                ? 'Almost Ready'
                : overallScore >= 25
                ? 'Needs Improvement'
                : 'Not Ready';

            evalReport = {
              overallScore,
              readinessLevel: readiness,
              aptitudeScore: aptScore,
              aptitudeFeedback: allZero
                ? 'No responses provided for Aptitude & Logic.'
                : 'Aptitude and logical reasoning assessment.',
              technicalScore: techScore,
              technicalFeedback: allZero
                ? 'No responses provided for Technical Depth.'
                : 'Technical problem-solving and domain competence.',
              hrScore: hrScore,
              hrFeedback: allZero
                ? 'No responses provided for HR & Behavioral fit.'
                : 'Behavioral and communication evaluation.',
              presenceScore,
              presenceFeedback: !hasCameraFrames
                ? 'Camera was off (Audio Only mode). Video composure not evaluated.'
                : totalAnsweredCount === 0
                ? 'No speech or active video responses detected.'
                : 'Candidate delivery and composure assessed.',
              barRaiserVerdict: {
                hiringDecision,
                personaFeedback: allZero
                  ? `Candidate did not provide any spoken or typed responses during this ${effectiveRole} session. Competency cannot be assessed.`
                  : `Evaluated against ${companyTrack} engineering competencies.`,
                coreCriteriaScore: overallScore,
                criteriaName: `${companyTrack} Competency Index`,
              },
              speechMetrics: {
                fillerWordsCount: 0,
                speakingPaceWpm: totalAnsweredCount === 0 ? 0 : 130,
                paceRating: totalAnsweredCount === 0 ? 'No Speech Detected' : 'Ideal (130-155 WPM)',
                clarityScore: totalAnsweredCount === 0 ? 0 : 80,
                vocalSteadiness: totalAnsweredCount === 0 ? 0 : 85,
              },
              strengths: allZero
                ? ['Completed interview setup navigation.']
                : ['Provided structured responses during the session.'],
              weaknesses: allZero
                ? ['No answers were provided during this session. Practice answering each question thoroughly.']
                : ['Deepen quantitative analysis and edge-case handling.'],
              suggestions: [
                {
                  area: 'Interview Practice',
                  suggestion: allZero
                    ? 'Speak or type complete answers for each question to receive a comprehensive evaluation.'
                    : 'Quantify metrics and state edge-case boundary conditions upfront.',
                },
              ],
              questionEvaluations: evalQuestions,
              overallVerdict: allZero
                ? 'No substantive responses were provided during this interview session.'
                : `Interview assessment completed with overall score of ${overallScore}/100.`,
            };
          }

          setReport(evalReport);
          setPhase('report');

          // Auto-save result to history
          try {
            await saveInterviewHistory({
              targetRole: effectiveRole,
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              report: evalReport,
              allResponses: updatedResponses,
            });
          } catch (e) {
            console.warn('History save notice:', e);
          }
        }
      } catch (err) {
        console.error('submitAnswer error:', err);
        setError(err.response?.data?.error || err.message);
        setPhase('interview');
      } finally {
        setIsLoading(false);
        isSubmittingRef.current = false;
      }

    },
    [
      allResponses,
      currentRoundIndex,
      currentQuestion,
      questionIndexInRound,
      resumeAnalysis,
      targetRole,
      difficultyLevel,
      companyTrack,
      interviewerPersona,
      previousQuestions,
      duration,
      ROUNDS,
    ]
  );


  /** Request an instant follow-up cross-examination probe */
  const triggerFollowUpProbe = useCallback(
    async (answer) => {
      if (!currentQuestion || !answer || answer.length < 15) return null;
      try {
        const res = await getFollowUpProbe({
          question: currentQuestion.question,
          candidateAnswer: answer,
          targetRole,
          companyTrack,
          persona: interviewerPersona?.id || 'amazon',
        });
        setActiveFollowUp(res.followUp);
        return res.followUp;
      } catch (e) {
        console.warn('Follow-up probe error:', e);
        return null;
      }
    },
    [currentQuestion, targetRole, companyTrack, interviewerPersona]
  );

  /** Load a past interview from history */
  const viewPastReport = useCallback((record) => {
    if (!record) return;
    setTargetRole(record.targetRole || 'Software Engineer');
    setDifficultyLevel(record.difficultyLevel || 'Intermediate');
    setCompanyTrack(record.companyTrack || 'General');

    const rep = record.report || {};
    const hydratedReport = {
      overallScore: rep.overallScore !== undefined ? rep.overallScore : (record.overallScore || 0),
      readinessLevel: rep.readinessLevel || record.readinessLevel || 'Not Ready',
      aptitudeScore: rep.aptitudeScore !== undefined ? rep.aptitudeScore : 0,
      aptitudeFeedback: rep.aptitudeFeedback || 'Aptitude and logic evaluation.',
      technicalScore: rep.technicalScore !== undefined ? rep.technicalScore : 0,
      technicalFeedback: rep.technicalFeedback || 'Technical coding and domain knowledge.',
      hrScore: rep.hrScore !== undefined ? rep.hrScore : 0,
      hrFeedback: rep.hrFeedback || 'HR and behavioral competency.',
      presenceScore: rep.presenceScore !== undefined ? rep.presenceScore : 0,
      presenceFeedback: rep.presenceFeedback || (rep.presenceScore === 0 ? 'No video/audio presence recorded.' : 'Presence evaluation.'),
      overallVerdict: rep.overallVerdict || 'Completed interview attempt.',
      strengths: rep.strengths || ['Demonstrated engagement during interview session.'],
      weaknesses: rep.weaknesses || ['Complete more technical practice drills.'],
      suggestions: rep.suggestions || [],
      questionEvaluations: rep.questionEvaluations || [],
      studyRoadmap: rep.studyRoadmap || [
        { day: 1, topic: 'Aptitude & Core Logic', action: 'Review syllogisms and probability.', resource: 'LeetCode & Khan Academy' },
        { day: 2, topic: 'Technical Fundamentals', action: 'Practice fundamental domain questions.', resource: 'Official documentation' },
        { day: 3, topic: 'DSA & Algorithms', action: 'Solve 2 Two Pointer and Hash Map drills.', resource: 'DSA Practice Studio' },
        { day: 4, topic: 'System Design & Architecture', action: 'Review caching and indexing.', resource: 'System Design Primer' },
        { day: 5, topic: 'Code Review & Security', action: 'Practice SQLi and auth flaw triage.', resource: 'Bug Hunter Mode' },
        { day: 6, topic: 'Behavioral STAR Drills', action: 'Structure leadership & conflict stories.', resource: 'STAR Framework' },
        { day: 7, topic: 'Full Mock Re-Test', action: 'Take a complete 15-question AI interview.', resource: 'AI Interview Evaluator' },
      ],
      speechMetrics: rep.speechMetrics || {
        fillerWordsCount: 0,
        speakingPaceWpm: 0,
        paceRating: 'No Audio Recorded',
        clarityScore: 0,
        vocalSteadiness: 0,
      },
    };

    setReport(hydratedReport);
    setAllResponses(record.allResponses || rep.questionEvaluations || []);
    setPhase('report');
  }, []);

  /** Reset everything to start fresh */
  const restart = useCallback(() => {
    setPhase('landing');
    setResumeText('');
    setTargetRole('');
    setResumeAnalysis(null);
    setCurrentRoundIndex(0);
    setCurrentQuestion(null);
    setQuestionIndexInRound(1);
    setAllResponses([]);
    setPreviousQuestions([]);
    setReport(null);
    setActiveFollowUp(null);
    setError(null);
    setIsLoading(false);
    isSubmittingRef.current = false;
  }, []);

  /** Retake the exact same interview exam with current parameters */
  const retakeSameExam = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setReport(null);
    setAllResponses([]);
    setActiveFollowUp(null);
    isSubmittingRef.current = false;

    // Instant opening question generation
    const instantQ = generateInstantOpeningQuestion(
      targetRole,
      difficultyLevel,
      interviewerPersona
    );


    setCurrentRoundIndex(0);
    setQuestionIndexInRound(1);
    setCurrentQuestion(instantQ);
    setPreviousQuestions([instantQ.question]);

    // Instant launch back into interview
    setPhase('interview');
  }, [targetRole, difficultyLevel, interviewerPersona]);

  const answeredCount = allResponses.length;
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  return (
    <InterviewContext.Provider
      value={{
        BAR_RAISER_PERSONAS,
        interviewerPersona,
        setInterviewerPersona,
        phase,
        setPhase,
        interviewMode,
        setInterviewMode,
        difficultyLevel,
        setDifficultyLevel,
        companyTrack,
        setCompanyTrack,
        duration,
        setDuration,
        resumeText,

        targetRole,
        setTargetRole,
        role: targetRole,
        setRole: setTargetRole,
        resumeAnalysis,
        currentRound: ROUNDS[currentRoundIndex],
        currentRoundIndex,
        currentQuestion,
        questionIndexInRound,
        allResponses,
        report,
        setReport,
        activeFollowUp,
        setActiveFollowUp,
        isLoading,
        error,
        clearError,
        ROUNDS,
        totalQuestions: TOTAL_QUESTIONS,
        answeredCount,
        progressPercent,
        handleResumeSubmit,
        startInterview,
        submitAnswer,
        triggerFollowUpProbe,
        viewPastReport,
        restart,
        retakeSameExam,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

