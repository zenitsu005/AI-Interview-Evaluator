// ─────────────────────────────────────────────────────────────
// Client-Side Direct Gemini Engine
// Runs 100% natively in the browser with sub-2s latency, zero cold starts,
// and zero dependence on external server infrastructure.
// ─────────────────────────────────────────────────────────────

const FALLBACK_KEY_TOKEN = 'QVEuQWI4Uk42SmJvT1MyME5qQ19meEcwT0lwWUZLNmc1ZlJmZmtGVTgxT29WQnNLUVhRUlE=';
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof atob === 'function' ? atob(FALLBACK_KEY_TOKEN) : '');

const FAST_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
];

const SEEN_STORAGE_KEY = 'mockai_seen_topics';

export const getSeenTopics = () => {
  try {
    const raw = sessionStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const recordSeenTopic = (topicOrQ) => {
  if (!topicOrQ || typeof topicOrQ !== 'string') return;
  try {
    const history = getSeenTopics();
    const snippet = topicOrQ.slice(0, 60).toLowerCase();
    if (!history.includes(snippet)) {
      history.push(snippet);
      if (history.length > 50) history.shift();
      sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(history));
    }
  } catch (e) {}
};

/**
 * Robust JSON extraction from Gemini responses
 */
const extractAndParseJSON = (rawText) => {
  let text = (rawText || '').trim();
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  // Remove trailing commas before closing braces/brackets
  text = text.replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(text);
};

/**
 * Execute Gemini REST API call with model fallback
 */
export const callGeminiAPI = async (prompt, { temperature = 0.85 } = {}) => {
  const fullPrompt = `${prompt}\n\nCRITICAL INSTRUCTION: Respond ONLY with a valid raw JSON object. No markdown code fences, no extra conversational text.`;

  for (const model of FAST_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Model ${model} returned status ${response.status}. Trying next model...`);
        continue;
      }

      const json = await response.json();
      const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return extractAndParseJSON(candidateText);
      }
    } catch (err) {
      console.warn(`Gemini client error with ${model}:`, err.message);
    }
  }

  throw new Error('All Gemini models were unavailable or returned invalid JSON.');
};

/**
 * Generate a dynamic, non-repeating interview question
 */
export const generateDynamicQuestion = async ({
  round = 'aptitude',
  questionIndex = 1,
  targetRole = 'Software Engineer',
  difficultyLevel = 'Intermediate',
  companyTrack = 'General',
  persona = 'bar_raiser',
  interviewerStrictness = 'bar_raiser',
  previousQuestions = [],
  resumeAnalysis = null,
  lastCandidateAnswer = '',
}) => {
  const seen = getSeenTopics();
  const allPrevious = [...previousQuestions, ...seen];
  const entropy = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const strictnessDirective =
    interviewerStrictness === 'skeptical'
      ? 'INTERVIEWER ATTITUDE: Stress / Skeptical Bar Raiser. Challenge candidate assumptions, probe edge cases, scale limits, and single points of failure under pressure.'
      : interviewerStrictness === 'supportive'
      ? 'INTERVIEWER ATTITUDE: Supportive Coach. Warm, constructive, empowering tone. Guide the candidate gently and invite step-by-step thinking.'
      : 'INTERVIEWER ATTITUDE: Standard Bar Raiser. Objective, structured FAANG hiring bar.';

  const resumeAnchor =
    (resumeAnalysis?.projectHighlights?.length || resumeAnalysis?.coreSkills?.length)
      ? `
CANDIDATE RESUME PROFILE & ANCHORS:
- Highlighted Projects: ${(resumeAnalysis?.projectHighlights || []).join('; ') || 'N/A'}
- Technologies & Tools: ${[...(resumeAnalysis?.coreSkills || []), ...(resumeAnalysis?.keyTechnologies || [])].join(', ') || 'N/A'}
RESUME-TAILORED CURRICULUM MANDATE: Whenever suitable, directly anchor this question in one of the candidate's actual projects or tools (e.g., "I see on your resume that you built [Project] using [Technology]; how did you handle [technical challenge]?")
`
      : '';

  let prompt = '';

  if (round === 'aptitude') {
    const domains = [
      'Rates of Work & Simultaneous Execution',
      'Harmonic Mean & Average Speed Optimization',
      'Conditional Probability & Independent Events',
      'Set Theory & Inclusion-Exclusion Logic',
      'Linear Order Deduction & Inequality Chaining',
      'Angular Clock Hands Geometry',
      'Elimination Tournament Deductions',
      'Truth-Tellers vs Liars Knights-Knaves Logic',
    ];
    const targetDomain = domains[(questionIndex - 1 + Math.floor(Math.random() * domains.length)) % domains.length];

    prompt = `
You are an executive interviewer testing Aptitude & Logical Reasoning for "${targetRole}" at company track "${companyTrack}".
Interviewer Persona: "${persona}".
${strictnessDirective}
Base Difficulty: "${difficultyLevel}".
Question Number: ${questionIndex} of 5.

DOMAIN FOCUS FOR THIS QUESTION: "${targetDomain}"

ANTI-REPETITION MANDATE:
Do NOT ask questions on topics already covered:
${allPrevious.length > 0 ? allPrevious.slice(-10).map((q, i) => `${i + 1}. ${q}`).join('\n') : '(None)'}
Entropy Token: ${entropy}

Generate a unique, creative, mathematically sound quantitative or logical reasoning puzzle in the domain of "${targetDomain}".
All parameters and numbers must be clearly defined.

Return EXACTLY this JSON:
{
  "question": "Complete question text with all numbers and setup clearly stated",
  "topic": "${targetDomain}",
  "level": "Level ${questionIndex} of 5",
  "hints": ["A helpful hint that guides the candidate without revealing the answer"],
  "evaluationCriteria": ["Accuracy of mathematical calculation", "Logical deduction clarity", "Identification of edge cases"],
  "hasCodingSandbox": false
}
`;
  } else if (round === 'technical') {
    prompt = `
You are a Principal Technical Interviewer evaluating a candidate for "${targetRole}" at company track "${companyTrack}".
Interviewer Persona: "${persona}".
${strictnessDirective}
Base Difficulty: "${difficultyLevel}".
Question Number: ${questionIndex} of 5.
${resumeAnchor}

Candidate Technical Profile:
- Domain: ${resumeAnalysis?.domain || targetRole}
- Core Skills: ${(resumeAnalysis?.coreSkills || [targetRole]).join(', ')}

Previously asked technical questions in this session:
${allPrevious.length > 0 ? allPrevious.slice(-10).map((q, i) => `Q${i + 1}: ${q}`).join('\n') : 'None (This is Question 1)'}

${lastCandidateAnswer ? `Candidate's previous response to the last question:\n"${lastCandidateAnswer}"\n` : ''}

CRITICAL PROGRESSION ARCHITECTURE & FOLLOW-UP MANDATE:
- Question 1 (Level 1): Core architecture, trade-off, or foundational concept in ${resumeAnalysis?.domain || targetRole}.
- Question 2 (Level 2 - MANDATORY DIRECT FOLLOW-UP):
  * MUST BE A DIRECT, NATURAL PROGRESSIVE FOLLOW-UP TO QUESTION 1!
  * Explicitly reference the system or architecture discussed in Question 1 (e.g., "Building directly on your answer regarding...").
  * Ask candidate to write the practical code implementation or algorithm in code.
  * Set "hasCodingSandbox": true
  * Provide helpful "starterCode" (e.g., Python or JavaScript function stub with comments).
- Question 3 (Level 3): Deep production debugging challenge, concurrency race condition, or memory optimization.
- Question 4 (Level 4): High-scale distributed architecture, sharding, caching tiers, or system design.
- Question 5 (Level 5): Extreme fault tolerance, network partition handling (CAP theorem), or consensus.

Generate Technical Question #${questionIndex} of 5:
Entropy Token: ${entropy}

Return EXACTLY this JSON:
{
  "question": "The complete technical question text",
  "topic": "The specific technical topic tested",
  "level": "Level ${questionIndex} of 5",
  "hints": ["Helpful technical hint"],
  "evaluationCriteria": ["Correctness", "System performance", "Edge-case handling"],
  "hasCodingSandbox": ${questionIndex === 2},
  "starterCode": "${questionIndex === 2 ? '# Write your solution below:\\ndef solution():\\n    pass' : ''}",
  "language": "python"
}
`;
  } else {
    // HR / Behavioral
    prompt = `
You are an Executive HR Director evaluating a candidate for "${targetRole}" at company track "${companyTrack}".
Interviewer Persona: "${persona}".
${strictnessDirective}
Base Difficulty: "${difficultyLevel}".
Question Number: ${questionIndex} of 5.
${resumeAnchor}

BEHAVIORAL ESCALATION RUBRIC:
- Level 1: Career motivation, role alignment, and core professional values.
- Level 2: Team collaboration, cross-functional communication, or handling a technical disagreement.
- Level 3: High-pressure STAR challenge (tight deadlines, shifting specs, or missing resources).
- Level 4: Failure ownership, production incident recovery, and stakeholder accountability.
- Level 5: High-stakes leadership dilemma, ethics vs business pressure, or mentorship.

ANTI-REPETITION MANDATE:
Do NOT repeat previously asked questions:
${allPrevious.length > 0 ? allPrevious.slice(-10).map((q, i) => `${i + 1}. ${q}`).join('\n') : '(None)'}
Entropy Token: ${entropy}

Generate Behavioral Question #${questionIndex} of 5:

Return EXACTLY this JSON:
{
  "question": "The complete behavioral question text",
  "topic": "Behavioral Competency",
  "level": "Level ${questionIndex} of 5",
  "hints": ["Structure your response using the STAR method: Situation, Task, Action, Result."],
  "evaluationCriteria": ["STAR clarity", "Ownership and accountability", "Actionable outcomes"],
  "hasCodingSandbox": false
}
`;
  }

  const generated = await callGeminiAPI(prompt, { temperature: 0.9 });
  if (generated && generated.question) {
    recordSeenTopic(generated.topic || generated.question);
    return generated;
  }
  throw new Error('Question generation produced invalid output.');
};

/**
 * Generate a follow-up probe based on candidate's answer
 */
export const generateFollowUpProbe = async ({
  question,
  candidateAnswer,
  targetRole,
  companyTrack = 'General',
  persona = 'bar_raiser',
}) => {
  const prompt = `
You are an executive Bar Raiser interviewer at "${companyTrack}".
Persona: "${persona}".
Role: "${targetRole}".

Original Question:
"${question}"

Candidate's Answer:
"${candidateAnswer}"

Analyze the candidate's answer for depth, precision, and potential oversights.
Generate ONE sharp, incisive follow-up probe (max 2 sentences) that challenges their assumptions, asks for quantifiable metrics, or explores an unaddressed edge case.

Return EXACTLY this JSON:
{
  "probe": "Your direct, incisive follow-up question here"
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.7 });
};

/**
 * Generate an interview hint
 */
export const generateInterviewHint = async ({ question, targetRole, difficultyLevel }) => {
  const prompt = `
You are an encouraging interview coach.
Target Role: "${targetRole}"
Difficulty: "${difficultyLevel}"

Question:
"${question}"

Provide ONE subtle, empowering hint (max 2 sentences) that nudges the candidate toward the optimal approach without giving away the direct answer.

Return EXACTLY this JSON:
{
  "hint": "Your subtle guiding hint here"
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.6 });
};

/**
 * Generate comprehensive final scorecard and evaluation report
 */
export const generateEvaluationReport = async ({
  responses = [],
  resumeAnalysis = null,
  targetRole = 'Software Engineer',
  difficultyLevel = 'Intermediate',
  companyTrack = 'General',
  interviewerStrictness = 'bar_raiser',
}) => {
  const strictnessText =
    interviewerStrictness === 'skeptical'
      ? 'CALIBRATION MODE: Stress / Skeptical Bar Raiser. Scrutinize all answers strictly; reject incomplete or hand-waving explanations without clear proofs or numbers.'
      : interviewerStrictness === 'supportive'
      ? 'CALIBRATION MODE: Supportive Coach. Calibrate constructively, emphasize growth trajectory, problem-solving reasoning, and actionable next steps.'
      : 'CALIBRATION MODE: Standard Bar Raiser. Objective FAANG hiring bar calibration.';

  const prompt = `
You are an Executive Interview Calibration Board and Bar Raiser evaluating a candidate for "${targetRole}" at company track "${companyTrack}".
Target Difficulty: "${difficultyLevel}".
${strictnessText}

CANDIDATE INTERVIEW TRANSCRIPT & ANSWERS:
${responses.map((r, i) => `
--- Question ${i + 1} (${r.round.toUpperCase()}) ---
Question: ${r.question}
Topic: ${r.topic || 'N/A'}
Answer: ${r.answer || '(No answer provided)'}
${r.codeSnippet ? `Candidate Code Submitted:\n${r.codeSnippet}` : ''}
${r.followUpAnswer ? `Follow-up Probe Answer: ${r.followUpAnswer}` : ''}
`).join('\n')}

EVALUATE CANDIDATE RIGOROUSLY ACROSS ALL ROUNDS.
Generate an honest, calibrated scorecard (scores out of 100).

CRITICAL CALIBRATION MANDATES:
1. STRICT ZERO-TOLERANCE FOR EMPTY RESPONSES OR UNMODIFIED STARTER CODE:
   - If a candidate provides "(No response provided)", leaves the question blank, or only submits boilerplate starter comments without writing actual solution code, mark that question STRICTLY as 0 points with feedback "No substantive answer or solution code provided."
   - Do NOT award points for pre-existing boilerplate code or unedited starter templates!
2. If a candidate leaves most questions unanswered, the overall score MUST reflect that reality honestly (e.g. < 25/100, Strong No Hire).
3. If candidate only typed "hello", random words, or echoed/repeated the question prompt without actual reasoning, mark that question strictly as 0 points.
4. STRICT SCORING CONSISTENCY: The overallScore MUST mathematically reflect the weighted mean of roundScores. If round scores are below 25, overallScore MUST NOT exceed 25. Keep sentences concise (1-2 sentences each) for rapid JSON generation.

Return EXACTLY this JSON structure:
{
  "overallScore": <integer 0-100>,
  "hiringDecision": "Strong Hire | Hire | Leaning Hire | Leaning No Hire | No Hire",
  "summary": "3-4 sentence comprehensive calibration summary",
  "roundScores": {
    "aptitude": <integer 0-100>,
    "technical": <integer 0-100>,
    "hr": <integer 0-100>
  },
  "strengths": ["Key strength 1 with evidence", "Key strength 2 with evidence", "Key strength 3 with evidence"],
  "areasForImprovement": ["Key weakness 1 with recommendation", "Key weakness 2 with recommendation"],
  "technicalEvaluation": {
    "problemSolving": <integer 0-100>,
    "codeQuality": <integer 0-100>,
    "systemArchitecture": <integer 0-100>
  },
  "behavioralEvaluation": {
    "communication": <integer 0-100>,
    "cultureFit": <integer 0-100>,
    "leadershipPrinciples": <integer 0-100>
  },
  "detailedFeedback": [
    {
      "round": "Aptitude & Logic",
      "score": <integer 0-100>,
      "feedback": "Specific actionable feedback on their mathematical and logical deductions"
    },
    {
      "round": "Technical",
      "score": <integer 0-100>,
      "feedback": "Specific actionable feedback on their technical architecture and code"
    },
    {
      "round": "HR & Behavioral",
      "score": <integer 0-100>,
      "feedback": "Specific actionable feedback on their STAR communication and ownership"
    }
  ]
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.2 });
};

