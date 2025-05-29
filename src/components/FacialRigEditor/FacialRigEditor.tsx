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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Facial Rig Editor</DialogTitle>
          <DialogDescription>
            Customize your chatty face appearance and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Preview */}
          <Card>
            <CardContent className="p-4">
              <div 
                style={{ backgroundColor: previewColor }} 
                className="h-48 w-full flex items-center justify-center rounded-md"
              >
                <div className="w-40 h-40">
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
                    expression="happy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Head Shape */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Head Shape</h3>
            <RadioGroup 
              value={selectedHeadShape.id} 
              onValueChange={(value) => {
                const shape = headShapes.find(s => s.id === value);
                if (shape) setSelectedHeadShape(shape);
              }}
              className="grid grid-cols-2 gap-4"
            >
              {headShapes.map((shape) => (
                <div key={shape.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={shape.id} id={`shape-${shape.id}`} className="mt-1" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor={`shape-${shape.id}`} className="font-medium">
                      {shape.name}
                    </Label>
                    <Card className="overflow-hidden">
                      <CardContent className="p-3 flex items-center justify-center h-20">
                        {shape.shape === 'rectangle' && (
                          <div className="w-16 h-12 bg-gray-300 rounded-md"></div>
                        )}
                        {shape.shape === 'circle' && (
                          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        )}
                        {shape.shape === 'triangle' && (
                          <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-gray-300"></div>
                        )}
                        {shape.shape === 'star' && (
                          <div className="text-4xl text-gray-300">★</div>
                        )}
                        {shape.shape === 'heart' && (
                          <div className="text-4xl text-gray-300">❤</div>
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
              <div className="flex justify-between">
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
              <div className="flex justify-between">
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
              <div className="flex justify-between">
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
              <div className="flex justify-between">
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

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacialRigEditor;