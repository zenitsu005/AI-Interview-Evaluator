const express = require('express');
const { generateJSON, transcribeAudio } = require('../services/geminiService');
const {
  aptitudeQuestionPrompt,
  technicalQuestionPrompt,
  hrQuestionPrompt,
  followUpProbePrompt,
  hintPrompt,
  rapidFirePrompt,
  dsaProblemPrompt,
  bugHunterPrompt,
  coachChatPrompt,
} = require('../prompts/templates');

const router = express.Router();

/**
 * POST /api/transcribe
 * Transcribes audio uploaded from client MediaRecorder.
 */
router.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }
    const text = await transcribeAudio(audioBase64, mimeType);
    res.json({ text });
  } catch (err) {
    console.error('Transcribe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/get-question
 * Returns the next interview question calibrated for difficulty level, company track, persona, and JD.
 */
router.post('/get-question', async (req, res) => {
  try {
    const {
      resumeAnalysis,
      targetRole,
      round,
      questionIndex,
      previousQuestions = [],
      difficultyLevel = 'Intermediate',
      companyTrack = 'General',
      persona = 'bar_raiser',
      jobDescription = '',
    } = req.body;

    const effectiveResumeAnalysis = resumeAnalysis || {
      targetRole: targetRole || 'Software Engineer',
      domainFocus: targetRole || 'Engineering',
      technicalSkills: [targetRole],
      strengths: ['Analytical problem solving', 'Clean modular design'],
      weaknesses: [],
    };

    if (!targetRole || !round || !questionIndex) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    let prompt;
    if (round === 'aptitude') {
      prompt = aptitudeQuestionPrompt(
        effectiveResumeAnalysis,

        targetRole,
        questionIndex,
        difficultyLevel,
        companyTrack,
        persona
      );
    } else if (round === 'technical') {
      prompt = technicalQuestionPrompt(
        effectiveResumeAnalysis,
        targetRole,
        questionIndex,
        previousQuestions,
        difficultyLevel,
        companyTrack,
        persona,
        jobDescription
      );
    } else if (round === 'hr') {
      prompt = hrQuestionPrompt(
        effectiveResumeAnalysis,
        targetRole,
        questionIndex,
        difficultyLevel,
        companyTrack,
        persona
      );
    }
 else {
      return res.status(400).json({ error: `Unknown round: ${round}` });
    }

    const question = await generateJSON(prompt);
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/followup-probe
 * Generates an adaptive senior cross-examination question probing the candidate's answer.
 */
router.post('/followup-probe', async (req, res) => {
  try {
    const { question, candidateAnswer, targetRole, companyTrack = 'General', persona = 'bar_raiser' } = req.body;

    if (!question || !candidateAnswer || !targetRole) {
      return res.status(400).json({ error: 'question, candidateAnswer, and targetRole are required.' });
    }

    const prompt = followUpProbePrompt(question, candidateAnswer, targetRole, companyTrack, persona);
    const result = await generateJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('Follow-up probe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/hint
 * Generates a Socratic hint for a candidate who is stuck on a question.
 */
router.post('/hint', async (req, res) => {
  try {
    const { question, round, targetRole, companyTrack = 'General' } = req.body;
    if (!question || !targetRole) {
      return res.status(400).json({ error: 'question and targetRole are required.' });
    }
    const prompt = hintPrompt(question, round || 'technical', targetRole, companyTrack);
    const result = await generateJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('Hint error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/rapid-fire
 * Generates 6 fast-paced 60-second warmup quiz questions.
 */
router.post('/rapid-fire', async (req, res) => {
  try {
    const { targetRole, domain } = req.body;
    const prompt = rapidFirePrompt(targetRole || 'Software Engineer', domain || 'Software Engineering');
    const result = await generateJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('Rapid fire error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/dsa/generate
 * Generates a fresh, dynamic Data Structures & Algorithms problem via Gemini.
 */
router.post('/dsa/generate', async (req, res) => {
  try {
    const { difficulty = 'Medium', category = 'Any' } = req.body;
    const prompt = dsaProblemPrompt(difficulty, category);
    const problem = await generateJSON(prompt);
    res.json(problem);
  } catch (err) {
    console.error('DSA generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/bug-hunter/generate
 * Dynamically generates a fresh 5-drill bug triage & security challenge.
 */
router.post('/bug-hunter/generate', async (req, res) => {
  try {
    const prompt = bugHunterPrompt();
    const data = await generateJSON(prompt);
    res.json(data);
  } catch (err) {
    console.error('Bug Hunter generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/coach/chat
 * Empathetic and tactical AI Coach chat session for candidates post-evaluation.
 */
router.post('/coach/chat', async (req, res) => {
  try {
    const { coachPersona, candidateMessage, interviewContext } = req.body;
    const prompt = coachChatPrompt(coachPersona, candidateMessage, interviewContext);
    const response = await generateJSON(prompt);
    res.json(response);
  } catch (err) {
    console.error('Coach chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
