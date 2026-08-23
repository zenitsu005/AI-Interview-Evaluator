import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import {
  TbFileText as FileText,
  TbX as X,
  TbChevronRight as ChevronRight,
  TbTrophy as Trophy,
  TbClock as Clock,
} from 'react-icons/tb';

export default function HistoryModal() {
  const { historyModalOpen, closeHistory, history } = useAuth();
  const { viewPastReport } = useInterview();

  if (!historyModalOpen) return null;

  const handleSelectRecord = (record) => {
    viewPastReport(record);
    closeHistory();
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60';
    if (score >= 40) return 'text-amber-300 border-amber-500/40 bg-amber-950/60';
    return 'text-rose-300 border-rose-500/40 bg-rose-950/60';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-sans">
      <div className="bg-[#131823] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Your Interview History</h2>
              <p className="text-xs text-slate-400">Review past attempts, score breakdowns, and track progress.</p>
            </div>
          </div>
          <button
            onClick={closeHistory}
            className="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-[#171E2D] hover:bg-[#1E273A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-teal-400/40 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">No past interviews found</p>
              <p className="text-slate-400 text-xs mt-1">Complete your first mock interview to see your record here!</p>
            </div>
          ) : (
            history.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => handleSelectRecord(item)}
                className="bg-[#0D111A] hover:bg-[#171E2D] border border-white/5 hover:border-teal-500/40 p-4 rounded-2xl transition-all cursor-pointer group shadow-md flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">{item.targetRole}</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#131823] text-teal-300 border border-teal-500/30">
                      {item.difficultyLevel || 'Intermediate'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(item.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate">
                    Readiness: <strong className="text-teal-300 font-mono">{item.readinessLevel}</strong>
                  </p>
                </div>

                {/* Score badge & View Button */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl border text-center font-black font-mono text-sm ${getScoreColor(item.overallScore)}`}>
                    {item.overallScore}<span className="text-[10px] font-normal opacity-70">/100</span>
                  </div>
                  <span className="text-xs text-teal-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all flex items-center gap-0.5">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{history.length} Interview Attempt{history.length !== 1 ? 's' : ''} recorded</span>
          <button onClick={closeHistory} className="py-2 px-4 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-slate-200 text-xs font-semibold shadow-sm cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