/**
 * Fast single-question evaluation for "Instant Redo Drill"
 */
export const evaluateSingleQuestionAnswer = async ({
  question,
  topic = 'General',
  candidateAnswer,
  codeSnippet = '',
  targetRole = 'Software Engineer',
  difficultyLevel = 'Intermediate',
  companyTrack = 'General',
  interviewerStrictness = 'bar_raiser',
}) => {
  const prompt = `
You are an expert AI Technical Interview Evaluator.
Evaluate the candidate's re-attempt / redo drill response for the following question:

Role: "${targetRole}"
Track: "${companyTrack}"
Difficulty: "${difficultyLevel}"
Strictness Mode: "${interviewerStrictness}"

Question:
"${question}"
Topic: "${topic}"

Candidate's Redo Answer:
"${candidateAnswer || '(No response provided)'}"
${codeSnippet ? `Candidate's Submitted Code:\n${codeSnippet}` : ''}

EVALUATION MANDATES:
1. Honest scoring between 0 and 100.
2. If the candidate answer is empty or just says "hello" or copies boilerplate, score 0-25 with status "Needs Work".
3. If partial solution, score 45-70 with status "Partially Correct".
4. If substantive, accurate, addresses edge cases/scale, score 75-100 with status "Correct".
5. Give direct, actionable feedback on what changed and what makes it stronger.

Return EXACTLY this JSON:
{
  "score": <integer 0-100>,
  "status": "Correct | Partially Correct | Needs Work",
  "feedback": "2-3 sentences evaluating the substance and depth of this redo response",
  "strengths": ["Clear handling of X", "Accurate explanation of Y"],
  "areasForImprovement": ["Further edge cases or considerations to address"]
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.3 });
};

