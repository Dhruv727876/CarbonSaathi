import React from 'react';
import { ALLOWED_PERSONAS } from '../constants';
import { Persona } from '../types';

interface Props {
  selectedPersona: string;
  onSelect: (id: string) => void;
}

export const PersonaSelector: React.FC<Props> = React.memo(({ selectedPersona, onSelect }) => {
  return (
    <fieldset className="p-4 bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
      <legend className="sr-only">Select your AI Carbon Consultant Persona</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup">
        {ALLOWED_PERSONAS.map((persona: Persona) => (
          <button
            key={persona.id}
            role="radio"
            aria-checked={selectedPersona === persona.id}
            aria-label={`Select ${persona.name}, role: ${persona.role}`}
            onClick={() => onSelect(persona.id)}
            className={`min-h-[44px] p-4 text-left border rounded-md transition-colors ${
              selectedPersona === persona.id 
                ? 'border-green-600 bg-green-50 ring-2 ring-green-600' 
                : 'border-gray-300 hover:border-green-400 focus:border-green-400 bg-white'
            }`}
          >
            <h2 className="font-semibold text-gray-900">{persona.name}</h2>
            <p className="text-sm text-contrast-safe mt-1">{persona.description}</p>
          </button>
        ))}
      </div>
    </fieldset>
  );
});
PersonaSelector.displayName = 'PersonaSelector';
