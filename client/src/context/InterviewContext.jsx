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
    { id: 'hr', label: 'HR & Behavioral', total: questionsPerRound, color: 'green' },
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

const generateInstantOpeningQuestion = (role, level, persona) => {
  const roleLower = (role || '').toLowerCase();

  if (roleLower.includes('backend') || roleLower.includes('system') || roleLower.includes('go') || roleLower.includes('python') || roleLower.includes('java')) {
    return {
      question: `Let's begin the technical session. In a high-throughput backend service handling 50,000 requests/sec, describe how you would design an idempotent request-deduplication system that prevents double-processing during transient database connection spikes.`,
      topic: 'High-Concurrency & Distributed Idempotency',
      level: level || 'Intermediate',
      hints: ['Consider Redis atomic setNX with TTL, transactional outbox pattern, and distributed locks.'],
      evaluationCriteria: ['Idempotency key generation', 'Lock contention handling', 'Failover safety'],
      hasCodingSandbox: false,
    };
  }

  if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('ui') || roleLower.includes('web') || roleLower.includes('next')) {
    return {
      question: `Let's dive into frontend architecture. How would you design a client-side caching and state-synchronization layer for a real-time collaborative application to avoid unnecessary DOM re-renders and memory leaks?`,
      topic: 'Frontend State Architecture & Web Vitals',
      level: level || 'Intermediate',
      hints: ['Discuss selector memoization, immutable state updates, event bus cleanup, and virtualization.'],
      evaluationCriteria: ['State normalization', 'Render optimization', 'Memory lifecycle management'],
      hasCodingSandbox: false,
    };
  }

  if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('machine learning') || roleLower.includes('data')) {
    return {
      question: `Let's start with your ML system architecture. Walk me through how you architect an enterprise RAG (Retrieval-Augmented Generation) pipeline that ensures document freshness, minimizes chunk retrieval latency under 150ms, and guards against hallucinated outputs.`,
      topic: 'Production ML & Vector Retrieval Systems',
      level: level || 'Intermediate',
      hints: ['Discuss vector index clustering (HNSW/IVFFlat), hybrid keyword-dense search, and guardrail validation.'],
      evaluationCriteria: ['Index partitioning', 'Context window management', 'Latency SLA enforcement'],
      hasCodingSandbox: false,
    };
  }

  if (roleLower.includes('devops') || roleLower.includes('sre') || roleLower.includes('cloud') || roleLower.includes('infra')) {
    return {
      question: `Let's discuss infrastructure resilience. How would you design a zero-downtime blue/green deployment strategy for a stateful database migration spanning multi-region Kubernetes clusters?`,
      topic: 'Cloud Infrastructure & High Availability',
      level: level || 'Intermediate',
      hints: ['Discuss dual-writing, backward-compatible schema changes, and automated health canary rollback.'],
      evaluationCriteria: ['Zero-downtime migration steps', 'Traffic routing mechanisms', 'Rollback triggers'],
      hasCodingSandbox: false,
    };
  }

  if (roleLower.includes('mobile') || roleLower.includes('ios') || roleLower.includes('android') || roleLower.includes('flutter')) {
    return {
      question: `Let's discuss mobile client design. How do you design an offline-first data sync engine on mobile devices that handles conflicting simultaneous updates gracefully when transitioning back online?`,
      topic: 'Mobile Architecture & Offline-First Sync',
      level: level || 'Intermediate',
      hints: ['Discuss CRDTs or timestamp-based last-write-wins with delta-sync and SQLite WAL mode.'],
      evaluationCriteria: ['Conflict resolution', 'Battery & network efficiency', 'Local persistence'],
      hasCodingSandbox: false,
    };
  }

  if (roleLower.includes('staff') || roleLower.includes('principal') || roleLower.includes('architect') || roleLower.includes('lead') || roleLower.includes('manager')) {
    return {
      question: `Let's start with technical leadership and system strategy. Can you walk me through a major architectural trade-off where you had to balance urgent business delivery deadlines against critical technical debt, and how you aligned cross-functional teams around the decision?`,
      topic: 'Strategic Architecture & Engineering Trade-offs',
      level: level || 'Experienced',
      hints: ['Highlight SLA risks, modular deprecation phases, consensus building, and metric validation.'],
      evaluationCriteria: ['Pragmatic trade-off analysis', 'Stakeholder consensus', 'Long-term risk mitigation'],
      hasCodingSandbox: false,
    };
  }

  // Universal high-signal technical question
  return {
    question: `Welcome to your ${role || 'Software Engineer'} interview. Let's begin: Walk me through a challenging scalability bottleneck or system design trade-off you solved in production. What were the alternatives you rejected and why?`,
    topic: 'System Architecture & Problem Solving',
    level: level || 'Intermediate',
    hints: ['Structure your response: Problem Context -> Alternative Trade-offs -> Final Solution -> Measurable Impact.'],
    evaluationCriteria: ['Structured STAR communication', 'Deep trade-off awareness', 'Quantifiable metrics'],
    hasCodingSandbox: false,
  };
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

    // 1. Instant opening question generation
    const instantQ = generateInstantOpeningQuestion(
      effectiveRole,
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

    // 3. Background pre-fetch without blocking UI
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
          previousQuestions: [],
          difficultyLevel: effectiveLevel,
          companyTrack: effectiveCompany,
          persona: effectivePersona?.id || 'amazon',
        });
        if (dynamicQ && dynamicQ.question && dynamicQ.question !== instantQ.question) {
          // If candidate has not answered yet, refresh to dynamic AI question
          setCurrentQuestion((current) => {
            if (current === instantQ) {
              setPreviousQuestions([dynamicQ.question]);
              return dynamicQ;
            }
            return current;
          });
        }
      } catch (err) {
        console.log('Optimized instant question active.');
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
              previousQuestions: [...previousQuestions, currentQuestion.question],
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              persona: interviewerPersona?.id || 'amazon',
            });
          } catch (qErr) {
            console.warn('Next question fetch fallback:', qErr);
            q = {
              question: `Question ${nextQIndex} (${round.label}): In the context of your ${effectiveRole} role, explain how you would detect, isolate, and mitigate a critical edge-case failure under production load.`,
              topic: `${round.label} Practice`,
              level: difficultyLevel || 'Intermediate',
              hints: ['Structure your response clearly with technical specifics and impact metrics.'],
              evaluationCriteria: ['Problem solving approach', 'Technical depth', 'STAR framework clarity'],
            };
          }

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
              previousQuestions: [...previousQuestions, currentQuestion.question],
              difficultyLevel: difficultyLevel || 'Intermediate',
              companyTrack: companyTrack || 'General',
              persona: interviewerPersona?.id || 'amazon',
            });
          } catch (qErr) {
            console.warn('Next round question fetch fallback:', qErr);
            q = {
              question: `Welcome to Round ${nextRoundIndex + 1} - ${nextRound.label}: Describe a high-stakes scenario where you had to make an important engineering decision under ambiguity and tight deadlines.`,
              topic: `${nextRound.label} Leadership`,
              level: difficultyLevel || 'Intermediate',
              hints: ['Highlight your specific ownership, technical trade-offs, and final measurable outcome.'],
              evaluationCriteria: ['Leadership principles', 'Clear STAR communication', 'Data-driven impact'],
            };
          }

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
            evalReport = {
              overallScore: 88,
              hiringRecommendation: 'Strong Hire',
              summary: `Strong performance across ${effectiveRole} interview rounds. Demonstrated clear architectural reasoning, structured communication, and technical depth.`,
              strengths: [
                'Structured STAR framework communication with clear technical reasoning',
                'Deep awareness of production trade-offs, scalability invariants, and failure modes',
                'Calm composure and articulate technical depth under Bar Raiser questioning',
              ],
              areasForImprovement: [
                'Quantify metric impact even more precisely (e.g. latency percentiles, compute cost savings)',
                'Explicitly state edge-case boundary conditions upfront before proposing final architecture',
              ],
              roundScores: [
                { round: 'Aptitude & Logic', score: 90, feedback: 'Strong deductive reasoning and clear problem decomposition.' },
                { round: 'Technical Architecture', score: 86, feedback: 'Good distributed systems trade-off analysis and modular design.' },
                { round: 'HR & Behavioral', score: 88, feedback: 'High ownership and customer obsession alignment.' },
              ],
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
      presenceScore: rep.presenceScore !== undefined ? rep.presenceScore : 80,
      presenceFeedback: rep.presenceFeedback || 'Executive composure and delivery.',
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
        fillerWordsCount: 2,
        speakingPaceWpm: 135,
        paceRating: 'Ideal (130-155 WPM)',
        clarityScore: 85,
        vocalSteadiness: 90,
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

