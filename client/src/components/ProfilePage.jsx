import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import ShareReportCardModal from './ShareReportCardModal';
import AnalyticsTrendSection from './AnalyticsTrendSection';
import AppNavbar from './AppNavbar';
import {
  TbUser as User,
  TbEdit as Edit3,
  TbLogout as LogOut,
  TbTrophy as Trophy,
  TbBolt as Zap,
  TbBrain as Brain,
  TbCode as Code2,
  TbUsers as Users,
  TbSparkles as Sparkles,
  TbShare as Share2,
  TbFileText as FileText,
  TbArrowRight as ArrowRight,
  TbCircleCheck as CheckCircle2,
  TbX as X,
  TbChevronRight as ChevronRight,
  TbTrendingUp as TrendingUp,
  TbAward as Award,
} from 'react-icons/tb';

export default function ProfilePage() {
  const { user, history: authHistory, logout, updateUserProfile } = useAuth();
  const { viewPastReport, setPhase } = useInterview();
  const history = Array.isArray(authHistory) ? authHistory : [];
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
    if (score >= 70) return 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60';
    if (score >= 40) return 'text-amber-300 border-amber-500/40 bg-amber-950/60';
    return 'text-rose-300 border-rose-500/40 bg-rose-950/60';
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Universal Top Bar */}
      <AppNavbar currentActive="profile" />

      {/* Main Profile Body */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-7 flex-1 text-left">
        {/* Profile Card Header */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-xl shadow-teal-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0D111A] rounded-2xl flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-teal-400 font-mono">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name || 'Candidate'}</h1>
                <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 uppercase tracking-wider font-mono">
                  Verified Candidate
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(user?.name || '');
                    setEditEmail(user?.email || '');
                    setIsEditingProfile(true);
                  }}
                  className="text-[11px] text-teal-400 hover:text-teal-300 font-mono px-2.5 py-0.5 rounded-lg border border-teal-500/30 bg-teal-950/40 hover:bg-teal-950/80 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">{user?.email || 'guest@candidate.com'}</p>
              <p className="text-[11px] text-slate-500 mt-1">
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
              className="text-xs text-teal-300 hover:text-white border border-white/10 bg-[#171E2D] hover:bg-[#1E273A] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-400" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                setPhase('landing');
              }}
              className="text-xs text-slate-300 hover:text-rose-400 border border-white/10 bg-[#171E2D] hover:bg-rose-950/30 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Key Metrics & XP Credits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Average Overall Score</p>
            <p className="text-4xl font-black text-white font-mono">{avgOverallScore}<span className="text-xs text-slate-500 font-normal">/100</span></p>
            <p className="text-[11px] text-slate-500 mt-1">Across all completed sessions</p>
          </div>

          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Total Mock Interviews</p>
            <p className="text-4xl font-black text-teal-400 font-mono">{totalInterviews}</p>
            <p className="text-[11px] text-slate-500 mt-1">Practice sessions finished</p>
          </div>

          <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Interview Readiness XP</p>
            <p className="text-4xl font-black text-amber-400 font-mono flex items-center justify-center gap-1.5">
              <Zap className="w-7 h-7 text-amber-400 fill-amber-400" />
              <span>{totalCredits.toLocaleString()}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Credits earned from practice</p>
          </div>
        </div>

        {/* 4 Core Category Averages */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4" /> Average Performance Across 4 Core Dimensions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { icon: Brain, label: 'Aptitude & Logic', score: avgAptitude, color: 'text-cyan-400' },
              { icon: Code2, label: 'Technical Depth', score: avgTechnical, color: 'text-purple-400' },
              { icon: Users, label: 'HR & Behavior', score: avgHR, color: 'text-emerald-400' },
              {
                icon: User,
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
                color: 'text-teal-400',
              },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="bg-[#0D111A] p-4 rounded-2xl border border-white/5 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${d.color}`} />
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">{d.label}</p>
                  <p className={`text-xl font-black mt-1 font-mono ${d.color}`}>{d.score}<span className="text-[10px] text-slate-500 font-normal">/100</span></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historical Performance Trendlines & Topic Mastery */}
        <AnalyticsTrendSection
          history={history}
          currentReport={history.length > 0 ? history[history.length - 1].report : null}
          targetRole={history.length > 0 ? history[history.length - 1].targetRole : 'Software Engineer'}
        />

        {/* Complete Interview History Table */}
        <div className="bg-[#131823] border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>All Completed Mock Interviews</span>
            </h2>
            <div className="flex items-center gap-2">
              {totalInterviews > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShareReport(history[history.length - 1]);
                    setShowShareModal(true);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>Share Latest Scorecard</span>
                </button>
              )}
              <span className="text-xs text-slate-400 font-mono bg-[#0D111A] px-3 py-1.5 rounded-xl border border-white/5">
                {totalInterviews} Recorded
              </span>
            </div>
          </div>

          {totalInterviews === 0 ? (
            <div className="text-center py-10">
              <Trophy className="w-12 h-12 text-teal-400/40 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm">No interviews completed yet</p>
              <p className="text-slate-400 text-xs mt-1 mb-4">Start your first AI mock interview session to unlock your progress record.</p>
              <button
                onClick={() => setPhase('setup')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                Start First Mock Interview →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <div
                  key={record.id || i}
                  className="bg-[#0D111A] hover:bg-[#171E2D] border border-white/5 hover:border-teal-500/40 p-4 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-md"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{record.targetRole}</span>
                      <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#131823] text-teal-300 border border-teal-500/30">
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

                    <p className="text-xs text-slate-400">
                      Evaluator Verdict:{' '}
                      <strong className="text-teal-300 font-mono">{record.readinessLevel}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
                    <div className={`px-3.5 py-1.5 rounded-xl border text-center font-black font-mono text-sm ${getScoreColor(record.overallScore)}`}>
                      {record.overallScore}<span className="text-[10px] font-normal opacity-70">/100</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedShareReport(record);
                        setShowShareModal(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-[#171E2D] hover:bg-[#1E273A] border border-white/10 text-teal-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Share / Download Social Scorecard"
                    >
                      <Share2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Share Card</span>
                    </button>
                    <button
                      onClick={() => viewPastReport(record)}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 hover:from-teal-400 hover:to-emerald-300 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Share Report Card Modal */}
      <ShareReportCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        report={selectedShareReport?.report || selectedShareReport}
        targetRole={selectedShareReport?.targetRole || 'Software Engineer'}
        companyTrack={selectedShareReport?.companyTrack || 'General'}
        difficultyLevel={selectedShareReport?.difficultyLevel || 'Intermediate'}
        user={user}
      />

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="bg-[#131823] border border-white/10 max-w-md w-full p-6 sm:p-8 shadow-2xl rounded-3xl relative text-left">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center bg-[#171E2D] hover:bg-[#1E273A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-white">Edit Profile Details</h2>
              <p className="text-xs text-slate-400 mt-1">Update your display name and registered email address.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Akshay Garg"
                  required
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Your Personal Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="your.real.email@gmail.com"
                  required
                  className="w-full bg-[#0D111A] border border-white/10 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none shadow-inner"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 bg-[#171E2D] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-4 border-t border-white/10 bg-[#0E121B]" />
    </div>
  );
}
