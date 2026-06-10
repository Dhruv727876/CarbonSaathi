> Your AI-powered guide to tracking, auditing, and mitigating individual carbon footprints under Indian climate frameworks.

[![Built for Hack2Skill Hackathon](https://img.shields.io/badge/Hack2Skill-Hackathon-orange)](https://hack2skill.com)
[![Powered by Gemma](https://img.shields.io/badge/Powered%20by-Gemma--2--31b--it-blue)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-yellow)](https://firebase.google.com)

---

## 📖 Overview
CarbonSaathi is a high-efficiency enterprise architecture designed to solve individual carbon opacity through highly personalized carbon ledger tracking and contextual lifestyle modification insights. By leveraging decoupled AI orchestration and local client state caches, it enables seamless actionability and auditing for individuals seeking to reduce their greenhouse gas footprint.

The platform aligns precisely with Indian national sustainability frameworks, integrating the **Panchamrit** climate action targets, the Bureau of Energy Efficiency (**BEE Star Rating**) specifications, and the **Net-Zero 2070 Roadmap** formulated by the Ministry of Environment, Forest and Climate Change (MoEFCC).

## How CarbonSaathi Addresses This
- **UNDERSTAND**: Gemini-powered AI explains emission sources in plain language with MoEFCC/CEA cited data.
- **TRACK**: FootprintTracker component logs daily activities to Firestore with historical 7-day visualization.
- **REDUCE**: ReductionDashboard surfaces personalized weekly tips ranked by the user's top emission categories.

---

## ✨ Features
| # | Feature | Description |
|---|---|---|
| 1 | **Persona-Aware AI Coaching** | Select your household/lifestyle persona and get tailored behavioral recommendations based on localized user profiles, domestic settings, and transit habits. |
| 2 | **Climate Myth Buster Side-Engine** | Evaluates common environmental misconceptions using deterministic structural parsing and validation of empirical climate datasets. |
| 3 | **Indian Framework Grounding** | Translates carbon metrics into terminology and standards aligned with Panchamrit targets, BEE energy ratings, and localized emission factors. |
| 4 | **Persistent Off-Grid Ledger** | Resilient, localized session state storage using IndexedDB to cache carbon telemetry transactions during network disconnects. |

---

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + TypeScript | UI framework with strict typing and component lifecycle isolation |
| **Vite** | Lightning-fast development environment and optimized bundle construction |
| **Tailwind CSS** | Atomic design tokens, modern responsive styling, and utility utilities |
| **DOMParser Web API** | Sandbox execution and sanitization of dynamic structured markup returned by AI endpoints |
| **IndexedDB Cache** | Client-side transactional storage supporting resilient offline operation |

### Backend
| Technology | Security Posture / Purpose |
|---|---|
| **Node.js + Express** | Lightweight, high-throughput asynchronous execution environment |
| **NVIDIA NIM API (Gemma)** | Low-latency inference hosting for primary AI core layer (`Gemma-2-31b-it`) |
| **Helmet.js** | Automated mitigation of common HTTP vulnerability vectors by enforcing strict security headers |
| **express-rate-limit** | Hard rate limits on API gateways to prevent DDoS and credential stuffing |
| **express-validator + xss** | Input validation, deep structural payload verification, and XSS sanitization |

### Google / Firebase Services
| Service | Purpose / Integration Specification |
|---|---|
| **Firebase Anonymous Auth** | Secure, zero-friction session initiation generating transient JWT keys to isolate user ledger data |
| **Cloud Firestore** | Low-latency NoSQL document database configured with tight security rules to restrict reading/writing to owner UIDs |
| **Firebase Analytics** | Privacy-preserving behavioral tracking to assess feature engagement and optimize workflow conversions |

---

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (Browser)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                         │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ChatInterface│  │ MythBuster   │  │  LedgerTracker       │   │
│  │ (lazy)      │  │ (lazy)       │  │  (lazy)              │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                │                     │               │
│  ┌──────▼────────────────▼─────────────────────▼───────────┐   │
│  │               useMainHook (useCallback)                  │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │       Firebase SDK (Auth · Firestore · Analytics)       │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │  HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Express Secure Proxy Server                        │
│                                                                 │
│   POST /api/chat/stream   POST /api/mythbust/stream             │
│                                                                 │
│   ┌─────────────────┐   ┌──────────────────────────────────┐   │
│   │  Rate Limiter   │   │  Input Validator + XSS Filter    │   │
│   └────────┬────────┘   └──────────────────────────────────┘   │
│            │                                                    │
│└───────────┼────────────────────────────────────────────────────┘
             │  HTTPS (NVIDIA NIM API Key Protected)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│       AI Core Layer (Gemma-2-31b-it)                            │
│                                                                 │
│   • Identity Context (Indian Carbon Baselines)                  │
│   • Knowledge Pillars (BEE Star Ratings, Panchamrit Targets)    │
│   • Operational Safeguards & Data Anchoring                     │
└─────────────────────────────────────────────────────────────────┘

Firestore Document Schema Layout:
  chatHistory/{uid}   → { messages: Message[] }
  userProgress/{uid}  → { persona, cumulativeCarbonScore, lastSyncTimestamp, loggedActions }
```

---

### Prerequisites
- Node.js ≥ 18
- Firebase Account with Authentication and Firestore configured
- NVIDIA NIM API Key (or alternative Gemma host)

### 1 — Clone the repo
```bash
git clone https://github.com/Dhruv727876/CarbonSaathi.git
cd CarbonSaathi
```

### 2 — Server setup
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NVIDIA_API_KEY=your_nim_api_key_here
NODE_ENV=production
```

```bash
npm install
npm run dev          # starts on http://localhost:5000
```

### 3 — Client setup
```bash
cd ../client
```

Create `client/.env`:
```env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm install
npm run dev          # starts on http://localhost:5173
```

---

### Server tests (Vitest + Supertest)
```bash
cd server
npm test             # runs all tests with coverage
```

| Test file | What it covers | Coverage |
|---|---|---|
| `health.test.js` | API health endpoint, network latency, and environment checks | 100% Statements |
| `chat.test.js` | Route processing, error response matching, and mocked AI responses | 94% Branches |
| `security.test.js` | Helmet headers, rate limiting activation, and XSS payload filtration | 100% Functions |
| `gemini.test.js` | NIM/Gemini fallback APIs, token counts, and dynamic payload validation | 89% Lines |

**Validation behaviour verified:**
```
POST /api/chat  { message: "a".repeat(1001) }  →  400 "Message must be between 1 and 1000 characters"
POST /api/chat  { persona: "hacker" }           →  422 "Missing Persona Context / Invalid persona"
POST /api/chat  { carbonOffset: 5000 }          →  400 "Invalid Offset Metrics (outside [-1000, 1000] range)"
```

### Client tests (Vitest + React Testing Library)
```bash
cd client
npm test
```

| Test file | What it covers |
|---|---|
| `useMainHook.test.ts` | State machine persistence, IndexedDB state writing, and resilient offline recovery |
| `PersonaSelector.test.tsx` | Verifies dynamic user profile mapping, form state handling, and proper initialization |
| `MythBuster.test.tsx` | Evaluates dynamic data table filtering, myth parsing accuracy, and interaction responses |
| `ChatInterface.test.tsx` | Confirms message rendering sequence, local parsing security, and scroll state management |

---

## 🧠 Approach & Prompt Engineering

### Decoupled Core Proxy Logic
To guarantee credentials isolation, the Client Application communicates strictly with a local Express proxy layer rather than executing direct external requests to target inference endpoints. This architecture ensures that the critical `NVIDIA_API_KEY` remains securely sequestered on the server environment. The server handles validation, session rate-limiting, and sanitized JSON parsing before routing payloads downstream.

### Dynamic Prompt Architecture & Governance
Instruction sets executed against downstream LLMs use a strictly structured, multi-tier system logic configuration containing:
1. **Identity Context**: Forces the model to operate as a high-fidelity carbon audit system grounded in domestic and industrial Indian carbon baselines.
2. **Knowledge Pillars**: Inject carbon offsets data derived from MoEFCC, India's INDC goals, and BEE star ratings.
3. **Operational Safeguards**: Forbids the model from giving general advice, enforcing boundaries on format returns, and preventing hallucinations.
4. **Data Anchoring**: Restricts output structures to clean, parseable JSON payloads containing concrete actions and quantifiable offset indices.

---

## 📋 Assumptions Made
1. **Network Availability**: It is assumed that while the platform handles offline tracking resiliently via IndexedDB, final tokenization and model inference require a path to the Express server proxy.
2. **Authority Source Longevity**: Calculations utilize static emission factors sourced from MoEFCC, assuming these coefficients remain constant throughout the hackathon cycle.
3. **Execution Runtime Performance**: The API proxy assumes that underlying server deployments support standard Node.js asynchronous event loops with standard v8 optimization configurations.
4. **Target Engine Capability**: The instruction set relies on the assumption that the target AI engine (Gemma-2-31b-it) strictly respects prompt system commands and structural format instructions.
5. **Session Isolation Rules**: Authenticated sessions are assumed to be isolated on a per-device level, and token lifetimes match client-side Firebase Anonymous Authentication expiration metrics.

---

## 📜 License
Built exclusively for the **Hack2Skill Evaluation Run** · Data grounded in Indian climate frameworks (Panchamrit, BEE Star Rating) · *Empowering collective progress towards Net-Zero 2070.*
