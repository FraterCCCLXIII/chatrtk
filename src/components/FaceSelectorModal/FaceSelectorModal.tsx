import React from 'react';
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
import { useToast } from "@/hooks/use-toast";

export interface FaceTheme {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  screenColor: string;
  faceColor: string;
  tongueColor: string;
}

export interface FaceSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFace: (faceTheme: FaceTheme) => void;
  currentFaceTheme: string;
}

const FaceSelectorModal: React.FC<FaceSelectorModalProps> = ({
  open,
  onOpenChange,
  onSelectFace,
  currentFaceTheme,
}) => {
  const { toast } = useToast();
  const [selectedFace, setSelectedFace] = React.useState(currentFaceTheme);

  // Face theme options
  const faceThemes: FaceTheme[] = [
    {
      id: 'default',
      name: 'Minty',
      description: 'The classic mint green face',
      previewColor: '#5ddbaf',
      screenColor: '#e2ffe5',
      faceColor: '#5daa77',
      tongueColor: '#ff7d9d',
    },
    {
      id: 'blueberry',
      name: 'Blueberry',
      description: 'A cool blue theme with a sweet personality',
      previewColor: '#5d9ddb',
      screenColor: '#e2f0ff',
      faceColor: '#5d7daa',
      tongueColor: '#ff9d7d',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'A warm orange theme with a fiery attitude',
      previewColor: '#ff9d5d',
      screenColor: '#fff0e2',
      faceColor: '#e67d45',
      tongueColor: '#ff5d7d',
    },
    {
      id: 'bubblegum',
      name: 'Bubblegum',
      description: 'A playful pink theme with a sweet and bubbly personality',
      previewColor: '#ff7dc7',
      screenColor: '#ffe2f5',
      faceColor: '#e45daa',
      tongueColor: '#5ddbaf',
    },
  ];

  const handleSave = () => {
    const selectedTheme = faceThemes.find(theme => theme.id === selectedFace);
    if (selectedTheme) {
      onSelectFace(selectedTheme);
      toast({
        title: "Theme Changed",
        description: `Successfully changed to ${selectedTheme.name} theme.`,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose a Face Theme</DialogTitle>
          <DialogDescription>
            Select a face theme to personalize your chatty face.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedFace} onValueChange={setSelectedFace} className="grid grid-cols-2 gap-4">
            {faceThemes.map((theme) => (
              <div key={theme.id} className="flex items-start space-x-2">
                <RadioGroupItem value={theme.id} id={theme.id} className="mt-1" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor={theme.id} className="font-medium">
                    {theme.name}
                  </Label>
                  <Card className="overflow-hidden">
                    <div 
                      style={{ backgroundColor: theme.previewColor }} 
                      className="h-24 w-full flex items-center justify-center"
                    >
                      <div 
                        style={{ backgroundColor: theme.screenColor }}
                        className="w-16 h-12 rounded-md border-2 border-gray-800 flex items-center justify-center"
                      >
                        <div className="relative">
                          {/* Simple face preview */}
                          <div className="flex space-x-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                          </div>
                          <div 
                            style={{ backgroundColor: theme.faceColor }}
                            className="w-6 h-3 rounded-md flex items-center justify-center"
                          >
                            <div 
                              style={{ backgroundColor: theme.tongueColor }}
                              className="w-3 h-1.5 rounded-sm"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-gray-500">{theme.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Apply Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaceSelectorModal;