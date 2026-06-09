import { Message } from '../types';

/**
 * Strict character sanitation utility processing malicious injection signatures.
 * @param input - Raw text string from client field.
 * @returns string Cleaned safe textual data.
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

/**
 * Formats a raw persona ID string into a user-friendly label.
 * @param id - The raw persona ID (e.g. 'policy_maker').
 * @returns The formatted user-friendly label.
 */
export const formatPersonaLabel = (id: string): string => {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncates the message history to keep only the most recent messages.
 * @param messages - The full list of messages.
 * @param maxLen - The maximum number of messages to retain.
 * @returns The truncated message history.
 */
export const truncateHistory = (messages: Message[], maxLen: number): Message[] => {
  if (messages.length <= maxLen) return messages;
  return messages.slice(messages.length - maxLen);
};

export interface ParsedMythData {
  isMyth: boolean;
  explanation: string;
  citation: string;
}

/**
 * Parses a structured mythbust response text from the service.
 * @param response - The raw response string from the service.
 * @returns An object containing parsed isMyth status, explanation, and citation.
 */
export const parseMyth = (response: string): ParsedMythData => {
  const normalized = response.toLowerCase();
  const isMyth = normalized.includes('myth') && !normalized.includes('fact');

  let citation = 'Source: moef.gov.in';
  const citationMatch = response.match(/source:\s*([^\s\n]+)/i);
  if (citationMatch) {
    citation = `Source: ${citationMatch[1]}`;
  }

  const explanation = response
    .replace(/source:\s*([^\s\n]+)/i, '')
    .trim();

  return {
    isMyth,
    explanation,
    citation
  };
};

/**
 * Calculates metric weight formulas for transportation footprints.
 * @param miles - Distance numerical representation.
 * @returns number Calculated carbon footprint metrics.
 */
export const calculateTransportEmissions = (miles: number): number => {
  const CO2_PER_MILE = 0.404;
  return miles * CO2_PER_MILE;
};
