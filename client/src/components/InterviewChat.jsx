import React, { useState, useRef, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';

const ROUND_CONFIG = {
  aptitude: { label: 'Aptitude & Logic', color: 'bg-blue-50 text-blue-700 border-blue-200', emoji: '🧠' },
  technical: { label: 'Technical', color: 'bg-purple-50 text-purple-700 border-purple-200', emoji: '💻' },
  hr: { label: 'HR Round', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '👥' },
};

export default function InterviewChat() {
  const {
    phase,
    currentRound,
    currentRoundIndex,
    currentQuestion,
    questionIndexInRound,
    allResponses,
    ROUNDS,
    totalQuestions,
    answeredCount,
    progressPercent,
    submitAnswer,
    isLoading,
    error,
    clearError,
    targetRole,
    companyTrack,
    interviewerPersona,
    setPhase,
  } = useInterview();

  const [answer, setAnswer] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allResponses, currentQuestion, isLoading]);

  useEffect(() => {
    setAnswer('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [currentQuestion]);

  // ── Global Keyboard Capture: Typing anywhere fills the response box ────────
  useEffect(() => {
    const handleGlobalTyping = (e) => {
      if (document.activeElement === textareaRef.current) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1 && !isLoading) {
        textareaRef.current?.focus();
        setAnswer((prev) => prev + e.key);
        e.preventDefault();
      } else if (e.key === 'Backspace' && !isLoading) {
        textareaRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalTyping);
    return () => window.removeEventListener('keydown', handleGlobalTyping);
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isLoading) return;
    const finalAnswer = answer.trim() || '(No response provided)';
    clearError();
    await submitAnswer(finalAnswer);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const roundCfg = currentRound ? ROUND_CONFIG[currentRound.id] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 select-none">
      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm shadow-sm">
            🎯
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">AI Interview Evaluator</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-xs">{targetRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1.5">
            {ROUNDS.map((r, i) => (
              <div
                key={r.id}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  i < currentRoundIndex
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : i === currentRoundIndex
                    ? ROUND_CONFIG[r.id]?.color
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                {i < currentRoundIndex ? '✓ ' : ''}
                {ROUND_CONFIG[r.id]?.emoji} {r.label}
              </div>
            ))}
          </div>

          <span className="text-xs text-slate-700 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {answeredCount}/{totalQuestions}
          </span>

          <button
            onClick={() => setPhase('setup')}
            className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg px-3 py-1.5 transition-all shadow-sm cursor-pointer"
          >
            Switch Mode
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-1 bg-teal-600 transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Chat Messages ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Past Q&A pairs */}
          {allResponses.map((resp, i) => (
            <div key={i} className="space-y-3 text-left">
              {/* Question */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  AI
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 flex-1 shadow-sm">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                    {resp.roundLabel} — Q{resp.questionNumber}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-normal">{resp.question}</p>
                </div>
              </div>

              {/* Candidate Answer */}
              <div className="flex gap-3 items-start justify-end">
                <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200 max-w-xl text-left shadow-sm">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                    Your Response:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 font-mono leading-relaxed">{resp.answer}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                  You
                </div>
              </div>
            </div>
          ))}

          {/* Current Question */}
          {currentQuestion && phase === 'interview' && (
            <div className="flex gap-3 items-start animate-fade-in text-left">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                AI
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex-1 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  {roundCfg && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${roundCfg.color}`}>
                      {roundCfg.emoji} {roundCfg.label} — Q{questionIndexInRound}/{currentRound.total}
                    </span>
                  )}
                  {currentQuestion.type && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {currentQuestion.type}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">{currentQuestion.question}</p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-fade-in text-left">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-xs text-slate-500 font-mono">
                  {phase === 'evaluating' ? 'Generating comprehensive scorecard...' : 'Preparing next question...'}
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Input Area ── */}
      {phase === 'interview' && (
        <div className="border-t border-slate-200 bg-white p-4 sticky bottom-0 shadow-md">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                ❌ {error}
              </p>
            )}

            <div className="relative flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your structured answer here..."
                rows={3}
                disabled={isLoading}
                className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed shadow-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-5 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50 h-full self-stretch"
              >
                {isLoading ? '...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
