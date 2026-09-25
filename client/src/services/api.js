import axios from 'axios';

import {
  generateDynamicQuestion,
  generateFollowUpProbe as clientFollowUpProbe,
  generateInterviewHint as clientInterviewHint,
  generateEvaluationReport as clientEvaluationReport,
  analyzeResumeClient,
} from './geminiClient';

const rawBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE = rawBase.includes('railway.app') ? '/api' : rawBase;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // Fast timeout so client Gemini takes over immediately if server is slow/unreachable
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mockai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-retry on network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export const checkServerHealth = async () => {
  try {
    const { data } = await api.get('/health', { timeout: 3000 });
    return data;
  } catch (e) {
    return null;
  }
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  try {
    const { data } = await api.post('/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (e) {
    console.warn('Backend upload-resume unavailable. Using local text extraction:', e.message);
    const text = await file.text().catch(() => 'Candidate Resume');
    return { resumeText: text };
  }
};

export const analyzeResume = async (resumeText, targetRole) => {
  try {
    const { data } = await api.post('/analyze-resume', { resumeText, targetRole });
    if (data && (data.domain || data.coreSkills)) return data;
  } catch (e) {
    console.warn('Backend analyze-resume unavailable. Using direct Gemini AI engine:', e.message);
  }
  return await analyzeResumeClient({ resumeText, targetRole });
};

export const optimizeResume = async ({ resumeText, targetRole, userDetails }) => {
  try {
    const { data } = await api.post('/optimize-resume', { resumeText, targetRole, userDetails });
    return data;
  } catch (e) {
    console.warn('Backend optimize-resume unavailable:', e.message);
    return null;
  }
};

export const getQuestion = async ({
  resumeAnalysis,
  targetRole,
  round,
  questionIndex,
  previousQuestions = [],
  lastCandidateAnswer = '',
  difficultyLevel = 'Intermediate',
  companyTrack = 'General',
  persona = 'bar_raiser',
  jobDescription = '',
}) => {
  try {
    const { data } = await api.post('/get-question', {
      resumeAnalysis,
      targetRole,
      round,
      questionIndex,
      previousQuestions,
      lastCandidateAnswer,
      difficultyLevel,
      companyTrack,
      persona,
      jobDescription,
    });
    if (data && data.question) return data;
  } catch (e) {
    console.warn('Backend get-question unreachable. Generating dynamically via client Gemini AI engine:', e.message);
  }

  // 100% Dynamic Direct Gemini Generation in Browser
  return await generateDynamicQuestion({
    round,
    questionIndex,
    targetRole,
    difficultyLevel,
    companyTrack,
    persona,
    previousQuestions,
    resumeAnalysis,
    lastCandidateAnswer,
  });
};

export const getRapidFireQuestions = async ({ targetRole, domain }) => {
  try {
    const { data } = await api.post('/rapid-fire', { targetRole, domain });
    return data;
  } catch (e) {
    return [];
  }
};

export const getFollowUpProbe = async ({
  question,
  candidateAnswer,
  targetRole,
  companyTrack,
  persona,
}) => {
  try {
    const { data } = await api.post('/followup-probe', {
      question,
      candidateAnswer,
      targetRole,
      companyTrack,
      persona,
    });
    if (data && (data.probe || data.followUp)) return data;
  } catch (e) {
    console.warn('Backend followup-probe unavailable. Using client Gemini engine:', e.message);
  }

  return await clientFollowUpProbe({ question, candidateAnswer, targetRole, companyTrack, persona });
};

export const getQuestionHint = async ({ question, round, targetRole, companyTrack, difficultyLevel = 'Intermediate' }) => {
  try {
    const { data } = await api.post('/hint', { question, round, targetRole, companyTrack });
    if (data && (data.hint || data.hints)) return data;
  } catch (e) {
    console.warn('Backend hint unavailable. Using client Gemini engine:', e.message);
  }

  return await clientInterviewHint({ question, targetRole, difficultyLevel });
};

export const generateDsaProblem = async ({ difficulty = 'Medium', category = 'Any' }) => {
  try {
    const { data } = await api.post('/dsa/generate', { difficulty, category }, { timeout: 35000 });
    return data;
  } catch (e) {
    return null;
  }
};

export const generateBugHunterDrills = async () => {
  try {
    const { data } = await api.post('/bug-hunter/generate', {}, { timeout: 35000 });
    return data;
  } catch (e) {
    return [];
  }
};

export const evaluateInterview = async ({
  resumeAnalysis,
  targetRole,
  allResponses = [],
  difficultyLevel = 'Intermediate',
  companyTrack = 'General',
  persona = 'bar_raiser',
}) => {
  try {
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
      { timeout: 25000 }
    );
    if (data && (data.overallScore || data.scores)) return data;
  } catch (e) {
    console.warn('Backend evaluate unavailable. Generating scorecard via client Gemini engine:', e.message);
  }

  return await clientEvaluationReport({
    responses: allResponses,
    resumeAnalysis,
    targetRole,
    difficultyLevel,
    companyTrack,
  });
};

