import React from 'react';
import { Gamepad2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WordChain from './WordChain/WordChain';
import ModalWrapper from '@/components/ui/modal-wrapper';

interface GamesProps {
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

const Games: React.FC<GamesProps> = ({
  open,
  onOpenChange,
}) => {
  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="RTK Arcade"
      icon={<Gamepad2 className="h-6 w-6" />}
    >
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
          <TabsTrigger value="word">Word</TabsTrigger>
          <TabsTrigger value="ai">AI Games</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <WordChain onGameEnd={handleGameEnd} />
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
          <GamePlaceholder 
            title="AI Story Builder" 
            description="Collaborate with AI to create stories"
          />
        </TabsContent>
      </Tabs>
    </ModalWrapper>
  );
};

export default Games; 