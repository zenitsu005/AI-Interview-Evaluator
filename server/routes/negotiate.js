const express = require('express');
const { generateJSON } = require('../services/geminiService');
const { salaryNegotiationPrompt } = require('../prompts/templates');

const router = express.Router();

/**
 * POST /api/negotiate/counter
 * Simulates salary negotiation with an AI Talent Acquisition Executive.
 */
router.post('/counter', async (req, res) => {
  try {
    const { targetRole, offerDetails, conversationHistory, candidateMessage } = req.body;

    if (!targetRole || !candidateMessage) {
      return res.status(400).json({ error: 'targetRole and candidateMessage are required.' });
    }

    const prompt = salaryNegotiationPrompt(
      targetRole,
      offerDetails || { base: 115000, bonus: 10, equity: 30000, signing: 5000 },
      conversationHistory || [],
      candidateMessage
    );

    const result = await generateJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('Salary negotiation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
