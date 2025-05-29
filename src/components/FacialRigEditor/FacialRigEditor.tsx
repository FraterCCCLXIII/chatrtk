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
  shape: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart';
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
}

export interface FaceRigConfig {
  headShape: HeadShape;
  head: ElementStyle;
  leftEye: ElementStyle;
  rightEye: ElementStyle;
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
  const [selectedTheme, setSelectedTheme] = useState<FaceTheme>({...currentFaceTheme});
  const [previewColor, setPreviewColor] = useState(currentFaceTheme.previewColor);
  const [screenColor, setScreenColor] = useState(currentFaceTheme.screenColor);
  const [faceColor, setFaceColor] = useState(currentFaceTheme.faceColor);
  const [tongueColor, setTongueColor] = useState(currentFaceTheme.tongueColor);
  
  // Head shape options
  const headShapes: HeadShape[] = [
    {
      id: 'rectangle',
      name: 'Boxy',
      shape: 'rectangle',
    },
    {
      id: 'circle',
      name: 'Roundy',
      shape: 'circle',
    },
    {
      id: 'triangle',
      name: 'Pointy',
      shape: 'triangle',
    },
    {
      id: 'star',
      name: 'Starry',
      shape: 'star',
    },
    {
      id: 'heart',
      name: 'Hearty',
      shape: 'heart',
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
    fillColor: screenColor,
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
  
  const defaultMouthStyle: ElementStyle = {
    x: 50,
    y: 60,
    width: 60,
    height: 30,
    fillColor: faceColor,
    strokeColor: 'transparent',
    strokeWidth: 0,
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
    };
    
    // Create rig configuration
    const rigConfig: FaceRigConfig = {
      headShape: selectedHeadShape,
      head: headStyle,
      leftEye: leftEyeStyle,
      rightEye: rightEyeStyle,
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
    return (
      <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
        <AccordionTrigger className="text-base font-medium">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`${title}-x`}>X Position (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-x`}
                    min={0} 
                    max={100} 
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
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${title}-y`}>Y Position (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-y`}
                    min={0} 
                    max={100} 
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
                    max={300} 
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
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${title}-height`}>Height (px)</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    id={`${title}-height`}
                    min={1} 
                    max={300} 
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
              <Input 
                id={`${title}-border-radius`}
                value={style.borderRadius || ''} 
                onChange={(e) => onChange({...style, borderRadius: e.target.value})}
                placeholder="e.g. 10px or 50%"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
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
                    onClick={() => setCurrentExpression(exp.id)}
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
                    onClick={() => setCurrentPhoneme(phoneme.id)}
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
            
            <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: previewColor }}>
              <div className="w-96 h-96">
                <TalkingHead 
                  theme={{
                    id: selectedTheme.id,
                    name: selectedTheme.name,
                    description: selectedTheme.description,
                    previewColor: previewColor,
                    screenColor: screenColor,
                    faceColor: faceColor,
                    tongueColor: tongueColor,
                  }}
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
                onValueChange={(value) => {
                  const shape = headShapes.find(s => s.id === value);
                  if (shape) setSelectedHeadShape(shape);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a head shape" />
                </SelectTrigger>
                <SelectContent>
                  {headShapes.map((shape) => (
                    <SelectItem key={shape.id} value={shape.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {shape.shape === 'rectangle' && '▭'}
                          {shape.shape === 'circle' && '⬤'}
                          {shape.shape === 'triangle' && '▲'}
                          {shape.shape === 'star' && '★'}
                          {shape.shape === 'heart' && '❤'}
                        </span>
                        <span>{shape.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Element Style Controls */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Element Controls</h3>
              <Accordion type="multiple" className="w-full">
                <ElementStyleControls 
                  title="Head" 
                  style={headStyle} 
                  onChange={setHeadStyle} 
                />
                <ElementStyleControls 
                  title="Left Eye" 
                  style={leftEyeStyle} 
                  onChange={setLeftEyeStyle} 
                />
                <ElementStyleControls 
                  title="Right Eye" 
                  style={rightEyeStyle} 
                  onChange={setRightEyeStyle} 
                />
                <ElementStyleControls 
                  title="Mouth" 
                  style={mouthStyle} 
                  onChange={setMouthStyle} 
                />
                <ElementStyleControls 
                  title="Top Teeth" 
                  style={topTeethStyle} 
                  onChange={setTopTeethStyle} 
                />
                <ElementStyleControls 
                  title="Bottom Teeth" 
                  style={bottomTeethStyle} 
                  onChange={setBottomTeethStyle} 
                />
                <ElementStyleControls 
                  title="Tongue" 
                  style={tongueStyle} 
                  onChange={setTongueStyle} 
                />
              </Accordion>
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
                      value={previewColor} 
                      onChange={(e) => setPreviewColor(e.target.value)}
                      id="preview-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="screen-color">Screen</Label>
                    <input 
                      type="color" 
                      value={screenColor} 
                      onChange={(e) => {
                        setScreenColor(e.target.value);
                        setHeadStyle({...headStyle, fillColor: e.target.value});
                      }}
                      id="screen-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="face-color">Face</Label>
                    <input 
                      type="color" 
                      value={faceColor} 
                      onChange={(e) => {
                        setFaceColor(e.target.value);
                        setMouthStyle({...mouthStyle, fillColor: e.target.value});
                      }}
                      id="face-color"
                      className="w-10 h-6"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tongue-color">Tongue</Label>
                    <input 
                      type="color" 
                      value={tongueColor} 
                      onChange={(e) => {
                        setTongueColor(e.target.value);
                        setTongueStyle({...tongueStyle, fillColor: e.target.value});
                      }}
                      id="tongue-color"
                      className="w-10 h-6"
                    />
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