import React from 'react';

interface Myth {
  id: string;
  myth: string;
  truth: string;
  citation?: string;
}

interface MythBusterProps {
  myths: readonly Myth[];
  onBustMyth: (myth: string) => void;
}

export const MythBuster: React.FC<MythBusterProps> = React.memo(({ myths, onBustMyth }) => {
  return (
    <section role="region" aria-label="Climate Myth Buster Section" className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Climate Myth Buster</h2>
      <fieldset className="space-y-4">
        <legend className="sr-only">Select a climate myth to fact-check with CarbonSaathi</legend>
        <div className="grid grid-cols-1 gap-3">
          {myths.map((item) => (
            <button
              key={item.id}
              onClick={() => onBustMyth(item.myth)}
              className="min-h-[44px] p-4 text-left border border-gray-300 hover:border-green-600 focus:border-green-600 rounded-md bg-gray-50 transition-colors w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2 flex flex-col gap-1"
            >
              <span className="font-semibold text-gray-800 text-sm">Myth: {item.myth}</span>
              <span className="text-xs text-gray-600 mt-1">Click to bust this myth using verified data.</span>
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
});

MythBuster.displayName = 'MythBuster';
