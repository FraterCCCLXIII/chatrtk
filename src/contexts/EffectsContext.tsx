import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { EffectType, EffectsState, PencilEffectConfig, PixelateEffectConfig, ScanlineEffectConfig, DotEffectConfig, DEFAULT_PENCIL_CONFIG, DEFAULT_PIXELATE_CONFIG, DEFAULT_SCANLINE_CONFIG, DEFAULT_DOT_CONFIG } from '@/types/effects';

interface EffectsContextType extends EffectsState {
  setActiveEffect: (effect: EffectType | null) => void;
  togglePencilEffect: () => void;
  updatePencilConfig: (config: Partial<PencilEffectConfig>) => void;
  togglePixelateEffect: () => void;
  updatePixelateConfig: (config: Partial<PixelateEffectConfig>) => void;
  toggleScanlineEffect: () => void;
  updateScanlineConfig: (config: Partial<ScanlineEffectConfig>) => void;
  toggleDotEffect: () => void;
  updateDotConfig: (config: Partial<DotEffectConfig>) => void;
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
    scanlineEffect: DEFAULT_SCANLINE_CONFIG,
    dotEffect: DEFAULT_DOT_CONFIG
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

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

      .pixelate-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        overflow: hidden;
        z-index: 9998;
        mix-blend-mode: screen;
      }

      .pixelate-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          linear-gradient(to right, var(--pixelate-color) 1px, transparent 1px),
          linear-gradient(to bottom, var(--pixelate-color) 1px, transparent 1px);
        background-size: var(--pixelate-size) var(--pixelate-size);
        opacity: var(--pixelate-opacity);
        animation: pixelate-anim var(--pixelate-speed) linear infinite;
      }

      @keyframes pixelate-anim {
        0% { transform: translate(0, 0); }
        100% { transform: translate(var(--pixelate-size), var(--pixelate-size)); }
      }
    `;
    document.head.appendChild(style);

    // Add SVG filters for squiggly effect only
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.width = '0';
    svg.style.height = '0';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    for (let i = 0; i < 5; i++) {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = `squiggly-${i}`;
      filter.setAttribute('x', '0%');
      filter.setAttribute('y', '0%');
      filter.setAttribute('width', '100%');
      filter.setAttribute('height', '100%');
      
      const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turbulence.setAttribute('type', 'fractalNoise');
      turbulence.setAttribute('baseFrequency', '0.02');
      turbulence.setAttribute('numOctaves', '3');
      turbulence.setAttribute('seed', i.toString());
      turbulence.setAttribute('result', 'noise');
      
      const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      displacement.setAttribute('in', 'SourceGraphic');
      displacement.setAttribute('in2', 'noise');
      displacement.setAttribute('scale', i % 2 === 0 ? '2' : '3');
      
      filter.appendChild(turbulence);
      filter.appendChild(displacement);
      defs.appendChild(filter);
    }
    
    svg.appendChild(defs);
    document.body.appendChild(svg);

    // Add pixelate container
    const pixelateContainer = document.createElement('div');
    pixelateContainer.className = 'pixelate-container';
    pixelateContainer.style.display = 'none';
    const pixelateGrid = document.createElement('div');
    pixelateGrid.className = 'pixelate-grid';
    pixelateContainer.appendChild(pixelateGrid);
    document.body.appendChild(pixelateContainer);

    // Add scanline container
    const scanlineContainer = document.createElement('div');
    scanlineContainer.className = 'scanline-container';
    scanlineContainer.style.display = 'none';
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    scanlineContainer.appendChild(scanline);
    document.body.appendChild(scanlineContainer);

    // Add dot effect canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    canvas.style.display = 'none';
    canvas.style.mixBlendMode = 'screen';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const resizeCanvas = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(svg);
      document.body.removeChild(pixelateContainer);
      document.body.removeChild(scanlineContainer);
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Dot effect animation
  useEffect(() => {
    if (!state.dotEffect.enabled || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.display = 'block';
    const config = state.dotEffect;
    const gridSize = config.gridSize;
    const elements: Array<Array<{ value: number; radiusInit: number; radiusSpeed: number }>> = [];

    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      elements[i] = [];
      for (let j = 0; j < gridSize; j++) {
        elements[i][j] = {
          value: 0,
          radiusInit: Math.random(),
          radiusSpeed: Math.random() * 0.5 + 0.5
        };
      }
    }

    const animate = (time: number) => {
      if (!ctx || !canvasRef.current) return;
      
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      
      ctx.fillStyle = '#0003';
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const gridStep = (canvas.width / dpr) / (gridSize - 1);
      const gridInit = gridStep * 0.5;
      const elementSize = gridStep * config.elementSize;

      ctx.lineWidth = config.thickness;
      ctx.fillStyle = config.color;
      ctx.strokeStyle = config.borderColor;
      ctx.beginPath();

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const el = elements[col][row];
          let elR = elementSize;

          if (config.noisy && col >= gridSize / 2) {
            const rFactor = Math.abs(Math.sin((el.radiusInit + el.radiusSpeed * time * 0.5 * config.animationSpeed) * Math.PI * 2)) * 0.5 + 0.5;
            elR *= 0.75;
            elR *= rFactor ** 2;
          }

          const x = col * gridStep + gridInit;
          const y = row * gridStep + gridInit;

          // Add 3D effect based on position
          const depth = Math.sin((col / gridSize) * Math.PI) * Math.cos((row / gridSize) * Math.PI);
          elR *= (0.5 + depth * 0.5);

          ctx.moveTo(x + elR, y);
          ctx.arc(x, y, elR, 0, Math.PI * 2);
        }
      }

      ctx.stroke();
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      timeRef.current = time * 0.001;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.dotEffect]);

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
    setState(prev => {
      const newConfig = { ...prev.pixelateEffect, ...config };
      
      // Update pixelate styles
      const container = document.querySelector('.pixelate-container') as HTMLElement;
      const grid = document.querySelector('.pixelate-grid') as HTMLElement;
      
      if (container && grid) {
        container.style.display = newConfig.enabled ? 'block' : 'none';
        grid.style.setProperty('--pixelate-color', newConfig.color);
        grid.style.setProperty('--pixelate-size', `${newConfig.gridSize}px`);
        grid.style.setProperty('--pixelate-opacity', newConfig.noisy ? '0.5' : '0.3');
        grid.style.setProperty('--pixelate-speed', `${newConfig.animationSpeed}s`);
      }

      return {
        ...prev,
        pixelateEffect: newConfig
      };
    });
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

  const toggleDotEffect = () => {
    setState(prev => ({
      ...prev,
      activeEffect: prev.dotEffect.enabled ? null : 'dot',
      dotEffect: {
        ...prev.dotEffect,
        enabled: !prev.dotEffect.enabled
      }
    }));
  };

  const updateDotConfig = (config: Partial<DotEffectConfig>) => {
    setState(prev => ({
      ...prev,
      dotEffect: { ...prev.dotEffect, ...config }
    }));
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
        updateScanlineConfig,
        toggleDotEffect,
        updateDotConfig
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
}; 