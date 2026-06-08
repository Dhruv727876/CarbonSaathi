export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface Persona {
  id: 'coach' | 'auditor' | 'investor' | 'debunker';
  name: string;
  role: string;
  description: string;
}

export interface EmissionLog {
  id: string;
  category: 'transport' | 'energy' | 'diet' | 'waste';
  value: number;
  co2EquivalentKg: number;
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  points: number;
}

export interface UserProgress {
  uid: string;
  totalEmissionsSavedKg: number;
  quizScore: number;
  lastActiveTimestamp: number;
}

export interface ChatResponse {
  responseText: string;
  suggestedAction: string;
  sources: string[];
}
