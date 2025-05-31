import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { EffectType, EffectsState, PencilEffectConfig, DEFAULT_PENCIL_CONFIG } from '@/types/effects';

interface EffectsContextType {
  state: EffectsState;
  setActiveEffect: (effect: EffectType) => void;
  updatePencilConfig: (config: Partial<PencilEffectConfig>) => void;
  toggleEffect: (effect: EffectType) => void;
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined);

export const useEffects = () => {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within an EffectsProvider');
  }
  return context;
};

export const EffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EffectsState>({
    activeEffect: 'none',
    pencilConfig: DEFAULT_PENCIL_CONFIG
  });

  const setActiveEffect = useCallback((effect: EffectType) => {
    setState(prev => ({
      ...prev,
      activeEffect: effect,
      pencilConfig: {
        ...prev.pencilConfig,
        enabled: effect === 'pencil'
      }
    }));
  }, []);

  const updatePencilConfig = useCallback((config: Partial<PencilEffectConfig>) => {
    setState(prev => ({
      ...prev,
      pencilConfig: {
        ...prev.pencilConfig,
        ...config
      }
    }));
  }, []);

  const toggleEffect = useCallback((effect: EffectType) => {
    setState(prev => ({
      ...prev,
      activeEffect: prev.activeEffect === effect ? 'none' : effect,
      pencilConfig: {
        ...prev.pencilConfig,
        enabled: prev.activeEffect === effect ? false : effect === 'pencil'
      }
    }));
  }, []);

  // Add SVG filters to document when component mounts
  useEffect(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'display: none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('version', '1.1');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Create squiggly filters
    for (let i = 0; i < 5; i++) {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', `squiggly-${i}`);

      const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turbulence.setAttribute('id', 'turbulence');
      turbulence.setAttribute('baseFrequency', '0.02');
      turbulence.setAttribute('numOctaves', '3');
      turbulence.setAttribute('result', 'noise');
      turbulence.setAttribute('seed', i.toString());

      const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      displacement.setAttribute('in', 'SourceGraphic');
      displacement.setAttribute('in2', 'noise');
      displacement.setAttribute('scale', (i % 2 === 0 ? '2' : '3'));

      filter.appendChild(turbulence);
      filter.appendChild(displacement);
      defs.appendChild(filter);
    }

    document.body.appendChild(svg);

    return () => {
      document.body.removeChild(svg);
    };
  }, []);

  return (
    <EffectsContext.Provider
      value={{
        state,
        setActiveEffect,
        updatePencilConfig,
        toggleEffect
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
}; 