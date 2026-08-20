const express = require('express');
const { generateJSON } = require('../services/geminiService');
const { evaluationPrompt } = require('../prompts/templates');

const router = express.Router();

/**
 * Mathematically validates and computes category scores directly from
 * question-by-question evaluation statuses, attire, voice confidence, and posture.
 */
const computeDeterministicScores = (report) => {
  const qEvals = report.questionEvaluations || [];

  if (qEvals.length > 0) {
    const calcCategory = (roundKey) => {
      const list = qEvals.filter((q) => (q.round || '').toLowerCase().includes(roundKey));
      if (list.length === 0) return 0;

      let totalPoints = 0;
      list.forEach((q) => {
        const s = (q.status || '').toLowerCase();
        if (s.includes('correct') && !s.includes('in') && !s.includes('not')) {
          totalPoints += 100;
        } else if (s.includes('partial')) {
          totalPoints += 50;
        }
      });

      return Math.round(totalPoints / list.length);
    };

    const aptScore = calcCategory('aptitude');
    const techScore = calcCategory('technical');
    const hrScore = calcCategory('hr');

    report.aptitudeScore = aptScore;
    report.technicalScore = techScore;
    report.hrScore = hrScore;

    // Fallback for presenceScore if individual keys were returned
    if (report.presenceScore === undefined) {
      const b = report.bodyLanguageScore || 0;
      const a = report.attireScore || 0;
      const v = report.voiceConfidenceScore || 0;
      report.presenceScore = Math.round((b + a + v) / 3);
      report.presenceFeedback = report.bodyLanguageFeedback || report.attireFeedback || report.voiceConfidenceFeedback;
    }

    const allWrong = aptScore === 0 && techScore === 0 && hrScore === 0;

    if (allWrong) {
      report.presenceScore = Math.min(report.presenceScore || 0, 10);
      report.overallScore = 0;
      report.readinessLevel = 'Not Ready';
    } else {
      const presenceScore = report.presenceScore || 0;

      // 4 Core Weights: Tech 45%, Aptitude 25%, HR 15%, Executive Presence 15%
      report.overallScore = Math.round(
        techScore * 0.45 +
        aptScore * 0.25 +
        hrScore * 0.15 +
        presenceScore * 0.15
      );

      if (report.overallScore >= 85) report.readinessLevel = 'Excellent';
      else if (report.overallScore >= 70) report.readinessLevel = 'Interview Ready';
      else if (report.overallScore >= 50) report.readinessLevel = 'Almost Ready';
      else if (report.overallScore >= 25) report.readinessLevel = 'Needs Improvement';
      else report.readinessLevel = 'Not Ready';
    }
  }

  return report;
};

/**
 * POST /api/evaluate
 * Evaluates all interview responses and returns a detailed performance report.
 */
router.post('/evaluate', async (req, res) => {
  try {
    const {
      resumeAnalysis,
      targetRole,
      allResponses,
      difficultyLevel = 'Intermediate',
      companyTrack = 'Amazon',
      persona = 'amazon',
    } = req.body;

    if (!resumeAnalysis || !targetRole || !allResponses) {
      return res.status(400).json({
        error: 'resumeAnalysis, targetRole, and allResponses are required.',
      });
    }

    const prompt = evaluationPrompt(
      resumeAnalysis,
      targetRole,
      allResponses,
      difficultyLevel,
      companyTrack,
      persona
    );

    let allImages = [];
    allResponses.forEach((r) => {
      if (r.frames && r.frames.length > 0) {
        allImages.push(r.frames[0]);
      }
    });
    // Send at most 2 lightweight sample frames for instant vision scoring
    if (allImages.length > 2) {
      allImages = [allImages[0], allImages[allImages.length - 1]];
    }

    const rawReport = await generateJSON(prompt, allImages);
    const calibratedReport = computeDeterministicScores(rawReport);

    res.json(calibratedReport);
  } catch (err) {
    console.error('Evaluation route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
