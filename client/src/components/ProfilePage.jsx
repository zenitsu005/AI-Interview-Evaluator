import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import ShareReportCardModal from './ShareReportCardModal';
import AnalyticsTrendSection from './AnalyticsTrendSection';

export default function ProfilePage() {
  const { user, logout, updateUserProfile } = useAuth();
  const { history, setPhase, setReport, setRole, setDifficultyLevel } = useInterview();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareReport, setSelectedShareReport] = useState(null);

  // Edit Profile Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;
    if (updateUserProfile) {
      updateUserProfile({ name: editName.trim(), email: editEmail.trim() });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingProfile(false);
    }, 800);
  };

  const viewPastReport = (record) => {
    setReport(record.report || record);
    setRole(record.targetRole || 'Software Engineer');
    setDifficultyLevel(record.difficultyLevel || 'Intermediate');
    setPhase('report');
  };

  const totalInterviews = history.length;
  const avgOverallScore = totalInterviews > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.overallScore || 0), 0) / totalInterviews)
    : 0;

  const getCategoryAvg = (key) => {
    if (totalInterviews === 0) return 0;
    const scores = history.map((h) => h.report?.[key] || 0);
    return Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews);
  };

  const avgAptitude = getCategoryAvg('aptitudeScore');
  const avgTechnical = getCategoryAvg('technicalScore');
  const avgHR = getCategoryAvg('hrScore');
  const avgPosture = getCategoryAvg('bodyLanguageScore');
  const avgAttire = getCategoryAvg('attireScore');
  const avgVoice = getCategoryAvg('voiceConfidenceScore');

  // Calculate Interview XP Credits: 100 XP per interview + bonus based on scores
  const totalCredits = totalInterviews > 0
    ? history.reduce((sum, h) => sum + 100 + Math.round((h.overallScore || 0) * 1.5), 0)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 40) return 'text-amber-700 border-amber-300 bg-amber-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none">
      {/* ── Top Bar ── */}
      <header className="bg-white/90 border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-sm shadow-sm text-white">
            🎯
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Candidate Profile & Analytics</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhase('landing')}
            className="text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Home
          </button>
          <button
            onClick={() => setPhase('setup')}
            className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            🚀 Start New Interview
          </button>
        </div>
      </header>

      {/* ── Main Profile Body ── */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-7 flex-1 text-left">
        {/* Profile Card Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-teal-700">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name || 'Candidate'}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 uppercase tracking-wider">
                  Verified Candidate
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(user?.name || '');
                    setEditEmail(user?.email || '');
                    setIsEditingProfile(true);
                  }}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-mono px-2 py-0.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>✏️ Edit</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email || 'guest@candidate.com'}</p>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditName(user?.name || '');
                setEditEmail(user?.email || '');
                setIsEditingProfile(true);
              }}
              className="text-xs text-teal-700 hover:text-teal-900 border border-teal-300 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm font-semibold"
            >
              <span>✏️ Change Email / Name</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                setPhase('landing');
              }}
              className="text-xs text-slate-600 hover:text-red-600 border border-slate-200 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* ── Key Metrics & XP Credits ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Average Overall Score</p>
            <p className="text-4xl font-black text-slate-900">{avgOverallScore}<span className="text-xs text-slate-400 font-normal">/100</span></p>
            <p className="text-[11px] text-slate-500 mt-1">Across all completed sessions</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Mock Interviews</p>
            <p className="text-4xl font-black text-teal-700">{totalInterviews}</p>
            <p className="text-[11px] text-slate-500 mt-1">Practice sessions finished</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Interview Readiness XP</p>
            <p className="text-4xl font-black text-amber-600">⚡ {totalCredits.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 mt-1">Credits earned from practice</p>
          </div>
        </div>

        {/* ── 4 Core Category Averages ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📈</span> Average Performance Across 4 Core Dimensions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { icon: '🧠', label: 'Aptitude & Logic', score: avgAptitude, color: 'text-blue-700' },
              { icon: '💻', label: 'Technical Depth', score: avgTechnical, color: 'text-purple-700' },
              { icon: '🤝', label: 'HR & Behavior', score: avgHR, color: 'text-emerald-700' },
              {
                icon: '👤',
                label: 'Presence & Comm.',
                score:
                  totalInterviews > 0
                    ? Math.round(
                        history.reduce(
                          (sum, h) =>
                            sum +
                            (h.report?.presenceScore !== undefined
                              ? h.report?.presenceScore
                              : Math.round(
                                  ((h.report?.bodyLanguageScore || 0) +
                                    (h.report?.attireScore || 0) +
                                    (h.report?.voiceConfidenceScore || 0)) /
                                    3
                                )),
                          0
                        ) / totalInterviews
                      )
                    : 0,
                color: 'text-teal-700',
              },
            ].map((d) => (
              <div key={d.label} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl block mb-1">{d.icon}</span>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{d.label}</p>
                <p className={`text-xl font-black mt-1 ${d.color}`}>{d.score}<span className="text-[10px] text-slate-400 font-normal">/100</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Historical Performance Trendlines & Topic Mastery ── */}
        <AnalyticsTrendSection
          history={history}
          currentReport={history.length > 0 ? history[history.length - 1].report : null}
          targetRole={history.length > 0 ? history[history.length - 1].targetRole : 'Software Engineer'}
        />

        {/* ── Complete Interview History Table ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>📜</span> All Completed Mock Interviews
            </h2>
            <div className="flex items-center gap-2">
              {totalInterviews > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShareReport(history[history.length - 1]);
                    setShowShareModal(true);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🛡️</span>
                  <span>Share Latest Scorecard</span>
                </button>
              )}
              <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {totalInterviews} Recorded
              </span>
            </div>
          </div>

          {totalInterviews === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl block mb-2 opacity-50">🎯</span>
              <p className="text-slate-800 font-semibold text-sm">No interviews completed yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-4">Start your first AI mock interview session to unlock your progress record.</p>
              <button
                onClick={() => setPhase('setup')}
                className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Start First Mock Interview →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <div
                  key={record.id || i}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-500/50 p-4 rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-sm"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{record.targetRole}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-300">
                        {record.difficultyLevel || 'Intermediate'} Level
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Evaluator Verdict:{' '}
                      <strong className="text-slate-900">{record.readinessLevel}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
                    <div className={`px-3.5 py-1.5 rounded-xl border text-center font-black text-sm ${getScoreColor(record.overallScore)}`}>
                      {record.overallScore}<span className="text-[10px] font-normal opacity-70">/100</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedShareReport(record);
                        setShowShareModal(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-teal-700 hover:text-teal-900 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                      title="Share / Download Social Scorecard"
                    >
                      <span>🛡️</span>
                      <span>Share Card</span>
                    </button>
                    <button
                      onClick={() => viewPastReport(record)}
                      className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      View Report →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Share Report Card Modal ── */}
      <ShareReportCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        report={selectedShareReport?.report || selectedShareReport}
        targetRole={selectedShareReport?.targetRole || 'Software Engineer'}
        companyTrack={selectedShareReport?.companyTrack || 'General'}
        difficultyLevel={selectedShareReport?.difficultyLevel || 'Intermediate'}
        user={user}
      />

      {/* ── Edit Profile Modal ── */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl rounded-3xl relative text-left">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Edit Profile Details</h2>
              <p className="text-xs text-slate-500 mt-1">Update your display name and registered email address.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Akshay Garg"
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                  Your Personal Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="your.real.email@gmail.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2">
                  <span>✅</span>
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-4 border-t border-slate-200 bg-white" />
    </div>
  );
}
