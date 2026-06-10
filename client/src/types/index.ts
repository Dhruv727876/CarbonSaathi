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


export interface ActivityCategory {
  id: string;
  label: string;
  unit: string;
  emissionFactor: number;
}

