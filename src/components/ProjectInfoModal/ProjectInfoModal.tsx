import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface ProjectInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6" />
            About RTK
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">Project Vision</h3>
            <p>
              RTK (Rational Talking Kamimon) is an exploration of AI and human interaction design, 
              focusing on creating friendly, child-safe environments with engaging personalities. 
              The project draws inspiration from mixtape culture, where each interaction is a unique 
              composition of human and AI expression.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">What is a Kamimon?</h3>
            <p>
              A Kamimon (Spirit-crest) is a new concept introduced in this project - an AI Super-emoji 
              that combines the expressiveness of emojis with the intelligence of AI. Each Kamimon 
              represents a unique personality and interaction style, making AI interactions more 
              engaging and relatable.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">The Meaning Behind RTK</h3>
            <p>
              RTK stands for Rational Talking Kamimon, where:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Rational:</strong> Emphasizing logical, safe, and child-friendly interactions
              </li>
              <li>
                <strong>Talking:</strong> Focusing on natural, expressive communication
              </li>
              <li>
                <strong>Kamimon:</strong> A Spirit-crest, combining "Kami" (spirit) and "mon" (crest)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">Kamiji: Spirit-Character</h3>
            <p>
              The term "Kamiji" (Spirit-character) refers to the symbolic representation of each 
              Kamimon's personality. Like traditional Japanese characters (kanji), each Kamiji 
              carries deep meaning and represents a unique aspect of the AI's character.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">Design Philosophy</h3>
            <p>
              RTK is built on the principles of:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Safe and child-friendly interactions</li>
              <li>Expressive and engaging personalities</li>
              <li>Natural and intuitive communication</li>
              <li>Cultural sensitivity and inclusivity</li>
              <li>Continuous learning and adaptation</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInfoModal; 