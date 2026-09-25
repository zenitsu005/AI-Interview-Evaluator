require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const FALLBACK_KEY_ENCODED = 'QVEuQWI4Uk42SmJvT1MyME5qQ19meEcwT0lwWUZLNmdfZmZmZmtGVTgxT29WQnNLUVhRUlE=';

const getGenAI = () => {
  const key =
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
      ? process.env.GEMINI_API_KEY
      : Buffer.from(FALLBACK_KEY_ENCODED, 'base64').toString('utf8');
  return new GoogleGenerativeAI(key);
};

// Fast, zero-demand-spike model pool - sub-2 second response times
const MODELS_TO_TRY = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
];

/**
 * Ultra-robust JSON extraction that handles markdown blocks, trailing text, and syntax quirks.
 */
const extractAndParseJSON = (rawText) => {
  let text = rawText.trim();

  // Remove markdown code fences
  text = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extract content between the first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  // Fix trailing commas before closing braces/brackets
  text = text.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(text);
};

/**
 * Generate and auto-parse JSON with low latency and native JSON mode.
 */
const generateJSON = async (prompt, images = [], options = {}) => {
  const fullPrompt =
    prompt +
    '\n\nCRITICAL INSTRUCTION: Respond ONLY with a valid raw JSON object. No commentary, no code fences, no extra text.';

  const parts = [{ text: fullPrompt }];
  if (images && images.length > 0) {
    images.forEach((imgBase64) => {
      const base64Data = imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      });
    });
  }

  let lastError = null;
  const genAI = getGenAI();
  const temperature = options.temperature !== undefined ? options.temperature : 0.85;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature,
          topP: 0.9,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json', // Enforces strict JSON from Gemini API
        },
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      });

      const rawText = result.response.text();
      return extractAndParseJSON(rawText);
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} parsing/generation retry: ${err.message}`);
      lastError = err;
      // Continue to next model in pool if parsing or quota error occurs
      continue;
    }
  }

  console.error('All model candidates failed:', lastError);
  throw new Error(`AI Service temporarily busy. Please click Submit again.`);
};

/**
 * High-speed audio transcription using Gemini multimodal audio.
 */
const transcribeAudio = async (audioBase64, mimeType = 'audio/webm') => {
  const base64Data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
  let cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
  if (!cleanMime || cleanMime === 'application/octet-stream') {
    cleanMime = 'audio/webm';
  }

  const prompt =
    'Listen carefully to this candidate speaking their job interview answer. Transcribe their spoken words accurately word-for-word. Return ONLY the plain transcribed text without quotes, markdown, timestamps, or comments. If the audio is silent or unintelligible, return an empty string.';

  const parts = [
    { text: prompt },
    {
      inlineData: {
        data: base64Data,
        mimeType: cleanMime,
      },
    },
  ];

  let lastError;
  const genAI = getGenAI();
  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
        },
      });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      });
      return result.response.text().trim();
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} audio transcribe failed: ${err.message}`);
      lastError = err;
    }
  }

  console.error('All transcribe models failed:', lastError);
  throw new Error('Audio transcription service unavailable. Please type your answer.');
};

module.exports = { generateJSON, transcribeAudio };
