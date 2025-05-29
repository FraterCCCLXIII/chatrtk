import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaceRigConfig } from '../FacialRigEditor';
import './AnimatedHeadSelectorModal.css';

export interface AnimatedHeadTheme {
  id: string;
  name: string;
  description: string;
  config: FaceRigConfig;
}

interface AnimatedHeadSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHead: (theme: AnimatedHeadTheme) => void;
  currentHeadId: string;
}

export const AnimatedHeadSelectorModal: React.FC<AnimatedHeadSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectHead,
  currentHeadId
}) => {
  // Define animated head themes
  const animatedHeadThemes: AnimatedHeadTheme[] = [
    {
      id: 'rtk-100',
      name: 'RTK-100',
      description: 'The original talking head',
      config: {
        head: {
          x: 0,
          y: 0,
          width: 220,
          height: 160,
          fillColor: '#5daa77',
          strokeColor: '#333333',
          strokeWidth: 8,
          borderRadius: '20px'
        },
        leftEye: {
          x: 30,
          y: 40,
          width: 12,
          height: 12,
          fillColor: '#000000',
          strokeColor: 'transparent',
          strokeWidth: 0,
          borderRadius: '50%'
        },
        rightEye: {
          x: 70,
          y: 40,
          width: 12,
          height: 12,
          fillColor: '#000000',
          strokeColor: 'transparent',
          strokeWidth: 0,
          borderRadius: '50%'
        },
        mouth: {
          x: 50,
          y: 60,
          width: 60,
          height: 30,
          fillColor: '#5daa77',
          strokeColor: '#333333',
          strokeWidth: 1,
          borderRadius: '15px'
        }
      }
    },
    {
      id: 'rtk-200',
      name: 'RTK-200',
      description: 'Sleek modern design',
      config: {
        head: {
          x: 0,
          y: 0,
          width: 220,
          height: 160,
          fillColor: '#4a90e2',
          strokeColor: '#2c3e50',
          strokeWidth: 6,
          borderRadius: '30px'
        },
        leftEye: {
          x: 30,
          y: 40,
          width: 14,
          height: 14,
          fillColor: '#ffffff',
          strokeColor: '#2c3e50',
          strokeWidth: 2,
          borderRadius: '50%'
        },
        rightEye: {
          x: 70,
          y: 40,
          width: 14,
          height: 14,
          fillColor: '#ffffff',
          strokeColor: '#2c3e50',
          strokeWidth: 2,
          borderRadius: '50%'
        },
        mouth: {
          x: 50,
          y: 60,
          width: 70,
          height: 35,
          fillColor: '#4a90e2',
          strokeColor: '#2c3e50',
          strokeWidth: 2,
          borderRadius: '20px'
        }
      }
    },
    {
      id: 'rtk-300',
      name: 'RTK-300',
      description: 'Friendly circular design',
      config: {
        head: {
          x: 0,
          y: 0,
          width: 220,
          height: 160,
          fillColor: '#f39c12',
          strokeColor: '#d35400',
          strokeWidth: 10,
          borderRadius: '50%'
        },
        leftEye: {
          x: 30,
          y: 40,
          width: 16,
          height: 16,
          fillColor: '#2c3e50',
          strokeColor: '#ffffff',
          strokeWidth: 3,
          borderRadius: '50%'
        },
        rightEye: {
          x: 70,
          y: 40,
          width: 16,
          height: 16,
          fillColor: '#2c3e50',
          strokeColor: '#ffffff',
          strokeWidth: 3,
          borderRadius: '50%'
        },
        mouth: {
          x: 50,
          y: 60,
          width: 60,
          height: 25,
          fillColor: '#f39c12',
          strokeColor: '#d35400',
          strokeWidth: 3,
          borderRadius: '25px'
        }
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Animated Head Style</DialogTitle>
          <DialogDescription>
            Choose a head style to change the shape and appearance of your talking head.
          </DialogDescription>
        </DialogHeader>
        
        <div className="animated-head-grid">
          {animatedHeadThemes.map((theme) => (
            <div 
              key={theme.id}
              className={`animated-head-item ${currentHeadId === theme.id ? 'selected' : ''}`}
              onClick={() => onSelectHead(theme)}
            >
              <div 
                className="animated-head-preview" 
                style={{ backgroundColor: theme.config.head.fillColor }}
              >
                <div className="animated-head-face" style={{
                  backgroundColor: theme.config.head.fillColor,
                  borderColor: theme.config.head.strokeColor,
                  borderWidth: `${theme.config.head.strokeWidth}px`,
                  borderRadius: theme.config.head.borderRadius,
                }}>
                  <div className="animated-head-eyes">
                    <div className="animated-head-eye left" style={{
                      backgroundColor: theme.config.leftEye.fillColor,
                      borderColor: theme.config.leftEye.strokeColor,
                      borderWidth: `${theme.config.leftEye.strokeWidth}px`,
                      borderRadius: theme.config.leftEye.borderRadius,
                    }}></div>
                    <div className="animated-head-eye right" style={{
                      backgroundColor: theme.config.rightEye.fillColor,
                      borderColor: theme.config.rightEye.strokeColor,
                      borderWidth: `${theme.config.rightEye.strokeWidth}px`,
                      borderRadius: theme.config.rightEye.borderRadius,
                    }}></div>
                  </div>
                  <div className="animated-head-mouth" style={{
                    backgroundColor: theme.config.mouth.fillColor,
                    borderColor: theme.config.mouth.strokeColor,
                    borderWidth: `${theme.config.mouth.strokeWidth}px`,
                    borderRadius: theme.config.mouth.borderRadius,
                  }}></div>
                </div>
              </div>
              <div className="animated-head-info">
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>
              <Button 
                variant={theme.id === currentHeadId ? "default" : "outline"}
                onClick={() => onSelectHead(theme)}
                className="animated-head-select-button"
              >
                {theme.id === currentHeadId ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnimatedHeadSelectorModal;