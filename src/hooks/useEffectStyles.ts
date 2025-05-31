import { useMemo } from 'react';
import { useEffects } from '@/contexts/EffectsContext';

export const useEffectStyles = () => {
  const { activeEffect, pencilEffect, pixelateEffect } = useEffects();

  const styles = useMemo(() => {
    const baseStyles: React.CSSProperties = {};

    if (activeEffect === 'pencil' && pencilEffect.enabled) {
      baseStyles.animation = `squiggly-anim ${1 / pencilEffect.animationSpeed}s infinite`;
      baseStyles.filter = `url(#squiggly-0)`;
    } else if (activeEffect === 'pixelate' && pixelateEffect.enabled) {
      baseStyles.filter = `url(#pixelate)`;
      // Update the pixelate filter parameters based on config
      const pixelateFilter = document.querySelector('#pixelate') as SVGElement;
      if (pixelateFilter) {
        const flood = pixelateFilter.querySelector('feFlood') as SVGElement;
        const composite = pixelateFilter.querySelector('feComposite') as SVGElement;
        const morphology = pixelateFilter.querySelector('feMorphology') as SVGElement;

        if (flood) {
          const size = Math.max(2, Math.min(20, pixelateEffect.pixelSize));
          flood.setAttribute('width', size.toString());
          flood.setAttribute('height', size.toString());
        }
        if (composite) {
          const size = Math.max(5, Math.min(50, pixelateEffect.pixelSize * 2));
          composite.setAttribute('width', size.toString());
          composite.setAttribute('height', size.toString());
        }
        if (morphology) {
          const radius = Math.max(1, Math.min(10, pixelateEffect.intensity / 10));
          morphology.setAttribute('radius', radius.toString());
        }
      }
    }

    return baseStyles;
  }, [activeEffect, pencilEffect, pixelateEffect]);

  return styles;
}; 