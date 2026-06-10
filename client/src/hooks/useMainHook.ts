import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Message } from '../types';
import { db, initializeUserSession, logCarbonEvent, doc, getDoc, setDoc } from '../firebase';
import { log } from '../utils/logger';

interface UseMainHookReturn {
  messages: Message[];
  selectedPersona: string | null;
  setSelectedPersona: (personaId: string | null) => void;
  isLoading: boolean;
  error: string | null;
  welcomeBack: boolean;
  sendMessage: (text: string, personaId?: string) => Promise<void>;
  bustMyth: (myth: string) => Promise<void>;
  uid: string | null;
}

export const useMainHook = (): UseMainHookReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [welcomeBack, setWelcomeBack] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);

  const hasLoaded = useRef<boolean>(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetSelectedPersona = useCallback((personaId: string | null) => {
    setSelectedPersona(personaId);
    if (personaId) {
      logCarbonEvent('persona_selected', { persona_id: personaId });
    }
  }, []);

  // Memoized message stream - clean any potential HTML tags or duplicate entries
  const cleanMessages = useMemo(() => {
    return messages.map(msg => {
      const doc = new DOMParser().parseFromString(msg.text, "text/html");
      const cleanText = doc.body.textContent || "";
      return {
        ...msg,
        text: cleanText
      };
    });
  }, [messages]);

  // Handle user session initialization
  useEffect(() => {
    let active = true;
    initializeUserSession()
      .then(async (userUid) => {
        if (!active) return;
        setUid(userUid);

        // Load historical chat from Firestore exactly once
        if (!hasLoaded.current) {
          hasLoaded.current = true;
          try {
            const userDocRef = doc(db, 'users', userUid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              if (data && Array.isArray(data.messages) && data.messages.length > 0) {
                setMessages(data.messages as Message[]);
                setWelcomeBack(true);
                logCarbonEvent('session_restored');
                // Reset welcomeBack indicator after 5 seconds
                setTimeout(() => setWelcomeBack(false), 5000);
              } else {
                logCarbonEvent('app_loaded');
              }
            } else {
              logCarbonEvent('app_loaded');
            }
          } catch (err) {
            log('Firestore load error:', err);
            setError(err instanceof Error ? err.message : 'Failed to recover user history');
          }
        }
      })
      .catch((err) => {
        if (!active) return;
        log('Session init error:', err);
        setError(err instanceof Error ? err.message : 'Auth initialization failure');
      });

    return () => {
      active = false;
    };
  }, []);

  // Background sync helper
  const syncToFirestore = useCallback((currentMessages: Message[]) => {
    if (!uid) return;
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, { messages: currentMessages }, { merge: true });
        log('Firestore sync successfully executed.');
      } catch (err) {
        log('Firestore sync error:', err);
        setError(err instanceof Error ? err.message : 'Database sync failed');
      }
    }, 2000);
  }, [uid]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Send message callback
  const sendMessage = useCallback(async (text: string, personaId?: string): Promise<void> => {
    if (!text || !text.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    logCarbonEvent('chat_message_sent');
    if (text.toLowerCase().includes('commute') || text.toLowerCase().includes('energy') || text.toLowerCase().includes('waste')) {
      logCarbonEvent('carbon_entry_logged', { category: 'general' });
    }
    if (text.toLowerCase().includes('quiz') || text.toLowerCase().includes('challenge')) {
      logCarbonEvent('challenge_started');
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    syncToFirestore(updatedMessages);

    try {
      const activePersonaId = personaId || selectedPersona || 'citizen';
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, personaId: activePersonaId })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.responseText || 'Error processing response.',
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      syncToFirestore(finalMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      log('Chat Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedPersona, syncToFirestore]);

  // Myth bust callback
  const bustMyth = useCallback(async (myth: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    logCarbonEvent('myth_checked', { myth_id: myth });

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `Bust Myth: ${myth}`,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    syncToFirestore(updatedMessages);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/mythbust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myth })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.responseText || `Fact Check Result: ${data.truth || 'Verified by CarbonSaathi.'}`,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      syncToFirestore(finalMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      log('Mythbust Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, syncToFirestore]);

  return {
    messages: cleanMessages,
    selectedPersona,
    setSelectedPersona: handleSetSelectedPersona,
    isLoading,
    error,
    welcomeBack,
    sendMessage,
    bustMyth,
    uid
  };
};

export default useMainHook;
