import { useEffect, useCallback } from 'react';
import { getHotkeyId } from '@/lib/hotkeysRegistry';

type HotkeyCallback = (e: KeyboardEvent) => void;

interface HotkeyOptions {
  preventDefault?: boolean;
  enabled?: boolean;
}

export const useHotkeys = (
  hotkeyId: string,
  callback: HotkeyCallback,
  options: HotkeyOptions = {}
) => {
  const {
    preventDefault = true,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const detectedHotkeyId = getHotkeyId(e);
      if (detectedHotkeyId === hotkeyId) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    },
    [hotkeyId, callback, preventDefault, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useHotkeysManager = () => {
  const registerHotkey = useCallback(
    (
      hotkeyId: string,
      callback: HotkeyCallback,
      options: HotkeyOptions = {}
    ) => {
      useHotkeys(hotkeyId, callback, options);
    },
    []
  );

  return { registerHotkey };
}; 