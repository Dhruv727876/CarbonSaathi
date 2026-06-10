require('dotenv').config();

const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { chatLimiter, mythLimiter } = require('./middleware/rateLimiter');
const { validateChat, validateMythbust, validateEmissions } = require('./middleware/validateInput');
const { buildSystemPrompt } = require('./services/gemmaService');
const { callAI } = require('./services/aiService');

// For Jest testing, mock keys if not already present
if (process.env.NODE_ENV === 'test') {
  process.env.NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || 'mock_nvidia_api_key_for_testing';
  process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'mock_gemini_api_key_for_testing';
  process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'carbonsaathi-prod-98';
}

// Startup ENV validation block
const REQUIRED_VARS = ['GEMINI_API_KEY', 'FIREBASE_PROJECT_ID'];
REQUIRED_VARS.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing ${v}`);
    process.exit(1);
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
      const systemPrompt = buildSystemPrompt(personaId);
      const aiResponse = await callAI(systemPrompt, message);
      res.status(200).json(aiResponse);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error("Backend Error:", error.message);
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
      const systemPrompt = `IDENTITY: Your name is CarbonSaathi, India's personal climate action guide. You are a scientific Climate Myth-Buster.

KNOWLEDGE PILLARS:
1. Transport emissions (CEA grid data, India avg car emissions)
2. Home energy (India electricity emission factor: 0.82 kg CO₂/kWh)
3. Food & diet (beef vs plant-based emission comparisons)
4. Shopping & consumption habits
5. Carbon offset schemes available in India
6. Government schemes: PM Ujjwala, FAME, Solar Rooftop

HARD LIMITS (NEVER DO THESE):
- NEVER recommend specific brands or private companies.
- NEVER make financial promises or ROI guarantees.
- NEVER recommend specific political parties or candidates.
- NEVER invent environmental data.
- NEVER provide medical or legal advice.
- NEVER break the output format.
- ALWAYS cite MoEFCC or MNRE as the data source.

RESPONSE FORMAT (Strictly enforce this structure):
Prefix all structured breakdowns with: FOOTPRINT_ANALYSIS:
1. Myth Assessment: Explicitly state whether the claim is a MYTH or a FACT.
2. Scientific Reality: Provide bullet points with metric values.
3. Official Citation: State "Source: moef.gov.in" or "Source: mnre.gov.in".
4. Concrete Next Action: End the response with exactly ONE specific, measurable action the user can take today.`;

      const aiResponse = await callAI(systemPrompt, myth);
      res.status(200).json(aiResponse);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/emissions',
  validateEmissions,
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Requested endpoint does not exist.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Payload validation failed.' });
  }

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
      process.stdout.write(`Server listening on port ${PORT}\n`);
  });
}

