import { Persona, QuizQuestion, ActivityCategory } from '../types';

export const ALLOWED_PERSONAS: readonly Persona[] = [
  { id: 'innovator', name: 'Eco-Innovator', role: 'Clean Tech & Decarbonization', description: 'Focuses on disruptive technologies and green tech startups.' },
  { id: 'skeptic', name: 'Climate Skeptic', role: 'Empirical Audit', description: 'Demands hard math, ROI payback periods, and verified emissions data.' },
  { id: 'policy_maker', name: 'Policy Specialist', role: 'Regulation & Net-Zero 2070', description: 'Deals with Indian government regulations and international protocols.' },
  { id: 'citizen', name: 'Sustainable Citizen', role: 'Grassroots Advocate', description: 'Helps with everyday habit changes and daily household utility math.' },
  { id: 'coach', name: 'Eco-Coach', role: 'Habit Redesign', description: 'Optimizes immediate daily habits.' },
  { id: 'auditor', name: 'Carbon Auditor', role: 'Mathematical Analysis', description: 'Deep mathematical infrastructure analysis.' },
  { id: 'investor', name: 'Green Investor', role: 'Financial Planning', description: 'Calculates structural green asset returns.' },
  { id: 'debunker', name: 'Myth-Buster', role: 'Scientific Truth Verification', description: 'Deconstructs systemic climate myths.' }
] as const;

export const ELECTION_STAGES = {
  PRE_ELECTION: 'pre_election',
  ACTIVE_VOTING: 'active_voting',
  POST_ELECTION: 'post_election'
} as const;

export const COMMON_MYTHS = [
  {
    id: 'm1',
    myth: 'Individual actions make zero impact on structural global emissions.',
    truth: 'Aggregated micro-adjustments scale linearly into metric tons of carbon reduction.',
    citation: 'Source: moef.gov.in'
  },
  {
    id: 'm2',
    myth: 'Renewable energy is too expensive to install in India.',
    truth: 'With subsidies and high solar irradiation, solar rooftop payback periods are down to 3-5 years.',
    citation: 'Source: mnre.gov.in'
  }
] as const;

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  MYTHBUST: '/api/mythbust',
  HEALTH: '/api/health'
} as const;

export const PERSONA_SUGGESTIONS = {
  innovator: [
    'How do direct air capture startups scale?',
    'What is the efficiency of solid-state batteries?'
  ],
  skeptic: [
    'Show me the payback calculations for a 5kW solar panel in India.',
    'Is carbon neutrality mathematically possible by 2070?'
  ],
  policy_maker: [
    'Explain India\'s Panchamrit climate goals.',
    'How do national carbon credit registries work?'
  ],
  citizen: [
    'How do I calculate my household waste emissions?',
    'What simple changes reduce my transit carbon footprint?'
  ],
  coach: [
    'How can I reduce my daily plastic usage?',
    'What are some simple energy-saving habits?'
  ],
  auditor: [
    'How do you audit home appliances?',
    'What is the calculation for carbon emissions from commuting?'
  ],
  investor: [
    'What is the ROI on residential solar panels?',
    'How do I assess green funds?'
  ],
  debunker: [
    'Bust the myth that electric cars pollute more than gas cars.',
    'Bust the myth that carbon offsets do not work.'
  ]
} as const;

export const READINESS_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Do you audit appliance BEE star ratings before procurement?',
    options: ['Yes', 'No', 'Unsure'],
    points: 10
  },
  {
    id: 'q2',
    question: 'What is the primary mode of transportation for your daily commute?',
    options: ['Electric Vehicle / Public Transit', 'Petrol/Diesel Car', 'Walk / Bicycle'],
    points: 15
  }
] as const;

export const EMISSION_FACTORS = {
  car_km: 0.17,
  flight_km: 0.25,
  beef_meal: 7.2,
  electricity_kwh: 0.82
} as const;

export const REDUCTION_TIPS: Record<string, string[]> = {
  transport: [
    "Switch to public transit or electric vehicles where possible.",
    "Carpool or combine errands to optimize route planning.",
    "Maintain optimal tire pressure to ensure maximum fuel efficiency."
  ],
  food: [
    "Opt for local, seasonal, and plant-based protein options.",
    "Compost organic waste to mitigate landfill methane output.",
    "Plan meals beforehand to reduce domestic food spoilage."
  ],
  energy: [
    "Replace old lightbulbs with energy-efficient LED configurations.",
    "Audit appliance BEE star ratings and select high-efficiency models.",
    "Unplug idle electronics to prevent phantom energy draw."
  ],
  shopping: [
    "Bring reusable bags and buy goods in bulk to reduce packaging waste.",
    "Prioritize durable products over single-use alternatives.",
    "Support brands that offer circular or return-to-loop programs."
  ]
};

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  { id: 'transport', label: 'Car Commute', unit: 'km', emissionFactor: 0.21 },
  { id: 'flight', label: 'Flight Travel', unit: 'km', emissionFactor: 0.255 },
  { id: 'food', label: 'High-impact Meals', unit: 'meals', emissionFactor: 3.3 },
  { id: 'electricity', label: 'Electricity', unit: 'kWh', emissionFactor: 0.82 },
];


