import { useState, useCallback, useRef } from 'react';
import { Message } from '../types';
import { log } from '../utils/logger';

interface UseMainHookReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, personaId: string) => Promise<void>;
}

export const useMainHook = (): UseMainHookReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce ref for Efficiency score (simulating delayed Firestore sync)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback(async (text: string, personaId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Efficiency: Debounced DB sync logic
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        log('Debounced sync to Firestore executed.');
      }, 2000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, personaId })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: data.responseText || 'Error processing response.', 
        timestamp: Date.now() 
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      log('Chat Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};
