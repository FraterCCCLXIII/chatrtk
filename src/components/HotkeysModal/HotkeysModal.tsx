import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface Hotkey {
  key: string;
  description: string;
  category: 'navigation' | 'voice' | 'chat' | 'general';
}

const hotkeys: Hotkey[] = [
  // Navigation
  { key: '⌘/Ctrl + H', description: 'Toggle head visibility', category: 'navigation' },
  { key: '⌘/Ctrl + C', description: 'Toggle chat visibility', category: 'navigation' },
  { key: '⌘/Ctrl + F', description: 'Open face selector', category: 'navigation' },
  { key: '⌘/Ctrl + E', description: 'Open facial rig editor', category: 'navigation' },
  { key: '⌘/Ctrl + S', description: 'Open settings', category: 'navigation' },
  { key: '⌘/Ctrl + G', description: 'Open RTK Arcade', category: 'navigation' },
  { key: '⌘/Ctrl + I', description: 'Open project info', category: 'navigation' },
  
  // Voice Controls
  { key: '⌘/Ctrl + V', description: 'Toggle voice', category: 'voice' },
  { key: '⌘/Ctrl + M', description: 'Toggle microphone', category: 'voice' },
  { key: '⌘/Ctrl + A', description: 'Toggle always listen', category: 'voice' },
  { key: 'Space', description: 'Stop/Continue AI', category: 'voice' },
  
  // Chat Controls
  { key: 'Enter', description: 'Send message', category: 'chat' },
  { key: 'Shift + Enter', description: 'New line in chat', category: 'chat' },
  { key: '⌘/Ctrl + L', description: 'Change language', category: 'chat' },
  
  // General
  { key: '⌘/Ctrl + K', description: 'Show hotkeys', category: 'general' },
  { key: 'Esc', description: 'Close any modal', category: 'general' },
];

interface HotkeysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotkeysModal: React.FC<HotkeysModalProps> = ({ open, onOpenChange }) => {
  const { currentLanguage } = useLanguage();

  const hotkeys = [
    { key: 'k', description: getTranslation('showHotkeys', currentLanguage) },
    { key: 'h', description: getTranslation('toggleHead', currentLanguage) },
    { key: 'c', description: getTranslation('toggleChat', currentLanguage) },
    { key: 'f', description: getTranslation('changeFace', currentLanguage) },
    { key: 'e', description: getTranslation('editFacialRig', currentLanguage) },
    { key: 's', description: getTranslation('settings', currentLanguage) },
    { key: 'g', description: getTranslation('rtkArcade', currentLanguage) },
    { key: 'i', description: getTranslation('aboutRTK', currentLanguage) },
    { key: 'v', description: getTranslation('toggleVoice', currentLanguage) },
    { key: 'm', description: getTranslation('toggleVoiceInput', currentLanguage) },
    { key: 'a', description: getTranslation('toggleAlwaysListen', currentLanguage) },
    { key: 'l', description: getTranslation('changeLanguage', currentLanguage) },
    { key: 'b', description: getTranslation('chatVerbosity', currentLanguage) },
    { key: 'Space', description: getTranslation('stopContinueAI', currentLanguage) },
    { key: 'Enter', description: getTranslation('sendMessage', currentLanguage) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTranslation('keyboardShortcuts', currentLanguage)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            {hotkeys.map((hotkey) => (
              <React.Fragment key={hotkey.key}>
                <div className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {hotkey.key}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hotkey.description}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotkeysModal; 