import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gamepad2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WordChain from '../games/WordChain/WordChain';
import KamijiRpg from '../games/KamijiRpg/KamijiRpg';

interface GamesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Placeholder for game components
const GamePlaceholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </CardContent>
  </Card>
);

const GamesModal: React.FC<GamesModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [isKamijiOpen, setIsKamijiOpen] = useState(false);
  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="max-w-4xl"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '600px',
            minHeight: '400px',
            maxHeight: '90vh'
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Gamepad2 className="h-6 w-6" />
              RTK Arcade
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
              <TabsTrigger value="word">Word</TabsTrigger>
              <TabsTrigger value="ai">AI Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <WordChain onGameEnd={handleGameEnd} />
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>KamijiRpg</CardTitle>
                  <CardDescription>Play Kamiji's Island Adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  <button onClick={() => setIsKamijiOpen(true)} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Launch KamijiRpg</button>
                </CardContent>
              </Card>
              <GamePlaceholder 
                title="Memory Match" 
                description="Test your memory by matching pairs of cards"
              />
              <GamePlaceholder 
                title="Word Scramble" 
                description="Unscramble the letters to form words"
              />
            </TabsContent>
            
            <TabsContent value="puzzle" className="space-y-4">
              <GamePlaceholder 
                title="Memory Match" 
                description="Test your memory by matching pairs of cards"
              />
            </TabsContent>
            
            <TabsContent value="word" className="space-y-4">
              <WordChain onGameEnd={handleGameEnd} />
              <GamePlaceholder 
                title="Word Scramble" 
                description="Unscramble the letters to form words"
              />
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <WordChain onGameEnd={handleGameEnd} />
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>KamijiRpg</CardTitle>
                  <CardDescription>Play Kamiji's Island Adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  <button onClick={() => setIsKamijiOpen(true)} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Launch KamijiRpg</button>
                </CardContent>
              </Card>
              <GamePlaceholder 
                title="AI Story Builder" 
                description="Collaborate with AI to create stories"
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Render KamijiRpg in its own modal */}
      {isKamijiOpen && (
        <KamijiRpg 
          open={isKamijiOpen} 
          onOpenChange={setIsKamijiOpen} 
        />
      )}
    </>
  );
};

export default GamesModal; 