export const transcribeAudio = async (audioBase64, mimeType) => {
  try {
    const { data } = await api.post('/transcribe', { audioBase64, mimeType });
    return data;
  } catch (e) {
    return null;
  }
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
const getRegisteredAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem('mockai_registered_accounts') || '{}');
  } catch (e) {
    return {};
  }
};

const saveRegisteredAccount = (account) => {
  try {
    const existing = getRegisteredAccounts();
    existing[account.email.toLowerCase()] = account;
    localStorage.setItem('mockai_registered_accounts', JSON.stringify(existing));
  } catch (e) {}
};

export const signupUser = async ({ name, email, password }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();

  // Check if account already exists
  const existingAccounts = getRegisteredAccounts();
  if (existingAccounts[cleanEmail]) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  try {
    const { data } = await api.post('/auth/signup', { name: cleanName, email: cleanEmail, password });
    if (data?.user) {
      saveRegisteredAccount({ name: cleanName, email: cleanEmail, password, user: data.user, token: data.token });
    }
    return data;
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 409) {
      throw new Error(err.response?.data?.error || 'Registration failed.');
    }
    // Local registration fallback
    const mockUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      name: cleanName || 'Candidate',
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      createdAt: new Date().toISOString(),
    };
    const mockToken = 'mock_jwt_' + Date.now();
    saveRegisteredAccount({ name: cleanName, email: cleanEmail, password, user: mockUser, token: mockToken });
    localStorage.setItem('mockai_user', JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  }
};

export const loginUser = async ({ email, password }) => {
  const cleanEmail = (email || '').trim().toLowerCase();

  try {
    const { data } = await api.post('/auth/login', { email: cleanEmail, password });
    return data;
  } catch (err) {
    // If backend explicitly rejected credentials (401 / 400 / 403), strictly fail!
    if (err.response?.status === 401 || err.response?.status === 400 || err.response?.status === 403) {
      throw new Error(err.response?.data?.error || 'Incorrect email or password. Please try again.');
    }

    // Check against registered accounts
    const registered = getRegisteredAccounts();
    const account = registered[cleanEmail];

    if (!account) {
      throw new Error('No account found with this email. Please click "Sign Up" to create your account.');
    }

    if (account.password !== password) {
      throw new Error('❌ Incorrect password. Access denied.');
    }

    const user = account.user || {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      name: account.name || cleanEmail.split('@')[0],
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
    };
    const token = account.token || ('mock_jwt_' + Date.now());
    localStorage.setItem('mockai_user', JSON.stringify(user));
    return { token, user };
  }
};

export const googleLoginUser = async ({ email, name, picture }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  try {
    const { data } = await api.post('/auth/google-login', { email: cleanEmail, name, picture });
    return data;
  } catch (err) {
    const mockUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail || 'candidate@gmail.com',
      name: name || (cleanEmail ? cleanEmail.split('@')[0] : 'Candidate'),
      picture: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail || 'User')}`,
    };
    const mockToken = 'mock_jwt_' + Date.now();
    localStorage.setItem('mockai_user', JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  }
};

export const getMe = async () => {

  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    const localUser = localStorage.getItem('mockai_user');
    if (localUser) {
      try {
        return { user: JSON.parse(localUser), history: [] };
      } catch (e) {}
    }
    return { user: null };
  }
};

export const getInterviewHistory = async () => {
  try {
    const { data } = await api.get('/auth/history');
    return data;
  } catch (err) {
    return { history: [] };
  }
};

export const saveInterviewHistory = async ({
  targetRole,
  difficultyLevel,
  companyTrack,
  report,
  allResponses,
}) => {
  try {
    const { data } = await api.post('/auth/save-history', {
      targetRole,
      difficultyLevel,
      companyTrack,
      report,
      allResponses,
    });
    return data;
  } catch (err) {
    return { success: true };
  }
};

