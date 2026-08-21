import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import InterviewSetup from './components/InterviewSetup';
import AnalysisCard from './components/AnalysisCard';
import InterviewChat from './components/InterviewChat';
import VideoInterview from './components/VideoInterview';
import ReportPanel from './components/ReportPanel';
import ProfilePage from './components/ProfilePage';
import ResumeOptimizer from './components/ResumeOptimizer';
import SalaryNegotiator from './components/SalaryNegotiator';
import RapidFireBlitz from './components/RapidFireBlitz';
import DsaPractice from './components/DsaPractice';
import BugHunterMode from './components/BugHunterMode';
import PreInterviewHypeLab from './components/PreInterviewHypeLab';
import AuthModal from './components/AuthModal';
import HistoryModal from './components/HistoryModal';
import {
  HowItWorksPage,
  PrivacyPage,
  TermsPage,
  SecurityPage,
  AccessibilityPage,
  SupportPage,
  AnalyticsPage,
} from './components/StaticPages';

const AppContent = () => {
  const { phase, setPhase, interviewMode } = useInterview();
  const isInterviewing =
    phase === 'interview' ||
    phase === 'evaluating' ||
    phase === 'video' ||
    phase === 'text';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {phase === 'landing' && <LandingPage onNavigate={setPhase} />}
        {phase === 'setup' && <InterviewSetup onNavigate={setPhase} />}
        {phase === 'analysis' && <AnalysisCard />}
        {phase === 'profile' && <ProfilePage />}
        {(phase === 'resume-builder' || phase === 'resume') && <ResumeOptimizer />}
        {(phase === 'negotiate' || phase === 'salary') && <SalaryNegotiator />}
        {phase === 'blitz' && <RapidFireBlitz />}
        {phase === 'dsa' && <DsaPractice />}
        {phase === 'bug-hunter' && <BugHunterMode />}
        {(phase === 'anxiety-prep' || phase === 'hype-lab') && <PreInterviewHypeLab />}
        {phase === 'how-it-works' && <HowItWorksPage onNavigate={setPhase} />}
        {phase === 'privacy' && <PrivacyPage onNavigate={setPhase} />}
        {phase === 'terms' && <TermsPage onNavigate={setPhase} />}
        {phase === 'security' && <SecurityPage onNavigate={setPhase} />}
        {phase === 'accessibility' && <AccessibilityPage onNavigate={setPhase} />}
        {phase === 'support' && <SupportPage onNavigate={setPhase} />}
        {phase === 'analytics' && <AnalyticsPage onNavigate={setPhase} />}
        {isInterviewing && (interviewMode === 'text' ? <InterviewChat /> : <VideoInterview />)}
        {phase === 'report' && <ReportPanel />}
      </div>

      {/* Global Modals */}
      <AuthModal />
      <HistoryModal />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <InterviewProvider>
        <AppContent />
      </InterviewProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
