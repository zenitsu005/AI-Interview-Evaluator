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
    name: 'Marcus Vance',
    title: 'Principal Bar Raiser & VP',
    avatar: '📦',
    badge: 'Amazon 16 LPs & Bar Raiser',
    accentColor: 'text-amber-400 border-amber-500/60 bg-amber-950/40',
    headerGradient: 'from-amber-600 to-yellow-600',
    focus: '16 Leadership Principles, Customer Obsession, Bias for Action, Quantifiable Metrics',
    catchphrase: "I'm looking for high ownership and data-driven decisions that raise our hiring bar.",
    rubric: 'Evaluates relentless customer focus, frugality, deep dives, and STAR metric impact.',
    promptDirective: 'Roleplay strictly as an Amazon Principal Bar Raiser. Interrogate deeply on the 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Have Backbone). Demand clear quantitative metrics (e.g. latency, revenue, scale) in every STAR response.',
  },
  {
    id: 'google',
    company: 'Google',
    name: 'Dr. Sanjay Rao',
    title: 'Distinguished SWE & L7 Hiring Committee',
    avatar: '🌐',
    badge: 'Google Distributed Scale & Algorithms',
    accentColor: 'text-cyan-400 border-cyan-500/60 bg-cyan-950/40',
    headerGradient: 'from-blue-600 to-cyan-600',
    focus: 'Distributed Systems Invariants, Clean Abstractions, Mathematical Big-O Proofs',
    catchphrase: "Let's explore distributed fault tolerance and prove your algorithmic boundaries.",
    rubric: 'Evaluates algorithmic optimality, race conditions, edge-case proofs, and planet-scale systems.',
    promptDirective: 'Roleplay strictly as a Google L7 Distinguished Software Engineer on the Hiring Committee. Focus on planet-scale distributed architecture, rigorous asymptotic Big-O proofs, memory invariants, and edge-case correctness.',
  },
  {
    id: 'yc_startup',
    company: 'YC Startup',
    name: 'Elena Rostova',
    title: 'YC Founder & Series-B CTO',
    avatar: '🚀',
    badge: 'YC Fast-Paced Shipping & Hustle',
    accentColor: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40',
    headerGradient: 'from-emerald-600 to-teal-600',
    focus: 'Shipping Velocity, Product Instincts, Full-Stack Pragmatism, Zero Fluff',
    catchphrase: "Can you ship this to 100k users by Friday without over-engineering?",
    rubric: 'Evaluates rapid execution, product trade-offs, scrappiness, and high agency.',
    promptDirective: 'Roleplay strictly as a fast-paced Y-Combinator Founder & CTO. Prioritize shipping velocity, product intuition, practical full-stack trade-offs, and high agency. Reject over-engineered academic answers in favor of working solutions.',
  },
  {
    id: 'wall_street',
    company: 'Wall Street HFT',
    name: 'Arthur Sterling',
    title: 'Head of Quantitative Infrastructure',
    avatar: '💹',
    badge: 'Wall Street Ultra-Low Latency & Quant',
    accentColor: 'text-purple-400 border-purple-500/60 bg-purple-950/40',
    headerGradient: 'from-purple-600 to-indigo-600',
    focus: 'Sub-Microsecond Latency, Lock-Free Concurrency, Cache-Locality, C++/OS Internals',
    catchphrase: "Every microsecond costs $100,000. How do you prevent cache misses and thread lockup?",
    rubric: 'Evaluates low-level memory alignment, kernel bypass, and high-frequency concurrency.',
    promptDirective: 'Roleplay strictly as a Head of Quantitative High-Frequency Trading Infrastructure on Wall Street. Focus on sub-microsecond latency, CPU cache alignment, lock-free ring buffers, OS kernel bypass, and deterministic concurrency.',
  },
  {
    id: 'microsoft',
    company: 'Microsoft',
    name: 'Sarah Chen',
    title: 'Partner Director of Software Engineering',
    avatar: '💼',
    badge: 'Enterprise Architecture & Cloud Resiliency',
    accentColor: 'text-blue-400 border-blue-500/60 bg-blue-950/40',
    headerGradient: 'from-blue-700 to-indigo-600',
    focus: 'Cloud Resiliency, Cross-Team Stakeholder Alignment, Security & Backward Compatibility',
    catchphrase: "How does your architecture guarantee 99.999% SLA across multi-region enterprise clouds?",
    rubric: 'Evaluates zero-trust security, backward compatibility, disaster recovery, and cross-team empathy.',
    promptDirective: 'Roleplay strictly as a Microsoft Partner Director of Engineering. Focus on enterprise cloud scalability (Azure/multi-region), disaster recovery, zero-trust security, backward compatibility, and stakeholder cross-collaboration.',
  },
  {
    id: 'meta',
    company: 'Meta / Product Tech',
    name: 'Kavita Patel',
    title: 'Staff Product Infrastructure Lead',
    avatar: '📱',
    badge: 'Meta Rapid Iteration & Real-Time Data',
    accentColor: 'text-pink-400 border-pink-500/60 bg-pink-950/40',
    headerGradient: 'from-pink-600 to-rose-600',
    focus: 'Billions-Scale Feeds, Real-Time Messaging, Live A/B Testing, Moving Fast',
    catchphrase: "Move fast, resolve infrastructure bottlenecks, and deliver delightful user impact.",
    rubric: 'Evaluates high-concurrency feeds, real-time sync, client-server optimizations, and A/B metric telemetry.',
    promptDirective: 'Roleplay strictly as a Meta Staff Infrastructure Lead. Focus on real-time messaging pipelines, live A/B experimentation, high-throughput caching, and rapid user-facing iteration.',
  },
];

