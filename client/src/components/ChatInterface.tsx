import React, { useMemo, useState } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
  onSendMessage: (text: string) => void;
}

/**
 * Chat interface component for AI-powered carbon conversations.
 * @param props - ChatInterfaceProps
 * @returns JSX chat interface element.
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = React.memo(({ messages, isLoading, error, onSendMessage }) => {
  const [input, setInput] = useState('');

  // Memoized rendered list of messages
  const renderedMessages = useMemo(() => {
    return messages.map((msg) => (
      <div 
        key={msg.id} 
        className={`mb-4 p-4 rounded-lg text-gray-800 ${
          msg.sender === 'user' 
            ? 'bg-blue-50 ml-auto max-w-[80%]' 
            : 'bg-gray-100 mr-auto max-w-[80%]'
        }`}
      >
        <p>{msg.text}</p>
      </div>
    ));
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-300 rounded-lg bg-white overflow-hidden relative">
      {/* Skip Link: Keyboard-accessible to bypass to input */}
      <a 
        href="#chat-input" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-orange-500 focus:text-white focus:p-2 focus:rounded-md focus:z-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
      >
        Skip message logs to input box
      </a>

      <header className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">CarbonSaathi Chat Ledger</h1>
      </header>

      {error && (
        <div role="alert" className="p-3 bg-red-100 border-b border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Message List */}
      <div 
        role="log" 
        aria-live="polite" 
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {renderedMessages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Start a conversation to analyze your carbon footprint.
          </p>
        )}
        {renderedMessages}

        {/* Status Loader */}
        {isLoading && (
          <div 
            role="status" 
            aria-live="polite" 
            className="text-sm text-gray-600 italic p-4 flex items-center gap-2"
          >
            <span>Analyzing environmental metrics...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex gap-2">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Type your carbon tracking message"
          className="flex-1 min-h-[44px] h-11 p-2 border border-gray-300 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2 text-gray-900"
          placeholder="Ask about reducing emissions..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          aria-label="Send Message"
          className="min-h-[44px] h-11 px-6 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
        >
          Send
        </button>
      </form>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';
