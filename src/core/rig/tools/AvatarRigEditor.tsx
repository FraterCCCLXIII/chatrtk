import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Slider } from '@/ui/slider-component';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/ui/accordion';
import { useToast } from '@/shared/hooks/use-toast';
import { FaceTheme, HeadShape, Expression, Phoneme } from '@/types/avatar';
import { AvatarRenderer } from '../base/AvatarRenderer';

interface RigElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius?: string;
  rotation?: number;
  opacity?: number;
}

interface AvatarRigConfig {
  headShape: HeadShape;
  head: RigElementStyle;
  leftEye: RigElementStyle;
  rightEye: RigElementStyle;
  leftTopEyelid: RigElementStyle;
  leftBottomEyelid: RigElementStyle;
  rightTopEyelid: RigElementStyle;
  rightBottomEyelid: RigElementStyle;
  mouth: RigElementStyle;
  topTeeth: RigElementStyle;
  bottomTeeth: RigElementStyle;
  tongue: RigElementStyle;
}

interface AvatarRigEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: FaceTheme;
  currentHeadShape?: HeadShape;
  onSave: (theme: FaceTheme, headShape: HeadShape, rigConfig?: Partial<AvatarRigConfig>) => void;
  voiceSettings?: {
    rate: number;
    pitch: number;
    volume: number;
    voice: string;
  };
  onVoiceSettingsChange?: (settings: Partial<AvatarRigEditorProps['voiceSettings']>) => void;
}

export type { RigElementStyle, AvatarRigConfig, AvatarRigEditorProps };

const AvatarRigEditor: React.FC<AvatarRigEditorProps> = ({
  open,
  onOpenChange,
  currentTheme,
  currentHeadShape,
  onSave,
  voiceSettings,
  onVoiceSettingsChange,
}) => {
  const [theme, setTheme] = useState<FaceTheme>(currentTheme);
  const [shape, setShape] = useState<HeadShape>(currentHeadShape || 'circle');
  const [expression, setExpression] = useState<Expression>(Expression.Neutral);
  const [speaking, setSpeaking] = useState(false);
  const [phoneme, setPhoneme] = useState<Phoneme>('neutral');
  const [blinking, setBlinking] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Create updated theme
    const updatedTheme: FaceTheme = {
      ...theme,
      previewColor: theme.faceColor,
      screenColor: theme.faceColor,
      faceColor: theme.faceColor,
      mouthColor: theme.faceColor, // Use faceColor for mouth
      borderColor: theme.strokeColor, // Use strokeColor for border
      textColor: '#333333', // Default text color
      backgroundColor: theme.screenColor, // Use screenColor for background
      tongueColor: theme.tongueColor,
      eyeColor: theme.eyeColor,
      strokeColor: theme.strokeColor,
      showStroke: theme.showStroke
    };
    
    onSave(updatedTheme, shape);
    toast({
      title: 'Settings saved',
      description: 'Your avatar settings have been updated.',
    });
  };

  // Update theme color handlers
  const handlePreviewColorChange = (color: string) => {
    setTheme(prev => ({ 
      ...prev, 
      previewColor: color,
      backgroundColor: color // Update background color to match preview
    }));
  };

  const handleScreenColorChange = (color: string) => {
    setTheme(prev => ({ 
      ...prev, 
      screenColor: color,
      backgroundColor: color // Update background color to match screen
    }));
  };

  const handleFaceColorChange = (color: string) => {
    setTheme(prev => ({ 
      ...prev, 
      faceColor: color,
      mouthColor: color // Update mouth color to match face
    }));
  };

  const handleTongueColorChange = (color: string) => {
    setTheme(prev => ({ ...prev, tongueColor: color }));
  };

  const handleEyeColorChange = (color: string) => {
    setTheme(prev => ({ ...prev, eyeColor: color }));
  };

  const handleStrokeColorChange = (color: string) => {
    setTheme(prev => ({ 
      ...prev, 
      strokeColor: color,
      borderColor: color // Update border color to match stroke
    }));
  };

  const handleShowStrokeChange = (show: boolean) => {
    setTheme(prev => ({ ...prev, showStroke: show }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Avatar Rig Editor</DialogTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="aspect-square relative">
                <AvatarRenderer
                  theme={theme}
                  shape={shape}
                  expression={expression}
                  speaking={speaking}
                  phoneme={phoneme}
                  blinking={blinking}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setSpeaking(!speaking)}
                  className="w-full"
                >
                  {speaking ? 'Stop Speaking' : 'Start Speaking'}
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(Expression).map((exp) => (
                    <Button
                      key={exp}
                      variant={expression === exp ? 'default' : 'outline'}
                      onClick={() => setExpression(exp)}
                      className="w-full"
                    >
                      {exp}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Voice Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[voiceSettings?.rate || 1]}
                      onValueChange={([value]) => onVoiceSettingsChange?.({ rate: value })}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">
                      {voiceSettings?.rate || 1}x
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pitch">Pitch</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[voiceSettings?.pitch || 1]}
                      onValueChange={([value]) => onVoiceSettingsChange?.({ pitch: value })}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">
                      {voiceSettings?.pitch || 1}x
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[voiceSettings?.volume || 1]}
                      onValueChange={([value]) => onVoiceSettingsChange?.({ volume: value })}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">
                      {Math.round((voiceSettings?.volume || 1) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AvatarRigEditor as default }; 