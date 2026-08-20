const express = require('express');
const multer = require('multer');
const { parseFile } = require('../services/fileParser');
const { generateJSON } = require('../services/geminiService');
const { analyzeResumePrompt, atsOptimizerPrompt } = require('../prompts/templates');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed.'), false);
    }
  },
});

/**
 * POST /api/upload-resume
 * Accepts a PDF or DOCX file, extracts and returns the text.
 */
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const text = await parseFile(req.file.buffer, req.file.mimetype);
    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        error:
          'Could not extract enough text from this file. Please paste resume text or proceed with role only.',
      });
    }
    res.json({ resumeText: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/analyze-resume
 * Analyzes resume text (or generates a standard curriculum if resume is omitted).
 */
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!targetRole) {
      return res.status(400).json({ error: 'targetRole is required.' });
    }

    const effectiveResumeText =
      resumeText && resumeText.trim().length > 10
        ? resumeText.trim()
        : `Candidate applying for the position of "${targetRole}". Focus on standard core industry skills, best practices, tools, and technical problem-solving expected for this role.`;

    const prompt = analyzeResumePrompt(effectiveResumeText, targetRole);
    const analysis = await generateJSON(prompt);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/optimize-resume
 * Audits ATS compliance, computes ATS scores, checks keywords, and generates an optimized ATS resume.
 */
router.post('/optimize-resume', async (req, res) => {
  try {
    const { resumeText, targetRole, userDetails } = req.body;
    if (!targetRole) {
      return res.status(400).json({ error: 'targetRole is required.' });
    }

    const prompt = atsOptimizerPrompt(resumeText || '', targetRole, userDetails || {});
    const atsResult = await generateJSON(prompt);
    res.json(atsResult);
  } catch (err) {
    console.error('ATS Optimize error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
