import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mockai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const { data } = await api.post('/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const analyzeResume = async (resumeText, targetRole) => {
  const { data } = await api.post('/analyze-resume', { resumeText, targetRole });
  return data;
};

export const optimizeResume = async ({ resumeText, targetRole, userDetails }) => {
  const { data } = await api.post('/optimize-resume', { resumeText, targetRole, userDetails });
  return data;
};

export const getQuestion = async ({
  resumeAnalysis,
  targetRole,
  round,
  questionIndex,
  previousQuestions,
  difficultyLevel,
  companyTrack,
  persona,
  jobDescription,
}) => {
  const { data } = await api.post('/get-question', {
    resumeAnalysis,
    targetRole,
    round,
    questionIndex,
    previousQuestions,
    difficultyLevel,
    companyTrack,
    persona,
    jobDescription,
  });
  return data;
};

export const getRapidFireQuestions = async ({ targetRole, domain }) => {
  const { data } = await api.post('/rapid-fire', { targetRole, domain });
  return data;
};

export const getFollowUpProbe = async ({
  question,
  candidateAnswer,
  targetRole,
  companyTrack,
  persona,
}) => {
  const { data } = await api.post('/followup-probe', {
    question,
    candidateAnswer,
    targetRole,
    companyTrack,
    persona,
  });
  return data;
};

export const getQuestionHint = async ({ question, round, targetRole, companyTrack }) => {
  const { data } = await api.post('/hint', { question, round, targetRole, companyTrack });
  return data;
};

export const generateDsaProblem = async ({ difficulty = 'Medium', category = 'Any' }) => {
  const { data } = await api.post('/dsa/generate', { difficulty, category }, { timeout: 35000 });
  return data;
};

export const generateBugHunterDrills = async () => {
  const { data } = await api.post('/bug-hunter/generate', {}, { timeout: 35000 });
  return data;
};

export const evaluateInterview = async ({
  resumeAnalysis,
  targetRole,
  allResponses,
  difficultyLevel,
  companyTrack,
  persona,
}) => {
  const { data } = await api.post(
    '/evaluate',
    {
      resumeAnalysis,
      targetRole,
      allResponses,
      difficultyLevel,
      companyTrack,
      persona,
    },
    { timeout: 120000 }
  );
  return data;
};

export const transcribeAudio = async (audioBase64, mimeType) => {
  const { data } = await api.post('/transcribe', { audioBase64, mimeType });
  return data;
};

// ── Salary Negotiation Simulator API ──
export const sendSalaryNegotiation = async ({
  targetRole,
  offerDetails,
  conversationHistory,
  candidateMessage,
}) => {
  const { data } = await api.post('/negotiate/counter', {
    targetRole,
    offerDetails,
    conversationHistory,
    candidateMessage,
  });
  return data;
};

// ── AI Interview Coach & Motivator API ──
export const sendCoachMessage = async ({
  coachPersona,
  candidateMessage,
  interviewContext,
}) => {
  const { data } = await api.post(
    '/coach/chat',
    {
      coachPersona,
      candidateMessage,
      interviewContext,
    },
    { timeout: 45000 }
  );
  return data;
};

// ── Auth & History APIs ──
export const signupUser = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const googleLoginUser = async ({ email, name, picture }) => {
  const { data } = await api.post('/auth/google-login', { email, name, picture });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const getInterviewHistory = async () => {
  const { data } = await api.get('/auth/history');
  return data;
};

export const saveInterviewHistory = async ({
  targetRole,
  difficultyLevel,
  companyTrack,
  report,
  allResponses,
}) => {
  const { data } = await api.post('/auth/save-history', {
    targetRole,
    difficultyLevel,
    companyTrack,
    report,
    allResponses,
  });
  return data;
};
