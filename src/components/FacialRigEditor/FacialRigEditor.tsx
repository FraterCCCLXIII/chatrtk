import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { FaceTheme } from '../FaceSelectorModal/FaceSelectorModal';
import TalkingHead from '../TalkingHead/TalkingHead';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

export interface HeadShape {
  id: string;
  name: string;
  shape: 'none' | 'square' | 'circle' | 'rectangle';
}

export interface ElementStyle {
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

export interface FaceRigConfig {
  headShape: HeadShape;
  head: ElementStyle;
  leftEye: ElementStyle;
  rightEye: ElementStyle;
  leftTopEyelid: ElementStyle;
  leftBottomEyelid: ElementStyle;
  rightTopEyelid: ElementStyle;
  rightBottomEyelid: ElementStyle;
  mouth: ElementStyle;
  topTeeth: ElementStyle;
  bottomTeeth: ElementStyle;
  tongue: ElementStyle;
}

export interface FacialRigEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFaceTheme: FaceTheme;
  currentHeadShape?: HeadShape;
  onSave: (faceTheme: FaceTheme, headShape: HeadShape, rigConfig?: Partial<FaceRigConfig>) => void;
}

const FacialRigEditor: React.FC<FacialRigEditorProps> = ({
  open,
  onOpenChange,
  currentFaceTheme,
  currentHeadShape,
  onSave,
}) => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<FaceTheme>({
    ...currentFaceTheme,
    eyeColor: currentFaceTheme.eyeColor || '#000000',
    strokeColor: currentFaceTheme.strokeColor || '#333333',
    showStroke: currentFaceTheme.showStroke !== false
  });
  const [previewColor, setPreviewColor] = useState(currentFaceTheme.previewColor);
  const [screenColor, setScreenColor] = useState(currentFaceTheme.screenColor);
  const [faceColor, setFaceColor] = useState(currentFaceTheme.faceColor);
  const [tongueColor, setTongueColor] = useState(currentFaceTheme.tongueColor);
  const [eyeColor, setEyeColor] = useState(currentFaceTheme.eyeColor || '#000000');
  const [strokeColor, setStrokeColor] = useState(currentFaceTheme.strokeColor || '#333333');
  const [showStroke, setShowStroke] = useState(currentFaceTheme.showStroke !== false);
  
  // Head shape options
  const headShapes: HeadShape[] = [
    {
      id: 'none',
      name: 'No Shape',
      shape: 'none',
    },
    {
      id: 'square',
      name: 'Square (Rounded)',
      shape: 'square',
    },
    {
      id: 'circle',
      name: 'Circle',
      shape: 'circle',
    },
    {
      id: 'rectangle',
      name: 'Rectangle (Rounded)',
      shape: 'rectangle',
    },
  ];
  
  const [selectedHeadShape, setSelectedHeadShape] = useState<HeadShape>(
    currentHeadShape || headShapes[0]
  );
  
  // Default element styles
  const defaultHeadStyle: ElementStyle = {
    x: 0,
    y: 0,
    width: 220,
    height: 160,
    fillColor: '#5daa77', // Default face color
    strokeColor: '#333333',
    strokeWidth: 8,
    borderRadius: '20px'
  };
  
  const defaultLeftEyeStyle: ElementStyle = {
    x: 30,
    y: 40,
    width: 12,
    height: 12,
    fillColor: '#000000',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '50%'
  };
  
  const defaultRightEyeStyle: ElementStyle = {
    x: 70,
    y: 40,
    width: 12,
    height: 12,
    fillColor: '#000000',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '50%'
  };
  
  const defaultLeftTopEyelidStyle: ElementStyle = {
    x: 30,
    y: 34,
    width: 14,
    height: 6,
    fillColor: '#333333',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '50% 50% 0 0',
    rotation: 0,
    opacity: 0
  };
  
  const defaultLeftBottomEyelidStyle: ElementStyle = {
    x: 30,
    y: 46,
    width: 14,
    height: 6,
    fillColor: '#333333',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '0 0 50% 50%',
    rotation: 0,
    opacity: 0
  };
  
  const defaultRightTopEyelidStyle: ElementStyle = {
    x: 70,
    y: 34,
    width: 14,
    height: 6,
    fillColor: '#333333',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '50% 50% 0 0',
    rotation: 0,
    opacity: 0
  };
  
  const defaultRightBottomEyelidStyle: ElementStyle = {
    x: 70,
    y: 46,
    width: 14,
    height: 6,
    fillColor: '#333333',
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '0 0 50% 50%',
    rotation: 0,
    opacity: 0
  };
  
  const defaultMouthStyle: ElementStyle = {
    x: 50,
    y: 60,
    width: 60,
    height: 30,
    fillColor: '#5daa77', // Default face color
    strokeColor: '#333333',
    strokeWidth: 1,
    borderRadius: '15px'
  };
  
  const defaultTopTeethStyle: ElementStyle = {
    x: 50,
    y: -6,
    width: 110,
    height: 12,
    fillColor: '#FFFFFF',
    strokeColor: '#DDDDDD',
    strokeWidth: 1,
    borderRadius: '0 0 8px 8px'
  };
  
  const defaultBottomTeethStyle: ElementStyle = {
    x: 50,
    y: 6,
    width: 110,
    height: 12,
    fillColor: '#FFFFFF',
    strokeColor: '#DDDDDD',
    strokeWidth: 1,
    borderRadius: '8px 8px 0 0'
  };
  
  const defaultTongueStyle: ElementStyle = {
    x: 50,
    y: -4,
    width: 30,
    height: 12,
    fillColor: tongueColor,
    strokeColor: 'transparent',
    strokeWidth: 0,
    borderRadius: '15px 15px 5px 5px'
  };
  
  // Element style states
  const [headStyle, setHeadStyle] = useState<ElementStyle>(defaultHeadStyle);
  const [leftEyeStyle, setLeftEyeStyle] = useState<ElementStyle>(defaultLeftEyeStyle);
  const [rightEyeStyle, setRightEyeStyle] = useState<ElementStyle>(defaultRightEyeStyle);
  const [leftTopEyelidStyle, setLeftTopEyelidStyle] = useState<ElementStyle>(defaultLeftTopEyelidStyle);
  const [leftBottomEyelidStyle, setLeftBottomEyelidStyle] = useState<ElementStyle>(defaultLeftBottomEyelidStyle);
  const [rightTopEyelidStyle, setRightTopEyelidStyle] = useState<ElementStyle>(defaultRightTopEyelidStyle);
  const [rightBottomEyelidStyle, setRightBottomEyelidStyle] = useState<ElementStyle>(defaultRightBottomEyelidStyle);
  const [mouthStyle, setMouthStyle] = useState<ElementStyle>(defaultMouthStyle);
  const [topTeethStyle, setTopTeethStyle] = useState<ElementStyle>(defaultTopTeethStyle);
  const [bottomTeethStyle, setBottomTeethStyle] = useState<ElementStyle>(defaultBottomTeethStyle);
  const [tongueStyle, setTongueStyle] = useState<ElementStyle>(defaultTongueStyle);

  const handleSave = () => {
    // Create updated theme
    const updatedTheme: FaceTheme = {
      ...selectedTheme,
      previewColor,
      screenColor,
      faceColor,
      tongueColor,
      eyeColor,
      strokeColor,
      showStroke
    };
    
    // Create rig configuration
    const rigConfig: FaceRigConfig = {
      headShape: selectedHeadShape,
      head: headStyle,
      leftEye: leftEyeStyle,
      rightEye: rightEyeStyle,
      leftTopEyelid: leftTopEyelidStyle,
      leftBottomEyelid: leftBottomEyelidStyle,
      rightTopEyelid: rightTopEyelidStyle,
      rightBottomEyelid: rightBottomEyelidStyle,
      mouth: mouthStyle,
      topTeeth: topTeethStyle,
      bottomTeeth: bottomTeethStyle,
      tongue: tongueStyle
    };
    
    onSave(updatedTheme, selectedHeadShape, rigConfig);
    
    toast({
      title: "Changes Saved",
      description: "Your facial rig customizations have been applied.",
    });
    
    onOpenChange(false);
  };

  // Define expressions for the animation panel
  const expressions = [
    { id: 'neutral', name: 'Neutral' },
    { id: 'happy', name: 'Happy' },
    { id: 'sad', name: 'Sad' },
    { id: 'surprised', name: 'Surprised' },
    { id: 'angry', name: 'Angry' },
    { id: 'thinking', name: 'Thinking' }
  ];

  // Define phonemes for the animation panel
  const phonemes = [
    { id: 'A', name: 'A' },
    { id: 'E', name: 'E' },
    { id: 'I', name: 'I' },
    { id: 'O', name: 'O' },
    { id: 'U', name: 'U' },
    { id: 'M', name: 'M' },
    { id: 'B', name: 'B' },
    { id: 'P', name: 'P' },
    { id: 'F', name: 'F' },
    { id: 'V', name: 'V' },
    { id: 'L', name: 'L' },
    { id: 'T', name: 'T' }
  ];

  const [currentExpression, setCurrentExpression] = useState('happy');
  const [currentPhoneme, setCurrentPhoneme] = useState('');
  
  // Update expression handler
  const handleExpressionChange = (expression: string) => {
    setCurrentExpression(expression);
    
    // Update mouth and eye styles based on expression
    switch (expression) {
      case 'happy':
        setMouthStyle({
          ...mouthStyle,
          height: 20,
          borderRadius: '0 0 30px 30px',
          y: 65
        });
        setLeftEyeStyle({...leftEyeStyle, height: 8, y: 38});
        setRightEyeStyle({...rightEyeStyle, height: 8, y: 38});
        break;
      case 'sad':
        setMouthStyle({
          ...mouthStyle,
          height: 20,
          borderRadius: '30px 30px 0 0',
          y: 70
        });
        setLeftEyeStyle({...leftEyeStyle, height: 12, y: 42});
        setRightEyeStyle({...rightEyeStyle, height: 12, y: 42});
        break;
      case 'surprised':
        setMouthStyle({
          ...mouthStyle,
          height: 30,
          borderRadius: '50%',
          y: 60
        });
        setLeftEyeStyle({...leftEyeStyle, height: 16, y: 35});
        setRightEyeStyle({...rightEyeStyle, height: 16, y: 35});
        break;
      case 'angry':
        setMouthStyle({
          ...mouthStyle,
          height: 15,
          borderRadius: '0',
          y: 65
        });
        setLeftEyeStyle({...leftEyeStyle, height: 8, y: 38});
        setRightEyeStyle({...rightEyeStyle, height: 8, y: 38});
        break;
      case 'thinking':
        setMouthStyle({
          ...mouthStyle,
          height: 25,
          borderRadius: '15px',
          y: 65
        });
        setLeftEyeStyle({...leftEyeStyle, height: 12, y: 40});
        setRightEyeStyle({...rightEyeStyle, height: 12, y: 40});
        break;
      default: // neutral
        setMouthStyle({
          ...mouthStyle,
          height: 30,
          borderRadius: '15px',
          y: 60
        });
        setLeftEyeStyle({...leftEyeStyle, height: 12, y: 40});
        setRightEyeStyle({...rightEyeStyle, height: 12, y: 40});
    }
  };

  // Update phoneme handler
  const handlePhonemeChange = (phoneme: string) => {
    setCurrentPhoneme(phoneme);
    
    // Update mouth and teeth styles based on phoneme
    switch (phoneme) {
      case 'A':
        setMouthStyle({...mouthStyle, height: 40, y: 55});
        setTopTeethStyle({...topTeethStyle, y: -10});
        setBottomTeethStyle({...bottomTeethStyle, y: 10});
        setTongueStyle({...tongueStyle, height: 20, y: 0});
        break;
      case 'E':
        setMouthStyle({...mouthStyle, height: 25, y: 60});
        setTopTeethStyle({...topTeethStyle, y: -8});
        setBottomTeethStyle({...bottomTeethStyle, y: 8});
        setTongueStyle({...tongueStyle, height: 15, y: 2});
        break;
      case 'I':
        setMouthStyle({...mouthStyle, height: 20, y: 62});
        setTopTeethStyle({...topTeethStyle, y: -6});
        setBottomTeethStyle({...bottomTeethStyle, y: 6});
        setTongueStyle({...tongueStyle, height: 12, y: 4});
        break;
      case 'O':
        setMouthStyle({...mouthStyle, height: 35, y: 58, borderRadius: '50%'});
        setTopTeethStyle({...topTeethStyle, y: -12});
        setBottomTeethStyle({...bottomTeethStyle, y: 12});
        setTongueStyle({...tongueStyle, height: 18, y: -2});
        break;
      case 'U':
        setMouthStyle({...mouthStyle, height: 30, y: 60, borderRadius: '40%'});
        setTopTeethStyle({...topTeethStyle, y: -10});
        setBottomTeethStyle({...bottomTeethStyle, y: 10});
        setTongueStyle({...tongueStyle, height: 15, y: 0});
        break;
      case 'M':
      case 'B':
      case 'P':
        setMouthStyle({...mouthStyle, height: 15, y: 65});
        setTopTeethStyle({...topTeethStyle, y: -4});
        setBottomTeethStyle({...bottomTeethStyle, y: 4});
        setTongueStyle({...tongueStyle, height: 10, y: 6});
        break;
      case 'F':
      case 'V':
        setMouthStyle({...mouthStyle, height: 20, y: 63});
        setTopTeethStyle({...topTeethStyle, y: -6});
        setBottomTeethStyle({...bottomTeethStyle, y: 6});
        setTongueStyle({...tongueStyle, height: 12, y: 4});
        break;
      case 'L':
        setMouthStyle({...mouthStyle, height: 25, y: 61});
        setTopTeethStyle({...topTeethStyle, y: -8});
        setBottomTeethStyle({...bottomTeethStyle, y: 8});
        setTongueStyle({...tongueStyle, height: 20, y: 0});
        break;
      case 'T':
        setMouthStyle({...mouthStyle, height: 22, y: 62});
        setTopTeethStyle({...topTeethStyle, y: -7});
        setBottomTeethStyle({...bottomTeethStyle, y: 7});
        setTongueStyle({...tongueStyle, height: 15, y: 2});
        break;
      default:
        // Reset to neutral mouth position
        setMouthStyle({...mouthStyle, height: 30, y: 60, borderRadius: '15px'});
        setTopTeethStyle({...topTeethStyle, y: -6});
        setBottomTeethStyle({...bottomTeethStyle, y: 6});
        setTongueStyle({...tongueStyle, height: 12, y: 0});
    }
  };

  // Helper component for element style controls
  const ElementStyleControls = ({ 
    title, 
    style, 
    onChange 
  }: { 
    title: string; 
    style: ElementStyle; 
    onChange: (style: ElementStyle) => void 
  }) => {
    // Convert percentage to pixels for position controls
    const convertToPixels = (value: number, max: number) => {
      return Math.round((value / 100) * max);
    };

    // Convert pixels to percentage for position controls
    const convertToPercentage = (value: number, max: number) => {
      return Math.round((value / max) * 100);
    };

    // Get max dimensions based on element type
    const getMaxDimensions = () => {
      switch (title.toLowerCase()) {
        case 'head':
          return { width: 280, height: 280 };
        case 'left eye':
        case 'right eye':
          return { width: 24, height: 24 };
        case 'left top eyelid':
        case 'left bottom eyelid':
        case 'right top eyelid':
        case 'right bottom eyelid':
          return { width: 14, height: 6 };
        case 'mouth':
          return { width: 80, height: 40 };
        case 'top teeth':
        case 'bottom teeth':
          return { width: 110, height: 12 };
        case 'tongue':
          return { width: 30, height: 12 };
        default:
          return { width: 100, height: 100 };
      }
    };

    const maxDims = getMaxDimensions();

    return (
      <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
        <AccordionTrigger className="text-base font-medium">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`${title}-x`}>X Position (px)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-x`}
                    min={0} 
                    max={maxDims.width} 
                    step={1} 
                    value={[style.x]} 
                    onValueChange={(value) => onChange({...style, x: value[0]})}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    value={style.x} 
                    onChange={(e) => onChange({...style, x: Number(e.target.value)})}
                    className="w-16"
                    min={0}
                    max={maxDims.width}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${title}-y`}>Y Position (px)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-y`}
                    min={0} 
                    max={maxDims.height} 
                    step={1} 
                    value={[style.y]} 
                    onValueChange={(value) => onChange({...style, y: value[0]})}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    value={style.y} 
                    onChange={(e) => onChange({...style, y: Number(e.target.value)})}
                    className="w-16"
                    min={0}
                    max={maxDims.height}
                  />
                </div>
              </div>
            </div>
            
            {/* Size Controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`${title}-width`}>Width (px)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-width`}
                    min={1} 
                    max={maxDims.width * 2} 
                    step={1} 
                    value={[style.width]} 
                    onValueChange={(value) => onChange({...style, width: value[0]})}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    value={style.width} 
                    onChange={(e) => onChange({...style, width: Number(e.target.value)})}
                    className="w-16"
                    min={1}
                    max={maxDims.width * 2}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${title}-height`}>Height (px)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-height`}
                    min={1} 
                    max={maxDims.height * 2} 
                    step={1} 
                    value={[style.height]} 
                    onValueChange={(value) => onChange({...style, height: value[0]})}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    value={style.height} 
                    onChange={(e) => onChange({...style, height: Number(e.target.value)})}
                    className="w-16"
                    min={1}
                    max={maxDims.height * 2}
                  />
                </div>
              </div>
            </div>
            
            {/* Color Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`${title}-fill`}>Fill Color</Label>
                  <input 
                    type="color" 
                    id={`${title}-fill`}
                    value={style.fillColor} 
                    onChange={(e) => onChange({...style, fillColor: e.target.value})}
                    className="w-8 h-6"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`${title}-stroke`}>Stroke Color</Label>
                  <input 
                    type="color" 
                    id={`${title}-stroke`}
                    value={style.strokeColor} 
                    onChange={(e) => onChange({...style, strokeColor: e.target.value})}
                    className="w-8 h-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Stroke Width */}
            <div className="space-y-1">
              <Label htmlFor={`${title}-stroke-width`}>Stroke Width (px)</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  id={`${title}-stroke-width`}
                  min={0} 
                  max={20} 
                  step={1} 
                  value={[style.strokeWidth]} 
                  onValueChange={(value) => onChange({...style, strokeWidth: value[0]})}
                  className="flex-1"
                />
                <Input 
                  type="number" 
                  value={style.strokeWidth} 
                  onChange={(e) => onChange({...style, strokeWidth: Number(e.target.value)})}
                  className="w-16"
                />
              </div>
            </div>
            
            {/* Border Radius */}
            <div className="space-y-1">
              <Label htmlFor={`${title}-border-radius`}>Border Radius</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  id={`${title}-border-radius-slider`}
                  min={0} 
                  max={50} 
                  step={1} 
                  value={[parseInt(style.borderRadius || '0') || 0]} 
                  onValueChange={(value) => onChange({...style, borderRadius: `${value[0]}px`})}
                  className="flex-1"
                />
                <Input 
                  id={`${title}-border-radius`}
                  value={style.borderRadius || ''} 
                  onChange={(e) => onChange({...style, borderRadius: e.target.value})}
                  placeholder="e.g. 10px or 50%"
                  className="w-24"
                />
              </div>
            </div>
            
            {/* Rotation */}
            <div className="space-y-1">
              <Label htmlFor={`${title}-rotation`}>Rotation (deg)</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  id={`${title}-rotation`}
                  min={0}
                  max={360}
                  step={1}
                  value={[style.rotation || 0]}
                  onValueChange={(value) => onChange({...style, rotation: value[0]})}
                />
                <Input 
                  className="w-16"
                  value={style.rotation || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      onChange({...style, rotation: value});
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Opacity */}
            <div className="space-y-1">
              <Label htmlFor={`${title}-opacity`}>Opacity</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  id={`${title}-opacity`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[style.opacity !== undefined ? style.opacity : 1]}
                  onValueChange={(value) => onChange({...style, opacity: value[0]})}
                />
                <Input 
                  className="w-16"
                  value={style.opacity !== undefined ? style.opacity : 1}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      onChange({...style, opacity: value});
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  // Update head shape change handler
  const handleHeadShapeChange = (shapeId: string) => {
    const shape = headShapes.find(s => s.id === shapeId);
    if (shape) {
      setSelectedHeadShape(shape);
      
      // Reset element positions based on new head shape
      const baseStyle = {
        x: 0,
        y: 0,
        width: 220,
        height: 160,
        fillColor: faceColor,
        strokeColor: '#333333',
        strokeWidth: 8,
        borderRadius: shape.shape === 'circle' ? '50%' : 
                     shape.shape === 'square' ? '20px' :
                     shape.shape === 'rectangle' ? '30px' : '0'
      };
      
      setHeadStyle(baseStyle);
      
      // Reset other elements to their default positions
      setLeftEyeStyle(defaultLeftEyeStyle);
      setRightEyeStyle(defaultRightEyeStyle);
      setLeftTopEyelidStyle(defaultLeftTopEyelidStyle);
      setLeftBottomEyelidStyle(defaultLeftBottomEyelidStyle);
      setRightTopEyelidStyle(defaultRightTopEyelidStyle);
      setRightBottomEyelidStyle(defaultRightBottomEyelidStyle);
      setMouthStyle(defaultMouthStyle);
      setTopTeethStyle(defaultTopTeethStyle);
      setBottomTeethStyle(defaultBottomTeethStyle);
      setTongueStyle(defaultTongueStyle);
    }
  };

  // Update theme color handlers
  const handlePreviewColorChange = (color: string) => {
    setPreviewColor(color);
    setSelectedTheme(prev => ({ ...prev, previewColor: color }));
  };

  const handleScreenColorChange = (color: string) => {
    setScreenColor(color);
    setSelectedTheme(prev => ({ ...prev, screenColor: color }));
  };

  const handleFaceColorChange = (color: string) => {
    setFaceColor(color);
    setSelectedTheme(prev => ({ ...prev, faceColor: color }));
  };

  const handleTongueColorChange = (color: string) => {
    setTongueColor(color);
    setSelectedTheme(prev => ({ ...prev, tongueColor: color }));
  };

  // Update eye color handler
  const handleEyeColorChange = (color: string) => {
    setEyeColor(color);
    setSelectedTheme(prev => ({ ...prev, eyeColor: color }));
  };

  // Update stroke color handler
  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    setSelectedTheme(prev => ({ ...prev, strokeColor: color }));
  };

  // Update stroke visibility handler
  const handleShowStrokeChange = (checked: boolean) => {
    setShowStroke(checked);
    setSelectedTheme(prev => ({ ...prev, showStroke: checked }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-full w-screen h-screen max-h-screen p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Drawer - Animation Controls */}
          <div className="w-64 bg-slate-100 p-4 overflow-y-auto border-r">
            <h2 className="text-xl font-bold mb-4">Animation</h2>
            
            {/* Expressions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Expressions</h3>
              <div className="space-y-2">
                {expressions.map(exp => (
                  <Button 
                    key={exp.id}
                    variant={currentExpression === exp.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleExpressionChange(exp.id)}
                  >
                    {exp.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Phonemes */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Phonemes</h3>
              <div className="grid grid-cols-3 gap-2">
                {phonemes.map(phoneme => (
                  <Button 
                    key={phoneme.id}
                    variant={currentPhoneme === phoneme.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handlePhonemeChange(phoneme.id)}
                  >
                    {phoneme.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content - Face Preview */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <DialogTitle className="text-2xl">Facial Rig Editor</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: selectedTheme.previewColor }}>
              <div className="w-96 h-96">
                <TalkingHead 
                  theme={selectedTheme}
                  headShape={selectedHeadShape}
                  expression={currentExpression as any}
                  text={currentPhoneme ? `Example of ${currentPhoneme} sound` : undefined}
                  speaking={!!currentPhoneme}
                />
              </div>
            </div>
          </div>
          
          {/* Right Drawer - Inspector */}
          <div className="w-80 bg-slate-100 p-4 overflow-y-auto border-l">
            <h2 className="text-xl font-bold mb-4">Inspector</h2>
            {/* Head Shape Dropdown */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Head Shape</h3>
              <Select 
                value={selectedHeadShape.id}
                onValueChange={handleHeadShapeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a head shape" />
                </SelectTrigger>
                <SelectContent>
                  {headShapes.map((shape) => (
                    <SelectItem key={shape.id} value={shape.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {shape.shape === 'none' && '○'}
                          {shape.shape === 'square' && '▭'}
                          {shape.shape === 'circle' && '⬤'}
                          {shape.shape === 'rectangle' && '▭'}
                        </span>
                        <span>{shape.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Theme Colors */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Theme Colors</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="preview-color">Background</Label>
                    <input 
                      type="color" 
                      value={selectedTheme.previewColor} 
                      onChange={(e) => handlePreviewColorChange(e.target.value)}
                      id="preview-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="screen-color">Face</Label>
                    <input 
                      type="color" 
                      value={selectedTheme.screenColor} 
                      onChange={(e) => handleScreenColorChange(e.target.value)}
                      id="screen-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="face-color">Mouth</Label>
                    <input 
                      type="color" 
                      value={selectedTheme.faceColor} 
                      onChange={(e) => handleFaceColorChange(e.target.value)}
                      id="face-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="eye-color">Eyes</Label>
                    <input 
                      type="color" 
                      value={selectedTheme.eyeColor || '#000000'} 
                      onChange={(e) => handleEyeColorChange(e.target.value)}
                      id="eye-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tongue-color">Tongue</Label>
                    <input 
                      type="color" 
                      value={selectedTheme.tongueColor} 
                      onChange={(e) => handleTongueColorChange(e.target.value)}
                      id="tongue-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="stroke-color">Face Stroke</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={selectedTheme.strokeColor || '#333333'} 
                        onChange={(e) => handleStrokeColorChange(e.target.value)}
                        id="stroke-color"
                        className="w-10 h-6"
                        disabled={!selectedTheme.showStroke}
                      />
                      <input
                        type="checkbox"
                        checked={selectedTheme.showStroke}
                        onChange={(e) => handleShowStrokeChange(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacialRigEditor;