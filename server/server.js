require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const evaluateRoutes = require('./routes/evaluate');
const authRoutes = require('./routes/auth');
const negotiateRoutes = require('./routes/negotiate');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS: supports localhost as well as production deployed URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api', resumeRoutes);
app.use('/api', interviewRoutes);
app.use('/api', evaluateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/negotiate', negotiateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock Interview API is running 🚀' });
});

// Production Static Serving (Single-Service Deployment support)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Interview Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set. Please create a .env file from .env.example');
  }
});
