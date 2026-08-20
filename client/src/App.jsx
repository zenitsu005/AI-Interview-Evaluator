import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import LandingPage from './components/LandingPage';
import ResumeSetup from './components/ResumeSetup';
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

const AppContent = () => {
  const { phase, interviewMode } = useInterview();
  const isInterviewing = phase === 'interview' || phase === 'evaluating';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {phase === 'landing' && <LandingPage />}
        {phase === 'setup' && <ResumeSetup />}
        {phase === 'analysis' && <AnalysisCard />}
        {phase === 'profile' && <ProfilePage />}
        {phase === 'resume-builder' && <ResumeOptimizer />}
        {phase === 'negotiate' && <SalaryNegotiator />}
        {phase === 'blitz' && <RapidFireBlitz />}
        {phase === 'dsa' && <DsaPractice />}
        {phase === 'bug-hunter' && <BugHunterMode />}
        {phase === 'hype-lab' && <PreInterviewHypeLab />}
        {isInterviewing && interviewMode === 'video' && <VideoInterview />}
        {isInterviewing && interviewMode === 'text' && <InterviewChat />}
        {phase === 'report' && <ReportPanel />}
      </div>

      {/* Global Modals */}
      <AuthModal />
      <HistoryModal />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  </AuthProvider>
);

export default App;
