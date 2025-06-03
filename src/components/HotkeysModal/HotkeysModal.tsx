import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { HOTKEYS, getHotkeysByCategory, getHotkeyDisplay, isHotkeysEnabled, setHotkeysEnabled } from '@/lib/hotkeysRegistry';
import { HotkeyCategory } from '@/types/hotkeys';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HotkeysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotkeysModal: React.FC<HotkeysModalProps> = ({ open, onOpenChange }) => {
  const { currentLanguage } = useLanguage();
  const categories: HotkeyCategory[] = ['navigation', 'voice', 'chat', 'general'];
  const [enabled, setEnabled] = useState(isHotkeysEnabled());
  const descriptionId = "hotkeys-modal-description";

  // Listen for hotkeys state changes
  useEffect(() => {
    const handleHotkeysStateChange = (event: CustomEvent<boolean>) => {
      setEnabled(event.detail);
    };

    window.addEventListener('hotkeysStateChanged', handleHotkeysStateChange as EventListener);
    return () => {
      window.removeEventListener('hotkeysStateChanged', handleHotkeysStateChange as EventListener);
    };
  }, []);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setHotkeysEnabled(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{getTranslation('keyboardShortcuts', currentLanguage)}</span>
            <div className="flex items-center space-x-2">
              <Switch
                id="hotkeys-toggle"
                checked={enabled}
                onCheckedChange={handleToggle}
              />
              <Label htmlFor="hotkeys-toggle" className="text-sm">
                {enabled 
                  ? getTranslation('hotkeysEnabled', currentLanguage) 
                  : getTranslation('hotkeysDisabled', currentLanguage)}
              </Label>
            </div>
          </DialogTitle>
          <DialogDescription id={descriptionId}>
            {getTranslation('hotkeysDescription', currentLanguage) || 'View and manage keyboard shortcuts for the application.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold text-sm">
                {getTranslation(`${category}Hotkeys`, currentLanguage)}
              </h3>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                {getHotkeysByCategory(category).map((hotkey) => (
                  <React.Fragment key={hotkey.id}>
                    <div className="font-mono bg-muted px-2 py-1 rounded text-sm">
                      {getHotkeyDisplay(hotkey)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getTranslation(hotkey.id, currentLanguage) || hotkey.description}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotkeysModal; 