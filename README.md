# CarbonSaathi: AI-Driven Carbon Ledger & Lifestyle Redesign Engine

CarbonSaathi is a high-efficiency enterprise architecture designed to solve the foundational crisis of tracking individual carbon footprints. The solution maps directly to the core challenge: helping individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **AI Core:** Gemini 2.0 Flash (Proxied, Search Grounded)
- **Database & Identity:** Firebase Auth, Firestore DB, Firebase Analytics
- **Testing Engine:** Jest, Supertest, React Testing Library
- **Deployment Spec:** Firebase Hosting & Render Engine

## Google Services Used
- `firebase/auth`: Anonymous authentication for baseline synchronization.
- `firebase/firestore`: Highly organized document mapping tracking metrics and chats.
- `firebase/analytics`: Micro-interaction monitoring via customized logged events.

## Architectural Flow

```
+-------------------------------------------------------------------------+
|                          CLIENT APPLICATION                             |
|  [React + TS + Tailwind]                                                |
|  - UI View Layer (Lazy components wrapped in Suspense & ErrorBoundary)  |
|  - Local State & Custom Debounced Hooks (Main UI state orchestration)   |
|  - Firebase SDK Layer: Auth (Anonymous session tracking)                |
|                        Firestore (Client offline cache, user progress)  |
|                        Analytics (logEvent triggering micro-metrics)    |
+------------------------------------+------------------------------------+
                                     |
                      REST API (HTTPS + Secure Headers)
                                     v
+-------------------------------------------------------------------------+
|                       EXPRESS SECURE PROXY SERVER                       |
|  [Node.js + Express on Render]                                          |
|  - Middleware Hardening Layer (Helmet CSP + XSS clean + rateLimiter)     |
|  - Payload Validation Guard (validateInput - rejects string >1000 chars) |
|  - Security Fallback Layer (Global 404 & async try-catch error handles) |
+------------------------------------+------------------------------------+
                                     |
                        Server-to-Server SDK / HTTPS
                                     v
+-------------------------------------------------------------------------+
|                            AI CORE LAYER                                |
|  [Gemini 2.0 Flash API Engine]                                          |
|  - Promise.race Engine (Enforces hard 25s execution timeout boundary)    |
|  - Dynamic System Prompt Compiler (Appends moef.gov.in domain anchors)   |
|  - Google Search Grounding Layer (Live environmental data verification)  |
+-------------------------------------------------------------------------+
```
