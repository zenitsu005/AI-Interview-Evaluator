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

/**
 * POST /api/auth/signup
 */
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();

    if (users.find((u) => u.email === cleanEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
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
    const users = getUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const userSafe = { id: user.id, name: user.name, email: user.email, picture: user.picture, createdAt: user.createdAt };
    res.json({ user: userSafe, token: `token_${user.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/google-login
 * One-click Google Authentication
 */
router.post('/google-login', (req, res) => {
  try {
    const { email, name, picture } = req.body;
    const cleanEmail = (email || 'google.user@gmail.com').toLowerCase().trim();
    const userName = name || cleanEmail.split('@')[0] || 'Google User';
    const userPic = picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

    const users = getUsers();
    let user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: userName,
        email: cleanEmail,
        passwordHash: 'google_auth_oauth2',
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
