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
import AnimatedBackground from './components/ui/AnimatedBackground';
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
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 relative overflow-x-hidden selection:bg-teal-500 selection:text-black">
      {/* Universal Ambient Animated Background (Radar Grid, Aurora Light & Constellation Particles) */}
      <AnimatedBackground />

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
