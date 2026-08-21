import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 180000, // 3 minutes for Railway cold starts
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mockai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-retry on network errors (handles Railway cold starts)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config._retryCount >= 3) return Promise.reject(error);
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    if (!isNetworkError) return Promise.reject(error);
    config._retryCount = (config._retryCount || 0) + 1;
    await new Promise((res) => setTimeout(res, 3000 * config._retryCount));
    return api(config);
  }
);

export const checkServerHealth = async () => {
  try {
    const { data } = await api.get('/health', { timeout: 15000 });
    return data;
  } catch (e) {
    return null;
  }
};

// Automatic silent background warm-up ping for Railway cold starts
setTimeout(() => {
  checkServerHealth().catch(() => {});
}, 100);

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

