import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWindow, Settings, Eye, EyeOff, MessageSquare, MessageSquareOff, Smile, Mic, MicOff, FileText, Gamepad2, Keyboard as KeyboardIcon, Sparkles, Edit2, Subtitles, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import './Drawers.css';

interface DrawersProps {
  children?: React.ReactNode;
  isLeftOpen: boolean;
  isRightOpen: boolean;
  onLeftOpenChange: (isOpen: boolean) => void;
  onRightOpenChange: (isOpen: boolean) => void;
  showHead?: boolean;
  showChat?: boolean;
  isVoiceEnabled?: boolean;
  showCaptions?: boolean;
  onToggleHead?: () => void;
  onToggleChat?: () => void;
  onToggleVoice?: () => void;
  onToggleCaptions?: () => void;
  onOpenFaceSelector?: () => void;
  onOpenFacialRigEditor?: () => void;
  onOpenProjectInfo?: () => void;
  onOpenGames?: () => void;
  onOpenHotkeys?: () => void;
  onOpenSpecialEffects?: () => void;
  onOpenApiSettings?: () => void;
}

export const Drawers: React.FC<DrawersProps> = ({ 
  children,
  isLeftOpen,
  isRightOpen,
  onLeftOpenChange,
  onRightOpenChange,
  showHead = true,
  showChat = true,
  isVoiceEnabled = true,
  showCaptions = false,
  onToggleHead,
  onToggleChat,
  onToggleVoice,
  onToggleCaptions,
  onOpenFaceSelector,
  onOpenFacialRigEditor,
  onOpenProjectInfo,
  onOpenGames,
  onOpenHotkeys,
  onOpenSpecialEffects,
  onOpenApiSettings,
}) => {
  const leftDrawerRef = useRef<HTMLDivElement>(null);
  const rightDrawerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();

  // Handle click outside to close drawers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leftDrawerRef.current && !leftDrawerRef.current.contains(event.target as Node)) {
        onLeftOpenChange(false);
      }
      if (rightDrawerRef.current && !rightDrawerRef.current.contains(event.target as Node)) {
        onRightOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onLeftOpenChange, onRightOpenChange]);

  // Prevent body scroll when drawers are open
  useEffect(() => {
    if (isLeftOpen || isRightOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLeftOpen, isRightOpen]);

  return (
    <>
      {/* Left Drawer */}
      <AnimatePresence>
        {isLeftOpen && (
          <motion.div
            ref={leftDrawerRef}
            className="drawer left-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 40
            }}
          >
            {/* Left drawer content will go here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Drawer */}
      <AnimatePresence>
        {isRightOpen && (
          <motion.div
            ref={rightDrawerRef}
            className="drawer right-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 40
            }}
          >
            <div className="p-4">
              <div className="flex flex-col gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleHead}
                      className="w-full justify-start gap-2"
                    >
                      {showHead ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span>{showHead ? getTranslation('hideHead', currentLanguage) : getTranslation('showHead', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[h]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleChat}
                      className="w-full justify-start gap-2"
                    >
                      {showChat ? <MessageSquareOff className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                      <span>{showChat ? getTranslation('hideChat', currentLanguage) : getTranslation('showChat', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[c]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleVoice}
                      className="w-full justify-start gap-2"
                    >
                      {isVoiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      <span>{isVoiceEnabled ? getTranslation('disableVoice', currentLanguage) : getTranslation('enableVoice', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[v]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleCaptions}
                      className="w-full justify-start gap-2"
                    >
                      <Subtitles className={`h-5 w-5 ${showCaptions ? 'text-primary' : ''}`} />
                      <span>{showCaptions ? getTranslation('hideCaptions', currentLanguage) : getTranslation('showCaptions', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[t]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenFaceSelector}
                      className="w-full justify-start gap-2"
                    >
                      <Smile className="h-5 w-5" />
                      <span>{getTranslation('changeFace', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[f]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenFacialRigEditor}
                      className="w-full justify-start gap-2"
                    >
                      <Edit2 className="h-5 w-5" />
                      <span>{getTranslation('editFacialRig', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[e]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenProjectInfo}
                      className="w-full justify-start gap-2"
                    >
                      <FileText className="h-5 w-5" />
                      <span>{getTranslation('aboutRTK', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[i]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenGames}
                      className="w-full justify-start gap-2"
                    >
                      <Gamepad2 className="h-5 w-5" />
                      <span>{getTranslation('rtkArcade', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[g]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenHotkeys}
                      className="w-full justify-start gap-2"
                    >
                      <KeyboardIcon className="h-5 w-5" />
                      <span>{getTranslation('showHotkeys', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[k]</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenSpecialEffects}
                      className="w-full justify-start gap-2"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>{getTranslation('specialEffects', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[x]</TooltipContent>
                </Tooltip>

                <div className="h-px bg-border my-2" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onOpenApiSettings}
                      className="w-full justify-start gap-2"
                    >
                      <Key className="h-5 w-5" />
                      <span>{getTranslation('aiApiSettings', currentLanguage)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>[s]</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="drawer-content">
        {children}
      </div>
    </>
  );
};

// Export drawer toggle button components for use in navigation
export const LeftDrawerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { currentLanguage } = useLanguage();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="hover:scale-105 active:scale-95 transition-transform"
        >
          <AppWindow className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {getTranslation('appMenu', currentLanguage)}
      </TooltipContent>
    </Tooltip>
  );
};

export const RightDrawerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { currentLanguage } = useLanguage();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="hover:scale-105 active:scale-95 transition-transform ml-auto"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {getTranslation('settings', currentLanguage)}
      </TooltipContent>
    </Tooltip>
  );
};

export default Drawers; 