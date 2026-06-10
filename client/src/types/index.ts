export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface Persona {
  id: 'innovator' | 'skeptic' | 'policy_maker' | 'citizen' | 'coach' | 'auditor' | 'investor' | 'debunker';
  name: string;
  role: string;
  description: string;
}

export type ElectionStage = 'pre_election' | 'active_voting' | 'post_election';

export interface ReadinessAnswer {
  questionId: string;
  optionIndex: number;
  pointsReceived: number;
}

export interface GroundingChunk {
  chunkId: string;
  sourceUri: string;
  snippet: string;
}

export interface GroundingMetadata {
  chunks: GroundingChunk[];
  confidenceScore: number;
}

export interface ChatResponse {
  responseText: string;
  suggestedAction: string;
  sources: string[];
  grounding?: GroundingMetadata;
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
  options: readonly string[];
  points: number;
}

export interface UserProgress {
  uid: string;
  totalEmissionsSavedKg: number;
  quizScore: number;
  lastActiveTimestamp: number;
  readinessAnswers: ReadinessAnswer[];
}

export interface ActivityCategory {
  id: string;
  label: string;
  unit: string;
  emissionFactor: number;
}

