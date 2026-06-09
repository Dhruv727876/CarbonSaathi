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
Chosen Vertical
Track: Sustainability & Climate Technology

CarbonSaathi is submitted under the Sustainability & Climate Technology vertical. The project directly addresses the escalating crisis of individual carbon opacity — the inability of everyday citizens to measure, understand, and systematically reduce their personal carbon footprint. By combining AI-driven personalized coaching with real-time carbon tracking and government-verified data grounding, CarbonSaathi bridges the gap between abstract climate awareness and actionable lifestyle redesign. The solution is specifically tailored for the Indian context, aligning with national frameworks such as the Panchamrit climate pledges, BEE Star Rating compliance, and the Net-Zero 2070 roadmap published by the Ministry of Environment, Forest and Climate Change (MoEFCC).

Approach and Logic
Technical Architecture
CarbonSaathi follows a strict three-tier decoupled architecture: a React + TypeScript client, a hardened Express proxy server, and an AI inference layer powered by Gemma via the NVIDIA API. The client never communicates directly with the AI engine — all requests are routed through the Express proxy, which enforces security middleware (Helmet CSP, XSS sanitization via the xss library, rate limiting via express-rate-limit, and input validation via express-validator). This ensures that API keys are never exposed to the client and that all payloads are sanitized before reaching the AI layer.

Gemma AI Integration
The AI core is powered by the google/gemma-4-31b-it model, accessed through the NVIDIA Integrate API (https://integrate.api.nvidia.com/v1/chat/completions). The integration uses the OpenAI-compatible chat completions interface, sending a dynamically compiled system prompt alongside the user message. A hard 25-second execution timeout is enforced using AbortController to prevent hanging connections. On timeout, the system throws an AI_TIMEOUT error that is caught by the global error handler and returned to the client as a 504 status.

System Prompt Logic
The system prompt is dynamically compiled based on the user's selected persona. The buildSystemPrompt function in gemmaService.js maps each persona ID (e.g., innovator, skeptic, policy_maker, citizen, coach, auditor, investor, debunker) to a specialized identity instruction that fundamentally changes the AI's response style, depth, and focus area. All prompts share a common foundation of seven Knowledge Pillars (Micro-Emissions Tracking, Structural Energy Auditing, Green ROI, Policy Alignment, Circular Economy & Waste, Carbon Sequestration & Offsets, and Climate Adaptation) and four Hard Limits (no political endorsements, no invented data, no medical/legal advice, no format breaking). Every response is required to follow a strict four-part format: Acknowledge & Analyze, The Data / The Reality, Official Citation (must reference moef.gov.in, mnre.gov.in, or beeindia.gov.in), and a Concrete Next Action.

Search Grounding
Citation verification is enforced through the system prompt's mandatory citation requirement. The response parser in gemmaService.js scans the AI output for domain references (moef.gov.in, mnre.gov.in) and automatically falls back to beeindia.gov.in if no citation is detected, ensuring every response is anchored to an official Indian government environmental data source.

How the Solution Works
CarbonSaathi provides a streamlined user journey from onboarding to actionable carbon insights:

Step 1 — Anonymous Authentication: When a user first visits the application, Firebase Anonymous Auth silently creates a session and assigns a unique user ID. No sign-up or login friction is required. This UID serves as the primary key for all Firestore document operations.

Step 2 — Persona Selection: The user is presented with four primary consultant personas — Eco-Innovator (clean tech focus), Climate Skeptic (empirical audit), Policy Specialist (regulatory frameworks), and Sustainable Citizen (daily habits). Four additional legacy personas (Eco-Coach, Carbon Auditor, Green Investor, Myth-Buster) are available on the backend. Each persona dynamically reconfigures the AI's system prompt, fundamentally altering the tone, depth, and domain focus of every response.

Step 3 — Carbon Chat Interaction: Once a persona is selected, the user enters the chat interface. Each message is sent to the Express proxy server at /api/chat, which validates the payload (max 1000 characters, XSS-sanitized, persona allowlisted), enforces rate limiting (20 requests/minute), and forwards the request to the NVIDIA API with the persona-specific system prompt. The AI responds with structured carbon analysis including metric values, official citations, and a specific next action.

Step 4 — Myth Busting: A dedicated sidebar allows users to click on pre-loaded common climate myths (e.g., "Individual actions make zero impact," "Renewable energy is too expensive in India"). These are sent to the /api/mythbust endpoint, which uses a specialized myth-busting system prompt that forces the AI to explicitly classify the claim as MYTH or FACT, provide scientific data with metric values, cite official sources, and recommend one concrete action.

Step 5 — Persistent Chat History: All messages are automatically synced to Firestore using a debounced write mechanism (2-second delay to batch rapid updates). When a returning user opens the app, their chat history is loaded from Firestore and a "Welcome back" indicator is displayed. Offline support is enabled via enableIndexedDbPersistence, allowing the app to function without an active network connection by reading from the local IndexedDB cache.

Step 6 — Security & Accessibility: Every response passes through DOMParser-based HTML stripping on the client side to prevent XSS rendering. The interface includes keyboard skip links, ARIA roles on all interactive elements, live regions for screen readers, and 44px minimum touch targets for mobile compliance.

Assumptions Made
Internet Connectivity: The solution assumes users have a stable internet connection for AI-powered chat interactions and Firestore synchronization. Offline persistence via IndexedDB provides read-only access to cached data, but new AI queries require network access.
Emission Factor Sources: All carbon calculations and emission factor references rely on data published by Indian government agencies (MoEFCC, MNRE, BEE). The system assumes these sources are authoritative and current as of the hackathon submission date.
API Availability: The solution assumes the NVIDIA Integrate API hosting the Gemma model remains available and within free-tier rate limits during evaluation. The 25-second timeout assumes typical inference latency under 15 seconds.
Firebase Quota: Anonymous authentication and Firestore operations assume usage within Firebase's free Spark plan quotas (50K reads/day, 20K writes/day). Heavy concurrent usage beyond hackathon-scale may require plan upgrades.
User Device Capabilities: The application assumes a modern browser with ES2021 support, IndexedDB availability, and DOMParser API. It does not support Internet Explorer or legacy browsers without JavaScript enabled.
Single-User Per Session: The current architecture assumes one user per browser session. Multi-user concurrent access on the same device is not supported due to anonymous auth session constraints.
Government Data Accuracy: Citations referencing moef.gov.in, mnre.gov.in, and beeindia.gov.in assume the AI model's training data accurately reflects the published content of these domains. The system does not perform real-time web scraping of these sites.
Standard Emission Factors: Transport emission calculations use a standard factor of 0.404 kg CO2 per mile, which assumes an average petrol/diesel vehicle. Actual emissions vary by vehicle type, fuel quality, and driving conditions.
