import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { EffectType, EffectsState, PencilEffectConfig, PixelateEffectConfig, ScanlineEffectConfig, DEFAULT_PENCIL_CONFIG, DEFAULT_PIXELATE_CONFIG, DEFAULT_SCANLINE_CONFIG } from '@/types/effects';

interface EffectsContextType extends EffectsState {
  setActiveEffect: (effect: EffectType | null) => void;
  togglePencilEffect: () => void;
  updatePencilConfig: (config: Partial<PencilEffectConfig>) => void;
  togglePixelateEffect: () => void;
  updatePixelateConfig: (config: Partial<PixelateEffectConfig>) => void;
  toggleScanlineEffect: () => void;
  updateScanlineConfig: (config: Partial<ScanlineEffectConfig>) => void;
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined);

export const useEffects = () => {
  const context = useContext(EffectsContext);
  if (context === undefined) {
    throw new Error('useEffects must be used within an EffectsProvider');
  }
  return context;
};

export const EffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EffectsState>({
    activeEffect: null,
    pencilEffect: DEFAULT_PENCIL_CONFIG,
    pixelateEffect: DEFAULT_PIXELATE_CONFIG,
    scanlineEffect: DEFAULT_SCANLINE_CONFIG
  });

  // Add SVG filter definitions and scanline styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes squiggly-anim {
        0% { filter: url(#squiggly-0); }
        25% { filter: url(#squiggly-1); }
        50% { filter: url(#squiggly-2); }
        75% { filter: url(#squiggly-3); }
        100% { filter: url(#squiggly-0); }
      }

      @keyframes scanline-move {
        0% { background-position: 0 0; }
        100% { background-position: 0 80px; }
      }

      .scanline-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        overflow: hidden;
        z-index: 9999;
      }

      .scanline {
        width: 100vw;
        height: 100vh;
        background: repeating-linear-gradient(
          transparent,
          transparent 2px,
          var(--scanline-color, #8BC34A) 2px,
          var(--scanline-color, #8BC34A) 5px
        );
        image-rendering: pixelated;
        animation: scanline-move var(--scanline-speed, 2s) linear infinite;
      }
    `;
    document.head.appendChild(style);

    // Add SVG filters
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.width = '0';
    svg.style.height = '0';
    
    // Add squiggly filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    for (let i = 0; i < 4; i++) {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = `squiggly-${i}`;
      filter.setAttribute('x', '0%');
      filter.setAttribute('y', '0%');
      filter.setAttribute('width', '100%');
      filter.setAttribute('height', '100%');
      
      const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turbulence.setAttribute('type', 'fractalNoise');
      turbulence.setAttribute('baseFrequency', '0.01');
      turbulence.setAttribute('numOctaves', '3');
      turbulence.setAttribute('seed', i.toString());
      
      const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      displacement.setAttribute('in', 'SourceGraphic');
      displacement.setAttribute('scale', '5');
      
      filter.appendChild(turbulence);
      filter.appendChild(displacement);
      defs.appendChild(filter);
    }

    // Add pixelate filter
    const pixelateFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    pixelateFilter.id = 'pixelate';
    pixelateFilter.setAttribute('x', '0');
    pixelateFilter.setAttribute('y', '0');
    
    const flood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    flood.setAttribute('x', '4');
    flood.setAttribute('y', '4');
    flood.setAttribute('height', '2');
    flood.setAttribute('width', '2');
    
    const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite.setAttribute('width', '10');
    composite.setAttribute('height', '10');
    
    const tile = document.createElementNS('http://www.w3.org/2000/svg', 'feTile');
    tile.setAttribute('result', 'a');
    
    const composite2 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite2.setAttribute('in', 'SourceGraphic');
    composite2.setAttribute('in2', 'a');
    composite2.setAttribute('operator', 'in');
    
    const morphology = document.createElementNS('http://www.w3.org/2000/svg', 'feMorphology');
    morphology.setAttribute('operator', 'dilate');
    morphology.setAttribute('radius', '5');
    
    pixelateFilter.appendChild(flood);
    pixelateFilter.appendChild(composite);
    pixelateFilter.appendChild(tile);
    pixelateFilter.appendChild(composite2);
    pixelateFilter.appendChild(morphology);
    defs.appendChild(pixelateFilter);
    
    svg.appendChild(defs);
    document.body.appendChild(svg);

    // Add scanline container
    const scanlineContainer = document.createElement('div');
    scanlineContainer.className = 'scanline-container';
    scanlineContainer.style.display = 'none';
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    scanlineContainer.appendChild(scanline);
    document.body.appendChild(scanlineContainer);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(svg);
      document.body.removeChild(scanlineContainer);
    };
  }, []);

  const setActiveEffect = (effect: EffectType | null) => {
    setState(prev => ({ ...prev, activeEffect: effect }));
  };

  const togglePencilEffect = () => {
    setState(prev => ({
      ...prev,
      activeEffect: prev.pencilEffect.enabled ? null : 'pencil',
      pencilEffect: {
        ...prev.pencilEffect,
        enabled: !prev.pencilEffect.enabled
      }
    }));
  };

  const updatePencilConfig = (config: Partial<PencilEffectConfig>) => {
    setState(prev => ({
      ...prev,
      pencilEffect: { ...prev.pencilEffect, ...config }
    }));
  };

  const togglePixelateEffect = () => {
    setState(prev => ({
      ...prev,
      activeEffect: prev.pixelateEffect.enabled ? null : 'pixelate',
      pixelateEffect: {
        ...prev.pixelateEffect,
        enabled: !prev.pixelateEffect.enabled
      }
    }));
  };

  const updatePixelateConfig = (config: Partial<PixelateEffectConfig>) => {
    setState(prev => ({
      ...prev,
      pixelateEffect: { ...prev.pixelateEffect, ...config }
    }));
  };

  const toggleScanlineEffect = () => {
    setState(prev => ({
      ...prev,
      activeEffect: prev.scanlineEffect.enabled ? null : 'scanline',
      scanlineEffect: {
        ...prev.scanlineEffect,
        enabled: !prev.scanlineEffect.enabled
      }
    }));

    // Update scanline container visibility
    const container = document.querySelector('.scanline-container') as HTMLElement;
    if (container) {
      container.style.display = state.scanlineEffect.enabled ? 'none' : 'block';
    }
  };

  const updateScanlineConfig = (config: Partial<ScanlineEffectConfig>) => {
    setState(prev => {
      const newConfig = { ...prev.scanlineEffect, ...config };
      
      // Update scanline styles
      const container = document.querySelector('.scanline-container') as HTMLElement;
      const scanline = document.querySelector('.scanline') as HTMLElement;
      
      if (container && scanline) {
        container.style.mixBlendMode = newConfig.blendMode;
        container.style.backgroundColor = `rgba(0, 20, 80, ${newConfig.opacity * 0.6})`;
        scanline.style.setProperty('--scanline-color', newConfig.color);
        scanline.style.setProperty('--scanline-speed', `${newConfig.speed}s`);
      }

      return {
        ...prev,
        scanlineEffect: newConfig
      };
    });
  };

  return (
    <EffectsContext.Provider
      value={{
        ...state,
        setActiveEffect,
        togglePencilEffect,
        updatePencilConfig,
        togglePixelateEffect,
        updatePixelateConfig,
        toggleScanlineEffect,
        updateScanlineConfig
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
}; 