// Interview rounds definition (5 questions per round, progressively escalating difficulty)
const ROUNDS = [
  { id: 'aptitude', label: 'Aptitude & Logic', total: 5, color: 'blue' },
  { id: 'technical', label: 'Technical', total: 5, color: 'purple' },
  { id: 'hr', label: 'HR & Behavioral', total: 5, color: 'green' },
];

const TOTAL_QUESTIONS = ROUNDS.reduce((sum, r) => sum + r.total, 0); // Exactly 15 questions

export const InterviewProvider = ({ children }) => {
  const [phase, setPhase] = useState('landing');
  const [interviewMode, setInterviewMode] = useState('video'); // 'video' | 'text'
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate'); // 'Beginner' | 'Intermediate' | 'Experienced'
  const [companyTrack, setCompanyTrack] = useState('Amazon'); // Track
  const [interviewerPersona, setInterviewerPersona] = useState(BAR_RAISER_PERSONAS[0]); // Bar Raiser Persona
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

  /** Step 2: Load first question and begin interview */
  const startInterview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const round = ROUNDS[0];
      const effectiveAnalysis = resumeAnalysis || {
        targetRole: targetRole || 'Software Engineer',
        domainFocus: targetRole || 'Software Engineering',
        technicalSkills: [targetRole || 'Software Engineer', 'Problem Solving', 'System Architecture'],
        strengths: ['Data Structures & Algorithms', 'Analytical problem solving', 'Clean Code'],
        weaknesses: [],
        questionCurriculum: ['Aptitude & Logic', 'Technical Depth', 'Behavioral Leadership']
      };

      let q;
      try {
        q = await getQuestion({
          resumeAnalysis: effectiveAnalysis,
          targetRole: targetRole || 'Software Engineer',
          round: round.id,
          questionIndex: 1,
          previousQuestions: [],
          difficultyLevel: difficultyLevel || 'Intermediate',
          companyTrack: companyTrack || 'General',
          persona: interviewerPersona?.id || 'amazon',
        });
      } catch (apiErr) {
        console.warn('API getQuestion failed or timed out, loading dynamic calibrated question:', apiErr);
        q = {
          question: `Welcome to your ${targetRole || 'Software Engineer'} interview. Let's begin: Can you describe an architectural challenge you encountered in a high-scale production system, and how you analyzed the engineering trade-offs to resolve it?`,
          topic: 'System Architecture & Problem Solving',
          level: difficultyLevel || 'Intermediate',
          hints: ['Discuss latency, data consistency, failure modes, and monitoring metrics.'],
          evaluationCriteria: ['Clear trade-off reasoning', 'Quantifiable impact', 'Structured communication']
        };
      }

      setCurrentRoundIndex(0);
      setQuestionIndexInRound(1);
      setCurrentQuestion(q);
      setAllResponses([]);
      setPreviousQuestions([q.question]);
      setActiveFollowUp(null);
      setPhase('interview');
    } catch (err) {
      console.error('startInterview error:', err);
      setError(err.response?.data?.error || err.message);
      // Fallback transition so candidate is never stuck on black screen
      setPhase('interview');
    } finally {
      setIsLoading(false);
    }
  }, [resumeAnalysis, targetRole, difficultyLevel, companyTrack, interviewerPersona]);


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

        if (nextQIndex <= round.total) {
          // Next question in same round
          const q = await getQuestion({
            resumeAnalysis,
            targetRole,
            round: round.id,
            questionIndex: nextQIndex,
            previousQuestions: [...previousQuestions, currentQuestion.question],
            difficultyLevel,
            companyTrack,
            persona: interviewerPersona?.id || 'amazon',
          });
          setCurrentQuestion(q);
          setQuestionIndexInRound(nextQIndex);
          setPreviousQuestions((prev) => [...prev, q.question]);
        } else if (nextRoundIndex < ROUNDS.length) {
          // Advance to next round
          const nextRound = ROUNDS[nextRoundIndex];
          const q = await getQuestion({
            resumeAnalysis,
            targetRole,
            round: nextRound.id,
            questionIndex: 1,
            previousQuestions: [...previousQuestions, currentQuestion.question],
            difficultyLevel,
            companyTrack,
            persona: interviewerPersona?.id || 'amazon',
          });
          setCurrentRoundIndex(nextRoundIndex);
          setQuestionIndexInRound(1);
          setCurrentQuestion(q);
          setPreviousQuestions((prev) => [...prev, q.question]);
        } else {
          // Exactly 15 questions answered — Evaluate
          setPhase('evaluating');
          const evalReport = await evaluateInterview({
            resumeAnalysis,
            targetRole,
            allResponses: updatedResponses,
            difficultyLevel,
            companyTrack,
            persona: interviewerPersona?.id || 'amazon',
          });
          setReport(evalReport);
          setPhase('report');

          // Auto-save result to history
          try {
            await saveInterviewHistory({
              targetRole,
              difficultyLevel,
              companyTrack,
              report: evalReport,
              allResponses: updatedResponses,
            });
          } catch (e) {
            console.warn('History save notice:', e);
          }
        }
      } catch (err) {
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
        resumeText,
        targetRole,
        setTargetRole,
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
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