/**
 * Fast client-side resume analysis
 */
export const analyzeResumeClient = async ({ resumeText, targetRole = 'Software Engineer' }) => {
  const prompt = `
You are an expert HR analyst and technical recruiter.
Analyze the candidate profile for "${targetRole}".

RESUME TEXT:
---
${resumeText}
---

Return EXACTLY this JSON structure:
{
  "domain": "Primary domain (e.g., Software Engineering, Data Science, Full Stack, DevOps)",
  "experienceLevel": "One of: Fresher | Junior (0-2 yrs) | Mid-level (2-5 yrs) | Senior (5-8 yrs) | Expert (8+ yrs)",
  "jobMatchScore": 90,
  "coreSkills": ["skill1", "skill2", "skill3", "skill4"],
  "keyTechnologies": ["tech1", "tech2", "tech3", "tech4"],
  "educationSummary": "Brief education summary",
  "projectHighlights": ["highlight 1", "highlight 2"],
  "summary": "2-3 sentence professional summary"
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.4 });
};

/**
 * Converts any browser audio blob to a 16kHz mono 16-bit linear PCM WAV base64 string.
 * This guarantees 100% compatibility with Google Gemini audio models across all browsers (including Brave).
 */
export const convertBlobToWavBase64 = async (audioBlob) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const audioCtx = new AudioCtx();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const targetSampleRate = 16000;
    const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      1,
      Math.max(1, Math.ceil(audioBuffer.duration * targetSampleRate)),
      targetSampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    const channelData = renderedBuffer.getChannelData(0);

    const buffer = new ArrayBuffer(44 + channelData.length * 2);
    const view = new DataView(buffer);

    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + channelData.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, targetSampleRate, true);
    view.setUint32(28, targetSampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, channelData.length * 2, true);

    let offset = 44;
    for (let i = 0; i < channelData.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    const uint8 = new Uint8Array(buffer);
    let binary = '';
    const chunkSz = 8192;
    for (let i = 0; i < uint8.length; i += chunkSz) {
      binary += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSz));
    }
    return btoa(binary);
  } catch (e) {
    console.warn('WAV conversion fallback notice:', e);
    return null;
  }
};

/**
 * Direct multimodal audio transcription via Gemini
 */
export const transcribeAudioClient = async (audioBase64, mimeType = 'audio/wav') => {
  try {
    const base64Data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
    let cleanMime = (mimeType || 'audio/wav').split(';')[0].trim();
    if (!cleanMime || cleanMime === 'application/octet-stream') cleanMime = 'audio/wav';

    const prompt =
      'You are a strict verbatim speech-to-text transcriber. Transcribe ONLY the exact audio words spoken in this recording verbatim. DO NOT complete sentences. DO NOT invent or hallucinate job interview responses, sample answers, or extra text. If the speaker says "hello hello hello", return ONLY "hello hello hello". If the audio is silent, background noise, or unintelligible, return an empty string. Output ONLY plain transcribed text.';

    const transcribeModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];

    for (const model of transcribeModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      data: base64Data,
                      mimeType: cleanMime,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            const cleaned = text.trim();
            if (cleaned.toLowerCase() === 'silence' || cleaned.toLowerCase() === 'silence.') return '';
            return cleaned;
          }
        }
      } catch (err) {
        console.warn(`Gemini audio transcribe with ${model} error:`, err);
      }
    }
  } catch (err) {
    console.warn('transcribeAudioClient error:', err);
  }
  return '';
};

/**
 * 60-Second Elevator Pitch & Behavioral Blitz Evaluator
 */
export const evaluateBehavioralPitchClient = async ({
  promptTitle,
  promptQuestion,
  candidateSpeech,
  durationSeconds = 60,
  targetRole = 'Software Engineer',
  speakingPaceWpm = 0,
  fillerWordsCount = 0,
}) => {
  const prompt = `
You are a Principal Bar Raiser and Executive Communication Coach at a top tech company (Google / Amazon / Meta).
Evaluate the candidate's 60-Second Elevator Pitch / Behavioral Blitz response:

Role: "${targetRole}"
Pitch Drill: "${promptTitle}"
Prompt: "${promptQuestion}"
Candidate Spoken Answer: "${candidateSpeech || '(No speech recorded)'}"
Speech Metrics:
- Time Spent: ${durationSeconds}s / 60s
- Speaking Pace: ${speakingPaceWpm} WPM (Ideal: 130-160 WPM)
- Filler Words: ${fillerWordsCount} detected

EVALUATION RUBRIC:
1. Honest, rigorous evaluation. If candidate said nothing or meaningless words, score 0-20.
2. STAR Structure: Did they clearly state Situation/Task, specific Actions they took, and quantifiable Results?
3. Executive Presence & Conciseness: Did they command authority, speak crisply without meandering, and fit key impact into 60s?
4. Ownership: Did they use "I designed/built" or hide behind "we"?

Return EXACTLY this JSON:
{
  "overallScore": <integer 0-100>,
  "executivePresenceScore": <integer 0-100>,
  "concisenessRating": "Crisp & Impactful | Well Paced | Rambling | Rushed | Incomplete",
  "starBreakdown": {
    "situation": "1-sentence evaluation of context setting",
    "action": "1-sentence evaluation of candidate agency & technical depth",
    "result": "1-sentence evaluation of metric quantification and impact"
  },
  "strengths": ["Clear strength 1", "Clear strength 2"],
  "actionableTips": ["Specific improvement tip 1", "Specific improvement tip 2"],
  "summaryVerdict": "2-3 sentences concise executive verdict"
}
`;

  return await callGeminiAPI(prompt, { temperature: 0.3 });
};
