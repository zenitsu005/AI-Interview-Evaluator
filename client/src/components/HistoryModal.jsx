import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';

export default function HistoryModal() {
  const { historyModalOpen, closeHistory, history } = useAuth();
  const { viewPastReport } = useInterview();

  if (!historyModalOpen) return null;

  const handleSelectRecord = (record) => {
    viewPastReport(record);
    closeHistory();
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 40) return 'text-amber-700 border-amber-300 bg-amber-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl shadow-sm">
              📊
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Interview History</h2>
              <p className="text-xs text-slate-500">Review past attempts, score breakdowns, and track progress.</p>
            </div>
          </div>
          <button
            onClick={closeHistory}
            className="text-slate-400 hover:text-slate-700 text-lg w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2 opacity-60">🎯</span>
              <p className="text-slate-700 font-semibold text-sm">No past interviews found</p>
              <p className="text-slate-500 text-xs mt-1">Complete your first mock interview to see your record here!</p>
            </div>
          ) : (
            history.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => handleSelectRecord(item)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-500/50 p-4 rounded-xl transition-all cursor-pointer group shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm truncate">{item.targetRole}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-sm">
                      {item.difficultyLevel || 'Intermediate'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate">
                    Readiness: <strong className="text-slate-800">{item.readinessLevel}</strong>
                  </p>
                </div>

                {/* Score badge & View Button */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl border text-center font-black text-sm ${getScoreColor(item.overallScore)}`}>
                    {item.overallScore}<span className="text-[10px] font-normal opacity-70">/100</span>
                  </div>
                  <span className="text-xs text-teal-700 group-hover:text-teal-800 group-hover:translate-x-1 transition-all">
                    View →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>{history.length} Interview Attempt{history.length !== 1 ? 's' : ''} recorded</span>
          <button onClick={closeHistory} className="py-1.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
