import { Persona, QuizQuestion } from '../types';

export const ALLOWED_PERSONAS: Persona[] = [
  { id: 'coach', name: 'Eco-Coach', role: 'Habit Redesign', description: 'Optimizes immediate daily habits.' },
  { id: 'auditor', name: 'Carbon Auditor', role: 'Mathematical Analysis', description: 'Deep mathematical infrastructure analysis.' },
  { id: 'investor', name: 'Green Investor', role: 'Financial Planning', description: 'Calculates structural green asset returns.' },
  { id: 'debunker', name: 'Myth-Buster', role: 'Scientific Truth Verification', description: 'Deconstructs systemic climate myths.' }
];

export const COMMON_MYTHS = [
  { id: 'm1', myth: 'Individual actions make zero impact on structural global emissions.', truth: 'Aggregated micro-adjustments scale linearly into metric tons of carbon reduction.' }
];

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  MYTHBUST: '/api/mythbust',
  HEALTH: '/api/health'
};

export const READINESS_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: 'Do you audit appliance BEE star ratings before procurement?', options: ['Yes', 'No', 'Unsure'], points: 10 }
];
