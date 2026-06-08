import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from './components';
import { useMainHook } from './hooks';

// Efficiency: React.lazy for heavy component trees
const PersonaSelector = React.lazy(() => import('./components').then(module => ({ default: module.PersonaSelector })));
const ChatInterface = React.lazy(() => import('./components').then(module => ({ default: module.ChatInterface })));

const App: React.FC = () => {
  const [activePersona, setActivePersona] = useState<string>('coach');
  const { messages, isLoading, error, sendMessage } = useMainHook();

  const handleSend = (text: string) => {
    sendMessage(text, activePersona);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Accessibility: Absolute first focusable element */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:font-bold focus:shadow-lg">
        Skip to main content
      </a>

      <header className="bg-green-800 text-white p-6 shadow-md" role="banner">
        <div className="max-w-5xl mx-auto">
          <h1>CarbonSaathi Ledger</h1>
          <p className="mt-2 opacity-90">Personalized tracking and lifestyle redesign.</p>
        </div>
      </header>

      <main id="main-content" role="main" className="flex-1 max-w-5xl w-full mx-auto p-6">
        {error && (
          <div role="alert" className="mb-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <ErrorBoundary>
          <Suspense fallback={<div role="status" className="p-8 text-center min-h-[44px]">Loading interfaces...</div>}>
            <section aria-labelledby="persona-heading">
              <h2 id="persona-heading" className="sr-only">Select Persona</h2>
              <PersonaSelector selectedPersona={activePersona} onSelect={setActivePersona} />
            </section>
            
            <section aria-labelledby="chat-heading" className="mt-8">
              <h2 id="chat-heading" className="sr-only">Carbon Analysis Chat</h2>
              <ChatInterface messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
            </section>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
