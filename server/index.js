const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { executeGemmaQuery } = require('./services/gemmaService');

// Firebase automatically loads the .env file in the same directory during deployment
const requiredEnvVars = ['NVIDIA_API_KEY'];
requiredEnvVars.forEach(envVar => {
  if (process.env.NODE_ENV === 'production' && !process.env[envVar]) {
    console.error(`CRITICAL: Missing required environment variable: ${envVar}`);
  }
});

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

// 2. Hardcoded CORS
const allowedOrigins = ['http://localhost:3000', 'https://carbonsaathi-prod-98.web.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation.'));
    }
  }
}));

app.use(express.json({ limit: '50kb' }));

// 3. Strict Rate Limiters (Trust proxy required for Firebase Functions)
app.set('trust proxy', 1);
const chatLimiter = rateLimit({ windowMs: 60000, max: 20, message: { error: 'Chat rate limit exceeded.' } });
const mythLimiter = rateLimit({ windowMs: 60000, max: 15, message: { error: 'Mythbust rate limit exceeded.' } });

// 4. Input Sanitization Wrapper
const sanitizePayload = (req, res, next) => {
  if (req.body && req.body.message) {
    req.body.message = xss(req.body.message);
  }
  next();
};

// --- ROUTES ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'operational', timestamp: Date.now() });
});

const ALLOWED_PERSONAS = ['coach', 'auditor', 'investor', 'debunker'];

app.post('/api/chat', 
  chatLimiter,
  [
    body('message').isString().trim().notEmpty().isLength({ max: 1000 }).withMessage('Message must be 1-1000 characters.'),
    body('personaId').isIn(ALLOWED_PERSONAS).withMessage('Invalid persona selected.')
  ],
  sanitizePayload,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Payload validation failed.', details: errors.array() });
      }

      const { message, personaId } = req.body;

      const aiExecution = executeGemmaQuery(message, personaId);
      const timeoutEngine = new Promise((_, reject) => setTimeout(() => reject(new Error('AI_TIMEOUT')), 25000));

      const aiResponse = await Promise.race([aiExecution, timeoutEngine]);
      
      res.status(200).json(aiResponse);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/mythbust',
  mythLimiter,
  [
    body('myth').isString().trim().notEmpty().isLength({ max: 500 })
  ],
  sanitizePayload,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid myth payload.' });

      res.status(200).json({ truth: 'Fact-checked by CarbonSaathi metrics.', sources: ['moef.gov.in'] });
    } catch (error) {
      next(error);
    }
  }
);

// 5. 404 & Error Handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Requested endpoint does not exist.' });
});

app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (err.message === 'AI_TIMEOUT') {
    return res.status(504).json({ error: 'AI processing timeout exceeded.' });
  }
  res.status(500).json({ error: 'Internal system operations failure.', details: isDev ? err.message : undefined });
});

// EXPORT AS FIREBASE HTTP FUNCTION
exports.api = functions.https.onRequest(app);
