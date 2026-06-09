import React, { Suspense } from 'react';
import { ErrorBoundary } from './components';
import { useMainHook } from './hooks';
import { COMMON_MYTHS } from './constants';

// Dynamic imports for optimized loading performance
const PersonaSelector = React.lazy(() => import('./components/PersonaSelector').then(m => ({ default: m.PersonaSelector })));
const ChatInterface = React.lazy(() => import('./components/ChatInterface').then(m => ({ default: m.ChatInterface })));
const MythBuster = React.lazy(() => import('./components/MythBuster').then(m => ({ default: m.MythBuster })));

const App: React.FC = () => {
  const { 
    messages, 
    selectedPersona, 
    setSelectedPersona, 
    isLoading, 
    error, 
    welcomeBack, 
    sendMessage, 
    bustMyth 
  } = useMainHook();

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleBustMyth = (myth: string) => {
    bustMyth(myth);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Skip Link for optimized accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:font-bold focus:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          Skip to main content
        </a>

        <header className="bg-green-800 text-white p-6 shadow-md" role="banner">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CarbonSaathi</h1>
              <p className="mt-1 opacity-90 text-sm">Personalized carbon tracking and lifestyle redesign.</p>
            </div>
            {welcomeBack && (
              <span className="bg-green-700 px-3 py-1 rounded-full text-xs font-semibold animate-pulse" role="status">
                Welcome back! Loaded saved history.
              </span>
            )}
          </div>
        </header>

        <main id="main-content" role="main" className="flex-1 max-w-5xl w-full mx-auto p-6">
          {error && (
            <div role="alert" className="mb-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <Suspense fallback={<div role="status" className="p-8 text-center min-h-[44px]">Loading interfaces...</div>}>
            {selectedPersona === null ? (
              <PersonaSelector selectedPersona="" onSelect={setSelectedPersona} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <ChatInterface 
                    messages={messages} 
                    isLoading={isLoading} 
                    error={error} 
                    onSendMessage={handleSend} 
                  />
                </div>
                <div className="md:col-span-1">
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-bold text-green-900 mb-1">Active Persona</h4>
                      <p className="text-sm text-gray-700 capitalize mb-3">{selectedPersona.replace('_', ' ')}</p>
                      <button 
                        onClick={() => setSelectedPersona(null)}
                        className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                      >
                        Change Persona
                      </button>
                    </div>
                    <MythBuster myths={COMMON_MYTHS} onBustMyth={handleBustMyth} />
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
