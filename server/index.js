require('dotenv').config();

const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { chatLimiter, mythLimiter } = require('./middleware/rateLimiter');
const { validateChat, validateMythbust } = require('./middleware/validateInput');
const { executeGemmaQuery, executeMythBust } = require('./services/gemmaService');

// For Jest testing, mock NVIDIA_API_KEY if not already present
if (process.env.NODE_ENV === 'test') {
  process.env.NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || 'mock_nvidia_api_key_for_testing';
}

// Startup ENV validation block
if (!process.env.NVIDIA_API_KEY) {
  process.stderr.write('CRITICAL CONFIGURATION ERROR: NVIDIA_API_KEY is not configured in the environment.\n');
  process.exit(1);
}

const app = express();

// 1. ABSOLUTE FIRST MIDDLEWARE: Helmet & CSP
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://apis.google.com"],
    connectSrc: ["'self'", "https://firestore.googleapis.com"]
  }
}));

// 2. Dynamic CORS configuration
const whitelist = [
  'http://localhost:3000',
  'https://carbonsaathi-prod-98.web.app',
  'https://carbonsaathi-prod-98.firebaseapp.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin || 
      whitelist.includes(origin) || 
      origin.endsWith('.web.app') || 
      origin.endsWith('.firebaseapp.com')
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation.'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50kb' }));
app.set('trust proxy', 1);

// --- ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'operational', timestamp: Date.now() });
});

app.post('/api/chat',
  chatLimiter,
  validateChat,
  async (req, res, next) => {
    try {
      const { message, personaId } = req.body;
      const aiResponse = await executeGemmaQuery(message, personaId);
      res.status(200).json(aiResponse);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/mythbust',
  mythLimiter,
  validateMythbust,
  async (req, res, next) => {
    try {
      const { myth } = req.body;
      const aiResponse = await executeMythBust(myth);
      res.status(200).json(aiResponse);
    } catch (error) {
      next(error);
    }
  }
);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Requested endpoint does not exist.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.message === 'AI_TIMEOUT') {
    return res.status(504).json({ error: 'AI processing timeout exceeded.' });
  }

  if (err.message === 'CORS policy violation.') {
    return res.status(400).json({ error: 'CORS policy violation.' });
  }

  res.status(500).json({ error: 'Internal system operations failure.' });
});

// Export Express app for testing and Firebase Functions
module.exports = app;
module.exports.api = functions.https.onRequest(app);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`🚀 Server is awake and listening on port ${PORT}`);
  });
}

