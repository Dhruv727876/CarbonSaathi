import React, { useMemo, useState } from 'react';
import { Message } from '../types';

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<Props> = React.memo(({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');

  // Efficiency: useMemo on rendered list
  const renderedMessages = useMemo(() => {
    return messages.map((msg) => (
      <div key={msg.id} className={`mb-4 p-4 rounded-lg ${msg.sender === 'user' ? 'bg-blue-50 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
        <p className="text-contrast-safe">{msg.text}</p>
      </div>
    ));
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <section aria-label="Chat Interface" className="flex flex-col h-[500px] border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div 
        role="log" 
        aria-live="polite" 
        className="flex-1 overflow-y-auto p-4"
      >
        {renderedMessages.length === 0 && <p className="text-center text-gray-600 mt-10">Start a conversation to analyze your footprint.</p>}
        {renderedMessages}
        {isLoading && (
          <div role="status" aria-live="polite" className="text-sm text-gray-600 italic p-4">
            AI is analyzing metrics...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Type your carbon tracking message</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-h-[44px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600"
          placeholder="Ask about reducing emissions..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          aria-label="Send Message"
          className="min-h-[44px] px-6 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
});
ChatInterface.displayName = 'ChatInterface';
