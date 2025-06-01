import { useEffect, useCallback } from 'react';
import { HOTKEYS } from './hotkeyMap';

interface HotkeyOptions {
  preventDefault?: boolean;
  enabled?: boolean;
}

export const useHotkeys = (
  hotkeyId: string,
  callback: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {}
) => {
  const { preventDefault = true, enabled = true } = options;
  const hotkey = HOTKEYS[hotkeyId];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !hotkey) return;

      const key = event.key.toLowerCase();
      const modifier = hotkey.modifier;
      const hasModifier = modifier ? event[`${modifier}Key`] : true;

      if (
        key === hotkey.key.toLowerCase() &&
        hasModifier &&
        (!hotkey.requiresModifier || event[`${hotkey.modifier}Key`])
      ) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [hotkey, callback, enabled, preventDefault]
  );

  useEffect(() => {
    if (enabled && hotkey) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, hotkey, handleKeyDown]);
}; 