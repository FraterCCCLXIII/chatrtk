import { useEffect, useCallback } from 'react';

type HotkeyCallback = (e: KeyboardEvent) => void;

interface HotkeyOptions {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
}

export const useHotkeys = (
  key: string,
  callback: HotkeyCallback,
  options: HotkeyOptions = {}
) => {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    preventDefault = true,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrlKey &&
        e.shiftKey === shiftKey &&
        e.altKey === altKey &&
        e.metaKey === metaKey
      ) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    },
    [key, callback, ctrlKey, shiftKey, altKey, metaKey, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useHotkeysManager = () => {
  const registerHotkey = useCallback(
    (
      key: string,
      callback: HotkeyCallback,
      options: HotkeyOptions = {}
    ) => {
      useHotkeys(key, callback, options);
    },
    []
  );

  return { registerHotkey };
}; 