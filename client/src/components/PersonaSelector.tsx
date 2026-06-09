import React from 'react';
import { ALLOWED_PERSONAS } from '../constants';
import { Persona } from '../types';

interface PersonaSelectorProps {
  selectedPersona: string;
  onSelect: (id: string) => void;
}

const personaEmojis: Record<string, string> = {
  innovator: '💡',
  skeptic: '🔍',
  policy_maker: '📜',
  citizen: '🏡'
};

export const PersonaSelector: React.FC<PersonaSelectorProps> = React.memo(({ selectedPersona, onSelect }) => {
  const primaryPersonas = ALLOWED_PERSONAS.filter((p): p is Persona & { id: 'innovator' | 'skeptic' | 'policy_maker' | 'citizen' } => 
    ['innovator', 'skeptic', 'policy_maker', 'citizen'].includes(p.id)
  );

  return (
    <section role="region" aria-label="Persona Selection Section">
      <div className="p-4 bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
        <h3 className="text-md font-bold text-gray-900 mb-4">Select Consultant Persona</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="Persona Selector Options">
          {primaryPersonas.map((persona) => {
            const emoji = personaEmojis[persona.id] || '🌱';
            const isSelected = selectedPersona === persona.id;
            return (
              <button
                key={persona.id}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Select ${persona.name}, role: ${persona.role}`}
                onClick={() => onSelect(persona.id)}
                className={`min-h-[44px] h-11 px-4 flex items-center justify-between border rounded-md transition-colors w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2 ${
                  isSelected 
                    ? 'border-green-600 bg-green-50 ring-2 ring-green-600' 
                    : 'border-gray-300 hover:border-green-400 focus:border-green-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span role="img" aria-label={`${persona.name} icon`}>
                    {emoji}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{persona.name}</span>
                </div>
                <span className="text-xs text-gray-500 hidden lg:inline">{persona.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

PersonaSelector.displayName = 'PersonaSelector';
