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

export interface HeadShape {
  id: string;
  name: string;
  shape: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart';
}

export interface FacialRigEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFaceTheme: FaceTheme;
  currentHeadShape?: HeadShape;
  onSave: (faceTheme: FaceTheme, headShape: HeadShape) => void;
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

  const handleSave = () => {
    // Create updated theme
    const updatedTheme: FaceTheme = {
      ...selectedTheme,
      previewColor,
      screenColor,
      faceColor,
      tongueColor,
    };
    
    onSave(updatedTheme, selectedHeadShape);
    
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
            
            {/* Head Shape */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Head Shape</h3>
              <RadioGroup 
                value={selectedHeadShape.id} 
                onValueChange={(value) => {
                  const shape = headShapes.find(s => s.id === value);
                  if (shape) setSelectedHeadShape(shape);
                }}
                className="grid grid-cols-2 gap-2"
              >
                {headShapes.map((shape) => (
                  <div key={shape.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={shape.id} id={`shape-${shape.id}`} className="mt-1" />
                    <div className="grid gap-1.5 w-full">
                      <Label htmlFor={`shape-${shape.id}`} className="font-medium">
                        {shape.name}
                      </Label>
                      <Card className="overflow-hidden">
                        <CardContent className="p-2 flex items-center justify-center h-16">
                          {shape.shape === 'rectangle' && (
                            <div className="w-12 h-8 bg-gray-300 rounded-md"></div>
                          )}
                          {shape.shape === 'circle' && (
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          )}
                          {shape.shape === 'triangle' && (
                            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-gray-300"></div>
                          )}
                          {shape.shape === 'star' && (
                            <div className="text-3xl text-gray-300">★</div>
                          )}
                          {shape.shape === 'heart' && (
                            <div className="text-3xl text-gray-300">❤</div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Color Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Color Customization</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="preview-color">Background Color</Label>
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
                  <Label htmlFor="screen-color">Screen Color</Label>
                  <input 
                    type="color" 
                    value={screenColor} 
                    onChange={(e) => setScreenColor(e.target.value)}
                    id="screen-color"
                    className="w-10 h-6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="face-color">Face Color</Label>
                  <input 
                    type="color" 
                    value={faceColor} 
                    onChange={(e) => setFaceColor(e.target.value)}
                    id="face-color"
                    className="w-10 h-6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tongue-color">Tongue Color</Label>
                  <input 
                    type="color" 
                    value={tongueColor} 
                    onChange={(e) => setTongueColor(e.target.value)}
                    id="tongue-color"
                    className="w-10 h-6"
                  />
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