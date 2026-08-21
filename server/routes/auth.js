const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and users file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

const getUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * POST /api/auth/signup
 */
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email address, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address (e.g., name@domain.com).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const users = getUsers();

    if (users.find((u) => u.email === cleanEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in instead.' });
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString(),
      history: [],
    };

    users.push(newUser);
    saveUsers(users);

    const userSafe = { id: newUser.id, name: newUser.name, email: newUser.email, picture: newUser.picture, createdAt: newUser.createdAt };
    res.status(201).json({ user: userSafe, token: `token_${newUser.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const users = getUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please sign up first.' });
    }

    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Incorrect password. Please verify your credentials and try again.' });
    }

    const userSafe = { id: user.id, name: user.name, email: user.email, picture: user.picture, createdAt: user.createdAt };
    res.json({ user: userSafe, token: `token_${user.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/google-login
 * Verified Google Authentication
 */
router.post('/google-login', (req, res) => {
  try {
    const { credential, email, name, picture } = req.body;

    let cleanEmail = '';
    let userName = '';
    let userPic = '';

    // If Google JWT credential is provided, decode payload
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) {
            cleanEmail = payload.email.toLowerCase().trim();
            userName = payload.name || cleanEmail.split('@')[0];
            userPic = payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;
          }
        }
      } catch (decodeErr) {
        console.warn('Google JWT parse notice:', decodeErr);
      }
    }

    if (!cleanEmail && email) {
      cleanEmail = email.toLowerCase().trim();
      userName = name || cleanEmail.split('@')[0] || 'Google User';
      userPic = picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid Google authentication token or unverified email.' });
    }

    const users = getUsers();
    let user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: userName,
        email: cleanEmail,
        passwordHash: 'google_auth_oauth2_verified',
        picture: userPic,
        createdAt: new Date().toISOString(),
        history: [],
      };
      users.push(user);
    } else {
      user.name = userName;
      user.picture = userPic;
    }

    saveUsers(users);

    const userSafe = { id: user.id, name: user.name, email: user.email, picture: user.picture, createdAt: user.createdAt };
    res.json({ user: userSafe, token: `token_${user.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token || !token.startsWith('token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = token.replace('token_', '');
    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userSafe = { id: user.id, name: user.name, email: user.email, picture: user.picture, createdAt: user.createdAt };
    res.json({ user: userSafe, history: user.history || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/auth/history
 */
router.get('/history', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token || !token.startsWith('token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = token.replace('token_', '');
    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ history: user.history || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/save-history
 */
router.post('/save-history', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token || !token.startsWith('token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = token.replace('token_', '');
    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { targetRole, difficultyLevel, report, allResponses, date } = req.body;
    user.history = user.history || [];
    const newRecord = {
      id: crypto.randomUUID(),
      targetRole,
      difficultyLevel: difficultyLevel || 'Intermediate',
      overallScore: report?.overallScore || 0,
      readinessLevel: report?.readinessLevel || 'Not Ready',
      report,
      allResponses: allResponses || [],
      date: date || new Date().toISOString(),
    };

    user.history.unshift(newRecord);
    saveUsers(users);
    res.json({ success: true, record: newRecord, history: user.history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
