import React, { useState, useRef, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';

const ROUND_CONFIG = {
  aptitude: { label: 'Aptitude & Logic', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', emoji: '🧠' },
  technical: { label: 'Technical', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', emoji: '💻' },
  hr: { label: 'HR & Behavioral', color: 'bg-green-500/10 text-green-400 border-green-500/30', emoji: '🤝' },
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* ── Top Bar ── */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-sm shadow-md">
            🎯
          </div>
          <div>
            <p className="font-bold text-white text-xs sm:text-sm tracking-tight">AI Interview Evaluator</p>
            <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">{targetRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1.5">
            {ROUNDS.map((r, i) => (
              <div
                key={r.id}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  i < currentRoundIndex
                    ? 'bg-green-950/60 text-green-300 border-green-700/60'
                    : i === currentRoundIndex
                    ? ROUND_CONFIG[r.id]?.color
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {i < currentRoundIndex ? '✓ ' : ''}
                {ROUND_CONFIG[r.id]?.emoji} {r.label}
              </div>
            ))}
          </div>

          <span className="text-xs text-slate-300 font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            {answeredCount}/{totalQuestions}
          </span>

          <button
            onClick={() => setPhase('setup')}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 bg-slate-800/60 hover:bg-slate-700 rounded-lg px-3 py-1.5 transition-all"
          >
            Switch Mode
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-900">
        <div
          className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-700 shadow-sm shadow-indigo-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Chat Messages ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Active Bar Raiser Interrogation Banner */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl">{interviewerPersona?.avatar || '📦'}</span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white flex items-center gap-1.5 truncate">
                  <span>{interviewerPersona?.name || 'Marcus Vance'}</span>
                  <span className="text-[10px] font-medium text-slate-400">({interviewerPersona?.company || companyTrack})</span>
                </p>
                <p className="text-[10px] text-amber-300 font-mono italic truncate">
                  "{interviewerPersona?.catchphrase || 'Demanding high ownership and measurable metrics.'}"
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-950 text-indigo-300 whitespace-nowrap">
              {interviewerPersona?.badge?.split('&')[0] || 'Bar Raiser'}
            </span>
          </div>
          {/* Past Q&A pairs */}
          {allResponses.map((resp, i) => (
            <div key={i} className="space-y-3">
              {/* Question */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                  AI
                </div>
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex-1 shadow-sm">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    {resp.roundLabel} — Q{resp.questionNumber}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">{resp.question}</p>
                </div>
              </div>

              {/* Candidate Answer */}
              <div className="flex gap-3 items-start justify-end">
                <div className="bg-indigo-950/40 rounded-2xl p-4 border border-indigo-800/60 max-w-xl text-left shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Your Response:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 font-mono leading-relaxed">{resp.answer}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold flex-shrink-0">
                  You
                </div>
              </div>
            </div>
          ))}

          {/* Current Question */}
          {currentQuestion && phase === 'interview' && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                AI
              </div>
              <div className="card-dark border-indigo-900/40 flex-1 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  {roundCfg && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${roundCfg.color}`}>
                      {roundCfg.emoji} {roundCfg.label} — Q{questionIndexInRound}/{currentRound.total}
                    </span>
                  )}
                  {currentQuestion.type && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                      {currentQuestion.type}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{currentQuestion.question}</p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-xs text-slate-400 font-mono">
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
        <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-xl p-4 sticky bottom-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
            {error && (
              <p className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-lg border border-red-800/60">
                ❌ {error}
              </p>
            )}

            <div className="relative flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your structured answer here (Press Enter to submit & continue, Shift+Enter for newline)..."
                rows={3}
                disabled={isLoading}
                className="input-field-dark text-xs leading-relaxed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary py-3 px-5 text-xs font-bold btn-glow h-full self-stretch"
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
